from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from app.auth import get_current_user, engine
from app.models import User
from sqlalchemy import text, inspect
import os
import json
from typing import List, Dict, Any
from app.config_utils import get_gemini_api_key

router = APIRouter()

from pydantic import BaseModel

class OnboardRequest(BaseModel):
    institution_name: str

@router.get("/institutions")
def list_institutions(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin restricted")
    
    try:
        with engine.connect() as conn:
            # Look for all custom schemas following EdNex naming convention
            result = conn.execute(text("SELECT schema_name FROM information_schema.schemata WHERE schema_name LIKE '%_ednex'"))
            schemas = [row[0] for row in result]
            return {"schemas": schemas}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/onboard")
def onboard_institution(
    request: OnboardRequest,
    current_user: User = Depends(get_current_user)
):
    institution_name = request.institution_name
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin restricted")
        
    # Sanitize schema name
    import re
    safe_name = re.sub(r'[^a-zA-Z0-9]', '_', institution_name).lower()
    schema_name = f"{safe_name}_ednex"
    
    try:
        with engine.connect() as conn:
            # 1. Create Schema
            conn.execute(text(f"CREATE SCHEMA IF NOT EXISTS {schema_name}"))
            
            # 2. Run DDLs
            # DDL_DIR = c:\Projects\AA\at\6_integration\ednex_base
            # Use relative to project root since uvicorn runs from app or backend
            ddl_dir = os.path.join("..", "..", "6_integration", "ednex_base")
            if not os.path.exists(ddl_dir):
                # Try another common path (if running from 3_code/backend)
                ddl_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "6_integration", "ednex_base"))

            if not os.path.exists(ddl_dir):
                raise Exception(f"DDL directory not found: {ddl_dir}")

            for ddl_file in sorted(os.listdir(ddl_dir)):
                if ddl_file.endswith(".sql"):
                    with open(os.path.join(ddl_dir, ddl_file), "r") as f:
                        ddl_content = f.read()
                        # Crucial: Prepend search_path setting to each execution if needed, 
                        # but one search_path should suffice for the session.
                        conn.execute(text(f"SET search_path TO {schema_name}, public"))
                        conn.execute(text(ddl_content))
            
            conn.commit()
            
        return {
            "status": "success", 
            "message": f"Institution {institution_name} onboarded.",
            "schema_name": schema_name
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/map-columns")
def map_columns(
    schema_name: str = Form(...),
    table_name: str = Form(...),
    csv_file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """
    Integration Agent: Uses AI to map CSV columns to target EdNex tables.
    """
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin restricted")
        
    import csv
    import io

    csv_file.file.seek(0)
    raw_content = csv_file.file.read()
    try:
        content_str = raw_content.decode('utf-8')
    except UnicodeDecodeError:
        content_str = raw_content.decode('windows-1252')

    csv_reader = csv.DictReader(io.StringIO(content_str))
    csv_columns = csv_reader.fieldnames or []
    
    sample_data = []
    for i, row in enumerate(csv_reader):
        if i >= 5:
            break
        # Replace empty strings or None with empty string (mimicking fillna(""))
        clean_row = {k: (v if v else "") for k, v in row.items()}
        sample_data.append(clean_row)

    
    # 1. Get Target Column Definitions from Schema
    target_columns = []
    try:
        inspector = inspect(engine)
        cols = inspector.get_columns(table_name, schema=schema_name)
        target_columns = [c["name"] for c in cols]
    except Exception as e:
        print(f"Introspection error for {schema_name}.{table_name}: {e}")
        # Mock target columns for common EdNex tables if introspection fails across schemas
        common_cols = {
            "mod00_users": ["id", "first_name", "last_name", "email", "role"],
            "mod01_student_profiles": ["user_id", "program_id", "gpa", "major", "academic_standing"]
        }
        target_columns = common_cols.get(table_name, [])

    # 2. Integration Agent Intelligence
    from sqlmodel import Session
    from app.auth import engine as db_engine
    
    with Session(db_engine) as session:
        api_key = get_gemini_api_key(session)
        
    if not api_key:
        # Fallback to simple Exact/Fuzzy logic if no API key
        mappings = []
        for col in csv_columns:
            status = "red"
            confidence = 0
            target = None
            
            # Exact
            if col.lower() in [tc.lower() for tc in target_columns]:
                target = next(tc for tc in target_columns if tc.lower() == col.lower())
                status = "green"
                confidence = 100
            else:
                # Simple heuristic
                for tc in target_columns:
                    if col.lower() in tc.lower() or tc.lower() in col.lower():
                        target = tc
                        status = "yellow"
                        confidence = 75
                        break
            
            mappings.append({
                "source": col,
                "sample": sample_data[0].get(col) if sample_data else "",
                "target": target,
                "status": status,
                "confidence": confidence
            })
        return {"status": "suggested", "mappings": mappings}

    # 3. AI Mapping using Gemini
    # 2. IA Engine (REST fallback for Python 3.8 SDK issues)
    try:
        import httpx
        debug_info = ""
        prompt = f"""You are an Integration Agent mapping Institution CSV columns to EdNex Database Columns.
        
TARGET COLUMNS for table '{table_name}': {target_columns}
CSV COLUMNS: {csv_columns}
SAMPLE DATA (First row): {sample_data[0] if sample_data else "None"}

Rules:
1. Exact name match (case-insensitive) -> status: "green", confidence: 100
2. Semantic match (e.g., 'fname' -> 'first_name', 'LName' -> 'last_name', 'Student_UID' -> 'id') -> status: "yellow", confidence: 60-95
3. No match -> status: "red", confidence: 0

Return valid JSON with the key "mappings". No explanation text outside JSON.
{{
  "mappings": [
     {{ "source": "csv_col", "target": "db_col", "status": "green|yellow|red", "confidence": 0-100, "sample": "value" }}
  ]
}}"""
        
        models_to_try = ['gemini-1.5-flash', 'gemini-1.5-pro']
        response_text = None

        for model_name in models_to_try:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
                payload = {
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {
                        "responseMimeType": "application/json",
                        "maxOutputTokens": 2048,
                        "temperature": 0.2
                    }
                }
                # Use sync client as we are in a 'def' route
                with httpx.Client(timeout=30.0) as client:
                    resp = client.post(url, json=payload)
                    resp.raise_for_status()
                    res_json = resp.json()
                    response_text = res_json["candidates"][0]["content"]["parts"][0]["text"]
                    break
            except Exception as model_err:
                print(f"DEBUG IA: {model_name} failed: {str(model_err)[:100]}")
                continue

        if response_text:
            cleaned = response_text.strip()
            if "```json" in cleaned:
                cleaned = cleaned.split("```json")[1].split("```")[0].strip()
            return json.loads(cleaned)
        
        raise Exception("No response from AI models")
        
    except Exception as e:
        print(f"AI Mapping error: {e}")
        # Rule-based fallback if AI is totally gone
        mappings = []
        for col in csv_columns:
            target = None
            status = "red"
            conf = 0
            if col.lower() in [tc.lower() for tc in target_columns]:
                target = [tc for tc in target_columns if tc.lower() == col.lower()][0]
                status = "green"
                conf = 100
            elif "mail" in col.lower() and "email" in target_columns:
                target = "email"
                status = "yellow"
                conf = 90
            
            mappings.append({
                "source": col, 
                "target": target, 
                "status": status, 
                "confidence": conf, 
                "sample": sample_data[0].get(col) if sample_data else None
            })
        return {"mappings": mappings}

@router.post("/ingest")
def ingest_data(
    schema_name: str = Form(...),
    table_name: str = Form(...),
    mappings_json: str = Form(...), # { csv_col: target_col }
    csv_file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin restricted")
        
    mappings = json.loads(mappings_json)
    import pandas as pd
    try:
        csv_file.file.seek(0)
        df = pd.read_csv(csv_file.file, encoding='utf-8')
    except UnicodeDecodeError:
        csv_file.file.seek(0)
        df = pd.read_csv(csv_file.file, encoding='windows-1252')
    except Exception as read_err:
        raise HTTPException(status_code=400, detail=f"Failed to read CSV: {str(read_err)}")
    
    # 1. Transform DataFrame based on mapping
    rename_dict = {k: v for k, v in mappings.items() if v}
    df_mapped = df[list(rename_dict.keys())].rename(columns=rename_dict)
    
    # 2. Write to DB
    try:
        # Use pandas to_sql or raw SQL for large sets
        # Note: to_sql might not support schemas perfectly if engine is not pre-configured.
        df_mapped.to_sql(
            table_name, 
            engine, 
            schema=schema_name, 
            if_exists='append', 
            index=False,
            method='multi' # Optimized insertion
        )
        return {"status": "success", "rows_ingested": len(df_mapped)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

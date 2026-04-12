import os
import time
import json
import sys

# Safely import the central App DB Engine to fully bypass Vercel uncompiled supabase-py packages
try:
    from pathlib import Path
    root_path = Path(__file__).resolve().parents[4]
    api_core_path = str(root_path / "api" / "core" / "backend")
    if api_core_path not in sys.path:
        sys.path.append(api_core_path)
    from app.auth import engine
    from sqlalchemy import text
except Exception as e:
    engine = None
    print(f"[Aura_Core] DB DB Tool Import Error: {e}")

def query_ednex_module(module_name: str, email: str):
    """
    Query a specific EdNex module for data related to the student email provided.
    This is a core 'hand' for specialists.
    """
    start_time = time.time()
    
    if not engine:
        return "Critical Error: SQLAlchemy Engine is not available inside Swarm runtime."
        
    try:
        with engine.connect() as conn:
            # Step 1: Match User ID from Email
            q_user = text('SELECT id FROM "public"."mod00_users" WHERE email = :email')
            user_res = conn.execute(q_user, {"email": email}).mappings().first()
            
            if not user_res:
                return f"Error: Student with email {email} not found in EdNex."
                
            user_id = str(user_res["id"])
            
            # Step 2: Query the target module
            target_col = "user_id"
            if module_name in ["mod02_student_accounts", "mod04_enrollments", "mod08_aid_packages", "mod03_advising_appointments"]:
                target_col = "student_id"
                
            q_target = text(f'SELECT * FROM "public"."{module_name}" WHERE {target_col} = :uid LIMIT 10')
            target_res = conn.execute(q_target, {"uid": user_id}).mappings().all()
            
            # Serialize
            results_list = []
            for r in target_res:
                r_dict = dict(r)
                for k, v in r_dict.items():
                    if hasattr(v, 'isoformat'):
                        r_dict[k] = v.isoformat()
                results_list.append(r_dict)
                
            duration = time.time() - start_time
            print(f"[Aura_Core] DB Tool: Query {module_name} took {duration:.2f}s")
            
            if results_list:
                return json.dumps(results_list, indent=2)
            else:
                return f"Notice: No records found in {module_name} for this student."
                
    except Exception as e:
        return f"Database Error in {module_name}: {str(e)}"

# Define available tools list for the agents
TOOLS = [
    {
        "name": "query_ednex_module",
        "description": "Fetches raw data from an EdNex (Supabase) module for a student email. Modules available: mod01_student_profiles, mod02_student_accounts, mod07_degree_audits, mod08_aid_packages, mod09_contributions.",
        "parameters": {
            "type": "object",
            "properties": {
                "module_name": {"type": "string"},
                "email": {"type": "string"}
            },
            "required": ["module_name", "email"]
        }
    }
]

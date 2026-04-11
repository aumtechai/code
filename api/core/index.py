import os
import sys
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# CRITICAL: Add the local backend folder to the sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(current_dir, "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.api import router as main_api_router
from app.api_tutoring import router as tutoring_router

app = FastAPI(title="Student Success Core API")

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(main_api_router, prefix="/api")
app.include_router(tutoring_router, prefix="/api")

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "mode": "bundled-backend",
    }

@app.get("/api/env-check")
def env_check():
    return {
        "db": bool(os.getenv("DATABASE_URL")),
        "secret": bool(os.getenv("SECRET_KEY")),
        "google": bool(os.getenv("GOOGLE_API_KEY"))
    }

@app.get("/api/ednex/context")
async def ednex_context(request: Request):
    """
    Lightweight EdNex context endpoint — imports Supabase lazily to avoid
    crashing the module at cold start. Decodes the JWT to get user email,
    then queries EdNex (Supabase) for student data.
    """
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = auth_header.split(" ", 1)[1]

    # Decode JWT to get user email
    try:
        import jwt as pyjwt
        secret = os.getenv("SECRET_KEY", "")
        payload = pyjwt.decode(token, secret, algorithms=["HS256"])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token decode failed: {e}")

    # Query EdNex Supabase
    try:
        from supabase import create_client
        url = os.environ.get("SUPABASE_URL", "https://rfkoylpcuptzkakmqotq.supabase.co")
        key = os.environ.get("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJma295bHBjdXB0emtha21xb3RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MzY0MDYsImV4cCI6MjA4ODQxMjQwNn0.kcUD2GGSmMJLcG0tyJZtbCd9h9gB2S8jFYDz9RJKMe8")
        sb = create_client(url, key)

        student_resp = sb.table("mod00_users").select("*").eq("email", email).execute()
        student_data = student_resp.data[0] if student_resp.data else None

        if not student_data:
            return {"status": "error", "message": "Student not found in EdNex database"}

        sid = student_data["id"]
        sis = sb.table("mod01_student_profiles").select("*").eq("user_id", sid).execute()
        fin = sb.table("mod02_student_accounts").select("*").eq("student_id", sid).execute()

        context = {
            "student_profile": {
                "name": f"{student_data.get('first_name','')} {student_data.get('last_name','')}".strip(),
                "email": student_data.get("email"),
            },
            "sis_stream": sis.data[0] if sis.data else {},
            "finance_stream": fin.data[0] if fin.data else {},
        }
        return {"status": "success", "source": "EdNex Central Staging", "context": context}
    except Exception as e:
        print(f"EdNex context error for {email}: {e}")
        return {"status": "error", "message": str(e)}

import os
from supabase import create_client, Client
import time
import json

# Connection setup: Reusing project defaults or env
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://rfkoylpcuptzkakmqotq.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

def get_supabase():
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def query_ednex_module(module_name: str, email: str):
    """
    Query a specific EdNex module for data related to the student email provided.
    This is a core 'hand' for specialists.
    """
    start_time = time.time()
    supabase = get_supabase()
    
    try:
        # Step 1: Match User ID from Email
        user_resp = supabase.table("mod00_users").select("id").eq("email", email).execute()
        if not user_resp.data:
            return f"Error: Student with email {email} not found in EdNex."
        
        user_id = user_resp.data[0]["id"]
        
        # Step 2: Query the target module
        # Dynamic filter for cross-module consistency
        target_col = "user_id"
        if module_name in ["mod02_student_accounts", "mod04_enrollments", "mod08_aid_packages", "mod03_advising_appointments"]:
            target_col = "student_id"
        
        result = supabase.table(module_name).select("*").eq(target_col, user_id).execute()
        
        duration = time.time() - start_time
        print(f"[Aura_Core] DB Tool: Query {module_name} took {duration:.2f}s")
        
        if result.data:
            return json.dumps(result.data, indent=2)
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

import os
import time
import json
import requests

# Connection setup: Reusing project defaults or env
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://rfkoylpcuptzkakmqotq.supabase.co").strip()
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "").strip()

def query_ednex_module(module_name: str, email: str):
    """
    Query a specific EdNex module for data related to the student email provided.
    This is a core 'hand' for specialists.
    """
    start_time = time.time()
    headers = {'apikey': SUPABASE_KEY, 'Authorization': f'Bearer {SUPABASE_KEY}'}
    
    try:
        # Step 1: Match User ID from Email
        user_url = f"{SUPABASE_URL}/rest/v1/mod00_users?select=id&email=eq.{email}&limit=1"
        user_resp = requests.get(user_url, headers=headers)
        
        if user_resp.status_code != 200 or len(user_resp.json()) == 0:
            return f"Error: Student with email {email} not found in EdNex."
        
        user_id = user_resp.json()[0]["id"]
        
        # Step 2: Query the target module
        target_col = "user_id"
        if module_name in ["mod02_student_accounts", "mod04_enrollments", "mod08_aid_packages", "mod03_advising_appointments"]:
            target_col = "student_id"
        
        target_url = f"{SUPABASE_URL}/rest/v1/{module_name}?select=*&{target_col}=eq.{user_id}"
        result_resp = requests.get(target_url, headers=headers)
        
        duration = time.time() - start_time
        print(f"[Aura_Core] DB Tool: Query {module_name} took {duration:.2f}s")
        
        if result_resp.status_code == 200 and len(result_resp.json()) > 0:
            return json.dumps(result_resp.json(), indent=2)
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

from app.ednex import get_supabase_client
import json

def introspect():
    supabase = get_supabase_client()
    tables = [
        "mod00_users", "mod01_student_profiles", "mod02_student_accounts", 
        "mod04_enrollments", "mod06_admissions_applications", 
        "mod07_degree_audits", "mod08_aid_packages"
    ]
    
    for t in tables:
        print(f"--- Table: {t} ---")
        try:
            resp = supabase.table(t).select("*").limit(1).execute()
            if resp.data:
                print(json.dumps(resp.data[0], indent=2))
            else:
                print("Empty table.")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    introspect()

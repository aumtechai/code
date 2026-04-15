import sys
import os

sys.path.append(os.path.abspath('api/core/backend'))

from app.ednex import get_supabase_client

supabase = get_supabase_client()
if not supabase:
    print("FAILED: No supabase client!")
    sys.exit(1)

resp = supabase.table("mod00_users").select("*").eq("role", "student").limit(5).execute()
for u in resp.data:
    if u['email'] != "student@university.edu":
        print(f"Found real student: {u['email']}, ID: {u['id']}, Name: {u['first_name']} {u['last_name']}")
        
        supabase.table("mod00_users").update({
            "password_hash": "hashedpw"
        }).eq("email", u['email']).execute()
        
        # Also let's check if they have courses/finances
        sis = supabase.table("mod01_student_profiles").select("*").eq("user_id", u['id']).limit(1).execute()
        print(f"Profile: {sis.data}")
        break

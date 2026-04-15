import sys
import os

# Ensure backend packages can be imported
sys.path.append(os.path.abspath('api/core/backend'))

from app.ednex import get_supabase_client

supabase = get_supabase_client()
if not supabase:
    print("FAILED: No supabase client!")
    sys.exit(1)

# Check if student exists
resp = supabase.table("mod00_users").select("*").eq("email", "student@university.edu").execute()
if len(resp.data) == 0:
    print("Injecting Student into EdNex...")
    supabase.table("mod00_users").insert({
        "first_name": "Alex",
        "last_name": "Student",
        "email": "student@university.edu",
        "role": "student",
        "password_hash": "hashedpw"
    }).execute()
else:
    print("Student already in EdNex, updating password override...")
    supabase.table("mod00_users").update({
        "password_hash": "hashedpw"
    }).eq("email", "student@university.edu").execute()

print("EdNex Proxy Accounts Initialized successfully.")

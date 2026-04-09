import uuid
import random
from app.ednex import get_supabase_client

def seed():
    supabase = get_supabase_client()
    
    # Target User: student@aumtech.ai
    email = "student@aumtech.ai"
    
    # 0. Get user from mod00 (or identify by email)
    ur = supabase.table("mod00_users").select("id").eq("email", email).execute()
    if not ur.data:
        print(f"User {email} not found in mod00_users. Creating...")
        ur = supabase.table("mod00_users").insert({
            "email": email,
            "first_name": "Daniel",
            "last_name": "Garrett",
            "role": "student"
        }).execute()
    
    student_id = ur.data[0]["id"]
    print(f"Seeding for Student ID: {student_id}")

    # 1. mod01_student_profiles (SIS)
    # Using columns verified via introspection
    sis_data = {
        "user_id": student_id,
        "external_student_id": "SIS-DG-449",
        "enrollment_status": "Enrolled",
        "cumulative_gpa": 3.75,
        "academic_standing": "Dean's List",
        "expected_graduation_term": "Spring 2026",
        "total_units_earned": 92,
        "ai_insight": "Exceptional performance in STEM courses. Advised to skip introductory ML."
    }
    
    try:
        supabase.table("mod01_student_profiles").upsert(sis_data, on_conflict="user_id").execute()
        print("✓ mod01 seeded")
    except Exception as e:
        print(f"✗ mod01 failed: {e}")

    # 2. mod02_student_accounts (Financial)
    fin_data = {
        "student_id": student_id,
        "tuition_balance": 8450.00,
        "fees_balance": 120.00,
        "financial_aid_award": 15000.00,
        "net_amount_due": 0.00,
        "has_financial_hold": False
    }
    try:
        supabase.table("mod02_student_accounts").upsert(fin_data, on_conflict="student_id").execute()
        print("✓ mod02 seeded")
    except Exception as e:
        print(f"✗ mod02 failed: {e}")

    # 3. mod05_degree_audits
    degree_data = {
        "student_id": student_id,
        "program_name": "Computer Science (B.S.)",
        "total_credits_required": 120,
        "total_credits_completed": 92,
        "major_gpa": 3.9,
        "is_on_track": True,
        "audit_json": {"requirements": ["Calculus I: OK", "Algorithms: OK"]}
    }
    try:
        supabase.table("mod05_degree_audits").upsert(degree_data, on_conflict="student_id").execute()
        print("✓ mod05 seeded")
    except Exception as e:
        print(f"✗ mod05 failed: {e}")

    print("Seeding Complete.")

if __name__ == "__main__":
    seed()

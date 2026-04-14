import uuid
from app.ednex import get_supabase_client

def seed():
    supabase = get_supabase_client()
    email = "student@aumtech.ai"
    
    # 0. Find or Create User
    ur = supabase.table("mod00_users").select("id").eq("email", email).execute()
    if not ur.data:
        ur = supabase.table("mod00_users").insert({
            "email": email, "first_name": "Daniel", "last_name": "Garrett", "role": "student"
        }).execute()
    student_id = ur.data[0]["id"]
    print(f"Student ID: {student_id}")

    # 1. mod01_student_profiles
    sis_data = {
        "user_id": student_id,
        "external_student_id": "SIS-DG-449",
        "program_id": str(uuid.uuid4()),
        "enrollment_status": "Enrolled",
        "cumulative_gpa": 3.75,
        "credits_earned": 92,
        "academic_standing": "Dean's List",
        "expected_graduation": "2026-05-20"
    }
    try:
        supabase.table("mod01_student_profiles").upsert(sis_data, on_conflict="user_id").execute()
        print("✓ mod01 success")
    except Exception as e:
        print(f"✗ mod01 failed: {e}")

    # 2. mod02_student_accounts
    finance_data = {
        "student_id": student_id,
        "tuition_balance": 8450.00,
        "fees_balance": 120.00,
        "financial_aid_award": 15000.00,
        "net_amount_due": 0.00,
        "has_financial_hold": False
    }
    try:
        supabase.table("mod02_student_accounts").upsert(finance_data, on_conflict="student_id").execute()
        print("✓ mod02 success")
    except Exception as e:
        print(f"✗ mod02 failed: {e}")

    # 3. mod07_degree_audits (Verified Table Name from error hint)
    try:
        audit_data = {
            "user_id": student_id,
            "program_name": "Computer Science (B.S.)",
            "total_credits_required": 120,
            "total_credits_completed": 92,
            "major_gpa": 3.9,
            "is_on_track": True,
            "audit_json": {"requirements": ["Calculus I: OK", "Algorithms: OK"]}
        }
        supabase.table("mod07_degree_audits").upsert(audit_data, on_conflict="user_id").execute()
        print("✓ mod07 success")
    except Exception as e:
        print(f"✗ mod07 failed: {e}")

    print("Seed V4 Complete.")

if __name__ == "__main__":
    seed()

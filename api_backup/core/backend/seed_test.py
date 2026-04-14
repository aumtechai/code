import uuid
from datetime import datetime
from app.ednex import get_supabase_client

def seed_one_by_one():
    supabase = get_supabase_client()
    email = "student@university.edu" # Using the one that already exists in mod00 probably
    
    # 1. Ensure user
    user_data = {
        "email": email,
        "first_name": "Alex",
        "last_name": "Student",
        "role": "student",
        "is_active": True,
        "password_hash": "hashedpw"
    }
    ur = supabase.table("mod00_users").upsert(user_data, on_conflict="email").execute()
    student_id = ur.data[0]["id"]
    print(f"Student ID: {student_id}")

    # 2. mod01
    sis_data = {
        "user_id": student_id,
        "external_student_id": "SIS-ALEX-101",
        "enrollment_status": "Enrolled",
        "cumulative_gpa": 3.9,
        "academic_standing": "Honors",
        "expected_graduation_term": "Fall 2026",
        "total_units_earned": 105,
        "ai_insight": "Exceptional student performance."
    }
    try:
        supabase.table("mod01_student_profiles").delete().eq("user_id", student_id).execute()
        dr = supabase.table("mod01_student_profiles").insert(sis_data).execute()
        print("Success: mod01")
    except Exception as e:
        print(f"Error mod01: {e}")

    # 3. mod02
    finance_data = {
        "student_id": student_id,
        "tuition_balance": 5000.0,
        "fees_balance": 100.0,
        "financial_aid_award": 3000.0,
        "has_financial_hold": False,
        "net_amount_due": 2100.0
    }
    try:
        supabase.table("mod02_student_accounts").delete().eq("student_id", student_id).execute()
        supabase.table("mod02_student_accounts").insert(finance_data).execute()
        print("Success: mod02")
    except Exception as e:
        print(f"Error mod02: {e}")

    # 4. mod04
    try:
        enrollment = {
            "student_id": student_id,
            "section_id": str(uuid.uuid4()),
            "midterm_grade": "A",
            "final_grade": "A",
            "absence_count": 0
        }
        supabase.table("mod04_enrollments").delete().eq("student_id", student_id).execute()
        supabase.table("mod04_enrollments").insert(enrollment).execute()
        print("Success: mod04")
    except Exception as e:
        print(f"Error mod04: {e}")

if __name__ == "__main__":
    seed_one_by_one()

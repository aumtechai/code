import uuid
from datetime import datetime
from app.ednex import get_supabase_client

def seed_robust():
    supabase = get_supabase_client()
    email = "student@aumtech.ai"
    
    # 1. Ensure user
    user_data = {
        "email": email,
        "first_name": "Daniel",
        "last_name": "Garrett",
        "role": "student",
        "is_active": True,
        "password_hash": "hashedpw"
    }
    ur = supabase.table("mod00_users").upsert(user_data, on_conflict="email").execute()
    student_id = ur.data[0]["id"]
    print(f"Student ID: {student_id}")

    # 2. mod01 (SIS) - Testing columns
    sis_candidates = [
        {"user_id": student_id, "external_student_id": "SIS-DG-449", "enrollment_status": "Enrolled", "cumulative_gpa": 3.65, "total_units_earned": 94, "academic_standing": "Good Standing", "expected_graduation_term": "Spring 2027"},
        {"user_id": student_id, "external_student_id": "SIS-DG-449", "enrollment_status": "Enrolled", "gpa": 3.65, "credits_earned": 94, "academic_standing": "Good Standing", "expected_graduation": "Spring 2027"},
        {"user_id": student_id, "external_student_id": "SIS-DG-449", "status": "Enrolled", "gpa": 3.65, "units": 94}
    ]

    for cand in sis_candidates:
        try:
            supabase.table("mod01_student_profiles").delete().eq("user_id", student_id).execute()
            supabase.table("mod01_student_profiles").insert(cand).execute()
            print(f"Success mod01 with columns: {list(cand.keys())}")
            break
        except Exception as e:
            print(f"Failed mod01 cand: {e}")

    # 3. mod02 (Finance)
    finance_cand = {"student_id": student_id, "tuition_balance": 12500.0, "fees_balance": 450.0, "financial_aid_award": 8000.0, "net_amount_due": 4950.0, "has_financial_hold": False}
    try:
        supabase.table("mod02_student_accounts").delete().eq("student_id", student_id).execute()
        supabase.table("mod02_student_accounts").insert(finance_cand).execute()
        print("Success mod02")
    except Exception as e:
        print(f"Error mod02: {e}")

    # 4. mod04 (Enrollments)
    try:
        enrollment = {"student_id": student_id, "section_id": str(uuid.uuid4()), "midterm_grade": "A", "final_grade": "A", "absence_count": 0}
        supabase.table("mod04_enrollments").delete().eq("student_id", student_id).execute()
        supabase.table("mod04_enrollments").insert(enrollment).execute()
        print("Success mod04")
    except Exception as e:
        print(f"Error mod04: {e}")

if __name__ == "__main__":
    seed_robust()

import os
from datetime import datetime, timedelta
from app.ednex import get_supabase_client

def seed_ednex_supabase():
    supabase = get_supabase_client()
    if not supabase:
        print("Supabase client not configured. Check environment variables.")
        return

    print("Seeding EdNex Supabase Data Warehouse...")

    # 1. Create User Identity (mod00_users)
    student_email = "student@aumtech.ai"
    user_data = {
        "email": student_email,
        "first_name": "Daniel",
        "last_name": "Garrett",
        "role": "student",
        "is_active": True,
        "password_hash": "hashedpw" # Special bypass for demo
    }
    
    # Upsert user
    resp = supabase.table("mod00_users").upsert(user_data, on_conflict="email").execute()
    if not resp.data:
        print("Failed to upsert user.")
        return
    
    student_id = resp.data[0]["id"]
    print(f"User {student_email} seeded with EdNex ID: {student_id}")

    # 2. SIS Profile (mod01_student_profiles)
    sis_data = {
        "user_id": student_id,
        "external_student_id": "SIS-DG-449",
        "enrollment_status": "Full-Time",
        "cumulative_gpa": 3.65,
        "total_units_earned": 94,
        "academic_standing": "Good Standing",
        "expected_graduation_term": "Spring 2027",
        "dob": "2004-05-12"
    }
    supabase.table("mod01_student_profiles").delete().eq("user_id", student_id).execute()
    supabase.table("mod01_student_profiles").insert(sis_data).execute()
    print("SIS Profile seeded.")

    # 3. Financial Account (mod02_student_accounts)
    finance_data = {
        "student_id": student_id,
        "tuition_balance": 12500.0,
        "fees_balance": 450.0,
        "financial_aid_award": 8000.0,
        "net_amount_due": 4950.0,
        "has_financial_hold": False
    }
    supabase.table("mod02_student_accounts").delete().eq("student_id", student_id).execute()
    supabase.table("mod02_student_accounts").insert(finance_data).execute()
    print("Financial Account seeded.")

    # 4. Enrollments (mod04_enrollments)
    import uuid
    enrollments = [
        {"student_id": student_id, "section_id": str(uuid.uuid4()), "final_grade": "A-", "midterm_grade": "A", "absence_count": 2},
        {"student_id": student_id, "section_id": str(uuid.uuid4()), "final_grade": "B+", "midterm_grade": "B", "absence_count": 0},
        {"student_id": student_id, "section_id": str(uuid.uuid4()), "final_grade": "A", "midterm_grade": "A", "absence_count": 1}
    ]
    supabase.table("mod04_enrollments").delete().eq("student_id", student_id).execute()
    supabase.table("mod04_enrollments").insert(enrollments).execute()
    print("Enrollments seeded.")

    # 5. Admissions (mod06_admissions_applications)
    admissions = {
        "user_id": student_id,
        "app_number": "APP-2024-8891",
        "status": "Admitted",
        "admit_type": "Transfer",
        "admit_term": "Fall 2024",
        "external_gpa": 3.8
    }
    supabase.table("mod06_admissions_applications").delete().eq("user_id", student_id).execute()
    supabase.table("mod06_admissions_applications").insert(admissions).execute()
    print("Admissions seeded.")

    # 6. Degree Audits (mod07_degree_audits)
    audits = [
        {"user_id": student_id, "requirement_name": "General Education - Core", "status": "Met", "courses_applied": ["ENG101", "HIS102"]},
        {"user_id": student_id, "requirement_name": "Major Core: Data Structures", "status": "Met", "courses_applied": ["CS202"]},
        {"user_id": student_id, "requirement_name": "Major Core: Operating Systems", "status": "In Progress", "courses_applied": ["CS301"]}
    ]
    supabase.table("mod07_degree_audits").delete().eq("user_id", student_id).execute()
    supabase.table("mod07_degree_audits").insert(audits).execute()
    print("Degree Audits seeded.")

    # 7. Aid Packages (mod08_aid_packages)
    aid = {
        "student_id": student_id,
        "aid_year": "2025-2026",
        "status": "Accepted",
        "total_offered": 8000.0,
        "total_disbursed": 4000.0
    }
    supabase.table("mod08_aid_packages").delete().eq("student_id", student_id).execute()
    supabase.table("mod08_aid_packages").insert(aid).execute()
    print("Financial Aid seeded.")

    print("--- EdNex Supabase Seeding Completed ---")

if __name__ == "__main__":
    seed_ednex_supabase()

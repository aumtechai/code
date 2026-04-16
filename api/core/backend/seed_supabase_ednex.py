"""
EdNex Supabase Full Cohort Seed Script (Schema-Correct)
Populates all EdNex modules using the verified column names from the live database.
Run: python -X utf8 seed_supabase_ednex.py
"""
import os
import sys
import uuid
from datetime import datetime, timedelta

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from app.ednex import get_supabase_admin_client

INSTITUTION_ID = "48b3789f-4097-4040-95d6-cf5fee5a6917"

# ─────────────────────────────────────────────
# COHORT DEFINITIONS
# ─────────────────────────────────────────────

STUDENTS = [
    {"email": "eric.moore0@txu.edu",     "first": "Eric",    "last": "Moore",     "major": "Computer Science",        "gpa": 3.60, "credits": 94,  "risk": "low",    "standing": "Good Standing"},
    {"email": "sarah.johnson@txu.edu",   "first": "Sarah",   "last": "Johnson",   "major": "Nursing",                 "gpa": 2.40, "credits": 58,  "risk": "medium", "standing": "Academic Warning"},
    {"email": "alex.rivera@txu.edu",     "first": "Alex",    "last": "Rivera",    "major": "Business Administration", "gpa": 1.80, "credits": 32,  "risk": "high",   "standing": "Academic Probation"},
    {"email": "priya.nair@txu.edu",      "first": "Priya",   "last": "Nair",      "major": "Mechanical Engineering",  "gpa": 3.85, "credits": 105, "risk": "low",    "standing": "Good Standing"},
    {"email": "jordan.miller@txu.edu",   "first": "Jordan",  "last": "Miller",    "major": "Computer Science",        "gpa": 3.20, "credits": 75,  "risk": "low",    "standing": "Good Standing"},
    {"email": "daniel.garrett@txu.edu",  "first": "Daniel",  "last": "Garrett",   "major": "Data Science",            "gpa": 3.65, "credits": 94,  "risk": "low",    "standing": "Good Standing"},
    {"email": "ava.johnson@txu.edu",     "first": "Ava",     "last": "Johnson",   "major": "Psychology",              "gpa": 1.80, "credits": 28,  "risk": "high",   "standing": "Academic Probation"},
    {"email": "marcus.chen@txu.edu",     "first": "Marcus",  "last": "Chen",      "major": "Computer Science",        "gpa": 2.60, "credits": 47,  "risk": "medium", "standing": "Academic Warning"},
    {"email": "elena.rodriguez@txu.edu", "first": "Elena",   "last": "Rodriguez", "major": "Art History",             "gpa": 1.50, "credits": 22,  "risk": "high",   "standing": "Academic Probation"},
    {"email": "david.smith@txu.edu",     "first": "David",   "last": "Smith",     "major": "Computer Science",        "gpa": 3.80, "credits": 112, "risk": "low",    "standing": "Good Standing"},
    {"email": "sophie.taylor@txu.edu",   "first": "Sophie",  "last": "Taylor",    "major": "Biology",                 "gpa": 2.10, "credits": 40,  "risk": "medium", "standing": "Academic Warning"},
    {"email": "julian.brown@txu.edu",    "first": "Julian",  "last": "Brown",     "major": "History",                 "gpa": 1.20, "credits": 18,  "risk": "high",   "standing": "Academic Suspension"},
]

FACULTY = [
    {"email": "m.thorne@txu.edu",   "first": "Marcus", "last": "Thorne",  "dept": "Computer Science"},
    {"email": "e.vasquez@txu.edu",  "first": "Elena",  "last": "Vasquez", "dept": "Nursing"},
    {"email": "j.park@txu.edu",     "first": "James",  "last": "Park",    "dept": "Business"},
    {"email": "l.chen@txu.edu",     "first": "Linda",  "last": "Chen",    "dept": "Engineering"},
]

ADVISORS = [
    {"email": "r.adams@txu.edu",  "first": "Rachel",  "last": "Adams",  "notes": "STEM & Transfer Students"},
    {"email": "k.brown@txu.edu",  "first": "Kevin",   "last": "Brown",  "notes": "Business & Pre-Law"},
    {"email": "s.lopez@txu.edu",  "first": "Sandra",  "last": "Lopez",  "notes": "Health Sciences & At-Risk"},
]

PROGRAMS = [
    {"name": "Computer Science",        "degree_type": "Bachelor of Science",           "required_credits": 120},
    {"name": "Nursing",                 "degree_type": "Bachelor of Science in Nursing", "required_credits": 128},
    {"name": "Business Administration", "degree_type": "Bachelor of Business Administration", "required_credits": 120},
    {"name": "Mechanical Engineering",  "degree_type": "Bachelor of Science",           "required_credits": 128},
    {"name": "Data Science",            "degree_type": "Bachelor of Science",           "required_credits": 120},
    {"name": "Psychology",              "degree_type": "Bachelor of Arts",              "required_credits": 120},
    {"name": "Art History",             "degree_type": "Bachelor of Arts",              "required_credits": 120},
    {"name": "Biology",                 "degree_type": "Bachelor of Science",           "required_credits": 124},
    {"name": "History",                 "degree_type": "Bachelor of Arts",              "required_credits": 120},
]

COURSES = [
    {"course_code": "CS101",   "title": "Introduction to Computer Science",   "credits": 3},
    {"course_code": "CS201",   "title": "Data Structures & Algorithms",        "credits": 3},
    {"course_code": "CS301",   "title": "Operating Systems",                   "credits": 3},
    {"course_code": "CS401",   "title": "Machine Learning",                    "credits": 3},
    {"course_code": "MATH201", "title": "Calculus II",                         "credits": 4},
    {"course_code": "MATH301", "title": "Linear Algebra",                      "credits": 3},
    {"course_code": "STAT201", "title": "Probability & Statistics",            "credits": 3},
    {"course_code": "NURS301", "title": "Clinical Nursing Practice",           "credits": 4},
    {"course_code": "NURS201", "title": "Pharmacology",                        "credits": 3},
    {"course_code": "BUS201",  "title": "Principles of Marketing",             "credits": 3},
    {"course_code": "BUS301",  "title": "Corporate Finance",                   "credits": 3},
    {"course_code": "MECH201", "title": "Statics & Dynamics",                  "credits": 4},
    {"course_code": "DS201",   "title": "Introduction to Data Science",        "credits": 3},
    {"course_code": "ENG101",  "title": "English Composition",                 "credits": 3},
    {"course_code": "HIS102",  "title": "World History Since 1945",            "credits": 3},
    {"course_code": "PSYC101", "title": "Introduction to Psychology",          "credits": 3},
    {"course_code": "BIO201",  "title": "Cell Biology",                        "credits": 4},
    {"course_code": "ART205",  "title": "Art History: Renaissance to Modern",  "credits": 3},
]

COMPANIES = [
    {"name": "TechGlobal Inc.",           "industry": "Tech",        "partner_level": "Premium"},
    {"name": "National Health Solutions", "industry": "Healthcare",  "partner_level": "Standard"},
    {"name": "Apex Financial Group",      "industry": "Finance",     "partner_level": "Premium"},
    {"name": "StartUp Hub",               "industry": "Tech",        "partner_level": "Standard"},
    {"name": "GreenPath Engineering",     "industry": "Engineering", "partner_level": "Premium"},
]

ENROLLMENTS = {
    "eric.moore0@txu.edu":     [("CS401","A-","A",2), ("MATH301","B+","B",0), ("STAT201","A","A",1), ("ENG101","A","A",0)],
    "sarah.johnson@txu.edu":   [("NURS301","C+","C",5), ("NURS201","B-","C+",3), ("BIO201","C","C-",6)],
    "alex.rivera@txu.edu":     [("BUS201","D","D+",9), ("BUS301","D+","C-",7), ("HIS102","C-","D",4)],
    "priya.nair@txu.edu":      [("MECH201","A","A",0), ("MATH301","A","A",1), ("MATH201","A-","A",0), ("STAT201","A","A",0)],
    "jordan.miller@txu.edu":   [("CS201","B+","B",2), ("CS301","B","B-",3), ("STAT201","B+","A-",1)],
    "daniel.garrett@txu.edu":  [("DS201","A-","A",2), ("STAT201","A","A",0), ("CS201","A","A",1), ("MATH301","B+","A-",1)],
    "ava.johnson@txu.edu":     [("PSYC101","D","D+",11), ("ENG101","D+","C-",8)],
    "marcus.chen@txu.edu":     [("CS101","C+","C",4), ("MATH201","C","C+",5), ("ENG101","B-","C+",2)],
    "elena.rodriguez@txu.edu": [("ART205","D","D+",14), ("HIS102","D","D",10)],
    "david.smith@txu.edu":     [("CS401","A","A",0), ("CS301","A","A",0), ("MATH301","A-","A",1), ("STAT201","A","A",0)],
    "sophie.taylor@txu.edu":   [("BIO201","C-","D+",7), ("PSYC101","C","C",4), ("ENG101","C+","B-",3)],
    "julian.brown@txu.edu":    [("HIS102","F","F",20), ("ENG101","D","D-",15)],
}

MIGRATION_FLAGS = [
    {"email": "alex.rivera@txu.edu",     "flag": "Migration Prediction: 85% to Computer Science. Out-of-major taking: CS101, STAT201", "severity": "High"},
    {"email": "elena.rodriguez@txu.edu", "flag": "Migration Prediction: 92% to Psychology. Out-of-major taking: PSYC101, SOC201",      "severity": "Critical"},
    {"email": "julian.brown@txu.edu",    "flag": "Migration Prediction: 75% to Political Science. Out-of-major taking: HIST102, POLS101","severity": "High"},
    {"email": "marcus.chen@txu.edu",     "flag": "Migration Prediction: 60% to Data Science. Out-of-major taking: DS201, STAT201",     "severity": "Medium"},
    {"email": "ava.johnson@txu.edu",     "flag": "Migration Prediction: 70% to Social Work. Out-of-major taking: SOC101, PSYC101",     "severity": "Medium"},
]


def upsert_user(sb, email, first, last, role):
    # mod00_users has a unique constraint on email
    r = sb.table("mod00_users").upsert({
        "email": email, "first_name": first, "last_name": last,
        "role": role, "is_active": True, "password_hash": "hashed_placeholder",
        "institution_id": INSTITUTION_ID,
    }, on_conflict="email").execute()
    if r.data:
        return r.data[0]["id"]
    # Fallback: query existing
    existing = sb.table("mod00_users").select("id").eq("email", email).execute()
    if existing.data:
        return existing.data[0]["id"]
    print(f"  ERR: upsert failed for {email}")
    return None


def seed_ednex_supabase():
    sb = get_supabase_admin_client()
    if not sb:
        print("ERR: Supabase admin client not configured. "
              "Make sure SUPABASE_SERVICE_KEY is in your .env file.")
        return

    print("[START] EdNex Full Cohort Seed")

    # 1. Programs
    print("1/8 Programs...")
    # Fetch existing names to avoid duplicates
    existing_progs = sb.table("mod01_programs").select("name").execute()
    existing_prog_names = {r["name"] for r in (existing_progs.data or [])}
    for prog in PROGRAMS:
        prog["institution_id"] = INSTITUTION_ID
        if prog["name"] not in existing_prog_names:
            sb.table("mod01_programs").insert(prog).execute()
    print(f"    OK: programs seeded")

    # 2. Companies
    print("2/8 Companies...")
    existing_cos = sb.table("mod05_companies").select("name").execute()
    existing_co_names = {r["name"] for r in (existing_cos.data or [])}
    for co in COMPANIES:
        if co["name"] not in existing_co_names:
            sb.table("mod05_companies").insert(co).execute()
    print(f"    OK: companies seeded")

    # 3. Course catalog — use upsert on course_code
    print("3/8 Course catalog...")
    for c in COURSES:
        c["institution_id"] = INSTITUTION_ID
        existing = sb.table("mod04_courses").select("id").eq("course_code", c["course_code"]).execute()
        if not existing.data:
            sb.table("mod04_courses").insert(c).execute()
    # Build code->section_id map for enrollments
    cats = sb.table("mod04_courses").select("id,course_code").execute()
    course_id_map = {row["course_code"]: row["id"] for row in (cats.data or [])}
    print(f"    OK: {len(course_id_map)} courses available")

    # 4. Fetch program id map
    progs_resp = sb.table("mod01_programs").select("id,name").execute()
    program_id_map = {row["name"]: row["id"] for row in (progs_resp.data or [])}

    # 5. Faculty
    print("4/8 Faculty...")
    faculty_ids = {}
    for f in FACULTY:
        uid = upsert_user(sb, f["email"], f["first"], f["last"], "faculty")
        if uid:
            faculty_ids[f["email"]] = uid
            print(f"    OK: Faculty {f['first']} {f['last']}")

    # 6. Advisors
    print("5/8 Advisors...")
    advisor_ids = {}
    for a in ADVISORS:
        uid = upsert_user(sb, a["email"], a["first"], a["last"], "advisor")
        if uid:
            advisor_ids[a["email"]] = uid
            print(f"    OK: Advisor {a['first']} {a['last']}")
    advisor_list = list(advisor_ids.values())

    # 7. Students
    print("6/8 Students + profiles + financial + enrollments...")
    student_ids = {}
    for i, stu in enumerate(STUDENTS):
        uid = upsert_user(sb, stu["email"], stu["first"], stu["last"], "student")
        if not uid:
            continue
        student_ids[stu["email"]] = uid

        # SIS Profile
        prog_id = program_id_map.get(stu["major"])
        grad_year = 2025 + max(1, (120 - stu["credits"]) // 30)
        # Use uid suffix for external_student_id to ensure uniqueness per user
        ext_id = f"TXU-{uid[:8].upper()}"
        sb.table("mod01_student_profiles").upsert({
            "user_id": uid,
            "external_student_id": ext_id,
            "enrollment_status": "Enrolled",
            "cumulative_gpa": stu["gpa"],
            "credits_earned": stu["credits"],
            "total_units_earned": stu["credits"],
            "academic_standing": stu["standing"],
            "expected_graduation": f"{grad_year}-05-15",
            **({"program_id": prog_id} if prog_id else {}),
        }, on_conflict="user_id").execute()

        # Financial account
        tuition = round(12500 + (i * 300), 2)
        aid = round(8000 + (stu["gpa"] * 500), 2)
        net = round(tuition + 450 - aid, 2)
        sb.table("mod02_student_accounts").upsert({
            "student_id": uid,
            "tuition_balance": tuition,
            "fees_balance": 450.0,
            "financial_aid_award": aid,
            "net_amount_due": net,
            "has_financial_hold": stu["risk"] == "high",
            "payment_due_date": "2026-10-01",
        }, on_conflict="student_id").execute()

        # Aid package
        try:
            sb.table("mod08_aid_packages").delete().eq("student_id", uid).execute()
            sb.table("mod08_aid_packages").insert({
                "student_id": uid, "aid_year": "2025-2026",
                "status": "Accepted" if stu["risk"] != "high" else "Pending",
                "total_offered": aid, "total_disbursed": round(aid / 2, 2),
            }).execute()
        except Exception as e:
            print(f"    WARN mod08: {e}")

        # Enrollments
        try:
            sb.table("mod04_enrollments").delete().eq("student_id", uid).execute()
            for (code, grade, midterm, absences) in ENROLLMENTS.get(stu["email"], []):
                section_id = course_id_map.get(code, str(uuid.uuid4()))
                sb.table("mod04_enrollments").insert({
                    "student_id": uid, "section_id": section_id,
                    "final_grade": grade, "midterm_grade": midterm, "absence_count": absences,
                }).execute()
        except Exception as e:
            print(f"    WARN mod04_enrollments: {e}")

        # Advising appointment
        if advisor_list:
            try:
                adv_id = advisor_list[i % len(advisor_list)]
                appt_dt = (datetime.now() + timedelta(days=(i * 3 + 2))).strftime("%Y-%m-%dT%H:%M:%S")
                sb.table("mod03_advising_appointments").delete().eq("student_id", uid).execute()
                sb.table("mod03_advising_appointments").insert({
                    "student_id": uid, "advisor_id": adv_id,
                    "appointment_date": appt_dt, "status": "Scheduled",
                    "meeting_notes": f"Topic: {'Academic Recovery' if stu['risk'] == 'high' else 'Degree Planning'} | GPA {stu['gpa']}",
                }).execute()
            except Exception as e:
                print(f"    WARN mod03_appts: {e}")

        # Degree audit
        try:
            sb.table("mod07_degree_audits").delete().eq("user_id", uid).execute()
            sb.table("mod07_degree_audits").insert([
                {"user_id": uid, "requirement_name": "General Education Core", "status": "Met"},
                {"user_id": uid, "requirement_name": f"{stu['major']} Core Sequence", "status": "In Progress"},
            ]).execute()
        except Exception as e:
            print(f"    WARN mod07: {e}")

        # Admissions
        try:
            sb.table("mod06_admissions_applications").delete().eq("user_id", uid).execute()
            sb.table("mod06_admissions_applications").insert({
                "user_id": uid, "app_number": f"APP-2024-{8800+i}",
                "status": "Admitted",
                "admit_type": "Transfer" if stu["credits"] > 60 else "Freshman",
                "admit_term": "Fall 2024", "external_gpa": round(stu["gpa"] + 0.1, 2),
            }).execute()
        except Exception as e:
            print(f"    WARN mod06: {e}")

        print(f"    OK: {stu['first']} {stu['last']} (GPA {stu['gpa']}, {stu['credits']} cr)")

    # 8. Migration flags
    print("7/8 Migration flags...")
    for flag in MIGRATION_FLAGS:
        eid = student_ids.get(flag["email"])
        if not eid:
            continue
        sb.table("mod03_intervention_flags").insert({
            "student_id": eid,
            "flag_type": flag["flag"],
            "severity": flag["severity"],
            "is_resolved": False,
        }).execute()
        print(f"    OK: Flag for {flag['email']}")

    print("8/8 Skipping mod09 (no data needed)")
    print(f"\n[DONE] Seeded: {len(STUDENTS)} students, {len(FACULTY)} faculty, "
          f"{len(ADVISORS)} advisors, {len(PROGRAMS)} programs, "
          f"{len(COURSES)} courses, {len(COMPANIES)} companies, "
          f"{len(MIGRATION_FLAGS)} flags")


if __name__ == "__main__":
    seed_ednex_supabase()

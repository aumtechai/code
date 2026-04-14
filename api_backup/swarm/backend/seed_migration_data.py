import os
from datetime import datetime
from supabase import create_client

def seed_migration_data():
    url = 'https://rfkoylpcuptzkakmqotq.supabase.co'
    key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJma295bHBjdXB0emtha21xb3RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MzY0MDYsImV4cCI6MjA4ODQxMjQwNn0.kcUD2GGSmMJLcG0tyJZtbCd9h9gB2S8jFYDz9RJKMe8'
    supabase = create_client(url, key)

    print("Seeding Migration Tracker data into EdNex (mod03_intervention_flags)...")

    # 1. Get a few students from mod01_student_profiles
    profiles_resp = supabase.table("mod01_student_profiles").select("user_id").limit(5).execute()
    if not profiles_resp.data:
        print("No student profiles found to attach migration data.")
        return

    students = profiles_resp.data

    # We will insert a few "Migration Risk" flags into mod03
    test_data = [
        {
            "student_id": students[0]["user_id"],
            "flag_type": "Migration Prediction: 85% to Business. Out-of-major taking: MKTG 101, ACCT 202",
            "severity": "High",
            "is_resolved": False
        }
    ]
    
    if len(students) > 1:
        test_data.append({
            "student_id": students[1]["user_id"],
            "flag_type": "Migration Prediction: 60% to Computer Science. Out-of-major taking: CS 101, MATH 201",
            "severity": "Medium",
            "is_resolved": False
        })
        
    if len(students) > 2:
        test_data.append({
            "student_id": students[2]["user_id"],
            "flag_type": "Migration Prediction: 92% to Art History. Out-of-major taking: ART 205, HIST 101",
            "severity": "Critical",
            "is_resolved": False
        })

    # Clear existing migration flags
    try:
        existing = supabase.table("mod03_intervention_flags").select("id").ilike("flag_type", "Migration Prediction%").execute()
        for f in existing.data:
            supabase.table("mod03_intervention_flags").delete().eq("id", f["id"]).execute()
    except Exception as e:
        print("Cleanup error:", e)

    # Insert new flags
    for d in test_data:
        res = supabase.table("mod03_intervention_flags").insert(d).execute()
        print(f"Inserted Migration Risk for student {d['student_id']}")

    print("Migration data seeding complete.")

if __name__ == "__main__":
    seed_migration_data()

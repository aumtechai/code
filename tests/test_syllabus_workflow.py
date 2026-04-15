import requests
import json
import os
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8000/api"
STUDENT_EMAIL = "student@aumtech.ai"
STUDENT_PASSWORD = "password123"

def test_syllabus_workflow():
    print("--- Starting Syllabus Workflow Test ---")
    
    # 1. Login to get token
    print(f"Logging in as {STUDENT_EMAIL}...")
    login_res = requests.post(f"{BASE_URL}/auth/login", data={
        "username": STUDENT_EMAIL,
        "password": STUDENT_PASSWORD
    })
    if login_res.status_code != 200:
        print(f"Login failed: {login_res.text}")
        return
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("Login successful.")

    # 2. Get Courses to find an ID
    courses_res = requests.get(f"{BASE_URL}/courses", headers=headers)
    try:
        courses = courses_res.json()
    except:
        print(f"FAILED to parse courses JSON. Status: {courses_res.status_code}")
        print(f"Response: {courses_res.text}")
        return
    
    if not courses:
        print("No courses found. Please run seed_v6_courses.py first.")
        return
    
    target_course = courses[0]
    print(f"Target Course: {target_course['name']} ({target_course['code']}) [ID: {target_course['id']}]")

    # 3. Simulated Syllabus Content
    # We'll create a text file to upload
    syllabus_text = """
    CS402: Advanced Algorithms - Spring 2026
    
    SCHEDULE OF ASSIGNMENTS:
    - Homework 1: Complexity Analysis - Due February 10, 2026
    - Homework 2: Graph Theory Basics - Due February 24, 2026
    - MIDTERM EXAM: March 15, 2026 (In Class)
    - Final Project Proposal - Due April 05, 2026
    - Homework 3: Greedy Algorithms - Due April 15, 2026
    - FINAL EXAM: May 12, 2026 at 9:00 AM
    """
    
    with open("mock_syllabus.txt", "w") as f:
        f.write(syllabus_text)

    # 4. Upload and Parse Syllabus
    print(f"Uploading syllabus for {target_course['code']}...")
    with open("mock_syllabus.txt", "rb") as f:
        upload_res = requests.post(
            f"{BASE_URL}/courses/{target_course['id']}/upload-syllabus",
            headers=headers,
            files={"file": ("syllabus.txt", f, "text/plain")}
        )
    
    if upload_res.status_code != 200:
        print(f"Upload failed: {upload_res.text}")
        return
    
    result = upload_res.json()
    print(f"AI Success: Extracted {result['events_extracted']} events from syllabus.")

    # 5. Verify Calendar Feed
    print("Verifying calendar events...")
    calendar_res = requests.get(f"{BASE_URL}/calendar/events", headers=headers)
    events = calendar_res.json()
    
    # Filter for this course
    course_events = [e for e in events if e['course_id'] == target_course['id']]
    print(f"Retrieved {len(course_events)} calendar events for this course.")
    
    for ev in course_events:
        print(f"  - [{ev['event_type'].upper()}] {ev['title']} on {ev['event_date'][:10]}")

    print("--- Test Completed Successfully ---")
    
    # Cleanup
    if os.path.exists("mock_syllabus.txt"):
        os.remove("mock_syllabus.txt")

if __name__ == "__main__":
    test_syllabus_workflow()

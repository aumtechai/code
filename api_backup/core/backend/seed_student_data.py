import random
from datetime import datetime, timedelta
from sqlmodel import Session, select
from app.auth import engine, get_password_hash
from app.models import (
    User, Course, Tutor, FormRequest, Advisor, 
    LectureNote, StudentHold, Scholarship, 
    TutoringCourse, TutoringSection, TutoringEnrollment, TutoringAppointment
)

def seed_student_full_profile(email="student@aumtech.ai"):
    with Session(engine) as session:
        # 1. Create or Update Student
        student = session.exec(select(User).where(User.email == email)).first()
        if not student:
            student = User(
                email=email,
                password_hash=get_password_hash("student123"),
                full_name="Daniel Garrett",
                major="Computer Science",
                gpa=3.6,
                on_track_score=94,
                background="Transfer student from Community College, specializing in Software Engineering.",
                interests="Artificial Intelligence, Distributed Systems, Hiking",
                ai_insight="I noticed your GPA has a slight dip in Mathematics. Focus on the upcoming 'Calculus II' tutoring session to maintain your 3.6 GPA.",
                is_active=True
            )
            session.add(student)
            session.commit()
            session.refresh(student)
            print(f"Created student: {student.full_name}")
        else:
            student.full_name = "Daniel Garrett"
            student.major = "Computer Science"
            student.gpa = 3.6
            student.on_track_score = 94
            session.add(student)
            session.commit()
            session.refresh(student)
            print(f"Updated student: {student.full_name}")

        # 2. Add Courses
        course_data = [
            ("CS301", "Operating Systems", "A-", 3),
            ("MATH201", "Calculus II", "B+", 4),
            ("CS202", "Data Structures", "A", 3),
            ("ENG101", "English Composition", "A", 3),
        ]
        for code, name, grade, credits in course_data:
            existing = session.exec(select(Course).where(Course.user_id == student.id, Course.code == code)).first()
            if not existing:
                c = Course(user_id=student.id, code=code, name=name, grade=grade, credits=credits, suggestion="Focus on recursion complexity.")
                session.add(c)
        
        # 3. Add Advisor
        advisor = session.exec(select(Advisor).where(Advisor.name == "Dr. Brenda Vance")).first()
        if not advisor:
            advisor = Advisor(
                name="Dr. Brenda Vance",
                specialty="STEM Admissions & Career",
                availability="Mon-Thu 9AM-4PM",
                email="b.vance@university.edu",
                image="BV"
            )
            session.add(advisor)
            session.commit()
            session.refresh(advisor)

        # 4. Add Holds & Tasks
        holds_data = [
            ("hold", "Financial", "Outstanding Library Fine", "Unpaid fine of $15.50 for overdue books.", 15.50),
            ("task", "Administrative", "Upload Vaccination Records", "Required for Fall 2026 registration.", 0),
            ("alert", "Academic", "Low Grade Warning: MATH201", "Your mid-term grade is below C. See tutor.", 0),
        ]
        for item_type, cat, title, desc, amt in holds_data:
            existing = session.exec(select(StudentHold).where(StudentHold.user_id == student.id, StudentHold.title == title)).first()
            if not existing:
                h = StudentHold(user_id=student.id, item_type=item_type, category=cat, title=title, description=desc, amount=amt, status="active")
                session.add(h)

        # 5. Add Lecture Notes (Simulating Google Drive)
        notes_data = [
            ("OS Lecture 14: Virtual Memory", "Operating Systems", "Dr. Sarah Faculty", 
             "Virtual memory is a memory management technique that provides an idealized abstraction of the storage resources...",
             '["Page tables", "TLB", "Demand paging"]', '["Review chapter 8", "Complete lab 3"]'),
            ("Intro to AI: Neural Networks", "Artificial Intelligence", "Dr. Mike AI",
             "Neural networks are a series of algorithms that endeavor to recognize underlying relationships in a set of data...",
             '["Backpropagation", "Weights", "Activation Function"]', '["Build XOR from scratch"]'),
        ]
        for title, c_name, prof, trans, key, action in notes_data:
            existing = session.exec(select(LectureNote).where(LectureNote.user_id == student.id, LectureNote.title == title)).first()
            if not existing:
                n = LectureNote(
                    user_id=student.id, title=title, course_name=c_name, professor_name=prof, 
                    transcript=trans, summary="Comprehensive lecture on the fundamentals of the topic.",
                    keywords=key, action_items=action, duration_seconds=3600
                )
                session.add(n)

        # 6. Add Scholarships
        scholarships = [
            ("Aumtech Tech Scholarship", "For students excelling in AI and software engineering.", 5000.0, "STEM", "Aumtech.ai"),
            ("Transfer Success Grant", "Financial support for transfer students.", 2000.0, "Need-based", "State Board"),
        ]
        for s_title, s_desc, s_amt, s_cat, s_prov in scholarships:
            existing = session.exec(select(Scholarship).where(Scholarship.title == s_title)).first()
            if not existing:
                sc = Scholarship(title=s_title, description=s_desc, amount=s_amt, category=s_cat, provider=s_prov, deadline=datetime.now() + timedelta(days=45), requirements="GPA 3.5+")
                session.add(sc)

        # 7. Tutoring Sync
        tc = session.exec(select(TutoringCourse).where(TutoringCourse.code == "CS301")).first()
        if not tc:
            tc = TutoringCourse(code="CS301", name="Operating Systems", department="Computer Science")
            session.add(tc)
            session.commit()
            session.refresh(tc)
        
        faculty = session.exec(select(User).where(User.email == "faculty@university.edu")).first()
        if faculty:
            ts = session.exec(select(TutoringSection).where(TutoringSection.course_id == tc.id, TutoringSection.instructor_id == faculty.id)).first()
            if not ts:
                ts = TutoringSection(course_id=tc.id, instructor_id=faculty.id, term="Spring 2026")
                session.add(ts)
                session.commit()
                session.refresh(ts)
            
            # Enroll Student
            te = session.exec(select(TutoringEnrollment).where(TutoringEnrollment.user_id == student.id, TutoringEnrollment.section_id == ts.id)).first()
            if not te:
                te = TutoringEnrollment(user_id=student.id, section_id=ts.id, role="student")
                session.add(te)
        
        session.commit()
        print("Final Full Student Profile Seeded Successfully.")

if __name__ == "__main__":
    seed_student_full_profile()

import random
from datetime import datetime, timedelta
from sqlmodel import Session, select
from app.auth import engine
from app.models import User, Course, CalendarEvent

def seed_v6():
    with Session(engine) as session:
        # 1. Get student
        student = session.exec(select(User).where(User.email == "student@aumtech.ai")).first()
        if not student:
            # Create if genuinely missing
            from app.auth import get_password_hash
            student = User(
                email="student@aumtech.ai", 
                password_hash=get_password_hash("password123"),
                full_name="Daniel Garrett",
                is_active=True
            )
            session.add(student)
            session.commit()
            session.refresh(student)

        # 2. Add realistic CS courses
        courses_data = [
            ("CS402", "Advanced Algorithms", "B+", 3, "Spring 2026"),
            ("CS410", "AI & Machine Learning", "A-", 4, "Spring 2026"),
            ("CS350", "Full-Stack Web Engineering", "A", 3, "Spring 2026"),
            ("MATH302", "Linear Algebra II", "B", 3, "Spring 2026"),
            ("PHIL105", "Ethics in Technology", "A", 3, "Spring 2026")
        ]

        for code, name, grade, credits, sem in courses_data:
            existing = session.exec(select(Course).where(Course.user_id == student.id, Course.code == code)).first()
            if not existing:
                c = Course(
                    user_id=student.id, 
                    code=code, 
                    name=name, 
                    grade=grade, 
                    credits=credits, 
                    semester=sem,
                    suggestion="Review course syllabus for key project dates."
                )
                session.add(c)
                print(f"Added course: {name}")
            else:
                existing.semester = sem
                session.add(existing)

        session.commit()

        # 3. Add some sample calendar events (Deadlines)
        events = [
            ("Algorithms: Problem Set 4", "Focus on Dynamic Programming", datetime(2026, 4, 18), "assignment"),
            ("ML: Midterm Project Proposal", "Submit via Canvas", datetime(2026, 4, 22), "assignment"),
            ("Web Eng: Sprint 2 Demo", "In-class presentation", datetime(2026, 4, 25), "exam"),
            ("Ethics: Weekly Reflection", "Participation credit", datetime(2026, 4, 16), "assignment"),
        ]

        for title, desc, date, etype in events:
            existing = session.exec(select(CalendarEvent).where(CalendarEvent.user_id == student.id, CalendarEvent.title == title)).first()
            if not existing:
                ev = CalendarEvent(user_id=student.id, title=title, description=desc, event_date=date, event_type=etype)
                session.add(ev)
                print(f"Added event: {title}")

        session.commit()
        print("Seed v6 completed.")

if __name__ == "__main__":
    seed_v6()

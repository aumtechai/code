from sqlmodel import Session, select
from app.auth import engine
from app.models import User, Course, CalendarEvent
from sqlalchemy import text

def check():
    with Session(engine) as session:
        # Check rows in User
        users = session.exec(select(User).where(User.email == "student@aumtech.ai")).all()
        print(f"Users with email student@aumtech.ai: {len(users)}")
        for u in users:
            print(f"  ID: {u.id}, Name: {u.full_name}")
            
            # Check courses for this user
            courses = session.exec(select(Course).where(Course.user_id == u.id)).all()
            print(f"  Courses found: {len(courses)}")
            for c in courses:
                print(f"    - {c.name} (Semester: {getattr(c, 'semester', 'MISSING')})")

if __name__ == "__main__":
    check()

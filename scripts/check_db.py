from sqlmodel import Session, select
from app.auth import engine
from app.models import User, Course

def check_ids():
    with Session(engine) as session:
        users = session.exec(select(User)).all()
        print("Users in DB:")
        for u in users:
            print(f"ID: {u.id}, Email: {u.email}")
        
        # Check courses for -60093018
        courses = session.exec(select(Course).where(Course.user_id == -60093018)).all()
        print(f"\nCourses for ID -60093018: {len(courses)}")
        for c in courses:
            print(f" - {c.name}")

if __name__ == "__main__":
    check_ids()

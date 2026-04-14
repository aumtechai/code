from sqlmodel import Session, select
from app.auth import engine, get_password_hash
from app.models import User, Course

def seed_daniel():
    with Session(engine) as session:
        email = "daniel.garrett12@txu.edu"
        password = "password123"
        full_name = "Daniel Garrett"

        print(f"Checking for user {email}...")
        try:
            user = session.exec(select(User).where(User.email == email)).first()
            if not user:
                print(f"Creating new user {email}...")
                user = User(
                    email=email,
                    password_hash=get_password_hash(password),
                    full_name=full_name,
                    major="Business Administration",
                    is_active=True,
                    gpa=3.2,
                    on_track_score=78
                )
            else:
                print(f"Updating user {email}...")
                user.password_hash = get_password_hash(password)
                user.is_active = True
                user.full_name = full_name
                user.major = "Business Administration"
                user.gpa = 3.2
                user.on_track_score = 78
            
            session.add(user)
            session.commit()
            session.refresh(user)
            
            # Seed Courses for Daniel
            # Clear existing courses for this user to avoid duplicates
            existing_courses = session.exec(select(Course).where(Course.user_id == user.id)).all()
            for ec in existing_courses:
                session.delete(ec)
            session.commit()

            sample_courses = [
                Course(user_id=user.id, name="Calculus II", grade="D+", credits=4, status="active"),
                Course(user_id=user.id, name="Classical Mechanics", grade="A", credits=4, status="completed"),
                Course(user_id=user.id, name="Linear Algebra", grade="A-", credits=3, status="active"),
                Course(user_id=user.id, name="Business Ethics", grade="B+", credits=3, status="active"),
            ]
            for c in sample_courses:
                session.add(c)
            session.commit()

            print(f"User {email} and courses seeded successfully.")
        except Exception as e:
            print(f"Error seeding user: {e}")

if __name__ == "__main__":
    seed_daniel()

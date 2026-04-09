from sqlmodel import Session, select
from app.auth import engine
from app.models import User

def make_admin():
    with Session(engine) as session:
        email = "student@university.edu"
        user = session.exec(select(User).where(User.email == email)).first()
        if user:
            print(f"Granting admin rights to {email}...")
            user.is_admin = True
            session.add(user)
            session.commit()
            print("SUCCESS: User is now an admin.")
        else:
            print(f"ERROR: User {email} not found.")

if __name__ == "__main__":
    make_admin()

from sqlmodel import Session, text
from app.auth import engine
from app.models import SQLModel

def migrate():
    with Session(engine) as session:
        print("Running migration v6: Syllabus & Calendar...")
        
        # 1. Add columns to course table
        try:
            session.exec(text("ALTER TABLE course ADD COLUMN semester VARCHAR DEFAULT 'Spring 2026';"))
            print("Added 'semester' to course.")
        except Exception as e:
            print(f"Skipping 'semester': {e}")
            
        try:
            session.exec(text("ALTER TABLE course ADD COLUMN syllabus_url VARCHAR;"))
            print("Added 'syllabus_url' to course.")
        except Exception as e:
            print(f"Skipping 'syllabus_url': {e}")
            
        # 2. Create calendarevent table
        try:
            # We use SQLModel.metadata to create all tables (it will only create missing ones)
            SQLModel.metadata.create_all(engine)
            print("Verified/Created 'calendarevent' table.")
        except Exception as e:
            print(f"Failed to create table: {e}")
            
        session.commit()
        print("Migration v6 completed.")

if __name__ == "__main__":
    migrate()

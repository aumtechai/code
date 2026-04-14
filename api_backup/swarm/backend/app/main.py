from fastapi import FastAPI, Depends
from app.auth import get_admin_user
from app.models import User
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv(override=True)

from app.api import router

app = FastAPI(title="Student Success API", version="0.1.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    # allow_origins=[...],  # Commented out to use regex
    allow_origin_regex=r"https://.*\.aumtech\.ai|https://.*\.vercel\.app|http://localhost.*|http://127\.0\.0\.1.*|capacitor://.*|ionic://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    from sqlmodel import SQLModel, Session, select
    from sqlalchemy import text, inspect
    from app.auth import engine
    from app.models import (
        User, Course, ChatSession, ChatMessage, Tutor, FormRequest, 
        Advisor, StudyGroup, Mentorship, MarketplaceItem, 
        LectureNote, StudentHold, Scholarship, PersonalizedStatement,
        SystemConfig, Campaign, TutoringCourse, TutoringSection,
        TutoringEnrollment, TutoringAppointment
    )
    from datetime import datetime
    
    try:
        SQLModel.metadata.create_all(engine)
        
        # Simple migration: Add missing columns to 'user' table if they don't exist
        inspector = inspect(engine)
        existing_columns = [c["name"] for c in inspector.get_columns("user")]
        
        with engine.connect() as conn:
            columns_to_add = [
                ("full_name", "VARCHAR"),
                ("gpa", "FLOAT"),
                ("on_track_score", "INTEGER"),
                ("major", "VARCHAR"),
                ("background", "VARCHAR"),
                ("interests", "VARCHAR"),
                ("is_faculty", "BOOLEAN"),
                ("trial_ends_at", "TIMESTAMP"),
                ("subscription_status", "VARCHAR"),
                ("stripe_customer_id", "VARCHAR"),
                ("stripe_subscription_id", "VARCHAR"),
                ("is_advisor", "BOOLEAN"),
                ("is_dean", "BOOLEAN"),
                ("is_exec", "BOOLEAN")
            ]
            
            # Additional migration for LectureNote
            lecture_notes_cols = [
                ("action_items", "TEXT"),
                ("keywords", "TEXT"),
                ("follow_up_questions", "TEXT")
            ]
            
            for col_name, col_type in columns_to_add:
                if col_name not in existing_columns:
                    try:
                        conn.execute(text(f'ALTER TABLE "user" ADD COLUMN {col_name} {col_type}'))
                        conn.commit()
                        print(f"Successfully added column {col_name} to user table")
                    except Exception as e:
                        print(f"Error adding column {col_name}: {e}")
            
            # Check lecturenote table
            ln_inspector = inspect(engine)
            ln_existing = [c["name"] for c in ln_inspector.get_columns("lecturenote")]
            for col_name, col_type in lecture_notes_cols:
                if col_name not in ln_existing:
                    try:
                        conn.execute(text(f'ALTER TABLE "lecturenote" ADD COLUMN {col_name} {col_type}'))
                        conn.commit()
                        print(f"Successfully added column {col_name} to lecturenote table")
                    except Exception as e:
                        print(f"Error adding column {col_name} to lecturenote: {e}")
        
        # Seed Users (Test Accounts)
        from app.auth import get_password_hash
        
        with Session(engine) as session:
            # 1. Student
            student = session.exec(select(User).where(User.email == "student@university.edu")).first()
            if not student:
                student = User(
                    email="student@university.edu",
                    password_hash=get_password_hash("student123"),
                    full_name="Alex Student",
                    gpa=3.8,
                    major="Computer Science",
                    on_track_score=92,
                    background="First-gen college student interested in AI.",
                    interests="Machine Learning, Robotics, History",
                    is_admin=False,
                    is_faculty=False,
                    is_active=True
                )
                session.add(student)
                print("Seeded student user")

            # 2. Faculty
            faculty = session.exec(select(User).where(User.email == "faculty@university.edu")).first()
            if not faculty:
                faculty = User(
                    email="faculty@university.edu",
                    password_hash=get_password_hash("faculty123"),
                    full_name="Dr. Sarah Faculty",
                    is_admin=False,
                    is_faculty=True
                )
                session.add(faculty)
                print("Seeded faculty user")

            # 3. Admin
            admin = session.exec(select(User).where(User.email == "admin@university.edu")).first()
            if not admin:
                admin = User(
                    email="admin@university.edu",
                    password_hash=get_password_hash("admin123"),
                    full_name="System Admin",
                    is_admin=True,
                    is_faculty=False
                )
                session.add(admin)
                print("Seeded admin user")
            
            session.commit()

        # Seed Tutors
        with Session(engine) as session:
            sample_tutors = [
                Tutor(name="Alex Rivera", subjects="Calculus, Physics", rating=4.9, reviews=124, image="AR", color="#4f46e5"),
                Tutor(name="Sarah Chen", subjects="Chemistry, Biology", rating=4.8, reviews=89, image="SC", color="#10b981"),
                Tutor(name="Marcus Bell", subjects="History, English", rating=5.0, reviews=215, image="MB", color="#f59e0b"),
                Tutor(name="Elena Frost", subjects="Computer Science, Data Structures", rating=4.7, reviews=56, image="EF", color="#ec4899"),
                Tutor(name="David Park", subjects="Economics, Statistics", rating=4.9, reviews=92, image="DP", color="#8b5cf6"),
                Tutor(name="Maya Gupta", subjects="Psychology, Sociology", rating=4.8, reviews=156, image="MG", color="#f43f5e"),
                Tutor(name="Jordan Smith", subjects="Art History, Design", rating=4.6, reviews=43, image="JS", color="#06b6d4"),
                Tutor(name="Sam Wilson", subjects="Political Science, Law", rating=5.0, reviews=188, image="SW", color="#f97316"),
            ]
            
            for t in sample_tutors:
                statement = select(Tutor).where(Tutor.name == t.name)
                existing = session.exec(statement).first()
                if not existing:
                    session.add(t)
            session.commit()

            from app.models import Scholarship
            from datetime import timedelta
            
            sample_scholarships = [
                Scholarship(
                    title="STEM Excellence Award",
                    description="Awarded to outstanding students in Computer Science and Engineering.",
                    amount=5000.0,
                    deadline=datetime.now() + timedelta(days=60),
                    requirements="GPA 3.5+, STEM Major, Leadership experience",
                    category="STEM",
                    provider="Technology Foundation"
                ),
                Scholarship(
                    title="Future Leaders Scholarship",
                    description="Supporting the next generation of community leaders.",
                    amount=2500.0,
                    deadline=datetime.now() + timedelta(days=90),
                    requirements="Community service, Open to all majors, GPA 3.0+",
                    category="Merit",
                    provider="Civic League"
                ),
                Scholarship(
                    title="Diversity in Tech Grant",
                    description="Increasing representation in the technology sector.",
                    amount=3000.0,
                    deadline=datetime.now() + timedelta(days=45),
                    requirements="Underrepresented background, Interest in technology, Major in Tech/Business",
                    category="Diversity",
                    provider="Inclusive Partners"
                ),
                Scholarship(
                    title="The Arts & Humanities Fund",
                    description="Celebrating creative excellence and cultural research.",
                    amount=1500.0,
                    deadline=datetime.now() + timedelta(days=120),
                    requirements="Major in Arts or Humanities, Portfolio required",
                    category="Merit",
                    provider="Arts Council"
                )
            ]
            
            for s in sample_scholarships:
                statement = select(Scholarship).where(Scholarship.title == s.title)
                existing = session.exec(statement).first()
                if not existing:
                    session.add(s)
            
            session.commit()
            
            # Seed sample holds for first user

            first_user = session.exec(select(User)).first()
            if first_user:
                existing_holds = session.exec(select(StudentHold).where(StudentHold.user_id == first_user.id)).first()
                if not existing_holds:
                    sample_holds = [
                        StudentHold(
                            user_id=first_user.id,
                            item_type="hold",
                            category="Financial",
                            title="Outstanding Parking Ticket",
                            description="Unpaid ticket from 12/01/2025. Please pay to avoid registration delays.",
                            amount=50.00
                        ),
                        StudentHold(
                            user_id=first_user.id,
                            item_type="task",
                            category="Financial",
                            title="Submit FAFSA 2026-2027",
                            description="The priority deadline for financial aid is approaching. Please submit your FAFSA application.",
                            due_date=datetime(2026, 3, 1)
                        ),
                        StudentHold(
                            user_id=first_user.id,
                            item_type="alert",
                            category="Academic",
                            title="Missing Final High School Transcript",
                            description="Your final high school transcript has not been received. Please contact your counselor."
                        )
                    ]
                    for h in sample_holds:
                        session.add(h)
                    session.commit()
                    
            print("Database initialization complete")
    except Exception as e:
        print(f"Startup error: {e}")

@app.get("/")
async def root():
    return {"message": "Welcome to Student Success API"}

@app.get("/debug/env")
async def debug_env(admin: User = Depends(get_admin_user)):
    """Debug endpoint to check environment variables"""
    import os
    return {
        "GOOGLE_API_KEY": "SET" if os.getenv("GOOGLE_API_KEY") else "NOT SET",
        "DATABASE_URL": "SET" if os.getenv("DATABASE_URL") else "NOT SET",
        "CANVAS_API_TOKEN": "SET" if os.getenv("CANVAS_API_TOKEN") else "NOT SET"
    }

app.include_router(router, prefix="/api")

from app.api_tutoring import router as tutoring_router
app.include_router(tutoring_router, prefix="/api")

try:
    from app.integrations import router as integration_router
    app.include_router(integration_router, prefix="/api/integration", tags=["Integration"])
    print("[STARTUP] Integration router mounted successfully at /api/integration")
except Exception as e:
    import traceback
    print(f"[STARTUP ERROR] Failed to mount integration router: {e}")
    traceback.print_exc()


# End of router definitions


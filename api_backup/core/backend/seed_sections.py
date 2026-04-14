from sqlmodel import Session, select
from app.auth import engine
from app.models import User, Course, TutoringCourse, TutoringSection, TutoringEnrollment
import random

def seed_sections():
    with Session(engine) as session:
        # 1. Get the faculty user
        faculty = session.exec(select(User).where(User.email == "faculty@university.edu")).first()
        if not faculty:
            print("Faculty user not found. Please run seed_faculty.py first.")
            return

        # 2. Create some tutoring courses if they don't exist
        courses_data = [
            {"code": "CS101", "name": "Introduction to Computer Science", "department": "Computer Science"},
            {"code": "MATH201", "name": "Calculus II", "department": "Mathematics"},
            {"code": "PHYS101", "name": "General Physics I", "department": "Physics"}
        ]
        
        for c_data in courses_data:
            existing = session.exec(select(TutoringCourse).where(TutoringCourse.code == c_data["code"])).first()
            if not existing:
                tc = TutoringCourse(**c_data)
                session.add(tc)
                session.commit()
                session.refresh(tc)
                print(f"Created TutoringCourse: {tc.code}")
            else:
                tc = existing

            # 3. Create sections for each course with our faculty
            existing_section = session.exec(select(TutoringSection).where(
                TutoringSection.course_id == tc.id,
                TutoringSection.instructor_id == faculty.id
            )).first()
            if not existing_section:
                section = TutoringSection(
                    course_id=tc.id,
                    instructor_id=faculty.id,
                    term="Spring 2026"
                )
                session.add(section)
                session.commit()
                session.refresh(section)
                print(f"Created Section for {tc.code} with {faculty.full_name}")
            else:
                section = existing_section

            # 4. Enroll some random students in these sections
            # Get some non-faculty users
            students = session.exec(select(User).where(User.is_faculty == False, User.is_admin == False).limit(5)).all()
            for student in students:
                # Check if already enrolled
                existing_enrollment = session.exec(select(TutoringEnrollment).where(
                    TutoringEnrollment.user_id == student.id,
                    TutoringEnrollment.section_id == section.id
                )).first()
                if not existing_enrollment:
                    enrollment = TutoringEnrollment(
                        user_id=student.id,
                        section_id=section.id,
                        role="student"
                    )
                    session.add(enrollment)
                    print(f"Enrolled {student.full_name or student.email} in {tc.code}")
            
        session.commit()
        print("Seeding sections and enrollments completed.")

if __name__ == "__main__":
    seed_sections()

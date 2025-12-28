import asyncio
import os
import sys

sys.path.append(os.getcwd())

from sqlmodel import Session, select
from app.auth import engine
from app.models import User
from app.integrations.lms.canvas import CanvasService

async def debug_sync():
    print("--- Debugging Full Sync ---")
    
    # 1. Setup Canvas Service (Hardcoded as successful in debug_grades)
    token = "7~3LxQLMnxX4ZRzFteTC97YuyJuPaR92Aef88eLEB3M9YLtmXQ8ezH7TkPXDk4cYVx"
    base_url = "https://canvas.instructure.com/api/v1"
    canvas = CanvasService(base_url=base_url, access_token=token)
    
    # 2. Get a User from DB
    with Session(engine) as session:
        # Just grab the first user
        user = session.exec(select(User)).first()
        if not user:
            print("No users found in DB. Creating a dummy one.")
            user = User(email="test@example.com", password_hash="hash")
            session.add(user)
            session.commit()
            session.refresh(user)
        
        print(f"Syncing for User ID: {user.id} ({user.email})")
        
        try:
            # 3. Run Sync
            count = await canvas.sync_to_db(user.id, session)
            print(f"Sync Successful! Count: {count}")
            
            # 4. Verify DB State
            from app.models import Course
            courses = session.exec(select(Course).where(Course.user_id == user.id)).all()
            print("--- DB STATE ---")
            for c in courses:
                print(f"Course: {c.name} | Grade: {c.grade}")
            
        except Exception as e:
            print(f"CRASH during sync: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(debug_sync())

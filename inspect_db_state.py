import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)

def inspect():
    with engine.connect() as conn:
        # Check columns of 'course'
        print("Checking 'course' table columns:")
        res = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'course'"))
        columns = [r[0] for r in res]
        print(f"Columns: {columns}")
        
        if 'semester' in columns:
            print("SUCCESS: 'semester' column exists.")
        else:
            print("FAILURE: 'semester' column MISSING.")

        # Check 'calendarevent' table
        print("\nChecking for 'calendarevent' table:")
        res = conn.execute(text("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'calendarevent')"))
        exists = res.scalar()
        print(f"calendarevent exists: {exists}")

        # Check user by email
        print("\nChecking user 'student@aumtech.ai':")
        res = conn.execute(text("SELECT id, email FROM \"user\" WHERE email = 'student@aumtech.ai'"))
        users = res.fetchall()
        for u in users:
            print(f"Found User: ID={u[0]}, Email={u[1]}")

if __name__ == "__main__":
    inspect()

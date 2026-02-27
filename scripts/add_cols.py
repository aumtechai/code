import os
import psycopg2
from dotenv import load_dotenv

load_dotenv("C:/Projects/AA/SS_12_26/.env.local")

db_url = os.environ.get("DATABASE_URL")
if db_url and db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

try:
    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    cursor = conn.cursor()
    cursor.execute("ALTER TABLE tutoringappointment ADD COLUMN IF NOT EXISTS triage_note VARCHAR;")
    cursor.execute("ALTER TABLE tutoringappointment ADD COLUMN IF NOT EXISTS triage_image_url VARCHAR;")
    cursor.execute("ALTER TABLE tutoringappointment ADD COLUMN IF NOT EXISTS ai_summary VARCHAR;")
    print("Database altered successfully.")
except Exception as e:
    print(f"Error altering database: {e}")
finally:
    if 'conn' in locals() and conn:
        conn.close()

import asyncio
from fastapi.testclient import TestClient
import sys
import os

# Ensure backend acts as root
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.main import app
from app.auth import get_password_hash
from app.models import User
from app.auth import engine
from sqlmodel import Session
import io

# Give our test user admin privileges
with Session(engine) as session:
    admin_user = session.query(User).filter(User.email == "admin@university.edu").first()
    if not admin_user:
        admin_user = User(email="admin@university.edu", password_hash=get_password_hash("admin123"), role="admin", is_admin=True)
        session.add(admin_user)
        session.commit()

client = TestClient(app)

res = client.post("/api/auth/login", data={"username": "admin@university.edu", "password": "admin123"})
if res.status_code != 200:
    print(res.text)
    exit(1)

token = res.json()["access_token"]

csv_content = b"fname,lname,Student_UID,mail,gpa\nAlex,Smith,123,alex@example.com,NaN\n"
files = {'csv_file': ("students_variant_1.csv", io.BytesIO(csv_content), "text/csv")}
data = {'schema_name': 'test_ednex', 'table_name': 'mod01_student_profiles'}

res = client.post("/api/integration/map-columns", headers={"Authorization": f"Bearer {token}"}, files=files, data=data)
print(res.status_code)
print(res.text)

import os, sys, requests as req

# Test 1: Check users in the production Neon DB
DATABASE_URL = "postgresql://neondb_owner:npg_BwHSiOr92qQg@ep-divine-pine-a4tex5cw-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

try:
    from sqlmodel import create_engine, Session, text
    url = DATABASE_URL.split("?")[0]
    engine = create_engine(url, connect_args={"sslmode": "require"})
    with Session(engine) as sess:
        users = sess.exec(text('SELECT id, email, is_active FROM "user" LIMIT 20')).fetchall()
        print(f"=== DB Users ({len(users)} found) ===")
        for u in users:
            print(f"  id={u[0]}, email={u[1]}, is_active={u[2]}")
except Exception as e:
    print(f"DB query failed: {e}")

# Test 2: Hit the live login endpoint
print("\n=== Testing Live Login Endpoint ===")
test_credentials = [
    ("eric.moore0@txu.edu", "password123"),
    ("eric.moore0@txu.edu", "Password123"),
    ("student@university.edu", "student123"),
    ("admin@university.edu", "admin123"),
]

BASE_URL = "https://www.aumtech.ai"
for email, pw in test_credentials:
    try:
        r = req.post(
            f"{BASE_URL}/api/auth/login",
            data={"username": email, "password": pw},
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            timeout=10
        )
        print(f"  [{r.status_code}] {email} / {pw} => {r.text[:200]}")
    except Exception as e:
        print(f"  ERROR: {email} => {e}")

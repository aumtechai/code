"""
Fix script: Check eric.moore0@txu.edu in EdNex, then create/update local DB entry
with a proper bcrypt hash so local auth works.
"""
import os, sys
sys.path.insert(0, 'api/core/backend')

os.environ['DATABASE_URL'] = 'postgresql://neondb_owner:npg_BwHSiOr92qQg@ep-divine-pine-a4tex5cw-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require'
os.environ['SUPABASE_URL'] = 'https://rfkoylpcuptzkakmqotq.supabase.co'
os.environ['SUPABASE_KEY'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJma295bHBjdXB0emtha21xb3RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MzY0MDYsImV4cCI6MjA4ODQxMjQwNn0.kcUD2GGSmMJLcG0tyJZtbCd9h9gB2S8jFYDz9RJKMe8'

from sqlmodel import create_engine, Session, select, text
from app.auth import get_password_hash, verify_password
from app.models import User

db_url = os.environ['DATABASE_URL'].split('?')[0]
engine = create_engine(db_url, connect_args={'sslmode': 'require'})

target_email = 'eric.moore0@txu.edu'

# Check EdNex for this user
print(f"=== Checking EdNex for {target_email} ===")
import requests as req
headers = {
    'apikey': os.environ['SUPABASE_KEY'],
    'Authorization': f"Bearer {os.environ['SUPABASE_KEY']}"
}
rest_url = f"{os.environ['SUPABASE_URL']}/rest/v1/mod00_users?select=*&email=eq.{target_email}&limit=1"
resp = req.get(rest_url, headers=headers, timeout=8)
print(f"EdNex response: {resp.status_code}")
if resp.json():
    ednex_user = resp.json()[0]
    print(f"Found in EdNex: {ednex_user.get('email')}, role={ednex_user.get('role')}, hash={ednex_user.get('password_hash', '')[:20]}...")
else:
    print("NOT found in EdNex")
    ednex_user = None

# Check local DB
print(f"\n=== Checking local DB for {target_email} ===")
with Session(engine) as sess:
    user = sess.exec(select(User).where(User.email == target_email)).first()
    if user:
        print(f"Found locally: id={user.id}, is_active={user.is_active}, has_hash={bool(user.password_hash)}")
    else:
        print("NOT found locally")

# Check ram@aumtech.ai (the admin)
print(f"\n=== Checking ram@aumtech.ai ===")
with Session(engine) as sess:
    ram = sess.exec(select(User).where(User.email == 'ram@aumtech.ai')).first()
    if ram:
        print(f"Found: id={ram.id}, is_active={ram.is_active}")
        # Test verify
        test_result = verify_password('password123', ram.password_hash or '')
        print(f"  password123 match: {test_result}")
    else:
        print("NOT found locally")

print("\nDone.")

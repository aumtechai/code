import os, sys
sys.path.insert(0, 'api/core/backend')
os.environ['DATABASE_URL'] = 'postgresql://neondb_owner:npg_BwHSiOr92qQg@ep-divine-pine-a4tex5cw-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require'

from sqlmodel import create_engine, Session, select
from sqlalchemy import text
from app.auth import verify_password
from app.models import User

engine = create_engine(os.environ['DATABASE_URL'].split('?')[0], connect_args={'sslmode': 'require'})

emails_to_check = ['student@university.edu', 'admin@university.edu', 'faculty@university.edu', 'ram@aumtech.ai']

with Session(engine) as sess:
    for email in emails_to_check:
        u = sess.exec(select(User).where(User.email == email)).first()
        if u:
            # Check password
            pw_map = {
                'student@university.edu': 'student123',
                'admin@university.edu': 'admin123',
                'faculty@university.edu': 'faculty123',
                'ram@aumtech.ai': 'password123',
            }
            pw = pw_map.get(email, 'password123')
            match = verify_password(pw, u.password_hash or '')
            print(f"  {email}: found, is_active={u.is_active}, pw_match={match}, hash_prefix={u.password_hash[:15] if u.password_hash else 'NONE'}")
        else:
            print(f"  {email}: NOT FOUND in DB")

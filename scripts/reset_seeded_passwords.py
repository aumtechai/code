"""Reset seeded demo account passwords to their standard values."""
import os, sys
sys.path.insert(0, 'api/core/backend')
os.environ['DATABASE_URL'] = 'postgresql://neondb_owner:npg_BwHSiOr92qQg@ep-divine-pine-a4tex5cw-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require'

from sqlmodel import create_engine, Session, select
from app.auth import get_password_hash, verify_password
from app.models import User

engine = create_engine(os.environ['DATABASE_URL'].split('?')[0], connect_args={'sslmode': 'require'})

resets = [
    ('student@university.edu', 'student123', True),
    ('admin@university.edu', 'admin123', True),
    ('faculty@university.edu', 'faculty123', True),
]

with Session(engine) as sess:
    for email, password, active in resets:
        u = sess.exec(select(User).where(User.email == email)).first()
        if u:
            u.password_hash = get_password_hash(password)
            u.is_active = active
            sess.add(u)
            print(f"  Reset {email} => password={password}, is_active={active}")
        else:
            print(f"  {email}: NOT FOUND - skipping")
    sess.commit()
    print("\nCommitted. Verifying...")

with Session(engine) as sess:
    for email, password, _ in resets:
        u = sess.exec(select(User).where(User.email == email)).first()
        match = verify_password(password, u.password_hash or '') if u else False
        print(f"  {email}: pw_match={match}")

print("Done.")

import bcrypt
from sqlalchemy import create_engine, text

def get_hash(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

url="postgresql://neondb_owner:npg_BwHSiOr92qQg@ep-divine-pine-a4tex5cw-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
engine = create_engine(url)
pwd = get_hash("password123")

with engine.connect() as conn:
    conn.execute(text(f"UPDATE \"user\" SET password_hash = :pwd, is_admin = True WHERE email = 'admin@university.edu'"), {"pwd": pwd})
    conn.execute(text(f"UPDATE \"user\" SET password_hash = :pwd, is_faculty = True WHERE email = 'faculty@university.edu'"), {"pwd": pwd})
    # Create Dean if not configured right
    conn.execute(text(f"UPDATE \"user\" SET password_hash = :pwd, is_dean = True, is_admin = True WHERE email = 'audit.dean@aumtech-ai.com'"), {"pwd": pwd})
    # Fix student mistakenly being admin
    conn.execute(text(f"UPDATE \"user\" SET password_hash = :pwd, is_admin = False WHERE email = 'student@university.edu'"), {"pwd": pwd})
    conn.execute(text("COMMIT"))
    
print("Passwords dynamically reset to password123.")

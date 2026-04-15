import os
import psycopg2

db_url = os.getenv("DATABASE_URL", "postgresql://neondb_owner:npg_BwHSiOr92qQg@ep-divine-pine-a4tex5cw-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require")
conn = psycopg2.connect(db_url)
cur = conn.cursor()

# Check for rgudivada
cur.execute('SELECT id, email, is_active, is_admin, password_hash FROM "user" WHERE email LIKE %s OR email LIKE %s', 
            ('%rgudivada%', '%mwsu%'))
rows = cur.fetchall()
print("=== Searching for rgudivada/mwsu ===")
for r in rows:
    ph = r[4]
    print(f"  id={r[0]}, email={r[1]}, is_active={r[2]}, is_admin={r[3]}, hash={ph[:20] if ph else 'None'}...")
if not rows:
    print("  NOT FOUND in local DB")

# Also list all local users
print("\n=== All Local DB Users ===")
cur.execute('SELECT id, email, is_admin, is_active FROM "user" ORDER BY id')
for r in cur.fetchall():
    print(f"  id={r[0]}, email={r[1]}, is_admin={r[2]}, is_active={r[3]}")

conn.close()

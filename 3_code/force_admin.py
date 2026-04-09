import psycopg2
conn = psycopg2.connect("postgresql://neondb_owner:npg_BwHSiOr92qQg@ep-divine-pine-a4tex5cw-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require")
cur = conn.cursor()
try:
    cur.execute('UPDATE "user" SET is_admin = True WHERE email = %s', ('admin@university.edu',))
    conn.commit()
    print("SUCCESS: Forced is_admin=True for admin@university.edu")
    
    # Check if updated correctly
    cur.execute('SELECT email, is_admin FROM "user" WHERE email = %s', ('admin@university.edu',))
    res = cur.fetchone()
    print(f"Update Result: {res}")
except Exception as e:
    print(f"ERROR: {e}")
finally:
    cur.close()
    conn.close()

import psycopg2
conn = psycopg2.connect("postgresql://neondb_owner:npg_BwHSiOr92qQg@ep-divine-pine-a4tex5cw-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require")
cur = conn.cursor()
cur.execute("SELECT id FROM users WHERE email='daniel.garrett12@txu.edu'")
user = cur.fetchone()
if user:
    cur.execute("UPDATE users SET full_name='Daniel Garrett' WHERE id=%s", (user[0],))
    cur.execute("SELECT user_id FROM user_progress WHERE user_id=%s", (user[0],))
    prog = cur.fetchone()
    if prog:
        cur.execute("UPDATE user_progress SET gpa=3.5, on_track_score=87 WHERE user_id=%s", (user[0],))
    else:
        cur.execute("INSERT INTO user_progress (user_id, gpa, credits_completed, total_credits_required, on_track_score) VALUES (%s, 3.5, 60, 120, 87)", (user[0],))
    conn.commit()
    print("SUCCESS: Updated user to Daniel Garrett with GPA 3.5")
else:
    cur.execute("SELECT email, full_name, gpa FROM users LEFT JOIN user_progress ON users.id=user_progress.user_id LIMIT 10")
    print("USER NOT FOUND! Existing users:", cur.fetchall())

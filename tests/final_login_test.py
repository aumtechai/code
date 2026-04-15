import requests

BASE = 'https://aumtech.ai'

def test_login(email, password, label=''):
    r = requests.post(
        f'{BASE}/api/auth/login',
        data=f'username={email}&password={password}',
        headers={'Content-Type': 'application/x-www-form-urlencoded'},
        timeout=20
    )
    token = ''
    if r.status_code == 200:
        token = r.json().get('access_token', '')[:40] + '...'
    print(f'[{r.status_code}] {label or email}: {r.json().get("detail", "OK") if r.status_code != 200 else "SUCCESS token=" + token}')

print("=== Login Verification Suite ===\n")
test_login('ram@aumtech.ai', 'password123', 'Admin (ram)')
test_login('student@university.edu', 'student123', 'Student (seeded)')
test_login('admin@university.edu', 'admin123', 'Admin (seeded)')
test_login('faculty@university.edu', 'faculty123', 'Faculty (seeded)')
test_login('eric.moore0@txu.edu', 'password123', 'Eric Moore (EdNex)')
test_login('eric.moore0@txu.edu', 'wrongpassword', 'Eric Moore (wrong pw - should fail)')
test_login('nobody@nowhere.com', 'badpass', 'Non-existent user - should fail')
print("\nDone.")

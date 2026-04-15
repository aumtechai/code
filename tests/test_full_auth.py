"""
Full auth test: login + password change + re-login with new password
"""
import requests, time

BASE = 'https://aumtech.ai'

def login(email, password, label=''):
    r = requests.post(
        f'{BASE}/api/auth/login',
        data=f'username={email}&password={password}',
        headers={'Content-Type': 'application/x-www-form-urlencoded'},
        timeout=20
    )
    status = 'SUCCESS' if r.status_code == 200 else f'FAIL({r.status_code})'
    detail = r.json().get('detail', '') if r.status_code != 200 else r.json().get('access_token', '')[:40] + '...'
    print(f'  [{r.status_code}] {label or email}: {status} {detail}')
    return r.status_code == 200

def change_pw(email, old_pw, new_pw):
    r = requests.post(
        f'{BASE}/api/auth/change-password',
        json={'email': email, 'old_password': old_pw, 'new_password': new_pw},
        timeout=20
    )
    print(f'  Change PW [{r.status_code}]: {r.json()}')
    return r.status_code == 200

time.sleep(5)  # CDN propagation

print('\n=== 1. Login Tests ===')
login('ram@aumtech.ai', 'password123', 'Admin (local)')
login('student@university.edu', 'student123', 'Student (local)')
login('eric.moore0@txu.edu', 'password123', 'Eric Moore (EdNex)')
login('nobody@x.com', 'bad', 'Invalid - should fail')

print('\n=== 2. Password Change: eric.moore0@txu.edu ===')
# Change Eric's password
changed = change_pw('eric.moore0@txu.edu', 'password123', 'NewPassword@2026')

print('\n=== 3. Re-Login with new password ===')
if changed:
    login('eric.moore0@txu.edu', 'NewPassword@2026', 'Eric Moore (new pw)')
    login('eric.moore0@txu.edu', 'password123', 'Eric Moore (old pw - should fail)')

print('\n=== 4. Restore original password ===')
if changed:
    restore = change_pw('eric.moore0@txu.edu', 'NewPassword@2026', 'password123')
    if restore:
        login('eric.moore0@txu.edu', 'password123', 'Eric Moore (restored)')
print('\nDone.')

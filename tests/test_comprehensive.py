# -*- coding: utf-8 -*-
"""
Comprehensive auth test suite for aumtech.ai
Tests: login (local + EdNex), password change (EdNex write-back), error cases.
"""
import requests, sys, time, os

# Force UTF-8 output on Windows
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE = 'https://aumtech.ai'
results = []

def check(label, condition, detail=''):
    icon = '[PASS]' if condition else '[FAIL]'
    results.append((label, condition, detail))
    suffix = f' -> {detail}' if detail else ''
    print(f'  {icon} {label}{suffix}')
    return condition

def login(email, password):
    return requests.post(
        f'{BASE}/api/auth/login',
        data=f'username={email}&password={password}',
        headers={'Content-Type': 'application/x-www-form-urlencoded'},
        timeout=20
    )

def change_pw(email, old_pw, new_pw):
    return requests.post(
        f'{BASE}/api/auth/change-password',
        json={'email': email, 'old_password': old_pw, 'new_password': new_pw},
        timeout=20
    )

time.sleep(3)  # brief CDN warm-up

# ── 1. Health ─────────────────────────────────────────────────────────────────
print('\n[1] Health Check')
r = requests.get(f'{BASE}/api/health', timeout=15)
check('API /api/health reachable (200)', r.status_code == 200, r.text[:80])

r = requests.get(f'{BASE}/api/env-check', timeout=15)
check('Env vars /api/env-check reachable', r.status_code == 200, str(r.json()))

# ── 2. Local DB logins ────────────────────────────────────────────────────────
print('\n[2] Local DB Logins')
r = login('ram@aumtech.ai', 'password123')
check('Admin (ram@aumtech.ai)', r.status_code == 200)

r = login('student@university.edu', 'student123')
check('Student (student@university.edu)', r.status_code == 200)

r = login('admin@university.edu', 'admin123')
check('Admin (admin@university.edu)', r.status_code == 200)

r = login('faculty@university.edu', 'faculty123')
check('Faculty (faculty@university.edu)', r.status_code == 200)

# ── 3. EdNex logins ───────────────────────────────────────────────────────────
print('\n[3] EdNex (Supabase) Logins')
r = login('eric.moore0@txu.edu', 'password123')
check('EdNex student (eric.moore0@txu.edu)', r.status_code == 200)

# ── 4. Error cases ────────────────────────────────────────────────────────────
print('\n[4] Error / Rejection Cases')
r = login('nobody@x.com', 'bad')
check('Unknown user → 401', r.status_code == 401, r.json().get('detail', ''))

r = login('ram@aumtech.ai', 'wrongpassword')
check('Local wrong password → 401', r.status_code == 401)

r = login('eric.moore0@txu.edu', 'wrongpassword')
check('EdNex wrong password → 401', r.status_code == 401)

# ── 5. Password change + EdNex write-back ─────────────────────────────────────
print('\n[5] Password Change (EdNex write-back)')
EMAIL   = 'eric.moore0@txu.edu'
OLD_PW  = 'password123'
NEW_PW  = 'Aura@Test2026!'

r = change_pw(EMAIL, OLD_PW, NEW_PW)
changed = r.status_code == 200
check('Change password accepted', changed, str(r.json()))
if changed:
    sources = r.json().get('sources_updated', {})
    check('EdNex write-back confirmed', sources.get('ednex') is True, str(sources))

# ── 6. Re-login validation ────────────────────────────────────────────────────
print('\n[6] Re-login Validation')
if changed:
    r = login(EMAIL, NEW_PW)
    check('Login with NEW password works', r.status_code == 200)

    r = login(EMAIL, OLD_PW)
    check('Login with OLD password rejected (401)', r.status_code == 401)

    # Restore
    r = change_pw(EMAIL, NEW_PW, OLD_PW)
    restored = r.status_code == 200
    check('Password restored to original', restored)
    if restored:
        r = login(EMAIL, OLD_PW)
        check('Login with restored password works', r.status_code == 200)

# ── Summary ────────────────────────────────────────────────────────────────────
total  = len(results)
passed = sum(1 for _, ok, _ in results if ok)
failed = total - passed
print(f'\n{"="*60}')
print(f'Results: {passed}/{total} passed', 'ALL PASS' if failed == 0 else f'-- {failed} FAILED')
if failed > 0:
    print('Failures:')
    for label, ok, detail in results:
        if not ok:
            print(f'  [FAIL] {label}: {detail}')
print('='*60)
sys.exit(0 if failed == 0 else 1)

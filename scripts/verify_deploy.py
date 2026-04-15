import requests, time
time.sleep(15)
r = requests.get('https://aumtech.ai/api/health', timeout=20, headers={'Cache-Control': 'no-cache'})
print(f'Status: {r.status_code}')
cache = r.headers.get('X-Vercel-Cache', 'N/A')
print(f'X-Vercel-Cache: {cache}')
print(f'Body: {r.text[:300]}')

# Also test login
r2 = requests.post(
    'https://aumtech.ai/api/auth/login',
    data='username=ram@aumtech.ai&password=password123',
    headers={'Content-Type': 'application/x-www-form-urlencoded'},
    timeout=20
)
print(f'\nLogin test: {r2.status_code} => {r2.text[:300]}')

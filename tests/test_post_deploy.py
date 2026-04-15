import requests

new_url = 'https://aura-stable-final-9stfdt4em-aumtechais-projects.vercel.app'

for path in ['/api/health', '/api/env-check']:
    r = requests.get(new_url + path, timeout=15)
    print(f'Direct GET {path}: {r.status_code} => {r.text[:200]}')

r2 = requests.get('https://www.aumtech.ai/api/health', timeout=15)
print(f'www GET /api/health: {r2.status_code} => {r2.text[:200]}')

r3 = requests.get('https://aumtech.ai/api/health', timeout=15)
print(f'apex GET /api/health: {r3.status_code}')
sid = r3.headers.get('server', '')
xvid = r3.headers.get('x-vercel-id', '')
print(f'  server={sid}, x-vercel-id={xvid[:40]}')

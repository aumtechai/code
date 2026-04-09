import requests
url = "https://www.aumtech.ai/api/auth/login"
data = {"username": "admin@university.edu", "password": "wrongpassword"}
try:
    resp = requests.post(url, data=data)
    print(f"Status: {resp.status_code}")
    print(f"Body: {resp.text}")
except Exception as e:
    print(f"Error: {e}")

import requests
import io
import json

base_url = "https://3code-umber.vercel.app"

# Login to prod
res = requests.post(f"{base_url}/api/auth/login", data={"username": "admin@university.edu", "password": "admin123"})
if res.status_code != 200:
    print("Login failed:", res.text)
    exit(1)

token = res.json()["access_token"]
print("Logged in, token snippet:", token[:10])

# Map columns
csv_content = b"fname,lname,Student_UID,mail,gpa\nAlex,Smith,123,alex@example.com,NaN\n"
files = {'csv_file': ("students_variant_1.csv", io.BytesIO(csv_content), "text/csv")}
data = {'schema_name': 'test_ednex', 'table_name': 'mod01_student_profiles'}

res = requests.post(f"{base_url}/api/integration/map-columns", headers={"Authorization": f"Bearer {token}"}, files=files, data=data)
print("Status Code:", res.status_code)
print("Response JSON:")
print(res.text)

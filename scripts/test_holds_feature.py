import requests
import json

BASE_URL = "http://localhost:8000"

def test_holds_feature():
    # 1. Login to get token
    print("--- Logging in ---")
    login_data = {
        "username": "rgudi@student.edu", # Assuming this user exists or first user in DB
        "password": "password"
    }
    
    # Try common credentials or first register if needed
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", data=login_data)
        if response.status_code == 200:
            token = response.json().get("access_token")
            print("Login Successful")
        else:
            print(f"Login Failed: {response.text}")
            # Try to register a test user if login fails
            print("--- Registering Test User ---")
            reg_data = {
                "email": "testuser@university.edu",
                "password_hash": "testpass",
                "full_name": "Test Student"
            }
            requests.post(f"{BASE_URL}/api/auth/register", json=reg_data)
            response = requests.post(f"{BASE_URL}/api/auth/login", data={"username": "testuser@university.edu", "password": "testpass"})
            token = response.json().get("access_token")
            print("Registration and Login Successful")
    except Exception as e:
        print(f"Auth error: {e}")
        return

    headers = {"Authorization": f"Bearer {token}"}

    # 2. Test fetching holds
    print("\n--- Testing GET /api/holds ---")
    response = requests.get(f"{BASE_URL}/api/holds", headers=headers)
    if response.status_code == 200:
        holds = response.json()
        print(f"Found {len(holds)} holds/alerts")
        for h in holds:
            print(f"- [{h['status'].upper()}] {h['title']} ({h['category']})")
        
        if len(holds) > 0:
            hold_id = holds[0]['id']
            # 3. Test resolving a hold
            print(f"\n--- Testing PUT /api/holds/{hold_id}/resolve ---")
            res_response = requests.put(f"{BASE_URL}/api/holds/{hold_id}/resolve", headers=headers)
            print(f"Resolve Response: {res_response.json()}")
            
            # Verify status changed
            print("\n--- Verifying Resolve ---")
            verify_response = requests.get(f"{BASE_URL}/api/holds", headers=headers)
            updated_holds = verify_response.json()
            for h in updated_holds:
                if h['id'] == hold_id:
                    print(f"Status for {h['title']} is now: {h['status']}")
    else:
        print(f"Failed to fetch holds: {response.status_code} - {response.text}")

if __name__ == "__main__":
    test_holds_feature()

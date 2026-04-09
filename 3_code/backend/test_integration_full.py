import httpx
import json
import os

BASE_URL = "http://localhost:8000/api/integration"
TOKEN = "admin_token_placeholder" # I'll get a real one or bypass auth for test

def test_full_flow():
    # 1. Login to get token
    login_url = "http://localhost:8000/api/auth/login"
    login_res = httpx.post(login_url, data={"username": "admin@university.edu", "password": "admin123"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Onboard
    print("Testing Onboard...")
    onboard_res = httpx.post(f"{BASE_URL}/onboard", json={"institution_name": "Antigravity Test Uni"}, headers=headers)
    print(f"Onboard Status: {onboard_res.status_code}")
    schema = onboard_res.json()["schema_name"]
    print(f"Schema: {schema}")
    
    # 3. Map Columns
    print("\nTesting Map Columns (AI Integration Agent)...")
    csv_path = r"c:\Projects\AA\at\6_integration\sample_data\students_variant_1.csv"
    with open(csv_path, "rb") as f:
        files = {"csv_file": f}
        data = {"schema_name": schema, "table_name": "mod00_users"}
        map_res = httpx.post(f"{BASE_URL}/map-columns", data=data, files=files, headers=headers, timeout=30.0)
    
    print(f"Map Status: {map_res.status_code}")
    mappings = map_res.json().get("mappings", [])
    print(f"Found {len(mappings)} column mappings.")
    for m in mappings:
        print(f"  {m['source']} -> {m['target']} ({m['status']}, {m['confidence']}%)")
    
    # 4. Ingest
    print("\nTesting Ingestion...")
    mapping_dict = {m["source"]: m["target"] for m in mappings if m["target"]}
    print(f"Mapping Dictionary: {mapping_dict}")
    with open(csv_path, "rb") as f:
        files = {"csv_file": f}
        data = {
            "schema_name": schema, 
            "table_name": "mod00_users",
            "mappings_json": json.dumps(mapping_dict)
        }
        ingest_res = httpx.post(f"{BASE_URL}/ingest", data=data, files=files, headers=headers, timeout=30.0)
    
    print(f"Ingest Status: {ingest_res.status_code}")
    print(f"Result: {ingest_res.json()}")

if __name__ == "__main__":
    test_full_flow()

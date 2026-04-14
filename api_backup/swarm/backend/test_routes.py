import httpx
try:
    # Onboard is POST but GET will at least tell us if it's 404 vs 405
    response = httpx.get("http://127.0.0.1:8000/api/integration/onboard")
    print(f"GET Status: {response.status_code} (Expect 405 if registered)")
    
    # Check if the prefix /api/integration is there
    response = httpx.get("http://127.0.0.1:8000/api/openapi.json")
    if "/api/integration/onboard" in response.text:
        print("SUCCESS: Route found in openapi.json")
    else:
        print("FAIL: Route NOT found in openapi.json")
except Exception as e:
    print(f"ERROR: {e}")

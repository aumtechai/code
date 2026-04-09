import httpx
try:
    r = httpx.get("https://www.aumtech.ai/openapi.json")
    if "/api/integration/onboard" in r.text:
        print("SUCCESS: Route found in LIVE openapi.json")
    else:
        print("FAIL: Route NOT found in LIVE openapi.json")
except Exception as e:
    print(f"ERROR: {e}")

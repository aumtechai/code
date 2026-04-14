import httpx
for url in ["https://aumtech.ai", "https://www.aumtech.ai"]:
    try:
        r = httpx.get(f"{url}/openapi.json")
        found = "/api/integration/onboard" in r.text
        print(f"{url}: {found}")
    except Exception as e:
        print(f"{url}: Error: {e}")

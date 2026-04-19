import os
import requests
from dotenv import load_dotenv

# Load from the root .env.local
load_dotenv(".env.local")

def list_gemini_models():
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        print("GOOGLE_API_KEY is missing even in .env.")
        return
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key.strip()}"
    
    print(f"Checking models for key: {api_key[:10]}...")
    try:
        response = requests.get(url)
        if response.status_code == 200:
            models = response.json().get('models', [])
            print("\nAvailable Models:")
            for m in models:
                if "flash" in m['name'].lower():
                    print(f"- {m['name']}")
        else:
            print(f"Error {response.status_code}: {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    list_gemini_models()

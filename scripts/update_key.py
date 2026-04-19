import os
import sys

# Load Env
from dotenv import load_dotenv
load_dotenv(".env.local")

# Setup Path
sys.path.append(os.path.join(os.path.dirname(__file__), "api", "core", "backend"))

from app.auth import engine
from sqlmodel import Session
from app.config_utils import set_gemini_api_key

def update_key():
    new_key = os.environ.get("GOOGLE_API_KEY")
    if not new_key:
        print("ERROR: No GOOGLE_API_KEY found in environment. Aborting.")
        return
        
    print("Connecting to DB:", os.environ.get("DATABASE_URL"))
    with Session(engine) as session:
        set_gemini_api_key(session, new_key)
        print("Successfully updated database API key from environment.")

if __name__ == "__main__":
    update_key()

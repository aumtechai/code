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
    print("Connecting to DB:", os.environ.get("DATABASE_URL"))
    with Session(engine) as session:
        new_key = "AIzaSyDCLaSuBTCW8VD6LfboqV4X64hq1d5d0o0"
        set_gemini_api_key(session, new_key)
        print("Successfully updated database API key.")

if __name__ == "__main__":
    update_key()

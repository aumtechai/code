from sqlmodel import Session, select
import os
from datetime import datetime
from typing import Optional
from app.models import SystemConfig
from app.auth import engine

DEFAULT_GEMINI_KEY = "AIzaSyAr7PjALACYQKRQJCZNqIm4yOjWAAsBmPU"

def get_db_session():
    """Returns a new SQLModel Session."""
    return Session(engine)

def get_gemini_api_key(session: Session) -> str:
    """
    Retrieves the Gemini API key in order of priority:
    1. Database (SystemConfig table)
    2. Environment Variable (GOOGLE_API_KEY)
    3. Default Fallback
    """
    try:
        statement = select(SystemConfig).where(SystemConfig.key_name == "GOOGLE_API_KEY")
        config = session.exec(statement).first()
        if config and config.key_value:
            return config.key_value
    except Exception as e:
        print(f"Error fetching Gemini API key from DB: {e}")
    
    return os.getenv("GOOGLE_API_KEY") or DEFAULT_GEMINI_KEY

def set_gemini_api_key(session: Session, key_value: str):
    """
    Updates or creates the Gemini API key in the Database.
    """
    statement = select(SystemConfig).where(SystemConfig.key_name == "GOOGLE_API_KEY")
    config = session.exec(statement).first()
    
    if not config:
        config = SystemConfig(
            key_name="GOOGLE_API_KEY",
            key_value=key_value,
            updated_at=datetime.utcnow()
        )
    else:
        config.key_value = key_value
        config.updated_at = datetime.utcnow()
        
    session.add(config)
    session.commit()
    session.refresh(config)
    return config

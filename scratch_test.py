from app.auth import engine
from sqlalchemy import text
import json

try:
    with engine.connect() as conn:
        res = conn.execute(text("SELECT email FROM public.mod00_users LIMIT 5")).mappings().all()
        print(json.dumps([dict(r) for r in res], indent=2))
except Exception as e:
    print(f"Error: {e}")

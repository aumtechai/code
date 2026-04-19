import os
import sys

# Setup Paths
current_dir = os.path.dirname(os.path.abspath(__file__))
at_root = os.path.dirname(current_dir)
sys.path.append(os.path.join(at_root, "api", "swarm", "aura_core"))
sys.path.append(os.path.join(at_root, "api", "swarm", "backend"))

from sqlmodel import Session, delete
from app.auth import engine
from app.models import SystemConfig

def purge_db_key():
    print("Purging GOOGLE_API_KEY from SystemConfig table...")
    try:
        with Session(engine) as session:
            statement = delete(SystemConfig).where(SystemConfig.key_name == "GOOGLE_API_KEY")
            session.exec(statement)
            session.commit()
            print("Purge successful. Database is now clean of hard-coded keys.")
    except Exception as e:
        print(f"Error during purge: {e}")

if __name__ == "__main__":
    purge_db_key()

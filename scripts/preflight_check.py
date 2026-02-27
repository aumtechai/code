import sys
import os
sys.path.append(os.path.join(os.getcwd(), "backend"))

print("Testing imports...")
try:
    from app.models import StudentHold, User
    print("Models imported successfully")
    from app.api import router
    print("API router imported successfully")
    from app.main import app
    print("App imported successfully")
except Exception as e:
    print(f"Import failed: {e}")
    import traceback
    traceback.print_exc()

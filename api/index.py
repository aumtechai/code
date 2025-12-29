import os
import sys

# Add the project root and backend directory to sys.path for Vercel deployment
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(current_dir)
backend_dir = os.path.join(root_dir, "backend")

if root_dir not in sys.path:
    sys.path.insert(0, root_dir)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

try:
    from backend.app.main import app
    print("✓ Successfully imported app")
except Exception as e:
    print(f"✗ Failed to import app: {e}")
    # Create a minimal FastAPI app as fallback
    from fastapi import FastAPI
    app = FastAPI()
    
    @app.get("/")
    def root():
        return {"error": "Backend import failed", "details": str(e)}
    
    @app.get("/api/")
    def api_root():
        return {"error": "Backend import failed", "details": str(e)}

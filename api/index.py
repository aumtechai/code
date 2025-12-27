import os
import sys
from fastapi import FastAPI

# Debugging Vercel deployment
app = FastAPI()

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "python_version": sys.version,
        "cwd": os.getcwd(),
        "path": sys.path
    }

try:
    # Add the project root and backend directory to sys.path for Vercel deployment
    # Use relative paths from this file to be safer
    current_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(current_dir)
    backend_dir = os.path.join(root_dir, "backend")

    if root_dir not in sys.path:
        sys.path.insert(0, root_dir)
    if backend_dir not in sys.path:
        sys.path.insert(0, backend_dir)

    from backend.app.main import app as main_app
    app = main_app
except Exception as e:
    @app.get("/api/debug-error")
    def debug_error():
        import traceback
        return {
            "error": str(e),
            "traceback": traceback.format_exc(),
            "path": sys.path,
            "root": root_dir,
            "backend": backend_dir,
            "files_in_root": os.listdir(root_dir) if os.path.exists(root_dir) else "not found"
        }

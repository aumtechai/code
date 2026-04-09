import os
import sys
from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware

# CRITICAL: Add the local backend folder to the sys.path
# This allows 'from app.api import router' and 'from app.auth import ...' to work perfectly
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(current_dir, "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.api import router as main_api_router
from app.api_tutoring import router as tutoring_router
from app.integrations import router as integration_router

app = FastAPI(title="Student Success Core API")

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(main_api_router, prefix="/api")
app.include_router(tutoring_router, prefix="/api")
app.include_router(integration_router, prefix="/api/integration", tags=["Integration"])

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "mode": "bundled-backend",
        "path": sys.path
    }

@app.get("/api/env-check")
def env_check():
    return {
        "db": bool(os.getenv("DATABASE_URL")),
        "secret": bool(os.getenv("SECRET_KEY")),
        "google": bool(os.getenv("GOOGLE_API_KEY"))
    }

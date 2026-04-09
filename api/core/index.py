import os
import sys
from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware

# Setup pathing to find backend modules (two levels up from api/core)
current_dir = os.path.dirname(os.path.abspath(__file__))
at_root = os.path.dirname(os.path.dirname(current_dir))
root_dir = os.path.join(at_root, "3_code")
backend_dir = os.path.join(root_dir, "backend")

if at_root not in sys.path: sys.path.insert(0, at_root)
if root_dir not in sys.path: sys.path.insert(0, root_dir)
if backend_dir not in sys.path: sys.path.insert(0, backend_dir)

app = FastAPI(title="Student Success Core API")

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
try:
    from backend.app.api import router as main_api_router
    from backend.app.api_tutoring import router as tutoring_router
    from backend.app.integrations import router as integration_router
    
    app.include_router(main_api_router, prefix="/api")
    app.include_router(tutoring_router, prefix="/api")
    app.include_router(integration_router, prefix="/api/integration", tags=["Integration"])
except Exception as e:
    print(f"FAILED TO MOUNT CORE ROUTERS: {e}")

@app.get("/api/health")
def health():
    return {"status": "healthy", "mode": "partitioned-core", "cwd": os.getcwd()}

@app.get("/api/aura/status")
def aura_status():
    return {"status": "operational", "message": "Standard Aura services are running. Intelligent Swarm is in a separate function."}

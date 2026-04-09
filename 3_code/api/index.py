import os
import sys
from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, select, create_engine

# 1. Setup Path to find backend modules
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(current_dir)
backend_dir = os.path.join(root_dir, "backend")

if root_dir not in sys.path: sys.path.insert(0, root_dir)
if backend_dir not in sys.path: sys.path.insert(0, backend_dir)

# 2. CREATE A FRESH APP INSTANCE FOR VERCEL
# This avoids the complex 'on_startup' logic in main.py that might be crashing
app = FastAPI(title="Student Success API - Vercel")

# Mount Routers
try:
    from backend.app.api import router as main_api_router
    from backend.app.api_tutoring import router as tutoring_router
    from backend.app.integrations import router as integration_router
    
    app.include_router(main_api_router, prefix="/api")
    app.include_router(tutoring_router, prefix="/api")
    app.include_router(integration_router, prefix="/api/integration", tags=["Integration"])
    
    # Also mount at root for vercel rewrites robustness
    app.include_router(main_api_router, prefix="")
    app.include_router(tutoring_router, prefix="")
    app.include_router(integration_router, prefix="/integration", tags=["Integration"])
except Exception as e:
    print(f"FAILED TO MOUNT ROUTERS: {e}")

# Global Handlers
from fastapi.responses import JSONResponse
import traceback

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"VERCEL GLOBAL TRACEBACK: {traceback.format_exc()}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Global Vercel Error", "traceback": traceback.format_exc()}
    )

@app.get("/api/health")
def health():
    return {"status": "healthy", "mode": "isolated-vercel", "cwd": os.getcwd()}

@app.get("/api/debug/path")
def debug_path():
    from pathlib import Path
    # index.py is at 3_code/api/index.py
    # parents[0]=api, [1]=3_code, [2]=root (at)
    p = Path(__file__).resolve().parents[2]
    return {
        "__file__": __file__,
        "parents": [str(x) for x in Path(__file__).resolve().parents],
        "root": str(p),
        "aura_exists": os.path.exists(str(p / "5_Aura_Core"))
    }

@app.get("/api/debug/swarm-check")
async def debug_swarm_check():
    from pathlib import Path
    try:
        root_path = Path(__file__).resolve().parents[2]
        aura_core_path = str(root_path / "5_Aura_Core")
        if aura_core_path not in sys.path:
            sys.path.append(aura_core_path)
            
        from backend.app.api import get_gemini_api_key
        # Need to simulate a DB session or just get env
        api_key = os.getenv("GOOGLE_API_KEY")
        if api_key: os.environ["GOOGLE_API_KEY"] = api_key

        from agents.aura_agents import run_aura_core_query_async
        return {"status": "success", "message": "Aura Swarm is importable!", "path": aura_core_path}
    except Exception as e:
        import traceback
        return {"status": "error", "message": str(e), "traceback": traceback.format_exc()}

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os
import sys
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import traceback

# Setup pathing
current_dir = os.path.dirname(os.path.abspath(__file__))
at_root = os.path.dirname(os.path.dirname(current_dir))
swarm_backend_path = os.path.join(current_dir, "backend")
aura_core_path = os.path.join(at_root, "api", "swarm", "aura_core")
backend_path = os.path.join(at_root, "3_code", "backend")

# Deployment Sync: 2026-04-19 12:03 PM (Gemini 2.0 Flash Sync)
for p in [at_root, swarm_backend_path, aura_core_path, backend_path]:
    if p not in sys.path:
        sys.path.insert(0, p)

app = FastAPI(title="Aura Swarm Intelligence API")

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the full swarm backend router — this exposes /api/ednex/*, /api/users/me, etc.
# via /api/swarm/* on Vercel, but also handles /api/ednex/* via core fallthrough.
try:
    from app.api import router as swarm_api_router
    from app.ednex import ednex_router
    app.include_router(swarm_api_router, prefix="/api")
    app.include_router(ednex_router, prefix="/api/ednex", tags=["ednex"])
    print("Swarm backend router mounted successfully")
except Exception as e:
    print(f"WARNING: Could not mount swarm backend router: {e}")

@app.get("/api/aura/health")
def health():
    return {"status": "connected", "mode": "swarm-isolated"}

@app.post("/api/aura/query")
async def aura_query(request: Request):
    try:
        data = await request.json()
        query = data.get("query")
        student_data = data.get("student_context_data", {})
        
        # Ensure API Key is in environment for AutoGen
        try:
            from app.config_utils import get_gemini_api_key
            api_key = get_gemini_api_key()
            if api_key: os.environ["GOOGLE_API_KEY"] = api_key
        except Exception:
            pass
        
        # Invoke the AutoGen Swarm
        from agents.aura_agents import run_aura_core_query_async
        response = await run_aura_core_query_async(query, student_data)
        
        return {"response": response}
    except Exception as e:
        print(f"SWARM ERROR: {traceback.format_exc()}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e), "traceback": traceback.format_exc()}
        )

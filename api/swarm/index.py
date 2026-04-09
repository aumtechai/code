import os
import sys
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import traceback

# Setup pathing
current_dir = os.path.dirname(os.path.abspath(__file__))
at_root = os.path.dirname(os.path.dirname(current_dir))
aura_core_path = os.path.join(at_root, "5_Aura_Core")
backend_path = os.path.join(at_root, "3_code", "backend")

if at_root not in sys.path: sys.path.insert(0, at_root)
if aura_core_path not in sys.path: sys.path.insert(0, aura_core_path)
if backend_path not in sys.path: sys.path.insert(0, backend_path)

app = FastAPI(title="Aura Swarm Intelligence API")

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        from backend.app.api import get_gemini_api_key
        api_key = get_gemini_api_key()
        if api_key: os.environ["GOOGLE_API_KEY"] = api_key
        
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

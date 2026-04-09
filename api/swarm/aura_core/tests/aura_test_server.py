import os
import sys

# Add the 5_Aura_Core directory to sys.path to import agents and tools correctly
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), "5_Aura_Core")))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
import uvicorn
import json

from agents.aura_agents import run_aura_core_query

app = FastAPI(title="Aura Core Test Server")

# Enable CORS for the test HTML page
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the tests directory for the static HTML page
app.mount("/static", StaticFiles(directory="5_Aura_Core/tests"), name="static")

class QueryRequest(BaseModel):
    query: str
    email: str

@app.post("/api/aura-core/query")
async def query_aura_core(request: QueryRequest):
    """
    Exposes the Aura Core multi-agent functionality to the test frontend.
    """
    print(f"[Core_Server] Received Query: {request.query} from {request.email}")
    
    try:
        # Call the multi-agent orchestrator
        # This will communicate with the specialists and the Master agent
        result = run_aura_core_query(request.query, request.email)
        
        if result.get("status") == "error":
            raise HTTPException(status_code=500, detail=result["message"])
            
        return result
        
    except Exception as e:
        print(f"Core Server Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/aura-core/audit")
async def get_audit_logs():
    """
    Retrieve all audit logs for visualization.
    """
    audit_file = os.path.join(os.getcwd(), "5_Aura_Core", "audit", "audit_log.json")
    if os.path.exists(audit_file):
        with open(audit_file, "r") as f:
            return json.load(f)
    return []

if __name__ == "__main__":
    # Run the test server on port 8001 (different from the main backend)
    print("Aura Core Test Server starting on http://localhost:8001")
    uvicorn.run(app, host="0.0.0.0", port=8001)

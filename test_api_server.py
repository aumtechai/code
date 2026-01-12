from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import os

# Create minimal app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import the module
from api.texas_analytics import TexasAccountabilityScraper
scraper = TexasAccountabilityScraper()

@app.get("/api/texas/colleges")
def get_colleges():
    print("Fetching Colleges...")
    return scraper.fetch_all_institutions()

class AnalyzeReq(BaseModel):
    instId: str
    sector: str
    typeId: int
    name: str

@app.post("/api/texas/analyze")
def analyze(req: AnalyzeReq):
    print(f"Analyzing {req.name}...")
    data = scraper.fetch_college_metrics(req.instId, req.sector, req.typeId)
    return {
        "college": req.name,
        "data_summary": data,
        "ai_insight": insight,
        "source": "live_scrape_test"
    }

# --- CIP Local Test ---
# In-memory storage for testing without DB
cip_cache = []

from api.cip_codes import CIPScraper

@app.get("/api/cip")
def get_cips(search: str = None):
    results = cip_cache
    if search:
        s = search.lower()
        results = [c for c in results if s in c['title'].lower() or s in c['code'].lower()]
    return results

@app.post("/api/cip/refresh")
def refresh_cips():
    scraper = CIPScraper()
    data = scraper.fetch_data()
    global cip_cache
    cip_cache = data
    return {"status": "success", "added": len(data), "total": len(data)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

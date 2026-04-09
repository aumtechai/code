import os
from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware

# The 'backend' folder is now local to this file
from .backend.app.api import router as main_api_router
from .backend.app.api_tutoring import router as tutoring_router
from .backend.app.integrations import router as integration_router

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
    return {"status": "healthy", "mode": "local-backend"}

@app.get("/api/aura/status")
def aura_status():
    return {"status": "operational", "message": "Backend discovered locally within Lambda bundle."}

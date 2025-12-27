from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import router

app = FastAPI(title="Student Success API", version="0.1.0")

# CORS Configuration
origins = [
    "http://localhost:5173",  # Vite default port
    "http://localhost:3000",
    "https://studentsuccess-nu.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for Vercel deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    # Currently doing nothing to debug startup crashes
    print("Startup complete")

@app.get("/")
async def root():
    return {"message": "Welcome to Student Success API"}

app.include_router(router, prefix="/api")

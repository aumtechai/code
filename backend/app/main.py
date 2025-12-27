from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import router

app = FastAPI(title="Student Success API", version="0.1.0")

# CORS Configuration
origins = [
    "http://localhost:5173",  # Vite default port
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    from sqlmodel import SQLModel, Session, select
    from app.auth import engine
    from app.models import Tutor
    SQLModel.metadata.create_all(engine)
    
    # Seed Tutors if empty
    with Session(engine) as session:
        statement = select(Tutor)
        existing_tutors = session.exec(statement).first()
        if not existing_tutors:
            tutors = [
                Tutor(name="Alex Rivera", subjects="Calculus, Physics", rating=4.9, reviews=124, image="AR", color="#4f46e5"),
                Tutor(name="Sarah Chen", subjects="Chemistry, Biology", rating=4.8, reviews=89, image="SC", color="#10b981"),
                Tutor(name="Marcus Bell", subjects="History, English", rating=5.0, reviews=215, image="MB", color="#f59e0b"),
                Tutor(name="Elena Frost", subjects="Computer Science, Data Structures", rating=4.7, reviews=56, image="EF", color="#ec4899"),
            ]
            session.add_all(tutors)
            session.commit()

@app.get("/")
async def root():
    return {"message": "Welcome to Student Success API"}

app.include_router(router, prefix="/api")

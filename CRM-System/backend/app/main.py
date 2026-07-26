from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine, SessionLocal
from .routes import router
from .models import AdminProfile, TeamMember

# Create database tables
Base.metadata.create_all(bind=engine)

# Seed initial database records if empty
db = SessionLocal()
try:
    if not db.query(AdminProfile).first():
        admin = AdminProfile(
            name="Alex Rivera",
            role="Senior Lead",
            email="alex.rivera@supportflow.com"
        )
        db.add(admin)
        db.commit()
        
    if not db.query(TeamMember).first():
        members = [
            TeamMember(name="Alex Rivera", role="Senior Lead", email="alex.rivera@supportflow.com", status="Active", tickets_handled=124),
            TeamMember(name="Sarah Chen", role="Frontend Engineer", email="sarah.chen@supportflow.com", status="Active", tickets_handled=85),
            TeamMember(name="Marcus Thorne", role="Database Specialist", email="marcus.thorne@supportflow.com", status="Away", tickets_handled=92),
            TeamMember(name="Elena Vance", role="API Architect", email="elena.vance@supportflow.com", status="Active", tickets_handled=110),
            TeamMember(name="Gordon Freeman", role="Systems Operator", email="gordon.f@supportflow.com", status="Offline", tickets_handled=45)
        ]
        db.bulk_save_objects(members)
        db.commit()
finally:
    db.close()

app = FastAPI()

# Anyone from any origin can access this API (for development purposes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/")
def home():
    return {"message": "Support CRM API Running"}

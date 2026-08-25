from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.seed_data import ensure_seed
from app.routes import (
    auth,
    admin,
    categories,
    providers,
    provider_portal,
    bookings,
    reviews,
    jobs,
    stats,
    uploads,
    chat,
    slides,
    ads,
    jobseeker,
    contact,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize DB connection and seed initial data
    from app.db import init_db
    await init_db()
    try:
        await ensure_seed()
        print("[INIT] Database seeding verified on startup.")
    except Exception as e:
        print(f"[WARNING] Seeding notice: {e}")
    yield
    # Shutdown logic if any

app = FastAPI(
    title="Search2Service API",
    description="Python FastAPI backend for Search2Service marketplace",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all route modules
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(categories.router)
app.include_router(providers.router)
app.include_router(provider_portal.router)
app.include_router(bookings.router)
app.include_router(reviews.router)
app.include_router(jobs.router)
app.include_router(stats.router)
app.include_router(uploads.router)
app.include_router(chat.router)
app.include_router(slides.router)
app.include_router(ads.router)
app.include_router(jobseeker.router)
app.include_router(contact.router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to Search2Service API (FastAPI Python Backend)",
        "docs": "/docs",
        "health": "/api/health"
    }

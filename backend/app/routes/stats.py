import time
from fastapi import APIRouter
from app.db import get_db

router = APIRouter(prefix="/api", tags=["stats"])

@router.get("/health")
async def health_check():
    return {
        "ok": True,
        "service": "Search2Service API (FastAPI Python)",
        "ts": int(time.time() * 1000)
    }

@router.get("/stats")
async def get_stats():
    db = get_db()
    providers_count = await db.providers.count_documents({})
    doctors_count = await db.providers.count_documents({"specialization": {"$ne": None}})
    reviews_count = await db.reviews.count_documents({})
    categories_count = await db.categories.count_documents({})
    ads_count = await db.advertisements.count_documents({})
    active_ads = await db.advertisements.count_documents({"status": "active"})
    
    return {
        "providers": providers_count,
        "doctors": doctors_count,
        "reviews": reviews_count,
        "categories": categories_count,
        "ads": ads_count,
        "activeAds": active_ads,
        "customers": 25000 + providers_count * 4
    }

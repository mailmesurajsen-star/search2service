from datetime import datetime
from typing import Optional
from fastapi import APIRouter
from app.db import get_db, clean_doc
from app.seed_data import ensure_seed

router = APIRouter(prefix="/api", tags=["slides"])

@router.get("/hero-slides")
async def get_public_hero_slides():
    db = get_db()
    # Ensure seed in case slides haven't been loaded yet
    count = await db.hero_slides.count_documents({})
    if count == 0:
        await ensure_seed()
        
    slides_cursor = db.hero_slides.find({"isActive": True}).sort([("order", 1), ("createdAt", -1)])
    slides = await slides_cursor.to_list(length=50)
    return {"slides": clean_doc(slides)}

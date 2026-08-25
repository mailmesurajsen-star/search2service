import uuid
from datetime import datetime
from typing import Optional, List, Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.db import get_db, clean_doc

router = APIRouter(prefix="/api", tags=["reviews"])

class CreateReviewPayload(BaseModel):
    providerId: str
    userName: Optional[str] = "Anonymous"
    rating: Optional[Any] = 5
    comment: Optional[str] = ""
    photos: Optional[List[str]] = None

@router.get("/reviews/recent")
async def get_recent_reviews():
    db = get_db()
    recent = await db.reviews.find({"rating": {"$gte": 4}}).sort([("createdAt", -1)]).limit(9).to_list(length=9)
    
    with_provider = []
    for r in recent:
        p = await db.providers.find_one(
            {"id": r.get("providerId")},
            {"name": 1, "categoryName": 1, "city": 1, "_id": 0}
        )
        cleaned_r = clean_doc(r)
        cleaned_r["provider"] = p
        with_provider.append(cleaned_r)
        
    return {"items": with_provider}

@router.post("/reviews")
async def create_review(payload: CreateReviewPayload):
    if not payload.providerId:
        raise HTTPException(status_code=400, detail="providerId required")
        
    db = get_db()
    
    try:
        rating_int = int(payload.rating)
    except (ValueError, TypeError):
        rating_int = 5
    rating_val = max(1, min(5, rating_int))
    
    photos = (payload.photos or [])[:6]
    
    doc = {
        "id": str(uuid.uuid4()),
        "providerId": payload.providerId,
        "userName": payload.userName or "Anonymous",
        "rating": rating_val,
        "comment": payload.comment or "",
        "photos": photos,
        "createdAt": datetime.utcnow().isoformat()
    }
    
    await db.reviews.insert_one(doc)
    
    # Recalculate average rating & review count for the provider
    all_revs = await db.reviews.find({"providerId": payload.providerId}).to_list(length=1000)
    if all_revs:
        avg_rating = sum(r.get("rating", 5) for r in all_revs) / len(all_revs)
        await db.providers.update_one(
            {"id": payload.providerId},
            {"$set": {"rating": round(avg_rating, 1), "reviewCount": len(all_revs)}}
        )
        
    return {"ok": True, "review": clean_doc(doc)}

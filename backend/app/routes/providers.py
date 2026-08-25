import re
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.db import get_db, clean_doc

router = APIRouter(prefix="/api", tags=["providers"])

@router.get("/providers")
async def get_providers(
    category: Optional[str] = Query(None),
    group: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    area: Optional[str] = Query(None),
    premium: Optional[str] = Query(None),
    verified: Optional[str] = Query(None),
    q: Optional[str] = Query(None),
    sort: Optional[str] = Query(None),
    limit: int = Query(24, ge=1, le=100),
    skip: int = Query(0, ge=0)
):
    db = get_db()
    query_filter = {}
    
    if category:
        query_filter["categorySlug"] = category
    if group:
        query_filter["group"] = group
    if state:
        query_filter["state"] = state
    if district:
        query_filter["district"] = district
    if city:
        query_filter["city"] = city
    if area:
        query_filter["area"] = area
    if premium == "true":
        query_filter["premium"] = True
    if verified == "true":
        query_filter["verified"] = True
    if q and q.strip():
        rx = {"$regex": re.escape(q.strip()), "$options": "i"}
        query_filter["$or"] = [
            {"name": rx},
            {"categoryName": rx},
            {"description": rx},
            {"services": rx}
        ]
        
    sort_criteria = [("premium", -1), ("featured", -1), ("rating", -1)]
    if sort == "rating":
        sort_criteria = [("rating", -1)]
    elif sort == "newest":
        sort_criteria = [("createdAt", -1)]
        
    items_cursor = db.providers.find(query_filter).sort(sort_criteria).skip(skip).limit(limit)
    items = await items_cursor.to_list(length=limit)
    total = await db.providers.count_documents(query_filter)
    
    return {
        "items": clean_doc(items),
        "total": total
    }

@router.get("/doctors")
async def get_doctors(
    featured: Optional[str] = Query(None),
    limit: int = Query(8, ge=1, le=100)
):
    db = get_db()
    query_filter = {"specialization": {"$ne": None}}
    if featured == "true":
        query_filter["featured"] = True
        
    items = await db.providers.find(query_filter).sort([("premium", -1), ("rating", -1)]).limit(limit).to_list(length=limit)
    return {"items": clean_doc(items)}

@router.get("/hotels")
async def get_hotels(
    limit: int = Query(6, ge=1, le=100)
):
    db = get_db()
    items = await db.providers.find({"categorySlug": "hotel"}).sort([("rating", -1)]).limit(limit).to_list(length=limit)
    return {"items": clean_doc(items)}

@router.get("/restaurants")
async def get_restaurants(
    limit: int = Query(6, ge=1, le=100)
):
    db = get_db()
    items = await db.providers.find({"categorySlug": "restaurant"}).sort([("rating", -1)]).limit(limit).to_list(length=limit)
    return {"items": clean_doc(items)}

@router.get("/gov-services")
async def get_gov_services():
    db = get_db()
    items = await db.providers.find({"group": "Government Services"}).sort([("rating", -1)]).limit(6).to_list(length=6)
    return {"items": clean_doc(items)}

@router.get("/providers/{provider_id}")
async def get_provider_by_id(provider_id: str):
    db = get_db()
    p = await db.providers.find_one({"id": provider_id})
    if not p:
        raise HTTPException(status_code=404, detail="not found")
        
    reviews = await db.reviews.find({"providerId": provider_id}).sort([("createdAt", -1)]).limit(20).to_list(length=20)
    similar = await db.providers.find({"categorySlug": p.get("categorySlug"), "id": {"$ne": provider_id}}).limit(4).to_list(length=4)
    
    return {
        "provider": clean_doc(p),
        "reviews": clean_doc(reviews),
        "similar": clean_doc(similar)
    }

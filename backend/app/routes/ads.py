import re
import uuid
from datetime import datetime
from typing import Optional, List, Any
from fastapi import APIRouter, Request, HTTPException, Query, status
from pydantic import BaseModel
from app.db import get_db, clean_doc
from app.auth import get_current_user
from app.seed_data import ensure_seed

router = APIRouter(prefix="/api", tags=["ads"])

ADMIN_ROLES = ["admin", "super_admin", "state_manager", "district_manager"]

async def require_admin(request: Request) -> dict:
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="unauthorized")
    if user.get("role") not in ADMIN_ROLES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="admin role required")
    return user

# ---------------------------------------------------------
# PYDANTIC SCHEMAS
# ---------------------------------------------------------
class AdCreatePayload(BaseModel):
    title: str
    subtitle: Optional[str] = ""
    imageUrl: Optional[str] = ""
    targetUrl: Optional[str] = "/"
    placement: Optional[str] = "homepage_banner"  # homepage_banner, search_top, search_sidebar, category_banner, popup_modal, footer_banner
    badge: Optional[str] = "Sponsored"
    ctaText: Optional[str] = "Explore Now"
    advertiserName: Optional[str] = ""
    advertiserPhone: Optional[str] = ""
    gradient: Optional[str] = "from-blue-600 via-indigo-600 to-orange-500"
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    status: Optional[str] = "active"  # active, inactive, expired, draft
    priority: Optional[int] = 1

class AdUpdatePayload(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    imageUrl: Optional[str] = None
    targetUrl: Optional[str] = None
    placement: Optional[str] = None
    badge: Optional[str] = None
    ctaText: Optional[str] = None
    advertiserName: Optional[str] = None
    advertiserPhone: Optional[str] = None
    gradient: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[int] = None

class AdStatusPatchPayload(BaseModel):
    status: str

class AdReorderPayload(BaseModel):
    adOrders: List[dict]  # list of {"id": "...", "priority": 1}

# ---------------------------------------------------------
# PUBLIC ENDPOINTS (No Admin Auth Required)
# ---------------------------------------------------------
@router.get("/ads")
async def get_public_ads(
    placement: Optional[str] = Query(None),
    status_val: Optional[str] = Query("active", alias="status"),
    limit: int = Query(20, ge=1, le=100)
):
    """Fetch active advertisements for public display."""
    db = get_db()
    
    # Ensure seed if ads empty
    count = await db.advertisements.count_documents({})
    if count == 0:
        await ensure_seed()

    query: dict = {}
    if status_val and status_val != "all":
        query["status"] = status_val
    if placement and placement != "all":
        query["placement"] = placement

    # Date validity check if status is active
    if status_val == "active":
        today_str = datetime.utcnow().strftime("%Y-%m-%d")
        query["$and"] = [
            {"$or": [{"startDate": None}, {"startDate": ""}, {"startDate": {"$lte": today_str}}]},
            {"$or": [{"endDate": None}, {"endDate": ""}, {"endDate": {"$gte": today_str}}]}
        ]

    cursor = db.advertisements.find(query).sort([("priority", 1), ("createdAt", -1)]).limit(limit)
    items = await cursor.to_list(length=limit)
    return {"ads": clean_doc(items), "count": len(items)}

@router.post("/ads/{ad_id}/impression")
async def record_ad_impression(ad_id: str):
    """Increment ad impression counter."""
    db = get_db()
    res = await db.advertisements.update_one(
        {"id": ad_id},
        {"$inc": {"impressions": 1}}
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Ad not found")
    return {"ok": True, "adId": ad_id}

@router.post("/ads/{ad_id}/click")
async def record_ad_click(ad_id: str):
    """Increment ad click counter."""
    db = get_db()
    res = await db.advertisements.update_one(
        {"id": ad_id},
        {"$inc": {"clicks": 1}}
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Ad not found")
    return {"ok": True, "adId": ad_id}

# ---------------------------------------------------------
# ADMIN ENDPOINTS (Admin Auth Required)
# ---------------------------------------------------------
@router.get("/admin/ads")
async def get_admin_ads(
    request: Request,
    q: Optional[str] = Query(None),
    placement: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    sort: Optional[str] = Query("priority"),
    limit: int = Query(50, ge=1, le=200),
    skip: int = Query(0, ge=0)
):
    await require_admin(request)
    db = get_db()

    # Ensure seed in case not seeded
    count = await db.advertisements.count_documents({})
    if count == 0:
        await ensure_seed()

    query_filter: dict = {}
    if placement and placement != "all":
        query_filter["placement"] = placement
    if status_filter and status_filter != "all":
        query_filter["status"] = status_filter

    if q and q.strip():
        rx = {"$regex": re.escape(q.strip()), "$options": "i"}
        query_filter["$or"] = [
            {"title": rx},
            {"subtitle": rx},
            {"advertiserName": rx},
            {"advertiserPhone": rx},
            {"targetUrl": rx},
            {"badge": rx},
        ]

    sort_criteria = [("priority", 1), ("createdAt", -1)]
    if sort == "newest":
        sort_criteria = [("createdAt", -1)]
    elif sort == "clicks":
        sort_criteria = [("clicks", -1), ("createdAt", -1)]
    elif sort == "impressions":
        sort_criteria = [("impressions", -1), ("createdAt", -1)]
    elif sort == "title":
        sort_criteria = [("title", 1)]

    cursor = db.advertisements.find(query_filter).sort(sort_criteria).skip(skip).limit(limit)
    items = await cursor.to_list(length=limit)
    total = await db.advertisements.count_documents(query_filter)

    # Compute overall ads analytics
    all_ads = await db.advertisements.find({}).to_list(length=1000)
    total_impressions = sum(ad.get("impressions", 0) for ad in all_ads)
    total_clicks = sum(ad.get("clicks", 0) for ad in all_ads)
    active_count = sum(1 for ad in all_ads if ad.get("status") == "active")
    inactive_count = sum(1 for ad in all_ads if ad.get("status") != "active")
    avg_ctr = round((total_clicks / total_impressions * 100), 2) if total_impressions > 0 else 0.0

    return {
        "items": clean_doc(items),
        "total": total,
        "page": (skip // limit) + 1,
        "limit": limit,
        "stats": {
            "totalAds": len(all_ads),
            "activeAds": active_count,
            "inactiveAds": inactive_count,
            "totalImpressions": total_impressions,
            "totalClicks": total_clicks,
            "averageCTR": avg_ctr
        }
    }

@router.get("/admin/ads/{ad_id}")
async def get_admin_ad_by_id(ad_id: str, request: Request):
    await require_admin(request)
    db = get_db()
    ad = await db.advertisements.find_one({"id": ad_id})
    if not ad:
        raise HTTPException(status_code=404, detail="Advertisement not found")
    return {"ad": clean_doc(ad)}

@router.post("/admin/ads", status_code=201)
async def create_admin_ad(payload: AdCreatePayload, request: Request):
    await require_admin(request)
    db = get_db()

    now_iso = datetime.utcnow().isoformat()
    today_str = datetime.utcnow().strftime("%Y-%m-%d")

    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["startDate"] = doc.get("startDate") or today_str
    doc["impressions"] = 0
    doc["clicks"] = 0
    doc["createdAt"] = now_iso
    doc["updatedAt"] = now_iso

    await db.advertisements.insert_one(doc)
    return {"ok": True, "ad": clean_doc(doc)}

@router.put("/admin/ads/{ad_id}")
@router.patch("/admin/ads/{ad_id}")
async def update_admin_ad(ad_id: str, payload: AdUpdatePayload, request: Request):
    await require_admin(request)
    db = get_db()

    existing = await db.advertisements.find_one({"id": ad_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Advertisement not found")

    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    updates["updatedAt"] = datetime.utcnow().isoformat()

    await db.advertisements.update_one({"id": ad_id}, {"$set": updates})
    updated = await db.advertisements.find_one({"id": ad_id})
    return {"ok": True, "ad": clean_doc(updated)}

@router.patch("/admin/ads/{ad_id}/status")
async def patch_admin_ad_status(ad_id: str, payload: AdStatusPatchPayload, request: Request):
    await require_admin(request)
    db = get_db()

    existing = await db.advertisements.find_one({"id": ad_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Advertisement not found")

    valid_statuses = ["active", "inactive", "expired", "draft"]
    if payload.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")

    await db.advertisements.update_one(
        {"id": ad_id},
        {"$set": {"status": payload.status, "updatedAt": datetime.utcnow().isoformat()}}
    )
    updated = await db.advertisements.find_one({"id": ad_id})
    return {"ok": True, "ad": clean_doc(updated)}

@router.delete("/admin/ads/{ad_id}")
async def delete_admin_ad(ad_id: str, request: Request):
    await require_admin(request)
    db = get_db()

    res = await db.advertisements.delete_one({"id": ad_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Advertisement not found")

    return {"ok": True, "deletedId": ad_id, "message": "Advertisement deleted successfully"}

@router.post("/admin/ads/reorder")
async def reorder_admin_ads(payload: AdReorderPayload, request: Request):
    await require_admin(request)
    db = get_db()

    for item in payload.adOrders:
        if "id" in item and "priority" in item:
            await db.advertisements.update_one(
                {"id": item["id"]},
                {"$set": {"priority": int(item["priority"]), "updatedAt": datetime.utcnow().isoformat()}}
            )

    return {"ok": True, "message": "Ads priority reordered successfully"}

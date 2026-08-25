import re
import uuid
from datetime import datetime
from typing import Optional, List, Any
from fastapi import APIRouter, Request, HTTPException, Query, status
from pydantic import BaseModel
from app.db import get_db, clean_doc
from app.auth import get_current_user, hash_password
from app.india_locations import INDIA_STATES, INDIA_LOCATIONS, get_all_states

router = APIRouter(prefix="/api/admin", tags=["admin"])

ADMIN_ROLES = ["admin", "super_admin", "state_manager", "district_manager"]

async def require_admin(request: Request) -> dict:
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="unauthorized")
    if user.get("role") not in ADMIN_ROLES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="admin role required")
    return user

class ChangeCredentialsPayload(BaseModel):
    newEmail: Optional[str] = None
    newPassword: Optional[str] = None

@router.post("/change-credentials")
async def change_admin_credentials(payload: ChangeCredentialsPayload, request: Request):
    user = await require_admin(request)
    db = get_db()

    update: dict = {}

    if payload.newEmail:
        new_email = payload.newEmail.strip().lower()
        existing = await db.users.find_one({"email": new_email, "id": {"$ne": user["id"]}})
        if existing:
            raise HTTPException(status_code=409, detail="Email already in use by another account")
        update["email"] = new_email

    if payload.newPassword:
        if len(payload.newPassword) < 6:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
        update["passwordHash"] = hash_password(payload.newPassword)

    if not update:
        raise HTTPException(status_code=400, detail="Provide a new email and/or password")

    await db.users.update_one({"id": user["id"]}, {"$set": update})
    updated = await db.users.find_one({"id": user["id"]})
    safe_user = clean_doc(updated)
    safe_user.pop("passwordHash", None)
    return {"ok": True, "user": safe_user}

class AdminProviderPayload(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    categorySlug: Optional[str] = None
    categoryName: Optional[str] = None
    categoryId: Optional[str] = None
    group: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    city: Optional[str] = None
    area: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    services: Optional[List[str]] = None
    priceFrom: Optional[Any] = None
    priceTo: Optional[Any] = None
    fees: Optional[Any] = None
    offers: Optional[List[str]] = None
    upi: Optional[str] = None
    razorpayKeyId: Optional[str] = None
    paymentMethods: Optional[List[str]] = None
    banner: Optional[str] = None
    images: Optional[List[str]] = None
    timings: Optional[dict] = None
    location: Optional[dict] = None
    rating: Optional[float] = None
    reviewCount: Optional[int] = None
    verified: Optional[bool] = None
    premium: Optional[bool] = None
    featured: Optional[bool] = None
    specialization: Optional[str] = None
    qualification: Optional[str] = None
    experience: Optional[Any] = None
    status: Optional[str] = None
    ownerName: Optional[str] = None
    ownerId: Optional[str] = None

class AdminProviderStatusPatch(BaseModel):
    status: Optional[str] = None
    verified: Optional[bool] = None
    premium: Optional[bool] = None
    featured: Optional[bool] = None

@router.get("/providers")
async def get_admin_providers(
    request: Request,
    q: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    verified: Optional[str] = Query(None),
    premium: Optional[str] = Query(None),
    featured: Optional[str] = Query(None),
    sort: Optional[str] = Query("newest"),
    limit: int = Query(25, ge=1, le=200),
    skip: int = Query(0, ge=0)
):
    await require_admin(request)
    db = get_db()
    
    query_filter = {}
    
    if category and category != "all":
        query_filter["categorySlug"] = category
        
    if status_filter and status_filter != "all":
        query_filter["status"] = status_filter
        
    if verified == "true":
        query_filter["verified"] = True
    elif verified == "false":
        query_filter["verified"] = {"$ne": True}
        
    if premium == "true":
        query_filter["premium"] = True
    elif premium == "false":
        query_filter["premium"] = {"$ne": True}
        
    if featured == "true":
        query_filter["featured"] = True
    elif featured == "false":
        query_filter["featured"] = {"$ne": True}
        
    if q and q.strip():
        rx = {"$regex": re.escape(q.strip()), "$options": "i"}
        query_filter["$or"] = [
            {"name": rx},
            {"ownerName": rx},
            {"phone": rx},
            {"email": rx},
            {"city": rx},
            {"state": rx},
            {"categoryName": rx},
            {"description": rx},
            {"services": rx},
        ]
        
    sort_criteria = [("createdAt", -1)]
    if sort == "rating":
        sort_criteria = [("rating", -1), ("createdAt", -1)]
    elif sort == "name":
        sort_criteria = [("name", 1)]
    elif sort == "oldest":
        sort_criteria = [("createdAt", 1)]
    elif sort == "popular":
        sort_criteria = [("reviewCount", -1), ("rating", -1)]
        
    items_cursor = db.providers.find(query_filter).sort(sort_criteria).skip(skip).limit(limit)
    items = await items_cursor.to_list(length=limit)
    total = await db.providers.count_documents(query_filter)
    
    # Compute quick stats
    total_count = await db.providers.count_documents({})
    active_count = await db.providers.count_documents({"status": "active"})
    pending_count = await db.providers.count_documents({"status": "pending"})
    suspended_count = await db.providers.count_documents({"status": "suspended"})
    verified_count = await db.providers.count_documents({"verified": True})
    featured_count = await db.providers.count_documents({"$or": [{"featured": True}, {"premium": True}]})
    
    return {
        "items": clean_doc(items),
        "total": total,
        "page": (skip // limit) + 1,
        "limit": limit,
        "stats": {
            "total": total_count,
            "active": active_count,
            "pending": pending_count,
            "suspended": suspended_count,
            "verified": verified_count,
            "featured": featured_count,
        }
    }

@router.get("/providers/{provider_id}")
async def get_admin_provider_by_id(provider_id: str, request: Request):
    await require_admin(request)
    db = get_db()
    p = await db.providers.find_one({"id": provider_id})
    if not p:
        raise HTTPException(status_code=404, detail="Provider not found")
    return {"provider": clean_doc(p)}

@router.post("/providers")
async def create_admin_provider(payload: AdminProviderPayload, request: Request):
    user = await require_admin(request)
    db = get_db()
    
    cat = None
    if payload.categorySlug:
        cat = await db.categories.find_one({"slug": payload.categorySlug})
        
    p_id = str(uuid.uuid4())
    doc = payload.model_dump(exclude_unset=True)
    doc["id"] = p_id
    doc["ownerId"] = doc.get("ownerId") or user["id"]
    doc["ownerName"] = doc.get("ownerName") or doc.get("name") or user.get("name", "Admin Created")
    doc["name"] = doc.get("name", "New Service Provider")
    doc["description"] = doc.get("description", "")
    
    if cat:
        doc["categoryId"] = cat.get("id")
        doc["categoryName"] = cat.get("name")
        doc["categorySlug"] = cat.get("slug")
        doc["group"] = cat.get("group")
        
    doc["status"] = doc.get("status", "active")
    doc["verified"] = doc.get("verified", True)
    doc["rating"] = float(doc.get("rating") or 4.5)
    doc["reviewCount"] = int(doc.get("reviewCount") or 0)
    doc["createdAt"] = datetime.utcnow().isoformat()
    doc["updatedAt"] = datetime.utcnow().isoformat()
    
    await db.providers.insert_one(doc)
    return {"ok": True, "provider": clean_doc(doc)}

@router.put("/providers/{provider_id}")
@router.patch("/providers/{provider_id}")
async def update_admin_provider(provider_id: str, payload: AdminProviderPayload, request: Request):
    await require_admin(request)
    db = get_db()
    
    existing = await db.providers.find_one({"id": provider_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Provider not found")
        
    update_data = payload.model_dump(exclude_unset=True)
    
    if "categorySlug" in update_data and update_data["categorySlug"]:
        cat = await db.categories.find_one({"slug": update_data["categorySlug"]})
        if cat:
            update_data["categoryId"] = cat.get("id")
            update_data["categoryName"] = cat.get("name")
            update_data["group"] = cat.get("group")
            
    update_data["updatedAt"] = datetime.utcnow().isoformat()
    
    await db.providers.update_one({"id": provider_id}, {"$set": update_data})
    updated = await db.providers.find_one({"id": provider_id})
    return {"ok": True, "provider": clean_doc(updated)}

@router.patch("/providers/{provider_id}/status")
async def patch_admin_provider_status(provider_id: str, payload: AdminProviderStatusPatch, request: Request):
    await require_admin(request)
    db = get_db()
    
    existing = await db.providers.find_one({"id": provider_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Provider not found")
        
    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        return {"ok": True, "provider": clean_doc(existing)}
        
    update_data["updatedAt"] = datetime.utcnow().isoformat()
    await db.providers.update_one({"id": provider_id}, {"$set": update_data})
    
    updated = await db.providers.find_one({"id": provider_id})
    return {"ok": True, "provider": clean_doc(updated)}

@router.delete("/providers/{provider_id}")
async def delete_admin_provider(provider_id: str, request: Request):
    await require_admin(request)
    db = get_db()
    
    existing = await db.providers.find_one({"id": provider_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Provider not found")
        
    await db.providers.delete_one({"id": provider_id})
    await db.reviews.delete_many({"providerId": provider_id})
    await db.bookings.delete_many({"providerId": provider_id})
    
    return {"ok": True, "deletedId": provider_id}

# ---------------------------------------------------------
# CATEGORY MANAGEMENT ENDPOINTS
# ---------------------------------------------------------
class AdminCategoryPayload(BaseModel):
    name: str
    slug: Optional[str] = None
    group: Optional[str] = "Home Services"
    icon: Optional[str] = "Folder"
    groupIcon: Optional[str] = "Folder"
    color: Optional[str] = "from-blue-500 to-indigo-600"
    description: Optional[str] = ""

@router.post("/categories")
async def create_admin_category(payload: AdminCategoryPayload, request: Request):
    await require_admin(request)
    db = get_db()
    
    name = payload.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Category name is required")
        
    slug = (payload.slug or re.sub(r'[^a-zA-Z0-9]+', '-', name.lower()).strip('-'))
    
    existing = await db.categories.find_one({"$or": [{"name": name}, {"slug": slug}]})
    if existing:
        raise HTTPException(status_code=409, detail="Category with this name or slug already exists")
        
    cat_doc = {
        "id": str(uuid.uuid4()),
        "name": name,
        "slug": slug,
        "group": payload.group or "Home Services",
        "icon": payload.icon or "Folder",
        "groupIcon": payload.groupIcon or payload.icon or "Folder",
        "color": payload.color or "from-blue-500 to-indigo-600",
        "description": payload.description or "",
        "iconVersion": 2,
        "createdAt": datetime.utcnow().isoformat()
    }
    
    await db.categories.insert_one(cat_doc)
    return {"ok": True, "category": clean_doc(cat_doc)}

@router.put("/categories/{category_id}")
async def update_admin_category(category_id: str, payload: AdminCategoryPayload, request: Request):
    await require_admin(request)
    db = get_db()
    
    existing = await db.categories.find_one({"id": category_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Category not found")
        
    update_data = payload.model_dump(exclude_unset=True)
    if "name" in update_data and update_data["name"]:
        update_data["name"] = update_data["name"].strip()
    if "slug" in update_data and not update_data["slug"]:
        update_data["slug"] = re.sub(r'[^a-zA-Z0-9]+', '-', update_data.get("name", existing["name"]).lower()).strip('-')
        
    await db.categories.update_one({"id": category_id}, {"$set": update_data})
    updated = await db.categories.find_one({"id": category_id})
    return {"ok": True, "category": clean_doc(updated)}

@router.delete("/categories/{category_id}")
async def delete_admin_category(category_id: str, request: Request):
    await require_admin(request)
    db = get_db()
    
    existing = await db.categories.find_one({"id": category_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Category not found")
        
    await db.categories.delete_one({"id": category_id})
    return {"ok": True, "deletedId": category_id}

# ---------------------------------------------------------
# USER & ROLE MANAGEMENT ENDPOINTS
# ---------------------------------------------------------
class AdminUserRolePatch(BaseModel):
    role: str

class AdminUserVerifyPatch(BaseModel):
    verified: bool

@router.get("/users")
async def get_admin_users(
    request: Request,
    q: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    skip: int = Query(0, ge=0)
):
    await require_admin(request)
    db = get_db()
    
    query_filter = {}
    if role and role != "all":
        query_filter["role"] = role
        
    if q and q.strip():
        rx = {"$regex": re.escape(q.strip()), "$options": "i"}
        query_filter["$or"] = [
            {"name": rx},
            {"email": rx},
            {"phone": rx}
        ]
        
    users_cursor = db.users.find(query_filter).sort("createdAt", -1).skip(skip).limit(limit)
    users = await users_cursor.to_list(length=limit)
    total = await db.users.count_documents(query_filter)
    
    # Safe user cleaning without hashes
    safe_users = []
    for u in clean_doc(users):
        u.pop("passwordHash", None)
        safe_users.append(u)
        
    return {
        "items": safe_users,
        "total": total,
        "roles": ["customer", "provider", "jobseeker", "admin", "super_admin", "state_manager", "district_manager"]
    }

@router.patch("/users/{user_id}/role")
async def update_user_role(user_id: str, payload: AdminUserRolePatch, request: Request):
    user = await require_admin(request)
    db = get_db()
    
    allowed_roles = ["customer", "provider", "jobseeker", "admin", "super_admin", "state_manager", "district_manager"]
    if payload.role not in allowed_roles:
        raise HTTPException(status_code=400, detail=f"Invalid role. Allowed: {allowed_roles}")
        
    target = await db.users.find_one({"id": user_id})
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
        
    await db.users.update_one({"id": user_id}, {"$set": {"role": payload.role, "updatedAt": datetime.utcnow().isoformat()}})
    updated = await db.users.find_one({"id": user_id})
    safe = clean_doc(updated)
    safe.pop("passwordHash", None)
    return {"ok": True, "user": safe}

@router.patch("/users/{user_id}/verify")
async def toggle_user_verify(user_id: str, payload: AdminUserVerifyPatch, request: Request):
    await require_admin(request)
    db = get_db()
    
    target = await db.users.find_one({"id": user_id})
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
        
    await db.users.update_one({"id": user_id}, {"$set": {"verified": payload.verified, "updatedAt": datetime.utcnow().isoformat()}})
    updated = await db.users.find_one({"id": user_id})
    safe = clean_doc(updated)
    safe.pop("passwordHash", None)
    return {"ok": True, "user": safe}

@router.delete("/users/{user_id}")
async def delete_admin_user(user_id: str, request: Request):
    admin = await require_admin(request)
    if admin.get("id") == user_id:
        raise HTTPException(status_code=400, detail="Cannot delete your own admin account")
        
    db = get_db()
    target = await db.users.find_one({"id": user_id})
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
        
    await db.users.delete_one({"id": user_id})
    return {"ok": True, "deletedId": user_id}

# ---------------------------------------------------------
# LOCATION MANAGEMENT ENDPOINTS
# ---------------------------------------------------------
class AdminLocationPayload(BaseModel):
    state: str
    district: Optional[str] = ""
    city: str
    areas: Optional[List[str]] = []
    pincode: Optional[str] = ""
    tier: Optional[str] = "Tier 2"
    isActive: Optional[bool] = True

class AdminLocationUpdatePayload(BaseModel):
    state: Optional[str] = None
    district: Optional[str] = None
    city: Optional[str] = None
    areas: Optional[List[str]] = None
    pincode: Optional[str] = None
    tier: Optional[str] = None
    isActive: Optional[bool] = None

class AdminAddAreaPayload(BaseModel):
    area: str

@router.get("/locations")
async def get_admin_locations(
    request: Request,
    q: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    limit: int = Query(100, ge=1, le=500),
    skip: int = Query(0, ge=0)
):
    await require_admin(request)
    db = get_db()

    from app.seed_data import ensure_seed
    if await db.locations.count_documents({}) == 0:
        await ensure_seed()

    query_filter = {}
    if state and state != "all":
        query_filter["state"] = {"$regex": f"^{re.escape(state.strip())}$", "$options": "i"}

    if status_filter == "active":
        query_filter["isActive"] = True
    elif status_filter == "inactive":
        query_filter["isActive"] = False
    elif status_filter == "custom":
        query_filter["isCustom"] = True

    if q and q.strip():
        rx = {"$regex": re.escape(q.strip()), "$options": "i"}
        query_filter["$or"] = [
            {"city": rx},
            {"district": rx},
            {"state": rx},
            {"areas": rx},
            {"pincode": rx}
        ]

    locations_cursor = db.locations.find(query_filter).sort([("state", 1), ("city", 1)]).skip(skip).limit(limit)
    locations = await locations_cursor.to_list(length=limit)
    total = await db.locations.count_documents(query_filter)

    # Attach provider counts per city
    providers = await db.providers.find({}, {"city": 1, "state": 1}).to_list(length=5000)
    city_count_map = {}
    for p in providers:
        c = (p.get("city") or "").strip().lower()
        if c:
            city_count_map[c] = city_count_map.get(c, 0) + 1

    cleaned_items = clean_doc(locations)
    for item in cleaned_items:
        c_key = (item.get("city") or "").strip().lower()
        item["providerCount"] = city_count_map.get(c_key, 0)

    # Compute overall stats
    all_locs = await db.locations.find({}, {"state": 1, "district": 1, "city": 1, "areas": 1, "isCustom": 1}).to_list(length=5000)
    all_states = sorted(list(set(l.get("state", "").strip() for l in all_locs if l.get("state"))))
    all_districts = set(l.get("district", "").strip() for l in all_locs if l.get("district"))
    all_cities = set(l.get("city", "").strip() for l in all_locs if l.get("city"))
    total_areas = sum(len(l.get("areas", [])) for l in all_locs)
    custom_count = sum(1 for l in all_locs if l.get("isCustom"))

    return {
        "items": cleaned_items,
        "total": total,
        "states": all_states,
        "stats": {
            "totalStates": len(all_states),
            "totalDistricts": len(all_districts),
            "totalCities": len(all_cities),
            "totalAreas": total_areas,
            "customLocations": custom_count
        }
    }

@router.post("/locations", status_code=201)
async def create_admin_location(payload: AdminLocationPayload, request: Request):
    await require_admin(request)
    db = get_db()

    state = payload.state.strip()
    city = payload.city.strip()
    district = (payload.district or "").strip() or city

    if not state or not city:
        raise HTTPException(status_code=400, detail="State and City are required")

    # Clean areas
    areas = []
    if payload.areas:
        for a in payload.areas:
            if isinstance(a, str) and a.strip():
                for sub in a.split(","):
                    if sub.strip() and sub.strip() not in areas:
                        areas.append(sub.strip())

    # Check if this city already exists in the same state
    existing = await db.locations.find_one({
        "state": {"$regex": f"^{re.escape(state)}$", "$options": "i"},
        "city": {"$regex": f"^{re.escape(city)}$", "$options": "i"}
    })

    if existing:
        merged_areas = list(existing.get("areas", []))
        for a in areas:
            if a not in merged_areas:
                merged_areas.append(a)
        
        updates = {
            "district": district or existing.get("district", ""),
            "areas": merged_areas,
            "pincode": payload.pincode or existing.get("pincode", ""),
            "tier": payload.tier or existing.get("tier", "Tier 2"),
            "isActive": payload.isActive if payload.isActive is not None else existing.get("isActive", True),
            "updatedAt": datetime.utcnow().isoformat()
        }
        await db.locations.update_one({"id": existing["id"]}, {"$set": updates})
        updated = await db.locations.find_one({"id": existing["id"]})
        return {"ok": True, "location": clean_doc(updated), "message": f"Updated existing location for {city}, {state}"}

    doc = {
        "id": str(uuid.uuid4()),
        "state": state,
        "district": district,
        "city": city,
        "areas": areas,
        "pincode": (payload.pincode or "").strip(),
        "tier": payload.tier or "Tier 2",
        "isActive": True if payload.isActive is None else payload.isActive,
        "isCustom": True,
        "createdAt": datetime.utcnow().isoformat(),
        "updatedAt": datetime.utcnow().isoformat()
    }

    await db.locations.insert_one(doc)
    return {"ok": True, "location": clean_doc(doc), "message": f"Location {city}, {state} created successfully"}

@router.get("/locations/{location_id}")
async def get_admin_location(location_id: str, request: Request):
    await require_admin(request)
    db = get_db()

    loc = await db.locations.find_one({"id": location_id})
    if not loc:
        raise HTTPException(status_code=404, detail="Location not found")
    return {"ok": True, "location": clean_doc(loc)}

@router.put("/locations/{location_id}")
async def update_admin_location(location_id: str, payload: AdminLocationUpdatePayload, request: Request):
    await require_admin(request)
    db = get_db()

    loc = await db.locations.find_one({"id": location_id})
    if not loc:
        raise HTTPException(status_code=404, detail="Location not found")

    updates = {}
    if payload.state is not None and payload.state.strip():
        updates["state"] = payload.state.strip()
    if payload.district is not None:
        updates["district"] = payload.district.strip()
    if payload.city is not None and payload.city.strip():
        updates["city"] = payload.city.strip()
    if payload.areas is not None:
        cleaned_areas = []
        for a in payload.areas:
            if isinstance(a, str):
                for sub in a.split(","):
                    if sub.strip() and sub.strip() not in cleaned_areas:
                        cleaned_areas.append(sub.strip())
        updates["areas"] = cleaned_areas
    if payload.pincode is not None:
        updates["pincode"] = payload.pincode.strip()
    if payload.tier is not None:
        updates["tier"] = payload.tier.strip()
    if payload.isActive is not None:
        updates["isActive"] = payload.isActive

    updates["updatedAt"] = datetime.utcnow().isoformat()

    await db.locations.update_one({"id": location_id}, {"$set": updates})
    updated = await db.locations.find_one({"id": location_id})
    return {"ok": True, "location": clean_doc(updated), "message": "Location updated successfully"}

@router.delete("/locations/{location_id}")
async def delete_admin_location(location_id: str, request: Request):
    await require_admin(request)
    db = get_db()

    res = await db.locations.delete_one({"id": location_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Location not found")
    return {"ok": True, "message": "Location deleted successfully"}

@router.post("/locations/{location_id}/areas")
async def add_area_to_location(location_id: str, payload: AdminAddAreaPayload, request: Request):
    await require_admin(request)
    db = get_db()

    loc = await db.locations.find_one({"id": location_id})
    if not loc:
        raise HTTPException(status_code=404, detail="Location not found")

    area_name = payload.area.strip()
    if not area_name:
        raise HTTPException(status_code=400, detail="Area name cannot be blank")

    current_areas = list(loc.get("areas", []))
    if area_name not in current_areas:
        current_areas.append(area_name)
        await db.locations.update_one(
            {"id": location_id},
            {"$set": {"areas": current_areas, "updatedAt": datetime.utcnow().isoformat()}}
        )

    updated = await db.locations.find_one({"id": location_id})
    return {"ok": True, "location": clean_doc(updated), "message": f"Area '{area_name}' added to {loc.get('city')}"}

@router.delete("/locations/{location_id}/areas/{area_name}")
async def delete_area_from_location(location_id: str, area_name: str, request: Request):
    await require_admin(request)
    db = get_db()

    loc = await db.locations.find_one({"id": location_id})
    if not loc:
        raise HTTPException(status_code=404, detail="Location not found")

    current_areas = [a for a in loc.get("areas", []) if a.lower() != area_name.lower().strip()]
    await db.locations.update_one(
        {"id": location_id},
        {"$set": {"areas": current_areas, "updatedAt": datetime.utcnow().isoformat()}}
    )

    updated = await db.locations.find_one({"id": location_id})
    return {"ok": True, "location": clean_doc(updated), "message": f"Area removed from {loc.get('city')}"}

# ---------------------------------------------------------
# LOCATION SUMMARY ENDPOINT
# ---------------------------------------------------------
@router.get("/locations-summary")
async def get_admin_locations_summary(request: Request):
    await require_admin(request)
    db = get_db()
    
    # Query db.locations
    db_locs = await db.locations.find({}, {"city": 1, "state": 1, "district": 1, "areas": 1, "isActive": 1}).to_list(length=5000)
    providers = await db.providers.find({}, {"city": 1, "state": 1, "district": 1, "area": 1, "status": 1}).to_list(length=5000)
    
    city_map = {}
    for loc in (db_locs or INDIA_LOCATIONS):
        c = loc.get("city")
        s = loc.get("state")
        if c and c not in city_map:
            city_map[c] = {"city": c, "state": s, "count": 0, "active": 0}
            
    for p in providers:
        c = p.get("city") or "Unknown"
        s = p.get("state") or "India"
        if c not in city_map:
            city_map[c] = {"city": c, "state": s, "count": 0, "active": 0}
        city_map[c]["count"] += 1
        if p.get("status") == "active":
            city_map[c]["active"] += 1
            
    cities_list = sorted(list(city_map.values()), key=lambda x: (-x["count"], x["city"]))
    all_states = sorted(list(set(get_all_states()).union(set(l.get("state") for l in db_locs if l.get("state"))).union(set(p.get("state") for p in providers if p.get("state")))))
    
    return {
        "cities": cities_list,
        "totalCities": len(cities_list),
        "states": all_states,
        "totalStates": len(all_states)
    }

# ---------------------------------------------------------
# PLATFORM ANALYTICS & REPORTS
# ---------------------------------------------------------
@router.get("/dashboard")
async def get_admin_dashboard(request: Request):
    await require_admin(request)
    db = get_db()
    
    total_users = await db.users.count_documents({})
    customer_count = await db.users.count_documents({"role": "customer"})
    total_providers = await db.providers.count_documents({})
    total_doctors = await db.providers.count_documents({"categorySlug": "doctor"})
    total_reviews = await db.reviews.count_documents({})
    total_categories = await db.categories.count_documents({})
    total_bookings = await db.bookings.count_documents({})
    total_ads = await db.advertisements.count_documents({})
    active_ads = await db.advertisements.count_documents({"status": "active"})
    
    return {
        "stats": {
            "customers": customer_count,
            "providers": total_providers,
            "doctors": total_doctors,
            "reviews": total_reviews,
            "categories": total_categories,
            "bookings": total_bookings,
            "ads": total_ads,
            "activeAds": active_ads,
            "users": total_users
        }
    }

@router.get("/analytics")
async def get_admin_analytics(request: Request):
    await require_admin(request)
    db = get_db()
    
    total_users = await db.users.count_documents({})
    customer_count = await db.users.count_documents({"role": "customer"})
    provider_user_count = await db.users.count_documents({"role": "provider"})
    admin_count = await db.users.count_documents({"role": {"$in": ["admin", "super_admin", "state_manager", "district_manager"]}})
    
    total_providers = await db.providers.count_documents({})
    active_providers = await db.providers.count_documents({"status": "active"})
    pending_providers = await db.providers.count_documents({"status": "pending"})
    verified_providers = await db.providers.count_documents({"verified": True})
    featured_providers = await db.providers.count_documents({"featured": True})
    
    total_bookings = await db.bookings.count_documents({})
    completed_bookings = await db.bookings.count_documents({"status": "completed"})
    pending_bookings = await db.bookings.count_documents({"status": "pending"})
    
    total_reviews = await db.reviews.count_documents({})
    total_categories = await db.categories.count_documents({})
    total_jobs = await db.jobs.count_documents({})
    
    # Category popularity
    categories = await db.categories.find({}, {"name": 1, "slug": 1, "group": 1}).to_list(length=100)
    cat_stats = []
    for c in categories[:15]:
        p_count = await db.providers.count_documents({"categorySlug": c.get("slug")})
        cat_stats.append({"name": c.get("name"), "slug": c.get("slug"), "group": c.get("group"), "providerCount": p_count})
    cat_stats = sorted(cat_stats, key=lambda x: x["providerCount"], reverse=True)
    
    return {
        "overview": {
            "totalUsers": total_users,
            "customers": customer_count,
            "providerUsers": provider_user_count,
            "adminUsers": admin_count,
            "totalProviders": total_providers,
            "activeProviders": active_providers,
            "pendingProviders": pending_providers,
            "verifiedProviders": verified_providers,
            "featuredProviders": featured_providers,
            "totalBookings": total_bookings,
            "completedBookings": completed_bookings,
            "pendingBookings": pending_bookings,
            "totalReviews": total_reviews,
            "totalCategories": total_categories,
            "totalJobs": total_jobs
        },
        "categoryStats": cat_stats
    }

# ---------------------------------------------------------
# BOOKINGS MANAGEMENT ENDPOINT
# ---------------------------------------------------------
class AdminBookingStatusPatch(BaseModel):
    status: str

@router.get("/bookings")
async def get_admin_bookings(
    request: Request,
    status_filter: Optional[str] = Query(None, alias="status"),
    q: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    skip: int = Query(0, ge=0)
):
    await require_admin(request)
    db = get_db()
    
    query_filter = {}
    if status_filter and status_filter != "all":
        query_filter["status"] = status_filter
        
    if q and q.strip():
        rx = {"$regex": re.escape(q.strip()), "$options": "i"}
        query_filter["$or"] = [
            {"customerName": rx},
            {"customerPhone": rx},
            {"serviceName": rx},
            {"city": rx}
        ]
        
    bookings_cursor = db.bookings.find(query_filter).sort("createdAt", -1).skip(skip).limit(limit)
    items = await bookings_cursor.to_list(length=limit)
    total = await db.bookings.count_documents(query_filter)
    
    return {"items": clean_doc(items), "total": total}

@router.patch("/bookings/{booking_id}/status")
async def update_admin_booking_status(booking_id: str, payload: AdminBookingStatusPatch, request: Request):
    await require_admin(request)
    db = get_db()
    
    await db.bookings.update_one({"id": booking_id}, {"$set": {"status": payload.status, "updatedAt": datetime.utcnow().isoformat()}})
    updated = await db.bookings.find_one({"id": booking_id})
    return {"ok": True, "booking": clean_doc(updated)}

# ---------------------------------------------------------
# CMS & SETTINGS ENDPOINTS
# ---------------------------------------------------------
class AdminSettingsPayload(BaseModel):
    platformName: Optional[str] = "Search2Service"
    supportPhone: Optional[str] = ""
    supportEmail: Optional[str] = ""
    emergencyNotice: Optional[str] = ""
    noticeActive: Optional[bool] = False
    maintenanceMode: Optional[bool] = False

@router.get("/settings")
async def get_admin_settings(request: Request):
    await require_admin(request)
    db = get_db()
    
    settings = await db.system_settings.find_one({"key": "platform_config"})
    if not settings:
        settings = {
            "key": "platform_config",
            "platformName": "Search2Service",
            "supportPhone": "+91 9876543210",
            "supportEmail": "support@search2service.in",
            "emergencyNotice": "24x7 Emergency Services are active across major cities.",
            "noticeActive": True,
            "maintenanceMode": False
        }
    return {"settings": clean_doc(settings)}

@router.post("/settings")
async def save_admin_settings(payload: AdminSettingsPayload, request: Request):
    await require_admin(request)
    db = get_db()
    
    doc = payload.model_dump()
    doc["key"] = "platform_config"
    doc["updatedAt"] = datetime.utcnow().isoformat()
    
    await db.system_settings.update_one({"key": "platform_config"}, {"$set": doc}, upsert=True)
    return {"ok": True, "settings": doc}

# ---------------------------------------------------------
# PAYMENT GATEWAY & BILLING (Premium Plan Checkout)
# ---------------------------------------------------------
class PaymentGatewayPayload(BaseModel):
    provider: Optional[str] = "razorpay"
    keyId: Optional[str] = ""
    keySecret: Optional[str] = None
    enabled: Optional[bool] = False
    premiumAmount: Optional[int] = 499

@router.get("/payment-gateway")
async def get_payment_gateway(request: Request):
    await require_admin(request)
    db = get_db()

    cfg = await db.system_settings.find_one({"key": "payment_gateway_config"})
    if not cfg:
        cfg = {"provider": "razorpay", "keyId": "", "keySecret": "", "enabled": False, "premiumAmount": 499}

    safe = clean_doc(cfg)
    has_secret = bool(safe.get("keySecret"))
    if has_secret:
        safe["keySecret"] = "•" * 8 + safe["keySecret"][-4:]
    safe["hasSecret"] = has_secret
    return {"settings": safe}

@router.post("/payment-gateway")
async def save_payment_gateway(payload: PaymentGatewayPayload, request: Request):
    await require_admin(request)
    db = get_db()

    existing = await db.system_settings.find_one({"key": "payment_gateway_config"})
    doc = {
        "key": "payment_gateway_config",
        "provider": payload.provider or "razorpay",
        "keyId": payload.keyId if payload.keyId is not None else (existing.get("keyId", "") if existing else ""),
        "enabled": bool(payload.enabled),
        "premiumAmount": payload.premiumAmount or 499,
        "updatedAt": datetime.utcnow().isoformat(),
    }
    # Only overwrite the secret if the admin actually typed a new one (avoid clobbering with the masked placeholder)
    if payload.keySecret and "•" not in payload.keySecret:
        doc["keySecret"] = payload.keySecret
    else:
        doc["keySecret"] = existing.get("keySecret", "") if existing else ""

    await db.system_settings.update_one({"key": "payment_gateway_config"}, {"$set": doc}, upsert=True)
    return {"ok": True}

@router.get("/billing")
async def get_billing_transactions(request: Request, limit: int = Query(100, ge=1, le=500)):
    await require_admin(request)
    db = get_db()

    items = await db.billing_transactions.find({}).sort([("createdAt", -1)]).limit(limit).to_list(length=limit)
    total_revenue = sum(t.get("amount", 0) for t in items if t.get("status") == "paid")
    paid_count = sum(1 for t in items if t.get("status") == "paid")
    active_premium = await db.users.count_documents({"plan": "premium"})

    return {
        "items": clean_doc(items),
        "stats": {
            "totalRevenue": total_revenue,
            "paidTransactions": paid_count,
            "activePremiumProviders": active_premium,
        }
    }

# ---------------------------------------------------------
# HERO SLIDER MANAGEMENT ENDPOINTS
# ---------------------------------------------------------
class HeroSlidePayload(BaseModel):
    title: str
    highlightText: Optional[str] = ""
    badge: Optional[str] = ""
    subtitle: Optional[str] = ""
    imageUrl: str
    overlayGradient: Optional[str] = "from-blue-950/90 via-blue-900/85 to-orange-800/80"
    ctaText: Optional[str] = ""
    ctaLink: Optional[str] = ""
    order: Optional[int] = 1
    isActive: Optional[bool] = True

class HeroSlideUpdatePayload(BaseModel):
    title: Optional[str] = None
    highlightText: Optional[str] = None
    badge: Optional[str] = None
    subtitle: Optional[str] = None
    imageUrl: Optional[str] = None
    overlayGradient: Optional[str] = None
    ctaText: Optional[str] = None
    ctaLink: Optional[str] = None
    order: Optional[int] = None
    isActive: Optional[bool] = None

class HeroSlideReorderPayload(BaseModel):
    slideOrders: List[dict]

@router.get("/hero-slides")
async def get_admin_hero_slides(request: Request):
    await require_admin(request)
    db = get_db()
    
    from app.seed_data import ensure_seed
    count = await db.hero_slides.count_documents({})
    if count == 0:
        await ensure_seed()
        
    slides_cursor = db.hero_slides.find({}).sort([("order", 1), ("createdAt", -1)])
    slides = await slides_cursor.to_list(length=100)
    total = await db.hero_slides.count_documents({})
    return {"slides": clean_doc(slides), "total": total}

@router.post("/hero-slides", status_code=201)
async def create_admin_hero_slide(payload: HeroSlidePayload, request: Request):
    await require_admin(request)
    db = get_db()
    
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["createdAt"] = datetime.utcnow().isoformat()
    doc["updatedAt"] = datetime.utcnow().isoformat()
    
    await db.hero_slides.insert_one(doc)
    return {"ok": True, "slide": clean_doc(doc)}

@router.patch("/hero-slides/{slide_id}")
async def update_admin_hero_slide(slide_id: str, payload: HeroSlideUpdatePayload, request: Request):
    await require_admin(request)
    db = get_db()
    
    slide = await db.hero_slides.find_one({"id": slide_id})
    if not slide:
        raise HTTPException(status_code=404, detail="Hero slide not found")
        
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    updates["updatedAt"] = datetime.utcnow().isoformat()
    
    await db.hero_slides.update_one({"id": slide_id}, {"$set": updates})
    updated = await db.hero_slides.find_one({"id": slide_id})
    return {"ok": True, "slide": clean_doc(updated)}

@router.delete("/hero-slides/{slide_id}")
async def delete_admin_hero_slide(slide_id: str, request: Request):
    await require_admin(request)
    db = get_db()
    
    res = await db.hero_slides.delete_one({"id": slide_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Hero slide not found")
        
    return {"ok": True, "message": "Hero slide deleted"}

@router.post("/hero-slides/reorder")
async def reorder_admin_hero_slides(payload: HeroSlideReorderPayload, request: Request):
    await require_admin(request)
    db = get_db()
    
    for item in payload.slideOrders:
        if "id" in item and "order" in item:
            await db.hero_slides.update_one(
                {"id": item["id"]},
                {"$set": {"order": item["order"], "updatedAt": datetime.utcnow().isoformat()}}
            )
            
    return {"ok": True, "message": "Slides reordered"}



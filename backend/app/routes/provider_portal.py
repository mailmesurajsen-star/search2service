import uuid
import urllib.parse
import httpx
import hmac
import hashlib
from datetime import datetime, timedelta
import random
from typing import Optional, List, Any
from fastapi import APIRouter, Request, HTTPException, status
from pydantic import BaseModel
from app.db import get_db, delete_upload, clean_doc
from app.auth import get_current_user
from app.config import EMERGENT_LLM_KEY, GEMINI_MODEL

router = APIRouter(prefix="/api/provider", tags=["provider_portal"])

class TimingsModel(BaseModel):
    days: Optional[str] = "Mon - Sat"
    morning: Optional[str] = "09:00 AM - 01:00 PM"
    evening: Optional[str] = "05:00 PM - 09:00 PM"
    holiday: Optional[str] = "Sunday"
    open: Optional[str] = "09:00 AM"
    close: Optional[str] = "09:00 PM"

class LocationModel(BaseModel):
    lat: Optional[float] = None
    lng: Optional[float] = None
    embedUrl: Optional[str] = None

class BusinessPayload(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    categorySlug: Optional[str] = None
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
    doctorName: Optional[str] = None
    specialization: Optional[str] = None
    qualification: Optional[str] = None
    experience: Optional[Any] = None
    status: Optional[str] = None

class BookingStatusPayload(BaseModel):
    status: str

class PlanPayload(BaseModel):
    plan: str

@router.post("/plan")
async def set_provider_plan(payload: PlanPayload, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="unauthorized")

    if user.get("role") not in ["provider", "admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="provider role required")

    if payload.plan not in ["basic", "premium"]:
        raise HTTPException(status_code=400, detail="Invalid plan — must be 'basic' or 'premium'")

    db = get_db()

    if payload.plan == "premium":
        raise HTTPException(status_code=400, detail="Premium requires a confirmed payment — please complete checkout via /provider/plan/checkout")

    now_iso = datetime.utcnow().isoformat()
    await db.users.update_one({"id": user["id"]}, {"$set": {"plan": payload.plan, "planUpdatedAt": now_iso}})

    biz = await db.providers.find_one({"ownerId": user["id"]})
    if biz:
        await db.providers.update_one(
            {"id": biz["id"]},
            {"$set": {"plan": payload.plan, "premium": payload.plan == "premium", "planUpdatedAt": now_iso}}
        )

    updated_user = await db.users.find_one({"id": user["id"]})
    safe_user = clean_doc(updated_user)
    safe_user.pop("passwordHash", None)
    return {"ok": True, "user": safe_user}

@router.get("/plan/gateway-status")
async def get_plan_gateway_status(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="unauthorized")

    db = get_db()
    gw = await db.system_settings.find_one({"key": "payment_gateway_config"})
    if not gw or not gw.get("enabled") or not gw.get("keyId") or not gw.get("keySecret"):
        return {"enabled": False}

    return {"enabled": True, "amount": gw.get("premiumAmount", 499), "keyId": gw.get("keyId")}

class PlanVerifyPayload(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

@router.post("/plan/checkout")
async def create_plan_checkout(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="unauthorized")
    if user.get("role") not in ["provider", "admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="provider role required")

    db = get_db()
    gw = await db.system_settings.find_one({"key": "payment_gateway_config"})
    if not gw or not gw.get("enabled") or not gw.get("keyId") or not gw.get("keySecret"):
        raise HTTPException(status_code=400, detail="Payment gateway is not configured. Ask admin to set it up under Admin Console > Payment Gateway.")

    amount_inr = int(gw.get("premiumAmount") or 499)
    amount_paise = amount_inr * 100

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(
                "https://api.razorpay.com/v1/orders",
                auth=(gw["keyId"], gw["keySecret"]),
                json={
                    "amount": amount_paise,
                    "currency": "INR",
                    "receipt": f"premium_{user['id']}_{int(datetime.utcnow().timestamp())}",
                    "notes": {"ownerId": user["id"], "plan": "premium"},
                },
            )
    except Exception:
        raise HTTPException(status_code=502, detail="Could not reach payment gateway")

    if resp.status_code not in (200, 201):
        raise HTTPException(status_code=502, detail="Failed to create payment order")

    order = resp.json()

    txn = {
        "id": str(uuid.uuid4()),
        "ownerId": user["id"],
        "ownerName": user.get("name", ""),
        "plan": "premium",
        "amount": amount_inr,
        "currency": "INR",
        "razorpayOrderId": order["id"],
        "status": "created",
        "createdAt": datetime.utcnow().isoformat(),
    }
    await db.billing_transactions.insert_one(txn)

    return {
        "ok": True,
        "orderId": order["id"],
        "amount": amount_paise,
        "currency": "INR",
        "keyId": gw["keyId"],
        "name": "Search2Service Premium",
        "description": "Premium Provider Plan — Monthly",
    }

@router.post("/plan/verify")
async def verify_plan_checkout(payload: PlanVerifyPayload, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="unauthorized")

    db = get_db()
    gw = await db.system_settings.find_one({"key": "payment_gateway_config"})
    if not gw or not gw.get("keySecret"):
        raise HTTPException(status_code=400, detail="Payment gateway is not configured")

    generated_signature = hmac.new(
        gw["keySecret"].encode(),
        f"{payload.razorpay_order_id}|{payload.razorpay_payment_id}".encode(),
        hashlib.sha256,
    ).hexdigest()

    if generated_signature != payload.razorpay_signature:
        await db.billing_transactions.update_one(
            {"razorpayOrderId": payload.razorpay_order_id},
            {"$set": {"status": "failed", "updatedAt": datetime.utcnow().isoformat()}}
        )
        raise HTTPException(status_code=400, detail="Payment verification failed")

    now = datetime.utcnow()
    now_iso = now.isoformat()
    invoice_number = f"INV-{now.strftime('%Y%m%d')}-{payload.razorpay_payment_id[-6:].upper()}"

    await db.billing_transactions.update_one(
        {"razorpayOrderId": payload.razorpay_order_id},
        {"$set": {
            "status": "paid",
            "razorpayPaymentId": payload.razorpay_payment_id,
            "invoiceNumber": invoice_number,
            "paidAt": now_iso,
            "updatedAt": now_iso,
        }}
    )

    # Payment is confirmed and verified at this point — only now do we activate Premium.
    await db.users.update_one({"id": user["id"]}, {"$set": {"plan": "premium", "planUpdatedAt": now_iso}})
    biz = await db.providers.find_one({"ownerId": user["id"]})
    if biz:
        await db.providers.update_one(
            {"id": biz["id"]},
            {"$set": {"plan": "premium", "premium": True, "planUpdatedAt": now_iso}}
        )

    updated_user = await db.users.find_one({"id": user["id"]})
    safe_user = clean_doc(updated_user)
    safe_user.pop("passwordHash", None)

    invoice = await db.billing_transactions.find_one({"razorpayOrderId": payload.razorpay_order_id})
    return {"ok": True, "user": safe_user, "invoice": clean_doc(invoice)}

@router.get("/billing")
async def get_provider_billing(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="unauthorized")

    db = get_db()
    items = await db.billing_transactions.find({"ownerId": user["id"]}).sort([("createdAt", -1)]).to_list(length=100)
    return {"items": clean_doc(items)}

@router.get("/business")
async def get_provider_business(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="unauthorized")
        
    db = get_db()
    biz = await db.providers.find_one({"ownerId": user["id"]})
    return {"business": clean_doc(biz) if biz else None}

@router.api_route("/business", methods=["PUT", "POST"])
async def save_provider_business(payload: BusinessPayload, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="unauthorized")
        
    if user.get("role") not in ["provider", "admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="provider role required")
        
    db = get_db()
    cat = None
    if payload.categorySlug:
        cat = await db.categories.find_one({"slug": payload.categorySlug})
        
    existing = await db.providers.find_one({"ownerId": user["id"]})
    
    b_dict = payload.model_dump(exclude_unset=True)
    
    name = b_dict.get("name", existing.get("name", "") if existing else "")[:120]
    description = b_dict.get("description", existing.get("description", "") if existing else "")[:2000]
    
    # Location handling
    loc_input = b_dict.get("location", {})
    existing_loc = (existing.get("location") if existing else {}) or {}
    
    address = b_dict.get("address", existing.get("address", "") if existing else "")
    embed_url = (
        loc_input.get("embedUrl") or
        existing_loc.get("embedUrl") or
        (f"https://maps.google.com/maps?q={urllib.parse.quote(address)}&output=embed" if address else "")
    )
    
    lat = loc_input.get("lat") if loc_input.get("lat") not in (None, '') else existing_loc.get("lat")
    lng = loc_input.get("lng") if loc_input.get("lng") not in (None, '') else existing_loc.get("lng")
    
    # Timings handling
    t_input = b_dict.get("timings", {})
    existing_timings = (existing.get("timings") if existing else {}) or {}
    timings = {
        "days": t_input.get("days") or existing_timings.get("days") or "Mon - Sat",
        "morning": t_input.get("morning") or existing_timings.get("morning") or "09:00 AM - 01:00 PM",
        "evening": t_input.get("evening") or existing_timings.get("evening") or "05:00 PM - 09:00 PM",
        "holiday": t_input.get("holiday") or existing_timings.get("holiday") or "Sunday",
        "open": t_input.get("open") or existing_timings.get("open") or "09:00 AM",
        "close": t_input.get("close") or existing_timings.get("close") or "09:00 PM",
    }
    
    def parse_int(val, default=0):
        if val is None:
            return default
        try:
            return int(val)
        except (ValueError, TypeError):
            return default

    def parse_float(val, default=None):
        if val is None or val == '':
            return default
        try:
            return float(val)
        except (ValueError, TypeError):
            return default

    phone_val = b_dict.get("phone", existing.get("phone", user.get("phone", "")) if existing else user.get("phone", ""))
    whatsapp_val = b_dict.get("whatsapp", existing.get("whatsapp", phone_val) if existing else phone_val)

    doc = {
        "id": existing.get("id") if existing else str(uuid.uuid4()),
        "ownerId": user["id"],
        "ownerName": user.get("name", ""),
        "name": name,
        "description": description,
        "categoryId": cat.get("id") if cat else (existing.get("categoryId") if existing else None),
        "categoryName": cat.get("name") if cat else (existing.get("categoryName") if existing else None),
        "categorySlug": cat.get("slug") if cat else (existing.get("categorySlug") if existing else None),
        "group": cat.get("group") if cat else (existing.get("group") if existing else None),
        "state": b_dict.get("state", existing.get("state", "") if existing else ""),
        "district": b_dict.get("district", existing.get("district", "") if existing else ""),
        "city": b_dict.get("city", existing.get("city", "") if existing else ""),
        "area": b_dict.get("area", existing.get("area", "") if existing else ""),
        "address": address,
        "phone": phone_val,
        "whatsapp": whatsapp_val,
        "email": b_dict.get("email", existing.get("email", user.get("email", "")) if existing else user.get("email", "")),
        "website": b_dict.get("website", existing.get("website", "") if existing else ""),
        "services": [s for s in b_dict.get("services", existing.get("services", []) if existing else []) if s][:20],
        "priceFrom": parse_int(b_dict.get("priceFrom"), existing.get("priceFrom", 0) if existing else 0),
        "priceTo": parse_int(b_dict.get("priceTo"), existing.get("priceTo", 0) if existing else 0),
        "fees": parse_int(b_dict.get("fees"), existing.get("fees", 0) if existing else 0),
        "offers": [o for o in b_dict.get("offers", existing.get("offers", []) if existing else []) if o][:5],
        "upi": b_dict.get("upi", existing.get("upi", "") if existing else ""),
        "razorpayKeyId": b_dict.get("razorpayKeyId", existing.get("razorpayKeyId", "") if existing else ""),
        "paymentMethods": b_dict.get("paymentMethods", existing.get("paymentMethods", ["UPI", "Cash"]) if existing else ["UPI", "Cash"]),
        "banner": b_dict.get("banner", existing.get("banner", "") if existing else ""),
        "images": b_dict.get("images", existing.get("images", []) if existing else []),
        "timings": timings,
        "location": {
            "lat": parse_float(lat),
            "lng": parse_float(lng),
            "embedUrl": embed_url
        },
        "rating": existing.get("rating", 0) if existing else 0,
        "reviewCount": existing.get("reviewCount", 0) if existing else 0,
        "verified": existing.get("verified", False) if existing else False,
        "premium": existing.get("premium", False) if existing else False,
        "featured": existing.get("featured", False) if existing else False,
        "doctorName": b_dict.get("doctorName", existing.get("doctorName") if existing else None),
        "specialization": b_dict.get("specialization", existing.get("specialization") if existing else None),
        "qualification": b_dict.get("qualification", existing.get("qualification") if existing else None),
        "experience": parse_int(b_dict.get("experience"), existing.get("experience") if existing else None),
        "status": b_dict.get("status", existing.get("status", "active") if existing else "active"),
        "createdAt": existing.get("createdAt", datetime.utcnow().isoformat()) if existing else datetime.utcnow().isoformat(),
        "updatedAt": datetime.utcnow().isoformat(),
    }
    
    await db.providers.update_one({"id": doc["id"]}, {"$set": doc}, upsert=True)
    return {"ok": True, "business": clean_doc(doc)}

@router.get("/media")
async def get_provider_media(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="unauthorized")
        
    db = get_db()
    biz = await db.providers.find_one({"ownerId": user["id"]})
    
    or_filters = [{"ownerId": user["id"]}]
    if biz:
        or_filters.append({"providerId": biz["id"]})
    else:
        or_filters.append({"providerId": "__none__"})
        
    items = await db.media.find({"$or": or_filters}).sort([("createdAt", -1)]).limit(200).to_list(length=200)
    return {"items": clean_doc(items)}

@router.delete("/media/{media_id}")
async def delete_provider_media(media_id: str, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="unauthorized")
        
    db = get_db()
    media = await db.media.find_one({"id": media_id})
    if not media:
        raise HTTPException(status_code=404, detail="not found")
        
    biz = await db.providers.find_one({"ownerId": user["id"]})
    
    if (media.get("ownerId") != user["id"] and 
        media.get("providerId") != (biz.get("id") if biz else None) and 
        user.get("role") != "super_admin"):
        raise HTTPException(status_code=403, detail="forbidden")
        
    file_id = media.get("fileId")
    if file_id:
        try:
            await delete_upload(file_id)
        except Exception:
            pass
            
    await db.media.delete_one({"id": media_id})
    return {"ok": True}

@router.get("/bookings")
async def get_provider_bookings(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="unauthorized")
        
    db = get_db()
    biz = await db.providers.find_one({"ownerId": user["id"]})
    if not biz:
        return {"items": [], "stats": {"total": 0, "pending": 0, "confirmed": 0, "completed": 0, "cancelled": 0}}
        
    items = await db.bookings.find({"providerId": biz["id"]}).sort([("createdAt", -1)]).limit(200).to_list(length=200)
    
    stats = {"total": len(items), "pending": 0, "confirmed": 0, "completed": 0, "cancelled": 0}
    for b in items:
        st = b.get("status", "pending")
        if st in stats:
            stats[st] += 1
            
    return {"items": clean_doc(items), "stats": stats}

@router.patch("/bookings/{booking_id}")
async def update_booking_status(booking_id: str, payload: BookingStatusPayload, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="unauthorized")
        
    if payload.status not in ["pending", "confirmed", "completed", "cancelled"]:
        raise HTTPException(status_code=400, detail="invalid status")
        
    db = get_db()
    await db.bookings.update_one(
        {"id": booking_id},
        {"$set": {"status": payload.status, "updatedAt": datetime.utcnow().isoformat()}}
    )
    return {"ok": True}

@router.get("/analytics")
async def get_provider_analytics(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="unauthorized")
        
    db = get_db()
    biz = await db.providers.find_one({"ownerId": user["id"]})
    if not biz:
        return {"views": 0, "leads": 0, "bookings": 0, "revenue": 0, "reviews": 0, "rating": 0, "series": []}
        
    bookings_count = await db.bookings.count_documents({"providerId": biz["id"]})
    reviews_count = await db.reviews.count_documents({"providerId": biz["id"]})
    
    series = []
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    now = datetime.utcnow()
    for i in range(7):
        day_date = now - timedelta(days=(6 - i))
        series.append({
            "day": day_date.strftime("%a"),
            "views": 10 + random.randint(0, 79),
            "leads": random.randint(0, 11)
        })
        
    views_total = sum(s["views"] for s in series)
    leads_total = sum(s["leads"] for s in series)
    fees_unit = biz.get("fees") or biz.get("priceFrom") or 500
    
    return {
        "views": views_total,
        "leads": leads_total,
        "bookings": bookings_count,
        "reviews": reviews_count,
        "rating": biz.get("rating", 0),
        "revenue": bookings_count * fees_unit,
        "series": series
    }

class AIDescriptionPayload(BaseModel):
    name: Optional[str] = None
    categoryName: Optional[str] = None
    city: Optional[str] = None
    specialization: Optional[str] = None
    qualification: Optional[str] = None
    services: Optional[List[str]] = None

def _fallback_description(p: "AIDescriptionPayload") -> str:
    name = p.name or "Our business"
    category = p.categoryName or "service"
    city = p.city or "your city"
    bits = [f"{name} is a trusted {category} provider serving customers in {city}."]
    if p.specialization:
        bits.append(f"Specialized in {p.specialization}" + (f" with qualification {p.qualification}" if p.qualification else "") + ".")
    if p.services:
        bits.append(f"Services offered include {', '.join(p.services[:6])}.")
    bits.append("Known for quality service, timely delivery, and customer satisfaction. Book now for a hassle-free experience.")
    return " ".join(bits)

@router.post("/ai-description")
async def generate_ai_description(payload: AIDescriptionPayload, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="unauthorized")

    prompt = (
        f"Write a short, appealing business listing description (max 60 words, no markdown, plain text) "
        f"for a local services marketplace in India.\n"
        f"Business name: {payload.name or 'N/A'}\n"
        f"Category: {payload.categoryName or 'N/A'}\n"
        f"City: {payload.city or 'N/A'}\n"
        f"Specialization: {payload.specialization or 'N/A'}\n"
        f"Qualification: {payload.qualification or 'N/A'}\n"
        f"Services: {', '.join(payload.services) if payload.services else 'N/A'}\n"
        f"Tone: professional, trustworthy, customer-friendly."
    )

    description = None
    if EMERGENT_LLM_KEY:
        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                resp = await client.post(
                    "https://api.emergentagent.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {EMERGENT_LLM_KEY}", "Content-Type": "application/json"},
                    json={
                        "model": GEMINI_MODEL,
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": 0.7,
                        "max_tokens": 200
                    }
                )
                if resp.status_code == 200:
                    data = resp.json()
                    description = data["choices"][0]["message"]["content"].strip()
        except Exception as e:
            print(f"AI description generation error: {e}")

    if not description:
        description = _fallback_description(payload)

    return {"ok": True, "description": description}

class JobPayload(BaseModel):
    title: Optional[str] = None
    type: Optional[str] = None
    salary: Optional[str] = None
    experience: Optional[str] = None
    description: Optional[str] = None

@router.get("/jobs")
async def get_provider_jobs(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="unauthorized")

    db = get_db()
    items = await db.jobs.find({"ownerId": user["id"]}).sort([("createdAt", -1)]).to_list(length=100)
    return {"items": clean_doc(items)}

@router.post("/jobs")
async def publish_provider_job(payload: JobPayload, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="unauthorized")

    if not payload.title or not payload.title.strip():
        raise HTTPException(status_code=400, detail="Job title is required")

    db = get_db()
    biz = await db.providers.find_one({"ownerId": user["id"]})
    if not biz:
        raise HTTPException(status_code=400, detail="Complete your business profile before publishing a job")

    job = {
        "id": str(uuid.uuid4()),
        "ownerId": user["id"],
        "providerId": biz["id"],
        "title": payload.title.strip()[:120],
        "company": biz.get("name", ""),
        "city": biz.get("city", ""),
        "state": biz.get("state", ""),
        "salary": (payload.salary or "Not disclosed")[:60],
        "experience": (payload.experience or "Any")[:40],
        "type": payload.type or "Full-time",
        "posted": "Just now",
        "description": (payload.description or "")[:1000],
        "status": "active",
        "createdAt": datetime.utcnow().isoformat(),
    }
    await db.jobs.insert_one(job)
    return {"ok": True, "job": clean_doc(job)}

@router.delete("/jobs/{job_id}")
async def delete_provider_job(job_id: str, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="unauthorized")

    db = get_db()
    job = await db.jobs.find_one({"id": job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.get("ownerId") != user["id"] and user.get("role") not in ["admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="forbidden")

    await db.jobs.delete_one({"id": job_id})
    return {"ok": True}

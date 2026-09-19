import uuid
from datetime import datetime
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.db import get_db, clean_doc
from app.auth import get_current_user
from app.notify import send_email_background

router = APIRouter(prefix="/api", tags=["bookings"])

class CreateBookingPayload(BaseModel):
    providerId: str
    customerName: Optional[str] = None
    customerPhone: Optional[str] = None
    service: Optional[str] = ""
    date: Optional[str] = ""
    slot: Optional[str] = "morning"
    note: Optional[str] = ""

@router.post("/bookings", status_code=201)
async def create_booking(payload: CreateBookingPayload, request: Request):
    if not payload.providerId:
        raise HTTPException(status_code=400, detail="providerId required")
        
    user = await get_current_user(request)
    db = get_db()
    
    doc = {
        "id": str(uuid.uuid4()),
        "providerId": payload.providerId,
        "customerId": user["id"] if user else None,
        "customerName": payload.customerName or (user.get("name") if user else "Guest"),
        "customerPhone": payload.customerPhone or (user.get("phone") if user else ""),
        "service": payload.service or "",
        "date": payload.date or "",
        "slot": payload.slot or "morning",
        "note": (payload.note or "")[:500],
        "status": "pending",
        "createdAt": datetime.utcnow().isoformat()
    }
    
    await db.bookings.insert_one(doc)

    # Email notifications (no-ops unless SMTP is configured & enabled in Admin Console)
    provider = await db.providers.find_one({"id": payload.providerId}) or {}
    biz_name = provider.get("name", "your business")
    when = " ".join(x for x in [doc["date"], f"({doc['slot']})" if doc["slot"] else ""] if x) or "not specified"
    owner = await db.users.find_one({"id": provider.get("ownerId")}) if provider.get("ownerId") else None
    provider_email = provider.get("email") or (owner or {}).get("email", "")
    send_email_background(provider_email, f"New booking request - {biz_name}", [
        f"You have a new booking request for {biz_name}.",
        f"Customer: {doc['customerName']}" + (f" ({doc['customerPhone']})" if doc["customerPhone"] else ""),
        f"Service: {doc['service'] or 'not specified'}",
        f"Preferred time: {when}",
        f"Note: {doc['note']}" if doc["note"] else "Open your Provider Portal > Bookings to confirm or decline.",
    ])
    if user and user.get("email"):
        send_email_background(user["email"], f"Booking request sent - {biz_name}", [
            f"Hi {doc['customerName']}, your booking request with {biz_name} has been received.",
            f"Service: {doc['service'] or 'not specified'}",
            f"Preferred time: {when}",
            "The provider will confirm shortly. You will get another email when the status changes.",
        ])
    return {"ok": True, "booking": clean_doc(doc)}

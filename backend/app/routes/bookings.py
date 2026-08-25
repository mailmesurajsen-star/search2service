import uuid
from datetime import datetime
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.db import get_db, clean_doc
from app.auth import get_current_user

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
    return {"ok": True, "booking": clean_doc(doc)}

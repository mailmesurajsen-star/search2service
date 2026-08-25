import uuid
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.db import get_db

router = APIRouter(prefix="/api", tags=["contact"])

class ContactPayload(BaseModel):
    name: str
    email: str
    subject: Optional[str] = ""
    message: str

@router.post("/contact", status_code=201)
async def submit_contact_message(payload: ContactPayload):
    name = payload.name.strip()
    email = payload.email.strip()
    message = payload.message.strip()

    if not name or not email or not message:
        raise HTTPException(status_code=400, detail="Name, email and message are required")

    db = get_db()
    doc = {
        "id": str(uuid.uuid4()),
        "name": name[:120],
        "email": email[:200],
        "subject": (payload.subject or "General Inquiry").strip()[:200],
        "message": message[:5000],
        "status": "new",
        "createdAt": datetime.utcnow().isoformat(),
    }
    await db.contact_messages.insert_one(doc)
    return {"ok": True}

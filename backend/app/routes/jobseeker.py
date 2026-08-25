import uuid
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from app.db import get_db, clean_doc
from app.auth import get_current_user

router = APIRouter(prefix="/api/jobseeker", tags=["jobseeker"])

class JobSeekerProfilePayload(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    photo: Optional[str] = None
    resumeUrl: Optional[str] = None
    resumeName: Optional[str] = None

@router.get("/profile")
async def get_jobseeker_profile(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="unauthorized")

    db = get_db()
    profile = await db.jobseekers.find_one({"ownerId": user["id"]})
    return {"profile": clean_doc(profile) if profile else None}

@router.api_route("/profile", methods=["PUT", "POST"])
async def save_jobseeker_profile(payload: JobSeekerProfilePayload, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="unauthorized")

    if user.get("role") not in ["jobseeker", "admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="jobseeker role required")

    db = get_db()
    existing = await db.jobseekers.find_one({"ownerId": user["id"]})
    p_dict = payload.model_dump(exclude_unset=True)

    def field(key, fallback=""):
        return p_dict.get(key, existing.get(key, fallback) if existing else fallback)

    doc = {
        "id": existing.get("id") if existing else str(uuid.uuid4()),
        "ownerId": user["id"],
        "name": field("name", user.get("name", "")),
        "address": field("address"),
        "phone": field("phone", user.get("phone", "")),
        "email": field("email", user.get("email", "")),
        "photo": field("photo"),
        "resumeUrl": field("resumeUrl"),
        "resumeName": field("resumeName"),
        "createdAt": existing.get("createdAt", datetime.utcnow().isoformat()) if existing else datetime.utcnow().isoformat(),
        "updatedAt": datetime.utcnow().isoformat(),
    }

    await db.jobseekers.update_one({"id": doc["id"]}, {"$set": doc}, upsert=True)
    return {"ok": True, "profile": clean_doc(doc)}

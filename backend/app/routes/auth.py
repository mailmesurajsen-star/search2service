import uuid
from datetime import datetime
from fastapi import APIRouter, Request, Response, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.db import get_db, clean_doc
from app.auth import (
    hash_password, verify_password, sign_token,
    set_auth_cookie, clear_auth_cookie, get_current_user
)

router = APIRouter(prefix="/api/auth", tags=["auth"])

class RegisterPayload(BaseModel):
    name: str
    email: str
    password: str
    phone: Optional[str] = ""
    role: Optional[str] = "customer"

class LoginPayload(BaseModel):
    email: str
    password: str

@router.post("/register", status_code=201)
async def register(payload: RegisterPayload, response: Response):
    db = get_db()
    email = payload.email.strip().lower()
    password = payload.password
    name = payload.name.strip()
    phone = (payload.phone or "").strip()
    role = (payload.role or "customer").lower()
    
    if role not in ["customer", "provider", "jobseeker"]:
        role = "customer"
        
    if not email or not password or not name:
        raise HTTPException(status_code=400, detail="name, email, password required")
        
    if len(password) < 6:
        raise HTTPException(status_code=400, detail="password must be at least 6 characters")
        
    exists = await db.users.find_one({"email": email})
    if exists:
        raise HTTPException(status_code=409, detail="Email already registered")
        
    pw_hash = hash_password(password)
    user_doc = {
        "id": str(uuid.uuid4()),
        "name": name,
        "email": email,
        "phone": phone,
        "role": role,
        "passwordHash": pw_hash,
        "verified": False,
        "createdAt": datetime.utcnow().isoformat()
    }
    
    await db.users.insert_one(user_doc)
    
    token = sign_token({"uid": user_doc["id"], "role": user_doc["role"], "email": user_doc["email"]})
    set_auth_cookie(response, token)
    
    safe_user = clean_doc(user_doc)
    safe_user.pop("passwordHash", None)
    
    return {"ok": True, "user": safe_user, "token": token}

@router.post("/login")
async def login(payload: LoginPayload, response: Response):
    db = get_db()
    email = payload.email.strip().lower()
    password = payload.password
    
    if not email or not password:
        raise HTTPException(status_code=400, detail="email and password required")
        
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    if not verify_password(password, user.get("passwordHash", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    token = sign_token({"uid": user["id"], "role": user.get("role", "customer"), "email": user["email"]})
    set_auth_cookie(response, token)
    
    safe_user = clean_doc(user)
    safe_user.pop("passwordHash", None)
    
    return {"ok": True, "user": safe_user, "token": token}

@router.get("/me")
async def me(request: Request):
    user = await get_current_user(request)
    return {"user": user}

@router.post("/logout")
async def logout(response: Response):
    clear_auth_cookie(response)
    return {"ok": True}

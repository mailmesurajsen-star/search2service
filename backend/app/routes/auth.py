import uuid
import httpx
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
    email: EmailStr
    password: str
    phone: Optional[str] = ""
    role: Optional[str] = "customer"

class LoginPayload(BaseModel):
    email: EmailStr
    password: str

class GoogleLoginPayload(BaseModel):
    credential: str

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

    # Registration does not auto-authenticate — no auth cookie is set here.
    # The user must explicitly call /api/auth/login with their new credentials.
    safe_user = clean_doc(user_doc)
    safe_user.pop("passwordHash", None)

    return {"ok": True, "user": safe_user}

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

@router.post("/google")
async def google_login(payload: GoogleLoginPayload, response: Response):
    db = get_db()

    settings = await db.system_settings.find_one({"key": "platform_config"})
    if not settings or not settings.get("googleLoginEnabled") or not settings.get("googleClientId"):
        raise HTTPException(status_code=400, detail="Google Login is not enabled")

    # Verify the ID token directly with Google rather than trusting the client —
    # this rejects forged/expired/wrong-audience tokens without needing a Google SDK.
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get("https://oauth2.googleapis.com/tokeninfo", params={"id_token": payload.credential})
    except Exception:
        raise HTTPException(status_code=502, detail="Could not reach Google to verify sign-in")

    if resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid or expired Google sign-in")

    claims = resp.json()
    if claims.get("aud") != settings["googleClientId"]:
        raise HTTPException(status_code=401, detail="Google sign-in was issued for a different app")
    if claims.get("email_verified") not in ("true", True):
        raise HTTPException(status_code=401, detail="Google account email is not verified")

    email = (claims.get("email") or "").strip().lower()
    name = claims.get("name") or email.split("@")[0]
    if not email:
        raise HTTPException(status_code=401, detail="Google did not return an email address")

    user = await db.users.find_one({"email": email})
    if not user:
        user_doc = {
            "id": str(uuid.uuid4()),
            "name": name,
            "email": email,
            "phone": "",
            "role": "customer",
            "passwordHash": hash_password(str(uuid.uuid4())),
            "authProvider": "google",
            "verified": True,
            "createdAt": datetime.utcnow().isoformat()
        }
        await db.users.insert_one(user_doc)
        user = user_doc

    token = sign_token({"uid": user["id"], "role": user.get("role", "customer"), "email": user["email"]})
    set_auth_cookie(response, token)

    safe_user = clean_doc(user)
    safe_user.pop("passwordHash", None)

    return {"ok": True, "user": safe_user}

@router.get("/me")
async def me(request: Request):
    user = await get_current_user(request)
    return {"user": user}

@router.post("/logout")
async def logout(response: Response):
    clear_auth_cookie(response)
    return {"ok": True}

import time
import bcrypt
import jwt
from typing import Optional
from fastapi import Request, Response, HTTPException, status
from app.config import JWT_SECRET, COOKIE_NAME, JWT_EXPIRATION_SECONDS, IS_PRODUCTION
from app.db import get_db, clean_doc

ROLES = ['customer', 'provider', 'admin', 'super_admin', 'state_manager', 'district_manager']

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt(10)
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False

def sign_token(payload: dict) -> str:
    data = payload.copy()
    data['exp'] = int(time.time()) + JWT_EXPIRATION_SECONDS
    return jwt.encode(data, JWT_SECRET, algorithm="HS256")

def verify_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except Exception:
        return None

def set_auth_cookie(response: Response, token: str):
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        max_age=JWT_EXPIRATION_SECONDS,
        httponly=True,
        secure=IS_PRODUCTION,
        samesite="lax",
        path="/"
    )

def clear_auth_cookie(response: Response):
    response.set_cookie(
        key=COOKIE_NAME,
        value="",
        max_age=0,
        httponly=True,
        secure=IS_PRODUCTION,
        samesite="lax",
        path="/"
    )

async def get_current_user(request: Request) -> Optional[dict]:
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        auth_header = request.headers.get("authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:].strip()
    if not token:
        return None
    
    payload = verify_token(token)
    if not payload or not payload.get("uid"):
        return None
    
    database = get_db()
    user = await database.users.find_one({"id": payload["uid"]})
    if not user:
        return None
    
    clean = clean_doc(user)
    clean.pop("passwordHash", None)
    return clean

async def require_current_user(request: Request) -> dict:
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="unauthorized")
    return user

import uuid
import re
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query, Response
from app.db import get_db, save_upload, get_upload, clean_doc

router = APIRouter(prefix="/api", tags=["uploads"])

MAX_UPLOAD = 10 * 1024 * 1024  # 10 MB
ALLOWED_MIME = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'application/pdf': '.pdf',
    'video/mp4': '.mp4',
    'video/webm': '.webm',
    'video/quicktime': '.mov',
}

@router.post("/uploads", status_code=201)
async def upload_file(
    file: UploadFile = File(...),
    ownerId: Optional[str] = Form("anonymous"),
    context: Optional[str] = Form("general"),
    providerId: Optional[str] = Form(None)
):
    if not file:
        raise HTTPException(status_code=400, detail="file is required")
        
    content_type = file.content_type
    if content_type not in ALLOWED_MIME:
        raise HTTPException(status_code=415, detail=f"Unsupported file type: {content_type}")
        
    contents = await file.read()
    file_size = len(contents)
    
    if file_size <= 0 or file_size > MAX_UPLOAD:
        raise HTTPException(status_code=413, detail="File exceeds 10 MB limit")
        
    ext = ALLOWED_MIME[content_type]
    safe_name = f"{uuid.uuid4()}{ext}"
    orig_name = (file.filename or "file")[:200]

    file_id = str(uuid.uuid4())
    await save_upload(
        file_id, safe_name, content_type, contents,
        metadata={
            "originalName": orig_name,
            "declaredMimeType": content_type,
            "size": file_size,
            "ownerId": ownerId or "anonymous",
            "context": context or "general",
            "providerId": providerId if providerId else None,
        },
        created_at=datetime.utcnow().isoformat()
    )

    media = {
        "id": str(uuid.uuid4()),
        "fileId": file_id,
        "originalName": orig_name,
        "mimeType": content_type,
        "size": file_size,
        "url": f"/api/files/{file_id}",
        "ownerId": ownerId or "anonymous",
        "context": context or "general",
        "providerId": providerId if providerId else None,
        "createdAt": datetime.utcnow().isoformat(),
    }
    
    db = get_db()
    await db.media.insert_one(media)
    
    response_data = clean_doc(media)
    response_data["ok"] = True
    return response_data

@router.get("/files/{file_id}")
async def get_file(file_id: str):
    stored = await get_upload(file_id)
    if not stored:
        raise HTTPException(status_code=404, detail="Not found")

    meta_dict = stored.get("metadata", {}) or {}
    orig_name = meta_dict.get("originalName") or stored.get("filename", "file")
    safe_filename = re.sub(r'["\\\r\n]', '_', str(orig_name))
    mime_type = meta_dict.get("declaredMimeType") or stored.get("contentType", "application/octet-stream")

    headers = {
        "Content-Disposition": f'inline; filename="{safe_filename}"',
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff"
    }

    return Response(content=stored["fileData"], media_type=mime_type, headers=headers)

@router.get("/media")
async def get_media_list(
    providerId: Optional[str] = Query(None),
    context: Optional[str] = Query(None),
    ownerId: Optional[str] = Query(None)
):
    query_filter = {}
    if providerId:
        query_filter["providerId"] = providerId
    if context:
        query_filter["context"] = context
    if ownerId:
        query_filter["ownerId"] = ownerId
        
    db = get_db()
    items = await db.media.find(query_filter).sort([("createdAt", -1)]).limit(100).to_list(length=100)
    return {"items": clean_doc(items)}

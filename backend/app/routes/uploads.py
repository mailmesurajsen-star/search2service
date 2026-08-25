import uuid
import re
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query, Response
from fastapi.responses import StreamingResponse
from bson import ObjectId
from app.db import get_db, get_files_bucket, clean_doc

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
    
    bucket = get_files_bucket()
    grid_in = bucket.open_upload_stream(
        safe_name,
        metadata={
            "originalName": orig_name,
            "declaredMimeType": content_type,
            "size": file_size,
            "ownerId": ownerId or "anonymous",
            "context": context or "general",
            "providerId": providerId if providerId else None,
        }
    )
    await grid_in.write(contents)
    await grid_in.close()
    
    file_id = str(grid_in._id)
    
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
    if not ObjectId.is_valid(file_id):
        raise HTTPException(status_code=400, detail="Invalid file id")
        
    obj_id = ObjectId(file_id)
    db = get_db()
    meta = await db["uploads.files"].find_one({"_id": obj_id})
    if not meta:
        raise HTTPException(status_code=404, detail="Not found")
        
    bucket = get_files_bucket()
    grid_out = await bucket.open_download_stream(obj_id)
    
    meta_dict = meta.get("metadata", {}) or {}
    orig_name = meta_dict.get("originalName") or meta.get("filename", "file")
    safe_filename = re.sub(r'["\\\r\n]', '_', str(orig_name))
    mime_type = meta_dict.get("declaredMimeType") or meta.get("contentType", "application/octet-stream")
    
    async def file_chunks():
        while True:
            chunk = await grid_out.readchunk()
            if not chunk:
                break
            yield chunk

    headers = {
        "Content-Length": str(meta.get("length", 0)),
        "Content-Disposition": f'inline; filename="{safe_filename}"',
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff"
    }
    
    return StreamingResponse(file_chunks(), media_type=mime_type, headers=headers)

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

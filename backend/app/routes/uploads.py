import uuid
import re
from datetime import datetime
from io import BytesIO
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query, Response
from PIL import Image, ImageOps
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

# Longest side any stored image is allowed to be — banners, gallery photos, etc.
# get shrunk down to this automatically. Keeps a huge phone-camera photo (portrait
# "long" images included) from bloating the database and slowing down page loads.
MAX_IMAGE_DIMENSION = 1920
PIL_FORMAT = {'image/jpeg': 'JPEG', 'image/png': 'PNG', 'image/webp': 'WEBP'}

def optimize_image(contents: bytes, content_type: str) -> bytes:
    """Resize an oversized image down to MAX_IMAGE_DIMENSION and re-compress it.
    Animated GIFs are left untouched — re-saving would drop the animation.
    Falls back to the original bytes if the image can't be decoded, so a
    corrupt/unusual file never blocks the upload.
    """
    fmt = PIL_FORMAT.get(content_type)
    if not fmt:
        return contents
    try:
        img = Image.open(BytesIO(contents))
        img = ImageOps.exif_transpose(img)  # fix sideways/upside-down phone-camera photos

        resized = False
        if max(img.width, img.height) > MAX_IMAGE_DIMENSION:
            img.thumbnail((MAX_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION), Image.LANCZOS)
            resized = True

        save_kwargs = {'optimize': True}
        if fmt == 'JPEG':
            if img.mode in ('RGBA', 'LA', 'P'):
                # JPEG has no alpha channel — flatten transparency onto white first.
                rgba = img.convert('RGBA')
                bg = Image.new('RGB', rgba.size, (255, 255, 255))
                bg.paste(rgba, mask=rgba.split()[-1])
                img = bg
            save_kwargs['quality'] = 85
        elif fmt == 'WEBP':
            save_kwargs['quality'] = 85

        out = BytesIO()
        img.save(out, format=fmt, **save_kwargs)
        optimized = out.getvalue()

        # Only keep the re-encoded version if it actually helped — a small,
        # already-efficient PNG can occasionally come back slightly larger.
        if resized or len(optimized) < len(contents):
            return optimized
        return contents
    except Exception:
        return contents

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

    if content_type in PIL_FORMAT:
        contents = optimize_image(contents, content_type)
        file_size = len(contents)

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

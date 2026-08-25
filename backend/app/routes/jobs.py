from fastapi import APIRouter, Query
from app.db import get_db, clean_doc

router = APIRouter(prefix="/api", tags=["jobs"])

@router.get("/jobs")
async def get_jobs(
    limit: int = Query(8, ge=1, le=100)
):
    db = get_db()
    items = await db.jobs.find({}).sort([("createdAt", -1)]).limit(limit).to_list(length=limit)
    return {"items": clean_doc(items)}

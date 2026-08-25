import uuid
import json
import httpx
from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.db import get_db, clean_doc
from app.config import EMERGENT_LLM_KEY, GEMINI_MODEL

router = APIRouter(prefix="/api", tags=["chat"])

SYSTEM_PROMPT = """You are Search2Service Assistant, a friendly AI concierge for India's complete local-services marketplace (like Justdial + Urban Company + Practo + IndiaMART).

Your job: help users find trusted local service providers — doctors, electricians, plumbers, beauticians, photographers, hotels, restaurants, tuition, government-form-fillers, and more — across India.

Rules:
- Be concise, warm, and use simple English with occasional Hindi words when it fits.
- When provider records are given in the prompt context, treat them as the SOURCE OF TRUTH — quote real names, cities, ratings, and phone numbers from that list only.
- If no matching provider records were passed, ask one clarifying question (e.g., city, area, budget, urgency) — do NOT invent providers.
- Format provider suggestions as a short readable list with name, category, rating, area/city, and phone/WhatsApp. Include a hint like "Tap the card on the site to book / view details."
- For medical questions: give safe general info and ALWAYS recommend consulting a qualified doctor. For emergencies say "Call 108 (Ambulance) or the nearest hospital immediately."
- Never fabricate prices, availability, or credentials.
- Answer in the same language the user writes in (English or Hindi)."""

class ChatPayload(BaseModel):
    message: str
    sessionId: Optional[str] = None

@router.post("/chat")
async def chat_handler(payload: ChatPayload):
    message = (payload.message or "").strip()[:4000]
    if not message:
        raise HTTPException(status_code=400, detail="message is required")
        
    session_id = payload.sessionId or str(uuid.uuid4())
    db = get_db()
    
    # Ground the model with real provider records from MongoDB
    lower = message.lower()
    all_cats = await db.categories.find({}, {"name": 1, "slug": 1, "group": 1, "_id": 0}).to_list(length=200)
    matched_cats = [
        c for c in all_cats
        if len(c.get("name", "")) >= 3 and c.get("name", "").lower() in lower
    ][:3]
    
    all_providers_cities = await db.providers.find({}, {"city": 1, "state": 1, "_id": 0}).to_list(length=1000)
    unique_cities = list(set(p.get("city") for p in all_providers_cities if p.get("city")))
    matched_city = next((c for c in unique_cities if c.lower() in lower), None)
    
    provider_filter = {}
    if matched_cats:
        provider_filter["categorySlug"] = {"$in": [c["slug"] for c in matched_cats]}
    if matched_city:
        provider_filter["city"] = matched_city
        
    providers = []
    if matched_cats or matched_city:
        providers = await db.providers.find(provider_filter).sort([("premium", -1), ("rating", -1)]).limit(6).to_list(length=6)
        
    if providers:
        prov_summary = []
        for p in providers:
            prov_id = p.get("id")
            prov_summary.append({
                "id": prov_id,
                "name": p.get("name"),
                "category": p.get("categoryName"),
                "area": p.get("area"),
                "city": p.get("city"),
                "state": p.get("state"),
                "rating": p.get("rating"),
                "reviews": p.get("reviewCount"),
                "phone": p.get("phone"),
                "whatsapp": p.get("whatsapp"),
                "fees": p.get("fees"),
                "specialization": p.get("specialization"),
                "url": f"/providers/{prov_id}"
            })
        grounded_context = f"\n\nMATCHED PROVIDER RECORDS (from Search2Service database — cite these):\n{json.dumps(prov_summary, indent=2)}"
    else:
        grounded_context = "\n\nNo provider records matched this turn. If the user is asking for a service, politely ask for clarification (which city, what exactly they need) so we can search our database of 300+ providers across 84 categories in 10 Indian cities."

    # Load prior turns
    prior_turns = await db.chat_messages.find({"sessionId": session_id}).sort([("createdAt", 1)]).limit(20).to_list(length=20)
    
    answer = None
    
    # Try calling LLM if key available
    if EMERGENT_LLM_KEY:
        try:
            # Example call with Gemini or Emergent Universal API
            async with httpx.AsyncClient(timeout=25.0) as client:
                messages_payload = [
                    {"role": "system", "content": SYSTEM_PROMPT + grounded_context}
                ]
                for m in prior_turns:
                    messages_payload.append({"role": m.get("role", "user"), "content": m.get("text", "")})
                messages_payload.append({"role": "user", "content": message})
                
                resp = await client.post(
                    "https://api.emergentagent.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {EMERGENT_LLM_KEY}", "Content-Type": "application/json"},
                    json={
                        "model": GEMINI_MODEL,
                        "messages": messages_payload,
                        "temperature": 0.4,
                        "max_tokens": 800
                    }
                )
                if resp.status_code == 200:
                    data = resp.json()
                    answer = data["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"LLM API Error: {e}")

    # Fallback if no LLM key or API fails
    if not answer:
        if providers:
            prov_list_text = "\n".join([
                f"• **{p.get('name')}** ({p.get('categoryName')}) - ⭐ {p.get('rating')}/5\n  📍 {p.get('area')}, {p.get('city')}\n  📞 {p.get('phone')} | [View Details & Book](/providers/{p.get('id')})"
                for p in providers[:3]
            ])
            answer = f"Namaste! Here are verified top-rated service providers matching your request:\n\n{prov_list_text}\n\nTap on any provider card to view their profile, see real customer reviews, or book directly!"
        else:
            answer = "Namaste! I'd be happy to help you find trusted local services across India. Could you please specify your city or area, and what exact service you need (e.g. Electrician, Doctor, Salon, AC repair, etc.)?"

    # Save turns to database
    now_iso = datetime.utcnow().isoformat()
    await db.chat_messages.insert_many([
        {"id": str(uuid.uuid4()), "sessionId": session_id, "role": "user", "text": message, "createdAt": now_iso},
        {"id": str(uuid.uuid4()), "sessionId": session_id, "role": "assistant", "text": answer, "createdAt": datetime.utcnow().isoformat(), "providerIds": [p.get("id") for p in providers]}
    ])

    return {
        "sessionId": session_id,
        "answer": answer,
        "providers": [
            {
                "id": p.get("id"),
                "name": p.get("name"),
                "category": p.get("categoryName"),
                "city": p.get("city"),
                "area": p.get("area"),
                "rating": p.get("rating"),
                "image": p.get("images", [None])[0] if p.get("images") else None,
                "url": f"/providers/{p.get('id')}"
            }
            for p in providers
        ]
    }

@router.get("/chat/{session_id}")
async def get_chat_history(session_id: str):
    db = get_db()
    msgs = await db.chat_messages.find({"sessionId": session_id}).sort([("createdAt", 1)]).limit(200).to_list(length=200)
    return {"items": clean_doc(msgs)}

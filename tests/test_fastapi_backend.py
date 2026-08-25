import os
import sys
import pytest
import asyncio
from httpx import AsyncClient, ASGITransport

if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.main import app
from app.db import init_db
from app.seed_data import ensure_seed

@pytest.mark.asyncio
async def test_full_backend():
    print("\n" + "="*80)
    print("SEARCH2SERVICE FASTAPI BACKEND VERIFICATION SUITE")
    print("="*80)

    # 1. Startup & Lifespan initialization
    await init_db()
    await ensure_seed()

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        # Health & Stats
        print("\n[1] Testing /api/health and /api/stats...")
        r = await client.get("/api/health")
        assert r.status_code == 200, f"Health failed: {r.text}"
        data = r.json()
        assert data.get("ok") is True
        print(f"  -> Health OK: {data}")

        r = await client.get("/api/stats")
        assert r.status_code == 200
        stats = r.json()
        print(f"  -> Stats: {stats}")
        assert stats.get("categories", 0) > 0
        assert stats.get("providers", 0) > 0

        # Categories & Locations
        print("\n[2] Testing /api/categories and /api/locations...")
        r = await client.get("/api/categories")
        assert r.status_code == 200
        cats = r.json().get("categories", [])
        assert len(cats) >= 50
        print(f"  -> Found {len(cats)} categories")

        r = await client.get("/api/categories?grouped=true")
        assert r.status_code == 200
        groups = r.json().get("groups", {})
        assert "Healthcare" in groups
        assert "Home Services" in groups
        print(f"  -> Found {len(groups)} category groups")

        r = await client.get("/api/locations")
        assert r.status_code == 200
        locs = r.json()
        assert len(locs.get("states", [])) > 0
        print(f"  -> Found {len(locs.get('states', []))} states, {len(locs.get('cities', []))} cities")

        # Providers listing and specialized collections
        print("\n[3] Testing Providers, Doctors, Hotels, Restaurants, Gov-Services, Jobs...")
        r = await client.get("/api/providers?limit=5")
        assert r.status_code == 200
        p_data = r.json()
        assert len(p_data.get("items", [])) > 0
        first_prov_id = p_data["items"][0]["id"]
        print(f"  -> Providers: {p_data.get('total')} total, fetched {len(p_data['items'])}")

        r = await client.get(f"/api/providers/{first_prov_id}")
        assert r.status_code == 200
        detail = r.json()
        assert "provider" in detail and "similar" in detail
        print(f"  -> Provider Detail: {detail['provider']['name']}")

        r = await client.get("/api/doctors?limit=3")
        assert r.status_code == 200
        assert len(r.json().get("items", [])) > 0

        r = await client.get("/api/jobs?limit=5")
        assert r.status_code == 200
        assert len(r.json().get("items", [])) > 0

        # Auth Registration & Login
        print("\n[4] Testing Authentication...")
        reg_payload = {
            "name": "Dr. Verification Test",
            "email": "doctor_test@example.com",
            "password": "password123",
            "phone": "+91 98765 43210",
            "role": "provider"
        }
        r = await client.post("/api/auth/register", json=reg_payload)
        assert r.status_code in [201, 409]
        if r.status_code == 201:
            user_data = r.json()
            token = user_data["token"]
            print(f"  -> Registered provider: {user_data['user']['email']}")
        else:
            # Login if exists
            r = await client.post("/api/auth/login", json={"email": reg_payload["email"], "password": reg_payload["password"]})
            assert r.status_code == 200
            user_data = r.json()
            token = user_data["token"]
            print(f"  -> Logged in provider: {user_data['user']['email']}")

        # Set cookie/header for authenticated requests
        auth_headers = {"Authorization": f"Bearer {token}"}
        r = await client.get("/api/auth/me", headers=auth_headers)
        assert r.status_code == 200
        assert r.json().get("user") is not None
        print(f"  -> Auth Me: {r.json()['user']['name']} ({r.json()['user']['role']})")

        # Provider Business CRUD
        print("\n[5] Testing Provider Portal Business Management...")
        biz_payload = {
            "name": "LifeCare Multispeciality Clinic",
            "categorySlug": "doctor",
            "state": "Maharashtra",
            "city": "Mumbai",
            "area": "Bandra",
            "address": "101, Linking Road, Bandra West, Mumbai",
            "phone": "+91 98765 43210",
            "specialization": "Cardiology",
            "fees": 800,
            "services": ["Cardiology Consultation", "ECG", "Echocardiogram"]
        }
        r = await client.put("/api/provider/business", json=biz_payload, headers=auth_headers)
        assert r.status_code == 200
        biz = r.json().get("business")
        assert biz["name"] == "LifeCare Multispeciality Clinic"
        print(f"  -> Saved Provider Business: {biz['name']} (ID: {biz['id']})")

        # Provider Analytics
        r = await client.get("/api/provider/analytics", headers=auth_headers)
        assert r.status_code == 200
        analytics = r.json()
        print(f"  -> Provider Analytics: views={analytics.get('views')}, leads={analytics.get('leads')}")

        # Bookings Flow
        print("\n[6] Testing Bookings Flow...")
        book_payload = {
            "providerId": biz["id"],
            "customerName": "Rohan Gupta",
            "customerPhone": "+91 91234 56789",
            "service": "Cardiology Consultation",
            "date": "2026-08-30",
            "slot": "morning",
            "note": "First consultation"
        }
        r = await client.post("/api/bookings", json=book_payload)
        assert r.status_code == 201
        booking = r.json().get("booking")
        booking_id = booking["id"]
        print(f"  -> Customer booked service: ID {booking_id}")

        r = await client.get("/api/provider/bookings", headers=auth_headers)
        assert r.status_code == 200
        b_list = r.json()
        assert len(b_list.get("items", [])) > 0
        print(f"  -> Provider received booking, total bookings: {b_list['stats']['total']}")

        r = await client.patch(f"/api/provider/bookings/{booking_id}", json={"status": "confirmed"}, headers=auth_headers)
        assert r.status_code == 200
        print(f"  -> Provider confirmed booking {booking_id}")

        # Reviews Flow
        print("\n[7] Testing Reviews...")
        rev_payload = {
            "providerId": biz["id"],
            "userName": "Rohan Gupta",
            "rating": 5,
            "comment": "Outstanding doctor! Very patient and thorough diagnosis."
        }
        r = await client.post("/api/reviews", json=rev_payload)
        assert r.status_code == 200
        print(f"  -> Review submitted successfully")

        r = await client.get("/api/reviews/recent")
        assert r.status_code == 200
        recent = r.json().get("items", [])
        assert len(recent) > 0
        print(f"  -> Recent reviews count: {len(recent)}")

        # File Upload & Media
        print("\n[8] Testing Media Upload & Streaming...")
        fake_image_bytes = b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00`\x00`\x00\x00\xff\xdb\x00C\x00" + b"\x00"*64
        files = {"file": ("clinic_photo.jpg", fake_image_bytes, "image/jpeg")}
        data = {"ownerId": user_data["user"]["id"], "providerId": biz["id"], "context": "provider-gallery"}
        r = await client.post("/api/uploads", files=files, data=data)
        assert r.status_code == 201
        upload_resp = r.json()
        file_id = upload_resp["fileId"]
        media_id = upload_resp["id"]
        print(f"  -> Uploaded file: ID {file_id}, URL: {upload_resp['url']}")

        # Stream back file
        r = await client.get(f"/api/files/{file_id}")
        assert r.status_code == 200
        assert r.headers.get("content-type") == "image/jpeg"
        print(f"  -> Streamed file back: status {r.status_code}, content-type: {r.headers.get('content-type')}")

        # List provider media
        r = await client.get("/api/provider/media", headers=auth_headers)
        assert r.status_code == 200
        media_list = r.json().get("items", [])
        assert len(media_list) > 0
        print(f"  -> Provider media count: {len(media_list)}")

        # AI Concierge Chat
        print("\n[9] Testing AI Concierge Chat...")
        chat_payload = {
            "message": "I need a doctor in Mumbai for heart checkup",
            "sessionId": "test-session-123"
        }
        r = await client.post("/api/chat", json=chat_payload)
        assert r.status_code == 200
        chat_resp = r.json()
        assert "answer" in chat_resp and "providers" in chat_resp
        print(f"  -> AI Chat Answer:\n     {chat_resp['answer'][:150]}...")

        # Super Admin Flow
        print("\n[10] Testing Super Admin Login & Dashboard...")
        r = await client.post("/api/auth/login", json={"email": "admin@search2service.in", "password": "admin123"})
        assert r.status_code == 200
        admin_token = r.json()["token"]
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        
        r = await client.get("/api/admin/dashboard", headers=admin_headers)
        assert r.status_code == 200
        admin_dash = r.json()
        print(f"  -> Super Admin Dashboard: Providers={admin_dash['stats']['providers']}, Categories={admin_dash['stats']['categories']}")

        print("\n" + "="*80)
        print("ALL PYTHON FASTAPI BACKEND TESTS PASSED SUCCESSFULLY!")
        print("="*80)

if __name__ == "__main__":
    asyncio.run(test_full_backend())

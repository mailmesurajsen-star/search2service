import os
import sys
import asyncio
from httpx import AsyncClient, ASGITransport

if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

try:
    import pytest
except ImportError:
    pytest = None

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.main import app
from app.db import init_db
from app.seed_data import ensure_seed

def maybe_pytest_asyncio(func):
    if pytest and hasattr(pytest, 'mark') and hasattr(pytest.mark, 'asyncio'):
        return pytest.mark.asyncio(func)
    return func

@maybe_pytest_asyncio
async def test_ads_system_end_to_end():
    print("\n" + "="*80)
    print("SEARCH2SERVICE ADS & BANNERS MANAGEMENT TEST SUITE")
    print("="*80)

    # Initialize DB & Seed
    await init_db()
    await ensure_seed()

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        # 1. Test Public /api/ads endpoint
        print("\n[1] Testing Public GET /api/ads...")
        res = await client.get("/api/ads")
        assert res.status_code == 200, f"Failed GET /api/ads: {res.text}"
        data = res.json()
        assert "ads" in data
        assert len(data["ads"]) >= 3
        print(f"  -> Public active ads returned: {len(data['ads'])} ads")

        # Test placement filter
        hp_res = await client.get("/api/ads?placement=homepage_banner")
        assert hp_res.status_code == 200
        hp_ads = hp_res.json().get("ads", [])
        assert len(hp_ads) > 0
        assert all(ad["placement"] == "homepage_banner" for ad in hp_ads)
        print(f"  -> Homepage banner filter returned: {len(hp_ads)} ads")

        target_ad = data["ads"][0]
        ad_id = target_ad["id"]
        initial_impressions = target_ad.get("impressions", 0)
        initial_clicks = target_ad.get("clicks", 0)

        # 2. Test Impression Tracking
        print("\n[2] Testing POST /api/ads/{id}/impression...")
        imp_res = await client.post(f"/api/ads/{ad_id}/impression")
        assert imp_res.status_code == 200, f"Failed impression: {imp_res.text}"
        assert imp_res.json().get("ok") is True
        print(f"  -> Successfully recorded impression for ad ID: {ad_id}")

        # 3. Test Click Tracking
        print("\n[3] Testing POST /api/ads/{id}/click...")
        click_res = await client.post(f"/api/ads/{ad_id}/click")
        assert click_res.status_code == 200, f"Failed click: {click_res.text}"
        assert click_res.json().get("ok") is True
        print(f"  -> Successfully recorded click for ad ID: {ad_id}")

        # 4. Test Admin Auth & Admin GET /api/admin/ads
        print("\n[4] Testing Admin Authentication & Admin GET /api/admin/ads...")
        # Unauthenticated request should fail
        unauth_res = await client.get("/api/admin/ads")
        assert unauth_res.status_code == 401
        print("  -> Unauthenticated request correctly rejected with 401")

        # Admin login
        login_res = await client.post("/api/auth/login", json={
            "email": "admin@search2service.in",
            "password": "admin123"
        })
        assert login_res.status_code == 200, f"Admin login failed: {login_res.text}"
        admin_token = login_res.json()["token"]
        headers = {"Authorization": f"Bearer {admin_token}"}
        print("  -> Admin authenticated successfully")

        # Admin list ads
        admin_ads_res = await client.get("/api/admin/ads", headers=headers)
        assert admin_ads_res.status_code == 200
        admin_data = admin_ads_res.json()
        assert "items" in admin_data and "stats" in admin_data
        stats = admin_data["stats"]
        assert stats["totalAds"] >= 3
        assert stats["totalImpressions"] >= initial_impressions + 1
        assert stats["totalClicks"] >= initial_clicks + 1
        print(f"  -> Admin stats: Total Ads={stats['totalAds']}, Active={stats['activeAds']}, Impressions={stats['totalImpressions']}, Clicks={stats['totalClicks']}, CTR={stats['averageCTR']}%")

        # 5. Test Admin POST /api/admin/ads (Create Ad)
        print("\n[5] Testing Admin POST /api/admin/ads (Create Ad)...")
        create_payload = {
            "title": "🎉 Diwali Special 70% Off Deep Cleaning",
            "subtitle": "Book certified cleaners with 100% eco-friendly chemicals and sanitization.",
            "imageUrl": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",
            "targetUrl": "/search?category=cleaner",
            "placement": "homepage_banner",
            "badge": "Diwali Dhamaka",
            "ctaText": "Book Deep Cleaning",
            "advertiserName": "SparkleClean Co.",
            "advertiserPhone": "+91 98765 99887",
            "gradient": "from-amber-600 via-orange-600 to-red-700",
            "startDate": "2026-01-01",
            "endDate": "2026-12-31",
            "status": "active",
            "priority": 99
        }
        create_res = await client.post("/api/admin/ads", json=create_payload, headers=headers)
        assert create_res.status_code == 201, f"Failed create ad: {create_res.text}"
        new_ad = create_res.json()["ad"]
        created_ad_id = new_ad["id"]
        assert created_ad_id is not None
        assert new_ad["title"] == create_payload["title"]
        assert new_ad["impressions"] == 0
        assert new_ad["clicks"] == 0
        print(f"  -> Created new Ad Campaign: ID={created_ad_id}, Title='{new_ad['title']}'")

        # 6. Test Admin GET /api/admin/ads/{id}
        print("\n[6] Testing Admin GET /api/admin/ads/{id}...")
        get_res = await client.get(f"/api/admin/ads/{created_ad_id}", headers=headers)
        assert get_res.status_code == 200
        assert get_res.json()["ad"]["id"] == created_ad_id
        print("  -> Retrieved ad by ID successfully")

        # 7. Test Admin PUT /api/admin/ads/{id} (Update Ad)
        print("\n[7] Testing Admin PUT /api/admin/ads/{id} (Update Ad)...")
        update_payload = {
            "title": "🎉 Updated Diwali Offer 75% Off",
            "ctaText": "Grab Deal Now",
            "priority": 2
        }
        update_res = await client.put(f"/api/admin/ads/{created_ad_id}", json=update_payload, headers=headers)
        assert update_res.status_code == 200
        updated_ad = update_res.json()["ad"]
        assert updated_ad["title"] == "🎉 Updated Diwali Offer 75% Off"
        assert updated_ad["ctaText"] == "Grab Deal Now"
        assert updated_ad["priority"] == 2
        print(f"  -> Updated ad successfully: Title='{updated_ad['title']}', Priority={updated_ad['priority']}")

        # 8. Test Admin PATCH /api/admin/ads/{id}/status (Toggle Status)
        print("\n[8] Testing Admin PATCH /api/admin/ads/{id}/status...")
        status_res = await client.patch(f"/api/admin/ads/{created_ad_id}/status", json={"status": "inactive"}, headers=headers)
        assert status_res.status_code == 200
        assert status_res.json()["ad"]["status"] == "inactive"
        print("  -> Successfully set status to 'inactive'")

        # 9. Test Admin POST /api/admin/ads/reorder
        print("\n[9] Testing Admin POST /api/admin/ads/reorder...")
        reorder_payload = {
            "adOrders": [
                {"id": created_ad_id, "priority": 1}
            ]
        }
        reorder_res = await client.post("/api/admin/ads/reorder", json=reorder_payload, headers=headers)
        assert reorder_res.status_code == 200
        print("  -> Successfully reordered priorities")

        # 10. Test Admin DELETE /api/admin/ads/{id}
        print("\n[10] Testing Admin DELETE /api/admin/ads/{id}...")
        del_res = await client.delete(f"/api/admin/ads/{created_ad_id}", headers=headers)
        assert del_res.status_code == 200
        assert del_res.json().get("ok") is True
        print(f"  -> Successfully deleted ad ID: {created_ad_id}")

        # Verify deletion
        del_verify = await client.get(f"/api/admin/ads/{created_ad_id}", headers=headers)
        assert del_verify.status_code == 404
        print("  -> Verified deleted ad returns 404")

    print("\n" + "="*80)
    print("ALL ADS & BANNERS TESTS PASSED SUCCESSFULLY!")
    print("="*80)

if __name__ == "__main__":
    asyncio.run(test_ads_system_end_to_end())

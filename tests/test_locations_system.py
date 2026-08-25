import os
import sys
import pytest
from httpx import AsyncClient, ASGITransport

if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.main import app
from app.db import init_db
from app.seed_data import ensure_seed

@pytest.mark.asyncio
async def test_locations_management():
    print("\n" + "="*80)
    print("TESTING ADMIN LOCATION MANAGEMENT SYSTEM")
    print("="*80)

    await init_db()
    await ensure_seed()

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        # 1. Login as Super Admin
        login_res = await client.post("/api/auth/login", json={
            "email": "admin@search2service.in",
            "password": "admin123"
        })
        assert login_res.status_code == 200, f"Login failed: {login_res.text}"
        auth_data = login_res.json()
        token = auth_data.get("token")
        headers = {"Authorization": f"Bearer {token}"}
        print("  -> Logged in as Super Admin successfully")

        # 2. Get Admin Locations List & Stats
        print("\n[1] Testing GET /api/admin/locations...")
        res = await client.get("/api/admin/locations", headers=headers)
        assert res.status_code == 200, f"Failed GET /api/admin/locations: {res.text}"
        loc_data = res.json()
        assert "items" in loc_data
        assert "stats" in loc_data
        assert loc_data["stats"]["totalStates"] >= 28
        assert loc_data["stats"]["totalCities"] >= 40
        print(f"  -> Total States: {loc_data['stats']['totalStates']}, Cities: {loc_data['stats']['totalCities']}, Areas: {loc_data['stats']['totalAreas']}")

        # 3. Create a new custom location
        print("\n[2] Testing POST /api/admin/locations (Create new Location)...")
        new_loc_payload = {
            "state": "Maharashtra",
            "district": "Pune District",
            "city": "Pune Metro Test",
            "areas": ["Kothrud", "Hinjewadi IT Park", "Baner", "Viman Nagar"],
            "pincode": "411001",
            "tier": "Tier 1",
            "isActive": True
        }
        res_create = await client.post("/api/admin/locations", json=new_loc_payload, headers=headers)
        assert res_create.status_code == 201, f"Create location failed: {res_create.text}"
        created_loc = res_create.json().get("location")
        loc_id = created_loc["id"]
        assert created_loc["city"] == "Pune Metro Test"
        assert len(created_loc["areas"]) == 4
        assert created_loc["isCustom"] is True
        print(f"  -> Location created with ID: {loc_id}, City: {created_loc['city']}")

        # 4. Get location by ID
        print("\n[3] Testing GET /api/admin/locations/{id}...")
        res_get = await client.get(f"/api/admin/locations/{loc_id}", headers=headers)
        assert res_get.status_code == 200
        assert res_get.json()["location"]["city"] == "Pune Metro Test"
        print("  -> Fetched location by ID successfully")

        # 5. Add a new area to existing location
        print("\n[4] Testing POST /api/admin/locations/{id}/areas (Add Area)...")
        res_area = await client.post(f"/api/admin/locations/{loc_id}/areas", json={"area": "Shivajinagar"}, headers=headers)
        assert res_area.status_code == 200
        updated_loc = res_area.json().get("location")
        assert "Shivajinagar" in updated_loc["areas"]
        assert len(updated_loc["areas"]) == 5
        print("  -> Area 'Shivajinagar' added. Total areas:", len(updated_loc["areas"]))

        # 6. Verify Public /api/locations includes the newly created city and areas
        print("\n[5] Testing Public GET /api/locations with query filters...")
        res_pub = await client.get("/api/locations?state=Maharashtra&city=Pune%20Metro%20Test")
        assert res_pub.status_code == 200
        pub_data = res_pub.json()
        assert "Pune Metro Test" in pub_data["cities"]
        assert "Kothrud" in pub_data["areas"]
        assert "Shivajinagar" in pub_data["areas"]
        print(f"  -> Public API confirms city '{pub_data['cities']}' and {len(pub_data['areas'])} areas available!")

        # 7. Delete an area from location
        print("\n[6] Testing DELETE /api/admin/locations/{id}/areas/{area_name}...")
        res_del_area = await client.delete(f"/api/admin/locations/{loc_id}/areas/Kothrud", headers=headers)
        assert res_del_area.status_code == 200
        after_del = res_del_area.json().get("location")
        assert "Kothrud" not in after_del["areas"]
        print("  -> Area 'Kothrud' deleted successfully")

        # 8. Update location details
        print("\n[7] Testing PUT /api/admin/locations/{id}...")
        res_update = await client.put(f"/api/admin/locations/{loc_id}", json={
            "tier": "Tier 1 Metro",
            "pincode": "411038"
        }, headers=headers)
        assert res_update.status_code == 200
        assert res_update.json()["location"]["tier"] == "Tier 1 Metro"
        print("  -> Location updated tier and pincode successfully")

        # 9. Delete custom location
        print("\n[8] Testing DELETE /api/admin/locations/{id}...")
        res_del = await client.delete(f"/api/admin/locations/{loc_id}", headers=headers)
        assert res_del.status_code == 200
        print("  -> Location deleted successfully")

        # 10. Verify /api/admin/locations-summary
        print("\n[9] Testing GET /api/admin/locations-summary...")
        res_sum = await client.get("/api/admin/locations-summary", headers=headers)
        assert res_sum.status_code == 200
        sum_data = res_sum.json()
        assert "cities" in sum_data
        assert "states" in sum_data
        print(f"  -> Locations summary OK: {sum_data['totalCities']} cities across {sum_data['totalStates']} states")

    print("\n" + "="*80)
    print("ALL LOCATION MANAGEMENT TESTS PASSED PERFECTLY!")
    print("="*80)

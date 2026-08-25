from fastapi import APIRouter, Query
from typing import Optional
from app.db import get_db, clean_doc

from app.india_locations import (
    INDIA_STATES,
    INDIA_LOCATIONS,
    get_all_states,
    get_cities_by_state,
    get_districts_by_state,
    get_areas_by_city
)

router = APIRouter(prefix="/api", tags=["categories"])

@router.get("/categories")
async def get_categories(
    popular: Optional[str] = Query(None),
    grouped: Optional[str] = Query(None)
):
    db = get_db()
    query_filter = {}
    if popular == "true":
        query_filter["popular"] = True
        
    cats = await db.categories.find(query_filter).to_list(length=500)
    cleaned = clean_doc(cats)
    
    if grouped == "true":
        groups = {}
        for c in cleaned:
            grp = c.get("group", "Other")
            if grp not in groups:
                groups[grp] = []
            groups[grp].append(c)
        return {"groups": groups}
        
    return {"categories": cleaned}

@router.get("/locations")
async def get_locations(
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    city: Optional[str] = Query(None)
):
    db = get_db()
    
    # Fetch locations from db.locations collection
    db_locs = await db.locations.find(
        {"isActive": {"$ne": False}},
        {"state": 1, "district": 1, "city": 1, "areas": 1, "_id": 0}
    ).to_list(length=5000)

    # Fetch existing provider locations to merge
    providers = await db.providers.find(
        {},
        {"state": 1, "district": 1, "city": 1, "area": 1, "_id": 0}
    ).to_list(length=5000)
    
    # 1. States (all 36 States/UTs + db_locs + provider states)
    all_states_set = set(get_all_states())
    for loc in db_locs:
        if loc.get("state"):
            all_states_set.add(loc["state"].strip())
    for p in providers:
        if p.get("state"):
            all_states_set.add(p["state"].strip())
    states = sorted([s for s in all_states_set if s])
    
    # 2. Districts
    districts_set = set(get_districts_by_state(state))
    for loc in db_locs:
        loc_dist = loc.get("district")
        loc_state = loc.get("state")
        if loc_dist and (not state or (loc_state and loc_state.lower() == state.lower().strip())):
            districts_set.add(loc_dist.strip())
    for p in providers:
        p_dist = p.get("district")
        p_state = p.get("state")
        if p_dist and (not state or (p_state and p_state.lower() == state.lower().strip())):
            districts_set.add(p_dist.strip())
    districts = sorted([d for d in districts_set if d])
    
    # 3. Cities
    cities_set = set(get_cities_by_state(state))
    for loc in db_locs:
        loc_city = loc.get("city")
        loc_state = loc.get("state")
        loc_dist = loc.get("district")
        if loc_city:
            match_st = not state or (loc_state and loc_state.lower() == state.lower().strip())
            match_dt = not district or (loc_dist and loc_dist.lower() == district.lower().strip())
            if match_st and match_dt:
                cities_set.add(loc_city.strip())
    for p in providers:
        p_city = p.get("city")
        p_state = p.get("state")
        p_dist = p.get("district")
        if p_city:
            match_st = not state or (p_state and p_state.lower() == state.lower().strip())
            match_dt = not district or (p_dist and p_dist.lower() == district.lower().strip())
            if match_st and match_dt:
                cities_set.add(p_city.strip())
    cities = sorted([c for c in cities_set if c])
    
    # 4. Areas
    areas_set = set(get_areas_by_city(state_name=state, city_name=city, district_name=district))
    for loc in db_locs:
        loc_city = loc.get("city")
        loc_state = loc.get("state")
        loc_dist = loc.get("district")
        if not city or (loc_city and loc_city.lower() == city.lower().strip()):
            match_st = not state or (loc_state and loc_state.lower() == state.lower().strip())
            match_dt = not district or (loc_dist and loc_dist.lower() == district.lower().strip())
            if match_st and match_dt:
                for a in loc.get("areas", []):
                    if a and a.strip():
                        areas_set.add(a.strip())
    for p in providers:
        p_area = p.get("area")
        p_city = p.get("city")
        if p_area and (not city or (p_city and p_city.lower() == city.lower().strip())):
            areas_set.add(p_area.strip())
    areas = sorted([a for a in areas_set if a])
    
    return {
        "states": states,
        "districts": districts,
        "cities": cities,
        "areas": areas
    }

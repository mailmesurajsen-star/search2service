#!/usr/bin/env python3
"""
Backend API Test Suite for Search2Service
Tests all backend endpoints as specified in test_result.md
"""

import requests
import json
import sys
from datetime import datetime

# Read base URL from .env
BASE_URL = "https://unified-services-now.preview.emergentagent.com/api"

def print_test(name, passed, details=""):
    """Print test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status}: {name}")
    if details:
        print(f"   {details}")
    return passed

def test_health():
    """Test GET /api/health"""
    print("\n=== Testing GET /api/health ===")
    try:
        resp = requests.get(f"{BASE_URL}/health", timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            data.get('ok') == True and
            data.get('service') == 'Search2Service API' and
            'ts' in data
        )
        
        return print_test(
            "GET /api/health",
            passed,
            f"Status: {resp.status_code}, Response: {json.dumps(data)}"
        )
    except Exception as e:
        return print_test("GET /api/health", False, f"Error: {str(e)}")

def test_stats():
    """Test GET /api/stats"""
    print("\n=== Testing GET /api/stats ===")
    try:
        resp = requests.get(f"{BASE_URL}/stats", timeout=10)
        data = resp.json()
        
        required_fields = ['providers', 'doctors', 'reviews', 'categories', 'customers']
        has_all_fields = all(field in data for field in required_fields)
        all_non_zero = all(data.get(field, 0) > 0 for field in required_fields)
        
        passed = resp.status_code == 200 and has_all_fields and all_non_zero
        
        return print_test(
            "GET /api/stats",
            passed,
            f"Status: {resp.status_code}, Counts: providers={data.get('providers')}, doctors={data.get('doctors')}, reviews={data.get('reviews')}, categories={data.get('categories')}, customers={data.get('customers')}"
        )
    except Exception as e:
        return print_test("GET /api/stats", False, f"Error: {str(e)}")

def test_categories():
    """Test GET /api/categories with various filters"""
    print("\n=== Testing GET /api/categories ===")
    results = []
    
    # Test basic categories
    try:
        resp = requests.get(f"{BASE_URL}/categories", timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'categories' in data and
            isinstance(data['categories'], list) and
            len(data['categories']) > 0
        )
        
        results.append(print_test(
            "GET /api/categories (basic)",
            passed,
            f"Status: {resp.status_code}, Count: {len(data.get('categories', []))}"
        ))
    except Exception as e:
        results.append(print_test("GET /api/categories (basic)", False, f"Error: {str(e)}"))
    
    # Test popular filter
    try:
        resp = requests.get(f"{BASE_URL}/categories?popular=true", timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'categories' in data and
            isinstance(data['categories'], list)
        )
        
        results.append(print_test(
            "GET /api/categories?popular=true",
            passed,
            f"Status: {resp.status_code}, Popular count: {len(data.get('categories', []))}"
        ))
    except Exception as e:
        results.append(print_test("GET /api/categories?popular=true", False, f"Error: {str(e)}"))
    
    # Test grouped
    try:
        resp = requests.get(f"{BASE_URL}/categories?grouped=true", timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'groups' in data and
            isinstance(data['groups'], dict)
        )
        
        results.append(print_test(
            "GET /api/categories?grouped=true",
            passed,
            f"Status: {resp.status_code}, Groups: {list(data.get('groups', {}).keys())[:3]}..."
        ))
    except Exception as e:
        results.append(print_test("GET /api/categories?grouped=true", False, f"Error: {str(e)}"))
    
    return all(results)

def test_locations():
    """Test GET /api/locations with filters"""
    print("\n=== Testing GET /api/locations ===")
    results = []
    
    # Test basic locations
    try:
        resp = requests.get(f"{BASE_URL}/locations", timeout=10)
        data = resp.json()
        
        required_fields = ['states', 'districts', 'cities', 'areas']
        has_all_fields = all(field in data for field in required_fields)
        all_arrays = all(isinstance(data.get(field), list) for field in required_fields)
        
        passed = resp.status_code == 200 and has_all_fields and all_arrays
        
        results.append(print_test(
            "GET /api/locations (basic)",
            passed,
            f"Status: {resp.status_code}, States: {len(data.get('states', []))}, Cities: {len(data.get('cities', []))}"
        ))
        
        # Store a state for filter test
        test_state = data.get('states', [])[0] if data.get('states') else None
        test_city = data.get('cities', [])[0] if data.get('cities') else None
        
    except Exception as e:
        results.append(print_test("GET /api/locations (basic)", False, f"Error: {str(e)}"))
        return False
    
    # Test state filter
    if test_state:
        try:
            resp = requests.get(f"{BASE_URL}/locations?state={test_state}", timeout=10)
            data = resp.json()
            
            passed = resp.status_code == 200 and 'districts' in data
            
            results.append(print_test(
                f"GET /api/locations?state={test_state}",
                passed,
                f"Status: {resp.status_code}, Districts: {len(data.get('districts', []))}"
            ))
        except Exception as e:
            results.append(print_test(f"GET /api/locations?state={test_state}", False, f"Error: {str(e)}"))
    
    # Test city filter
    if test_city:
        try:
            resp = requests.get(f"{BASE_URL}/locations?city={test_city}", timeout=10)
            data = resp.json()
            
            passed = resp.status_code == 200 and 'areas' in data
            
            results.append(print_test(
                f"GET /api/locations?city={test_city}",
                passed,
                f"Status: {resp.status_code}, Areas: {len(data.get('areas', []))}"
            ))
        except Exception as e:
            results.append(print_test(f"GET /api/locations?city={test_city}", False, f"Error: {str(e)}"))
    
    return all(results)

def test_providers():
    """Test GET /api/providers with various filters"""
    print("\n=== Testing GET /api/providers ===")
    results = []
    
    # Test basic providers
    try:
        resp = requests.get(f"{BASE_URL}/providers", timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'items' in data and
            'total' in data and
            isinstance(data['items'], list) and
            isinstance(data['total'], int) and
            data['total'] > 0
        )
        
        results.append(print_test(
            "GET /api/providers (basic)",
            passed,
            f"Status: {resp.status_code}, Items: {len(data.get('items', []))}, Total: {data.get('total')}"
        ))
    except Exception as e:
        results.append(print_test("GET /api/providers (basic)", False, f"Error: {str(e)}"))
        return False
    
    # Test category filter
    try:
        resp = requests.get(f"{BASE_URL}/providers?category=doctor", timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'items' in data and
            'total' in data
        )
        
        results.append(print_test(
            "GET /api/providers?category=doctor",
            passed,
            f"Status: {resp.status_code}, Doctors: {data.get('total')}"
        ))
    except Exception as e:
        results.append(print_test("GET /api/providers?category=doctor", False, f"Error: {str(e)}"))
    
    # Test group filter
    try:
        resp = requests.get(f"{BASE_URL}/providers?group=Healthcare", timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'items' in data and
            'total' in data
        )
        
        results.append(print_test(
            "GET /api/providers?group=Healthcare",
            passed,
            f"Status: {resp.status_code}, Healthcare providers: {data.get('total')}"
        ))
    except Exception as e:
        results.append(print_test("GET /api/providers?group=Healthcare", False, f"Error: {str(e)}"))
    
    # Test state filter
    try:
        resp = requests.get(f"{BASE_URL}/providers?state=Maharashtra", timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'items' in data and
            'total' in data
        )
        
        results.append(print_test(
            "GET /api/providers?state=Maharashtra",
            passed,
            f"Status: {resp.status_code}, Maharashtra providers: {data.get('total')}"
        ))
    except Exception as e:
        results.append(print_test("GET /api/providers?state=Maharashtra", False, f"Error: {str(e)}"))
    
    # Test city filter
    try:
        resp = requests.get(f"{BASE_URL}/providers?city=Mumbai", timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'items' in data and
            'total' in data
        )
        
        results.append(print_test(
            "GET /api/providers?city=Mumbai",
            passed,
            f"Status: {resp.status_code}, Mumbai providers: {data.get('total')}"
        ))
    except Exception as e:
        results.append(print_test("GET /api/providers?city=Mumbai", False, f"Error: {str(e)}"))
    
    # Test full-text search
    try:
        resp = requests.get(f"{BASE_URL}/providers?q=Doctor", timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'items' in data and
            'total' in data
        )
        
        results.append(print_test(
            "GET /api/providers?q=Doctor",
            passed,
            f"Status: {resp.status_code}, Search results: {data.get('total')}"
        ))
    except Exception as e:
        results.append(print_test("GET /api/providers?q=Doctor", False, f"Error: {str(e)}"))
    
    # Test premium filter
    try:
        resp = requests.get(f"{BASE_URL}/providers?premium=true", timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'items' in data and
            'total' in data
        )
        
        results.append(print_test(
            "GET /api/providers?premium=true",
            passed,
            f"Status: {resp.status_code}, Premium providers: {data.get('total')}"
        ))
    except Exception as e:
        results.append(print_test("GET /api/providers?premium=true", False, f"Error: {str(e)}"))
    
    # Test verified filter
    try:
        resp = requests.get(f"{BASE_URL}/providers?verified=true", timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'items' in data and
            'total' in data
        )
        
        results.append(print_test(
            "GET /api/providers?verified=true",
            passed,
            f"Status: {resp.status_code}, Verified providers: {data.get('total')}"
        ))
    except Exception as e:
        results.append(print_test("GET /api/providers?verified=true", False, f"Error: {str(e)}"))
    
    # Test sort=rating
    try:
        resp = requests.get(f"{BASE_URL}/providers?sort=rating", timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'items' in data and
            len(data['items']) > 0
        )
        
        results.append(print_test(
            "GET /api/providers?sort=rating",
            passed,
            f"Status: {resp.status_code}, First item rating: {data['items'][0].get('rating') if data.get('items') else 'N/A'}"
        ))
    except Exception as e:
        results.append(print_test("GET /api/providers?sort=rating", False, f"Error: {str(e)}"))
    
    # Test sort=newest
    try:
        resp = requests.get(f"{BASE_URL}/providers?sort=newest", timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'items' in data and
            len(data['items']) > 0
        )
        
        results.append(print_test(
            "GET /api/providers?sort=newest",
            passed,
            f"Status: {resp.status_code}, Items: {len(data.get('items', []))}"
        ))
    except Exception as e:
        results.append(print_test("GET /api/providers?sort=newest", False, f"Error: {str(e)}"))
    
    # Test limit
    try:
        resp = requests.get(f"{BASE_URL}/providers?limit=5", timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'items' in data and
            len(data['items']) <= 5
        )
        
        results.append(print_test(
            "GET /api/providers?limit=5",
            passed,
            f"Status: {resp.status_code}, Items returned: {len(data.get('items', []))}"
        ))
    except Exception as e:
        results.append(print_test("GET /api/providers?limit=5", False, f"Error: {str(e)}"))
    
    # Test skip
    try:
        resp = requests.get(f"{BASE_URL}/providers?skip=5", timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'items' in data and
            'total' in data
        )
        
        results.append(print_test(
            "GET /api/providers?skip=5",
            passed,
            f"Status: {resp.status_code}, Items: {len(data.get('items', []))}, Total: {data.get('total')}"
        ))
    except Exception as e:
        results.append(print_test("GET /api/providers?skip=5", False, f"Error: {str(e)}"))
    
    # Test combined filters
    try:
        resp = requests.get(f"{BASE_URL}/providers?category=doctor&city=Mumbai&sort=rating&limit=3", timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'items' in data and
            'total' in data and
            len(data['items']) <= 3
        )
        
        results.append(print_test(
            "GET /api/providers (combined filters)",
            passed,
            f"Status: {resp.status_code}, Items: {len(data.get('items', []))}, Total: {data.get('total')}"
        ))
    except Exception as e:
        results.append(print_test("GET /api/providers (combined filters)", False, f"Error: {str(e)}"))
    
    return all(results)

def test_provider_detail():
    """Test GET /api/providers/:id"""
    print("\n=== Testing GET /api/providers/:id ===")
    results = []
    
    # First get a valid provider ID
    try:
        resp = requests.get(f"{BASE_URL}/providers?limit=1", timeout=10)
        data = resp.json()
        
        if not data.get('items') or len(data['items']) == 0:
            return print_test("GET /api/providers/:id", False, "No providers found to test detail endpoint")
        
        provider_id = data['items'][0].get('id')
        
        if not provider_id:
            return print_test("GET /api/providers/:id", False, "Provider ID not found in response")
        
    except Exception as e:
        return print_test("GET /api/providers/:id (setup)", False, f"Error getting provider ID: {str(e)}")
    
    # Test valid provider detail
    try:
        resp = requests.get(f"{BASE_URL}/providers/{provider_id}", timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'provider' in data and
            'reviews' in data and
            'similar' in data and
            isinstance(data['reviews'], list) and
            isinstance(data['similar'], list)
        )
        
        results.append(print_test(
            f"GET /api/providers/{provider_id}",
            passed,
            f"Status: {resp.status_code}, Reviews: {len(data.get('reviews', []))}, Similar: {len(data.get('similar', []))}"
        ))
    except Exception as e:
        results.append(print_test(f"GET /api/providers/{provider_id}", False, f"Error: {str(e)}"))
    
    # Test invalid provider ID (should return 404)
    try:
        resp = requests.get(f"{BASE_URL}/providers/invalid-id-12345", timeout=10)
        data = resp.json()
        
        passed = resp.status_code == 404 and 'error' in data
        
        results.append(print_test(
            "GET /api/providers/invalid-id (404 test)",
            passed,
            f"Status: {resp.status_code}, Response: {json.dumps(data)}"
        ))
    except Exception as e:
        results.append(print_test("GET /api/providers/invalid-id (404 test)", False, f"Error: {str(e)}"))
    
    return all(results)

def test_doctors():
    """Test GET /api/doctors"""
    print("\n=== Testing GET /api/doctors ===")
    try:
        resp = requests.get(f"{BASE_URL}/doctors", timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'items' in data and
            isinstance(data['items'], list) and
            len(data['items']) > 0
        )
        
        # Verify doctors have specialization
        if passed and data['items']:
            has_specialization = all(item.get('specialization') is not None for item in data['items'])
            if not has_specialization:
                passed = False
                details = f"Status: {resp.status_code}, Items: {len(data['items'])}, ERROR: Some doctors missing specialization"
            else:
                details = f"Status: {resp.status_code}, Items: {len(data['items'])}, All have specialization ✓"
        else:
            details = f"Status: {resp.status_code}, Items: {len(data.get('items', []))}"
        
        return print_test("GET /api/doctors", passed, details)
    except Exception as e:
        return print_test("GET /api/doctors", False, f"Error: {str(e)}")

def test_hotels():
    """Test GET /api/hotels"""
    print("\n=== Testing GET /api/hotels ===")
    try:
        resp = requests.get(f"{BASE_URL}/hotels", timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'items' in data and
            isinstance(data['items'], list)
        )
        
        return print_test(
            "GET /api/hotels",
            passed,
            f"Status: {resp.status_code}, Items: {len(data.get('items', []))}"
        )
    except Exception as e:
        return print_test("GET /api/hotels", False, f"Error: {str(e)}")

def test_restaurants():
    """Test GET /api/restaurants"""
    print("\n=== Testing GET /api/restaurants ===")
    try:
        resp = requests.get(f"{BASE_URL}/restaurants", timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'items' in data and
            isinstance(data['items'], list)
        )
        
        return print_test(
            "GET /api/restaurants",
            passed,
            f"Status: {resp.status_code}, Items: {len(data.get('items', []))}"
        )
    except Exception as e:
        return print_test("GET /api/restaurants", False, f"Error: {str(e)}")

def test_gov_services():
    """Test GET /api/gov-services"""
    print("\n=== Testing GET /api/gov-services ===")
    try:
        resp = requests.get(f"{BASE_URL}/gov-services", timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'items' in data and
            isinstance(data['items'], list)
        )
        
        return print_test(
            "GET /api/gov-services",
            passed,
            f"Status: {resp.status_code}, Items: {len(data.get('items', []))}"
        )
    except Exception as e:
        return print_test("GET /api/gov-services", False, f"Error: {str(e)}")

def test_jobs():
    """Test GET /api/jobs"""
    print("\n=== Testing GET /api/jobs ===")
    try:
        resp = requests.get(f"{BASE_URL}/jobs", timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'items' in data and
            isinstance(data['items'], list) and
            len(data['items']) > 0
        )
        
        return print_test(
            "GET /api/jobs",
            passed,
            f"Status: {resp.status_code}, Items: {len(data.get('items', []))}"
        )
    except Exception as e:
        return print_test("GET /api/jobs", False, f"Error: {str(e)}")

def test_reviews_recent():
    """Test GET /api/reviews/recent"""
    print("\n=== Testing GET /api/reviews/recent ===")
    try:
        resp = requests.get(f"{BASE_URL}/reviews/recent", timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'items' in data and
            isinstance(data['items'], list) and
            len(data['items']) > 0
        )
        
        # Verify reviews have provider info and rating >= 4
        if passed and data['items']:
            has_provider_info = all('provider' in item for item in data['items'])
            all_high_rating = all(item.get('rating', 0) >= 4 for item in data['items'])
            
            if not has_provider_info:
                passed = False
                details = f"Status: {resp.status_code}, Items: {len(data['items'])}, ERROR: Missing provider info"
            elif not all_high_rating:
                passed = False
                details = f"Status: {resp.status_code}, Items: {len(data['items'])}, ERROR: Some ratings < 4"
            else:
                details = f"Status: {resp.status_code}, Items: {len(data['items'])}, All have provider info and rating >= 4 ✓"
        else:
            details = f"Status: {resp.status_code}, Items: {len(data.get('items', []))}"
        
        return print_test("GET /api/reviews/recent", passed, details)
    except Exception as e:
        return print_test("GET /api/reviews/recent", False, f"Error: {str(e)}")

def test_post_review():
    """Test POST /api/reviews and verify rating recalculation"""
    print("\n=== Testing POST /api/reviews ===")
    results = []
    
    # First get a valid provider ID
    try:
        resp = requests.get(f"{BASE_URL}/providers?limit=1", timeout=10)
        data = resp.json()
        
        if not data.get('items') or len(data['items']) == 0:
            return print_test("POST /api/reviews", False, "No providers found to test review creation")
        
        provider_id = data['items'][0].get('id')
        original_rating = data['items'][0].get('rating')
        original_review_count = data['items'][0].get('reviewCount', 0)
        
        if not provider_id:
            return print_test("POST /api/reviews", False, "Provider ID not found in response")
        
    except Exception as e:
        return print_test("POST /api/reviews (setup)", False, f"Error getting provider ID: {str(e)}")
    
    # Create a new review
    try:
        review_payload = {
            "providerId": provider_id,
            "userName": "Rajesh Kumar",
            "rating": 5,
            "comment": "Excellent service! Highly recommended for quality work."
        }
        
        resp = requests.post(f"{BASE_URL}/reviews", json=review_payload, timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            data.get('ok') == True and
            'review' in data and
            data['review'].get('providerId') == provider_id and
            data['review'].get('userName') == "Rajesh Kumar" and
            data['review'].get('rating') == 5
        )
        
        results.append(print_test(
            "POST /api/reviews (create)",
            passed,
            f"Status: {resp.status_code}, Review created: {data.get('review', {}).get('id')}"
        ))
        
    except Exception as e:
        results.append(print_test("POST /api/reviews (create)", False, f"Error: {str(e)}"))
        return False
    
    # Verify the review appears in provider detail and rating was recalculated
    try:
        resp = requests.get(f"{BASE_URL}/providers/{provider_id}", timeout=10)
        data = resp.json()
        
        new_rating = data['provider'].get('rating')
        new_review_count = data['provider'].get('reviewCount', 0)
        
        # Check if review count increased
        count_increased = new_review_count == original_review_count + 1
        
        # Check if the new review appears in the reviews list
        review_found = any(
            r.get('userName') == "Rajesh Kumar" and 
            r.get('comment') == "Excellent service! Highly recommended for quality work."
            for r in data.get('reviews', [])
        )
        
        passed = (
            resp.status_code == 200 and
            count_increased and
            review_found and
            new_rating is not None
        )
        
        results.append(print_test(
            "POST /api/reviews (verification)",
            passed,
            f"Status: {resp.status_code}, Review count: {original_review_count} → {new_review_count}, Rating: {original_rating} → {new_rating}, Review found: {review_found}"
        ))
        
    except Exception as e:
        results.append(print_test("POST /api/reviews (verification)", False, f"Error: {str(e)}"))
    
    return all(results)


def test_chat_basic_message():
    """Test POST /api/chat with message (no sessionId) - expect 200 with sessionId, answer, providers"""
    print("\n=== Testing POST /api/chat - Basic message (no sessionId) ===")
    
    try:
        payload = {"message": "Hello, I need help finding a service"}
        resp = requests.post(f"{BASE_URL}/chat", json=payload, timeout=30)
        
        if resp.status_code != 200:
            return print_test("POST /api/chat - Basic message", False, f"Expected 200, got {resp.status_code}")
        
        data = resp.json()
        
        # Check required fields
        has_session_id = "sessionId" in data and isinstance(data["sessionId"], str) and len(data["sessionId"]) > 0
        has_answer = "answer" in data and isinstance(data["answer"], str) and len(data["answer"]) > 0
        has_providers = "providers" in data and isinstance(data["providers"], list)
        
        # Check sessionId is UUID format (36 chars with dashes)
        session_id = data.get("sessionId", "")
        is_uuid = len(session_id) == 36 and session_id.count("-") == 4
        
        if not is_uuid:
            return print_test("POST /api/chat - Basic message", False, f"sessionId is not a valid UUID: {session_id}")
        
        if not (has_session_id and has_answer and has_providers):
            return print_test("POST /api/chat - Basic message", False, "Missing required fields in response")
        
        return print_test("POST /api/chat - Basic message", True, f"Got sessionId, answer ({len(data['answer'])} chars), providers ({len(data['providers'])} items)")
        
    except Exception as e:
        return print_test("POST /api/chat - Basic message", False, f"Exception: {str(e)}")

def test_chat_missing_message():
    """Test POST /api/chat with missing message - expect 400"""
    print("\n=== Testing POST /api/chat - Missing message ===")
    
    try:
        payload = {}
        resp = requests.post(f"{BASE_URL}/chat", json=payload, timeout=30)
        
        if resp.status_code != 400:
            return print_test("POST /api/chat - Missing message", False, f"Expected 400, got {resp.status_code}")
        
        data = resp.json()
        has_error = "error" in data and "message is required" in data["error"].lower()
        
        if not has_error:
            return print_test("POST /api/chat - Missing message", False, f"Expected 'message is required' error, got: {data}")
        
        return print_test("POST /api/chat - Missing message", True, "Correctly returned 400 with 'message is required'")
        
    except Exception as e:
        return print_test("POST /api/chat - Missing message", False, f"Exception: {str(e)}")

def test_chat_empty_message():
    """Test POST /api/chat with empty message - expect 400"""
    print("\n=== Testing POST /api/chat - Empty message ===")
    
    try:
        payload = {"message": "   "}
        resp = requests.post(f"{BASE_URL}/chat", json=payload, timeout=30)
        
        if resp.status_code != 400:
            return print_test("POST /api/chat - Empty message", False, f"Expected 400, got {resp.status_code}")
        
        data = resp.json()
        has_error = "error" in data
        
        if not has_error:
            return print_test("POST /api/chat - Empty message", False, f"Expected error response, got: {data}")
        
        return print_test("POST /api/chat - Empty message", True, "Correctly returned 400 for empty message")
        
    except Exception as e:
        return print_test("POST /api/chat - Empty message", False, f"Exception: {str(e)}")

def test_chat_grounding_electrician():
    """Test GROUNDING - electrician query should return providers"""
    print("\n=== Testing POST /api/chat - GROUNDING (Electrician) ===")
    
    try:
        payload = {"message": "Suggest an electrician anywhere in India"}
        resp = requests.post(f"{BASE_URL}/chat", json=payload, timeout=30)
        
        if resp.status_code != 200:
            return print_test("POST /api/chat - Grounding (electrician)", False, f"Expected 200, got {resp.status_code}")
        
        data = resp.json()
        providers = data.get("providers", [])
        answer = data.get("answer", "")
        
        if len(providers) == 0:
            return print_test("POST /api/chat - Grounding (electrician)", False, "Expected providers.length > 0, got 0")
        
        # Check provider structure
        if len(providers) > 0:
            first_provider = providers[0]
            required_fields = ["id", "name", "category", "city", "area", "rating", "url"]
            missing_fields = [f for f in required_fields if f not in first_provider]
            
            if missing_fields:
                return print_test("POST /api/chat - Grounding (electrician)", False, f"Provider missing fields: {missing_fields}")
            
            # Check URL format
            if not first_provider["url"].startswith("/providers/"):
                return print_test("POST /api/chat - Grounding (electrician)", False, f"Provider URL should start with /providers/, got: {first_provider['url']}")
        
        # Check if AI answer references at least one provider name (grounding verification)
        provider_names = [p.get("name", "") for p in providers]
        answer_lower = answer.lower()
        referenced_providers = [name for name in provider_names if name.lower() in answer_lower]
        
        if len(referenced_providers) == 0:
            return print_test("POST /api/chat - Grounding (electrician)", False, "AI answer does not reference any provider names from the grounded data")
        
        return print_test("POST /api/chat - Grounding (electrician)", True, f"Got {len(providers)} providers, AI referenced {len(referenced_providers)} provider(s) in answer")
        
    except Exception as e:
        return print_test("POST /api/chat - Grounding (electrician)", False, f"Exception: {str(e)}")

def test_chat_no_match_grounding():
    """Test NO-MATCH grounding - weather query should return empty providers"""
    print("\n=== Testing POST /api/chat - NO-MATCH GROUNDING (Weather) ===")
    
    try:
        payload = {"message": "How is the weather today?"}
        resp = requests.post(f"{BASE_URL}/chat", json=payload, timeout=30)
        
        if resp.status_code != 200:
            return print_test("POST /api/chat - No-match grounding", False, f"Expected 200, got {resp.status_code}")
        
        data = resp.json()
        providers = data.get("providers", [])
        answer = data.get("answer", "")
        
        if len(providers) != 0:
            return print_test("POST /api/chat - No-match grounding", False, f"Expected empty providers array, got {len(providers)} providers")
        
        # AI should ask clarifying question or explain it's for local services
        answer_lower = answer.lower()
        has_clarifying_response = any(keyword in answer_lower for keyword in [
            "service", "help", "looking for", "need", "city", "area", "what", "which", "clarif"
        ])
        
        if not has_clarifying_response:
            return print_test("POST /api/chat - No-match grounding", False, "AI should ask clarifying question or mention services when no match found")
        
        return print_test("POST /api/chat - No-match grounding", True, "Correctly returned empty providers and appropriate response")
        
    except Exception as e:
        return print_test("POST /api/chat - No-match grounding", False, f"Exception: {str(e)}")

def test_chat_multi_turn():
    """Test MULTI-TURN - plumber query followed by follow-up question"""
    print("\n=== Testing POST /api/chat - MULTI-TURN (Plumber + Follow-up) ===")
    
    try:
        import time
        
        # Turn 1: Initial plumber query
        print("   Turn 1: Initial plumber query")
        payload1 = {"message": "Suggest a plumber, top options across India"}
        resp1 = requests.post(f"{BASE_URL}/chat", json=payload1, timeout=30)
        
        if resp1.status_code != 200:
            return print_test("POST /api/chat - Multi-turn", False, f"Turn 1 failed with status {resp1.status_code}")
        
        data1 = resp1.json()
        session_id = data1.get("sessionId")
        providers1 = data1.get("providers", [])
        answer1 = data1.get("answer", "")
        
        if not session_id or len(providers1) == 0:
            return print_test("POST /api/chat - Multi-turn", False, "Turn 1 should return sessionId and providers")
        
        # Extract 2-3 provider names from Turn 1
        provider_names = [p.get("name", "") for p in providers1[:3]]
        print(f"   Provider names from Turn 1: {provider_names}")
        
        # Wait a bit to ensure messages are persisted
        time.sleep(1)
        
        # Turn 2: Follow-up question with sessionId
        print("   Turn 2: Follow-up question with sessionId")
        payload2 = {"sessionId": session_id, "message": "Which one has the best rating?"}
        resp2 = requests.post(f"{BASE_URL}/chat", json=payload2, timeout=30)
        
        if resp2.status_code != 200:
            return print_test("POST /api/chat - Multi-turn", False, f"Turn 2 failed with status {resp2.status_code}")
        
        data2 = resp2.json()
        answer2 = data2.get("answer", "")
        
        # Verify Turn 2 answer references at least one provider name from Turn 1
        answer2_lower = answer2.lower()
        referenced_in_turn2 = [name for name in provider_names if name.lower() in answer2_lower]
        
        # Also check if answer mentions "rating" or specific rating values
        mentions_rating = "rating" in answer2_lower or any(str(i) in answer2 for i in range(1, 6))
        
        if len(referenced_in_turn2) == 0 and not mentions_rating:
            return print_test("POST /api/chat - Multi-turn", False, "Turn 2 should reference provider names or ratings from Turn 1 context")
        
        # Store sessionId for next test
        test_chat_multi_turn.session_id = session_id
        
        return print_test("POST /api/chat - Multi-turn", True, f"Multi-turn context working - Turn 2 referenced {len(referenced_in_turn2)} provider(s) from Turn 1")
        
    except Exception as e:
        return print_test("POST /api/chat - Multi-turn", False, f"Exception: {str(e)}")

def test_chat_get_history():
    """Test GET /api/chat/:sessionId - should return message history"""
    print("\n=== Testing GET /api/chat/:sessionId - Fetch chat history ===")
    
    try:
        # Get sessionId from previous test
        session_id = getattr(test_chat_multi_turn, 'session_id', None)
        
        if not session_id:
            return print_test("GET /api/chat/:sessionId", False, "No sessionId available from multi-turn test")
        
        resp = requests.get(f"{BASE_URL}/chat/{session_id}", timeout=30)
        
        if resp.status_code != 200:
            return print_test("GET /api/chat/:sessionId", False, f"Expected 200, got {resp.status_code}")
        
        data = resp.json()
        items = data.get("items", [])
        
        # Should have 4 messages (2 user + 2 assistant) from multi-turn test
        if len(items) < 4:
            return print_test("GET /api/chat/:sessionId", False, f"Expected at least 4 messages, got {len(items)}")
        
        # Check for ObjectId leaks
        for i, msg in enumerate(items[:4]):
            if "_id" in msg:
                return print_test("GET /api/chat/:sessionId", False, f"Message {i+1} contains _id field (ObjectId leak)")
        
        # Verify alternating user/assistant roles
        roles = [msg.get("role") for msg in items[:4]]
        expected_pattern = ["user", "assistant", "user", "assistant"]
        if roles != expected_pattern:
            return print_test("GET /api/chat/:sessionId", False, f"Expected role pattern {expected_pattern}, got {roles}")
        
        # Check messages are sorted by createdAt ascending
        timestamps = [msg.get("createdAt") for msg in items]
        is_sorted = all(timestamps[i] <= timestamps[i+1] for i in range(len(timestamps)-1))
        
        if not is_sorted:
            return print_test("GET /api/chat/:sessionId", False, "Messages should be sorted by createdAt ascending")
        
        return print_test("GET /api/chat/:sessionId", True, f"Got {len(items)} messages with correct structure and order")
        
    except Exception as e:
        return print_test("GET /api/chat/:sessionId", False, f"Exception: {str(e)}")

def test_chat_no_objectid_leaks():
    """Test to ensure no ObjectId leaks in any chat response"""
    print("\n=== Testing POST /api/chat - No ObjectId leaks ===")
    
    try:
        # Test a simple chat message
        payload = {"message": "Hello"}
        resp = requests.post(f"{BASE_URL}/chat", json=payload, timeout=30)
        
        if resp.status_code != 200:
            return print_test("POST /api/chat - No ObjectId leaks", False, f"Chat request failed with status {resp.status_code}")
        
        data = resp.json()
        
        # Check for _id field in main response
        if "_id" in data:
            return print_test("POST /api/chat - No ObjectId leaks", False, "Response contains _id field")
        
        # Check providers array
        providers = data.get("providers", [])
        for i, provider in enumerate(providers):
            if "_id" in provider:
                return print_test("POST /api/chat - No ObjectId leaks", False, f"Provider {i} contains _id field")
        
        return print_test("POST /api/chat - No ObjectId leaks", True, "No _id fields found in responses")
        
    except Exception as e:
        return print_test("POST /api/chat - No ObjectId leaks", False, f"Exception: {str(e)}")

def main():
    """Run all tests"""
    print("=" * 80)
    print("Search2Service Backend API Test Suite")
    print("=" * 80)
    print(f"Base URL: {BASE_URL}")
    print(f"Test started at: {datetime.now().isoformat()}")
    print("=" * 80)
    
    results = []
    
    # Run all tests
    results.append(("Health Check", test_health()))
    results.append(("Stats", test_stats()))
    results.append(("Categories", test_categories()))
    results.append(("Locations", test_locations()))
    results.append(("Providers Search", test_providers()))
    results.append(("Provider Detail", test_provider_detail()))
    results.append(("Doctors", test_doctors()))
    results.append(("Hotels", test_hotels()))
    results.append(("Restaurants", test_restaurants()))
    results.append(("Government Services", test_gov_services()))
    results.append(("Jobs", test_jobs()))
    results.append(("Recent Reviews", test_reviews_recent()))
    results.append(("Post Review", test_post_review()))
    
    # Chat API tests
    results.append(("Chat - Basic message", test_chat_basic_message()))
    results.append(("Chat - Missing message", test_chat_missing_message()))
    results.append(("Chat - Empty message", test_chat_empty_message()))
    results.append(("Chat - Grounding (electrician)", test_chat_grounding_electrician()))
    results.append(("Chat - No-match grounding", test_chat_no_match_grounding()))
    results.append(("Chat - Multi-turn", test_chat_multi_turn()))
    results.append(("Chat - Get history", test_chat_get_history()))
    results.append(("Chat - No ObjectId leaks", test_chat_no_objectid_leaks()))
    
    # Summary
    print("\n" + "=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {name}")
    
    print("=" * 80)
    print(f"Total: {passed}/{total} tests passed")
    print(f"Test completed at: {datetime.now().isoformat()}")
    print("=" * 80)
    
    # Exit with appropriate code
    sys.exit(0 if passed == total else 1)

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Backend test for Provider Portal APIs
Tests all NEW Provider Portal endpoints with cookie-based authentication
"""

import requests
import json
import random
import string
from datetime import datetime

# Read base URL from .env
BASE_URL = "https://unified-services-now.preview.emergentagent.com"
API_URL = f"{BASE_URL}/api"

def random_email():
    """Generate random email for testing"""
    rand = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"provider_{rand}@example.com"

def test_provider_portal():
    """Test all Provider Portal APIs"""
    print("\n" + "="*80)
    print("PROVIDER PORTAL API TESTING")
    print("="*80)
    
    # Use requests.Session to maintain cookies
    session = requests.Session()
    
    # SETUP: Register a new provider
    print("\n[SETUP] Registering new provider...")
    provider_email = random_email()
    register_data = {
        "name": "Test Provider",
        "email": provider_email,
        "password": "passw0rd",
        "role": "provider"
    }
    
    try:
        resp = session.post(f"{API_URL}/auth/register", json=register_data)
        print(f"Status: {resp.status_code}")
        if resp.status_code != 201:
            print(f"❌ SETUP FAILED: {resp.text}")
            return
        
        data = resp.json()
        print(f"✅ Provider registered: {data['user']['email']}, role: {data['user']['role']}")
        provider_user_id = data['user']['id']
        
        # Verify cookie is set
        if 's2s_token' not in session.cookies:
            print("❌ SETUP FAILED: Cookie s2s_token not set")
            return
        print(f"✅ Cookie s2s_token set")
        
    except Exception as e:
        print(f"❌ SETUP FAILED: {e}")
        return
    
    # TEST 1: GET /api/provider/business (before saving anything) → 200 with {business: null}
    print("\n" + "-"*80)
    print("TEST 1: GET /api/provider/business (before saving) → should return {business: null}")
    print("-"*80)
    try:
        resp = session.get(f"{API_URL}/provider/business")
        print(f"Status: {resp.status_code}")
        data = resp.json()
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if resp.status_code == 200 and data.get('business') is None:
            print("✅ TEST 1 PASSED: Returns {business: null} before saving")
        else:
            print(f"❌ TEST 1 FAILED: Expected 200 with business:null, got {resp.status_code}")
    except Exception as e:
        print(f"❌ TEST 1 FAILED: {e}")
    
    # TEST 2: GET /api/provider/business (WITHOUT cookie) → 401 "unauthorized"
    print("\n" + "-"*80)
    print("TEST 2: GET /api/provider/business (WITHOUT cookie) → should return 401")
    print("-"*80)
    try:
        resp = requests.get(f"{API_URL}/provider/business")  # No session, no cookie
        print(f"Status: {resp.status_code}")
        data = resp.json()
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if resp.status_code == 401 and 'unauthorized' in data.get('error', '').lower():
            print("✅ TEST 2 PASSED: Returns 401 unauthorized without cookie")
        else:
            print(f"❌ TEST 2 FAILED: Expected 401 unauthorized, got {resp.status_code}")
    except Exception as e:
        print(f"❌ TEST 2 FAILED: {e}")
    
    # TEST 3: PUT /api/provider/business with full body
    print("\n" + "-"*80)
    print("TEST 3: PUT /api/provider/business with full body")
    print("-"*80)
    business_data = {
        "name": "My Test Business",
        "description": "We do great work",
        "categorySlug": "electrician",
        "state": "Maharashtra",
        "district": "Mumbai",
        "city": "Mumbai",
        "area": "Bandra",
        "address": "12 MG Road, Bandra West, Mumbai",
        "phone": "+91 98765 43210",
        "whatsapp": "+91 98765 43210",
        "email": "biz@test.com",
        "website": "https://mybiz.in",
        "services": ["Wiring", "Fan Installation", "Repair"],
        "priceFrom": 200,
        "priceTo": 2000,
        "fees": 0,
        "offers": ["Flat 10% off first booking"],
        "upi": "mybiz@paytm",
        "razorpayKeyId": "rzp_test_xxx",
        "paymentMethods": ["UPI", "Cash", "Card"],
        "banner": "",
        "images": [],
        "timings": {
            "days": "Mon - Sat",
            "morning": "9-1",
            "evening": "5-9",
            "holiday": "Sun",
            "open": "9AM",
            "close": "9PM"
        },
        "location": {
            "lat": "19.0760",
            "lng": "72.8777"
        }
    }
    
    try:
        resp = session.put(f"{API_URL}/provider/business", json=business_data)
        print(f"Status: {resp.status_code}")
        data = resp.json()
        print(f"Response keys: {list(data.keys())}")
        
        if resp.status_code == 200 and data.get('ok') and data.get('business'):
            biz = data['business']
            print(f"Business ID: {biz.get('id')}")
            print(f"Owner ID: {biz.get('ownerId')}")
            print(f"Category Name: {biz.get('categoryName')}")
            print(f"Category Group: {biz.get('group')}")
            print(f"Location embedUrl: {biz.get('location', {}).get('embedUrl', '')[:80]}...")
            print(f"Services: {biz.get('services')}")
            print(f"Payment Methods: {biz.get('paymentMethods')}")
            
            # Verify requirements
            errors = []
            
            # business.id is a uuid (36 chars with dashes)
            if not biz.get('id') or len(biz['id']) != 36 or biz['id'].count('-') != 4:
                errors.append("business.id is not a valid UUID")
            
            # business.ownerId matches the user id
            if biz.get('ownerId') != provider_user_id:
                errors.append(f"ownerId mismatch: {biz.get('ownerId')} != {provider_user_id}")
            
            # categoryName is "Electrician" and group is "Home Services"
            if biz.get('categoryName') != 'Electrician':
                errors.append(f"categoryName should be 'Electrician', got '{biz.get('categoryName')}'")
            if biz.get('group') != 'Home Services':
                errors.append(f"group should be 'Home Services', got '{biz.get('group')}'")
            
            # location.embedUrl contains "maps.google.com" and "12 MG Road"
            embed_url = biz.get('location', {}).get('embedUrl', '')
            if 'maps.google.com' not in embed_url:
                errors.append("embedUrl doesn't contain 'maps.google.com'")
            if '12%20MG%20Road' not in embed_url and '12+MG+Road' not in embed_url:
                errors.append("embedUrl doesn't contain encoded '12 MG Road'")
            
            # services and paymentMethods arrays preserved
            if biz.get('services') != ["Wiring", "Fan Installation", "Repair"]:
                errors.append(f"services not preserved: {biz.get('services')}")
            if set(biz.get('paymentMethods', [])) != {"UPI", "Cash", "Card"}:
                errors.append(f"paymentMethods not preserved: {biz.get('paymentMethods')}")
            
            # No _id field, no passwordHash
            if '_id' in biz:
                errors.append("Response contains _id field")
            if 'passwordHash' in biz:
                errors.append("Response contains passwordHash field")
            
            if errors:
                print(f"❌ TEST 3 FAILED:")
                for err in errors:
                    print(f"   - {err}")
            else:
                print("✅ TEST 3 PASSED: Business created with all validations passed")
                # Save business ID for later tests
                business_id = biz['id']
        else:
            print(f"❌ TEST 3 FAILED: Expected 200 with ok:true and business object")
            print(f"Response: {json.dumps(data, indent=2)}")
    except Exception as e:
        print(f"❌ TEST 3 FAILED: {e}")
        import traceback
        traceback.print_exc()
    
    # TEST 4: GET /api/provider/business (again after save) → returns the same business
    print("\n" + "-"*80)
    print("TEST 4: GET /api/provider/business (after save) → should return saved business")
    print("-"*80)
    try:
        resp = session.get(f"{API_URL}/provider/business")
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        if resp.status_code == 200 and data.get('business'):
            biz = data['business']
            print(f"Business ID: {biz.get('id')}")
            print(f"Business Name: {biz.get('name')}")
            
            if biz.get('name') == "My Test Business" and biz.get('id') == business_id:
                print("✅ TEST 4 PASSED: Returns the same business after save")
            else:
                print(f"❌ TEST 4 FAILED: Business data mismatch")
        else:
            print(f"❌ TEST 4 FAILED: Expected 200 with business object")
    except Exception as e:
        print(f"❌ TEST 4 FAILED: {e}")
    
    # TEST 5: PUT /api/provider/business with subset (update) → preserves previous fields
    print("\n" + "-"*80)
    print("TEST 5: PUT /api/provider/business with subset (update)")
    print("-"*80)
    update_data = {
        "name": "My Updated Business",
        "description": "Updated desc"
    }
    
    try:
        resp = session.put(f"{API_URL}/provider/business", json=update_data)
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        if resp.status_code == 200 and data.get('ok') and data.get('business'):
            biz = data['business']
            print(f"Business ID: {biz.get('id')}")
            print(f"Business Name: {biz.get('name')}")
            print(f"Services: {biz.get('services')}")
            print(f"Phone: {biz.get('phone')}")
            
            errors = []
            
            # Same business.id (updated in place, not new record)
            if biz.get('id') != business_id:
                errors.append(f"Business ID changed: {biz.get('id')} != {business_id}")
            
            # Name and description updated
            if biz.get('name') != "My Updated Business":
                errors.append(f"Name not updated: {biz.get('name')}")
            if biz.get('description') != "Updated desc":
                errors.append(f"Description not updated: {biz.get('description')}")
            
            # Previous fields preserved
            if biz.get('services') != ["Wiring", "Fan Installation", "Repair"]:
                errors.append(f"Services not preserved: {biz.get('services')}")
            if biz.get('phone') != "+91 98765 43210":
                errors.append(f"Phone not preserved: {biz.get('phone')}")
            if biz.get('categoryName') != 'Electrician':
                errors.append(f"CategoryName not preserved: {biz.get('categoryName')}")
            
            if errors:
                print(f"❌ TEST 5 FAILED:")
                for err in errors:
                    print(f"   - {err}")
            else:
                print("✅ TEST 5 PASSED: Business updated, previous fields preserved")
        else:
            print(f"❌ TEST 5 FAILED: Expected 200 with ok:true and business object")
    except Exception as e:
        print(f"❌ TEST 5 FAILED: {e}")
    
    # TEST 6: PUT /api/provider/business WITHOUT cookie → 401
    print("\n" + "-"*80)
    print("TEST 6: PUT /api/provider/business WITHOUT cookie → should return 401")
    print("-"*80)
    try:
        resp = requests.put(f"{API_URL}/provider/business", json={"name": "Test"})
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        if resp.status_code == 401 and 'unauthorized' in data.get('error', '').lower():
            print("✅ TEST 6 PASSED: Returns 401 unauthorized without cookie")
        else:
            print(f"❌ TEST 6 FAILED: Expected 401 unauthorized, got {resp.status_code}")
    except Exception as e:
        print(f"❌ TEST 6 FAILED: {e}")
    
    # TEST 7: PUT /api/provider/business as CUSTOMER role → 403
    print("\n" + "-"*80)
    print("TEST 7: PUT /api/provider/business as CUSTOMER role → should return 403")
    print("-"*80)
    try:
        # Register a customer
        customer_session = requests.Session()
        customer_email = random_email()
        customer_data = {
            "name": "Test Customer",
            "email": customer_email,
            "password": "passw0rd",
            "role": "customer"
        }
        resp = customer_session.post(f"{API_URL}/auth/register", json=customer_data)
        if resp.status_code != 201:
            print(f"❌ TEST 7 SETUP FAILED: Could not register customer")
        else:
            print(f"Customer registered: {customer_email}")
            
            # Try to PUT business as customer
            resp = customer_session.put(f"{API_URL}/provider/business", json={"name": "Test"})
            print(f"Status: {resp.status_code}")
            data = resp.json()
            
            if resp.status_code == 403 and 'provider role required' in data.get('error', '').lower():
                print("✅ TEST 7 PASSED: Returns 403 'provider role required' for customer")
            else:
                print(f"❌ TEST 7 FAILED: Expected 403 'provider role required', got {resp.status_code}")
                print(f"Response: {json.dumps(data, indent=2)}")
    except Exception as e:
        print(f"❌ TEST 7 FAILED: {e}")
    
    # TEST 8: POST /api/bookings (create booking)
    print("\n" + "-"*80)
    print("TEST 8: POST /api/bookings (create booking)")
    print("-"*80)
    booking_data = {
        "providerId": business_id,
        "customerName": "John Doe",
        "customerPhone": "+919000000000",
        "service": "Wiring",
        "date": "2026-09-01",
        "slot": "morning",
        "note": "Please come after 10am"
    }
    
    try:
        resp = session.post(f"{API_URL}/bookings", json=booking_data)
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        if resp.status_code == 201 and data.get('ok') and data.get('booking'):
            booking = data['booking']
            print(f"Booking ID: {booking.get('id')}")
            print(f"Provider ID: {booking.get('providerId')}")
            print(f"Customer Name: {booking.get('customerName')}")
            print(f"Status: {booking.get('status')}")
            print(f"Created At: {booking.get('createdAt')}")
            
            errors = []
            
            if not booking.get('id') or len(booking['id']) != 36:
                errors.append("Booking ID is not a valid UUID")
            if booking.get('providerId') != business_id:
                errors.append(f"Provider ID mismatch")
            if booking.get('customerName') != "John Doe":
                errors.append(f"Customer name mismatch")
            if booking.get('status') != 'pending':
                errors.append(f"Status should be 'pending', got '{booking.get('status')}'")
            if not booking.get('createdAt'):
                errors.append("Missing createdAt")
            
            if errors:
                print(f"❌ TEST 8 FAILED:")
                for err in errors:
                    print(f"   - {err}")
            else:
                print("✅ TEST 8 PASSED: Booking created successfully")
                booking_id = booking['id']
        else:
            print(f"❌ TEST 8 FAILED: Expected 201 with ok:true and booking object")
            print(f"Response: {json.dumps(data, indent=2)}")
    except Exception as e:
        print(f"❌ TEST 8 FAILED: {e}")
    
    # TEST 9: POST /api/bookings WITHOUT providerId → 400
    print("\n" + "-"*80)
    print("TEST 9: POST /api/bookings WITHOUT providerId → should return 400")
    print("-"*80)
    try:
        resp = session.post(f"{API_URL}/bookings", json={"customerName": "Test"})
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        if resp.status_code == 400 and 'providerid required' in data.get('error', '').lower():
            print("✅ TEST 9 PASSED: Returns 400 'providerId required'")
        else:
            print(f"❌ TEST 9 FAILED: Expected 400 'providerId required', got {resp.status_code}")
            print(f"Response: {json.dumps(data, indent=2)}")
    except Exception as e:
        print(f"❌ TEST 9 FAILED: {e}")
    
    # TEST 10: GET /api/provider/bookings (as provider)
    print("\n" + "-"*80)
    print("TEST 10: GET /api/provider/bookings (as provider)")
    print("-"*80)
    try:
        resp = session.get(f"{API_URL}/provider/bookings")
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        if resp.status_code == 200 and 'items' in data and 'stats' in data:
            items = data['items']
            stats = data['stats']
            print(f"Total bookings: {len(items)}")
            print(f"Stats: {json.dumps(stats, indent=2)}")
            
            errors = []
            
            if stats.get('total', 0) < 1:
                errors.append("Stats total should be >= 1")
            if stats.get('pending', 0) < 1:
                errors.append("Stats pending should be >= 1")
            if len(items) < 1:
                errors.append("Items should have at least 1 booking")
            
            if errors:
                print(f"❌ TEST 10 FAILED:")
                for err in errors:
                    print(f"   - {err}")
            else:
                print("✅ TEST 10 PASSED: Returns bookings with stats")
        else:
            print(f"❌ TEST 10 FAILED: Expected 200 with items and stats")
            print(f"Response: {json.dumps(data, indent=2)}")
    except Exception as e:
        print(f"❌ TEST 10 FAILED: {e}")
    
    # TEST 11: PATCH /api/provider/bookings/:id with status:"confirmed"
    print("\n" + "-"*80)
    print("TEST 11: PATCH /api/provider/bookings/:id with status:'confirmed'")
    print("-"*80)
    try:
        resp = session.patch(f"{API_URL}/provider/bookings/{booking_id}", json={"status": "confirmed"})
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        if resp.status_code == 200 and data.get('ok'):
            print("✅ Booking status updated to 'confirmed'")
            
            # Verify by fetching bookings again
            resp = session.get(f"{API_URL}/provider/bookings")
            data = resp.json()
            items = data.get('items', [])
            stats = data.get('stats', {})
            
            confirmed_booking = next((b for b in items if b['id'] == booking_id), None)
            if confirmed_booking and confirmed_booking['status'] == 'confirmed':
                print(f"✅ TEST 11 PASSED: Booking status confirmed in GET /api/provider/bookings")
                print(f"Stats: confirmed={stats.get('confirmed', 0)}, pending={stats.get('pending', 0)}")
            else:
                print(f"❌ TEST 11 FAILED: Booking status not updated")
        else:
            print(f"❌ TEST 11 FAILED: Expected 200 with ok:true")
            print(f"Response: {json.dumps(data, indent=2)}")
    except Exception as e:
        print(f"❌ TEST 11 FAILED: {e}")
    
    # TEST 12: PATCH /api/provider/bookings/:id with invalid status → 400
    print("\n" + "-"*80)
    print("TEST 12: PATCH /api/provider/bookings/:id with invalid status → should return 400")
    print("-"*80)
    try:
        resp = session.patch(f"{API_URL}/provider/bookings/{booking_id}", json={"status": "invalid"})
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        if resp.status_code == 400 and 'invalid status' in data.get('error', '').lower():
            print("✅ TEST 12 PASSED: Returns 400 'invalid status'")
        else:
            print(f"❌ TEST 12 FAILED: Expected 400 'invalid status', got {resp.status_code}")
            print(f"Response: {json.dumps(data, indent=2)}")
    except Exception as e:
        print(f"❌ TEST 12 FAILED: {e}")
    
    # TEST 13: GET /api/provider/analytics
    print("\n" + "-"*80)
    print("TEST 13: GET /api/provider/analytics")
    print("-"*80)
    try:
        resp = session.get(f"{API_URL}/provider/analytics")
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        if resp.status_code == 200:
            print(f"Views: {data.get('views')}")
            print(f"Leads: {data.get('leads')}")
            print(f"Bookings: {data.get('bookings')}")
            print(f"Revenue: {data.get('revenue')}")
            print(f"Reviews: {data.get('reviews')}")
            print(f"Rating: {data.get('rating')}")
            print(f"Series length: {len(data.get('series', []))}")
            
            errors = []
            
            if 'views' not in data or 'leads' not in data or 'bookings' not in data:
                errors.append("Missing required fields")
            if 'series' not in data or len(data['series']) != 7:
                errors.append(f"Series should have 7 items, got {len(data.get('series', []))}")
            if data.get('bookings', 0) < 1:
                errors.append("Bookings should be >= 1")
            
            # Check series structure
            if data.get('series'):
                first_item = data['series'][0]
                if 'day' not in first_item or 'views' not in first_item or 'leads' not in first_item:
                    errors.append("Series items missing required fields (day, views, leads)")
            
            if errors:
                print(f"❌ TEST 13 FAILED:")
                for err in errors:
                    print(f"   - {err}")
            else:
                print("✅ TEST 13 PASSED: Analytics returned with correct structure")
        else:
            print(f"❌ TEST 13 FAILED: Expected 200")
            print(f"Response: {json.dumps(data, indent=2)}")
    except Exception as e:
        print(f"❌ TEST 13 FAILED: {e}")
    
    # TEST 14: GET /api/provider/media (initially empty, then upload and check)
    print("\n" + "-"*80)
    print("TEST 14: GET /api/provider/media and POST /api/uploads")
    print("-"*80)
    try:
        # First check media (may be empty)
        resp = session.get(f"{API_URL}/provider/media")
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        if resp.status_code == 200 and 'items' in data:
            print(f"✅ GET /api/provider/media works, items: {len(data['items'])}")
            initial_count = len(data['items'])
            
            # Upload a test image
            print("\nUploading test image...")
            # Create a minimal JPEG (1x1 red pixel)
            jpeg_bytes = bytes([
                0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
                0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
                0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
                0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
                0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
                0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
                0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
                0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01,
                0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x03, 0xFF, 0xC4, 0x00, 0x14, 0x10, 0x01, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3F, 0x00,
                0x37, 0xFF, 0xD9
            ])
            
            files = {'file': ('test.jpg', jpeg_bytes, 'image/jpeg')}
            form_data = {
                'context': 'provider-gallery',
                'providerId': business_id,
                'ownerId': provider_user_id
            }
            
            resp = session.post(f"{API_URL}/uploads", files=files, data=form_data)
            print(f"Upload status: {resp.status_code}")
            
            if resp.status_code == 201:
                upload_data = resp.json()
                print(f"✅ File uploaded: {upload_data.get('id')}")
                media_id = upload_data.get('id')
                file_id = upload_data.get('fileId')
                
                # Check media again
                resp = session.get(f"{API_URL}/provider/media")
                data = resp.json()
                new_count = len(data['items'])
                
                if new_count > initial_count:
                    print(f"✅ TEST 14 PASSED: Media count increased from {initial_count} to {new_count}")
                else:
                    print(f"❌ TEST 14 FAILED: Media count did not increase")
            else:
                print(f"❌ Upload failed: {resp.status_code}")
                print(f"Response: {resp.text}")
        else:
            print(f"❌ TEST 14 FAILED: Expected 200 with items array")
    except Exception as e:
        print(f"❌ TEST 14 FAILED: {e}")
        import traceback
        traceback.print_exc()
    
    # TEST 15: DELETE /api/provider/media/:id
    print("\n" + "-"*80)
    print("TEST 15: DELETE /api/provider/media/:id")
    print("-"*80)
    try:
        if 'media_id' in locals() and 'file_id' in locals():
            resp = session.delete(f"{API_URL}/provider/media/{media_id}")
            print(f"Status: {resp.status_code}")
            data = resp.json()
            
            if resp.status_code == 200 and data.get('ok'):
                print(f"✅ Media deleted")
                
                # Verify file is removed from GridFS
                resp = session.get(f"{API_URL}/files/{file_id}")
                print(f"GET /api/files/{file_id} status: {resp.status_code}")
                
                if resp.status_code == 404:
                    print("✅ TEST 15 PASSED: File removed from GridFS (404)")
                else:
                    print(f"❌ TEST 15 FAILED: File still accessible (expected 404, got {resp.status_code})")
            else:
                print(f"❌ TEST 15 FAILED: Expected 200 with ok:true")
        else:
            print("⚠️  TEST 15 SKIPPED: No media uploaded in TEST 14")
    except Exception as e:
        print(f"❌ TEST 15 FAILED: {e}")
    
    # TEST 16: DELETE /api/provider/media/:id with fake/other's mediaId → 404 or 403
    print("\n" + "-"*80)
    print("TEST 16: DELETE /api/provider/media/:id with fake mediaId → should return 404")
    print("-"*80)
    try:
        fake_media_id = "00000000-0000-0000-0000-000000000000"
        resp = session.delete(f"{API_URL}/provider/media/{fake_media_id}")
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        if resp.status_code in [404, 403]:
            print(f"✅ TEST 16 PASSED: Returns {resp.status_code} for fake mediaId")
        else:
            print(f"❌ TEST 16 FAILED: Expected 404 or 403, got {resp.status_code}")
    except Exception as e:
        print(f"❌ TEST 16 FAILED: {e}")
    
    # TEST 17: Verify /api/locations no longer includes empty strings
    print("\n" + "-"*80)
    print("TEST 17: GET /api/locations (verify no empty strings)")
    print("-"*80)
    try:
        resp = session.get(f"{API_URL}/locations")
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        if resp.status_code == 200:
            states = data.get('states', [])
            districts = data.get('districts', [])
            cities = data.get('cities', [])
            areas = data.get('areas', [])
            
            print(f"States: {len(states)}")
            print(f"Districts: {len(districts)}")
            print(f"Cities: {len(cities)}")
            print(f"Areas: {len(areas)}")
            
            errors = []
            
            if '' in states:
                errors.append("States array contains empty string")
            if '' in districts:
                errors.append("Districts array contains empty string")
            if '' in cities:
                errors.append("Cities array contains empty string")
            if '' in areas:
                errors.append("Areas array contains empty string")
            
            if errors:
                print(f"❌ TEST 17 FAILED:")
                for err in errors:
                    print(f"   - {err}")
            else:
                print("✅ TEST 17 PASSED: No empty strings in locations arrays")
        else:
            print(f"❌ TEST 17 FAILED: Expected 200")
    except Exception as e:
        print(f"❌ TEST 17 FAILED: {e}")
    
    print("\n" + "="*80)
    print("PROVIDER PORTAL API TESTING COMPLETE")
    print("="*80)

if __name__ == "__main__":
    test_provider_portal()

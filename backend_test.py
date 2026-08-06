#!/usr/bin/env python3
"""
Backend API Test Suite for Search2Service Auth Endpoints
Tests JWT + bcrypt + httpOnly cookie authentication
"""

import requests
import json
import time
import random
import string
from typing import Dict, Any

# Base URL from .env
BASE_URL = "https://unified-services-now.preview.emergentagent.com/api"

def random_email():
    """Generate random email for testing"""
    rand = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"test_{rand}@example.com"

def print_test(name: str, passed: bool, details: str = ""):
    """Print test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status}: {name}")
    if details:
        print(f"  Details: {details}")
    if not passed:
        print()

def check_no_sensitive_fields(data: Dict[str, Any], test_name: str) -> bool:
    """Check that response doesn't contain passwordHash or _id"""
    user = data.get('user', {})
    if user and ('passwordHash' in user or '_id' in user):
        print_test(test_name, False, f"Response contains sensitive fields: {list(user.keys())}")
        return False
    return True

def test_auth_endpoints():
    """Test all auth endpoints"""
    print("\n" + "="*80)
    print("TESTING AUTH ENDPOINTS")
    print("="*80 + "\n")
    
    # Test 1: POST /api/auth/register - Valid customer signup
    print("\n--- Test 1: Valid Customer Registration ---")
    session = requests.Session()
    customer_email = random_email()
    customer_data = {
        "name": "Test Customer",
        "email": customer_email,
        "password": "secret123",
        "role": "customer"
    }
    
    try:
        resp = session.post(f"{BASE_URL}/auth/register", json=customer_data)
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        passed = (
            resp.status_code == 201 and
            data.get('ok') == True and
            'user' in data and
            'token' in data and
            data['user'].get('role') == 'customer' and
            data['user'].get('email') == customer_email and
            data['user'].get('name') == "Test Customer" and
            data['user'].get('verified') == False and
            'id' in data['user'] and
            'createdAt' in data['user'] and
            'passwordHash' not in data['user'] and
            '_id' not in data['user']
        )
        
        cookie_set = 's2s_token' in session.cookies
        print_test("Customer registration returns 201 with correct structure", passed, 
                   f"Role: {data.get('user', {}).get('role')}, Cookie set: {cookie_set}")
        
        if not cookie_set:
            print_test("Cookie s2s_token is set", False, "Cookie not found in response")
        else:
            print_test("Cookie s2s_token is set", True)
        
        customer_token = data.get('token')
        
    except Exception as e:
        print_test("Customer registration", False, f"Exception: {str(e)}")
        return
    
    # Test 2: POST /api/auth/register - Valid provider signup
    print("\n--- Test 2: Valid Provider Registration ---")
    session2 = requests.Session()
    provider_email = random_email()
    provider_data = {
        "name": "Test Provider",
        "email": provider_email,
        "password": "provider123",
        "phone": "9876543210",
        "role": "provider"
    }
    
    try:
        resp = session2.post(f"{BASE_URL}/auth/register", json=provider_data)
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        passed = (
            resp.status_code == 201 and
            data.get('ok') == True and
            data['user'].get('role') == 'provider' and
            data['user'].get('phone') == "9876543210" and
            'passwordHash' not in data['user'] and
            '_id' not in data['user']
        )
        
        print_test("Provider registration with role='provider'", passed, 
                   f"Role: {data.get('user', {}).get('role')}")
        
    except Exception as e:
        print_test("Provider registration", False, f"Exception: {str(e)}")
    
    # Test 3: POST /api/auth/register - Attempt role:"admin" (should coerce to customer)
    print("\n--- Test 3: Admin Role Coercion ---")
    session3 = requests.Session()
    admin_email = random_email()
    admin_data = {
        "name": "Test Admin Attempt",
        "email": admin_email,
        "password": "admin123",
        "role": "admin"
    }
    
    try:
        resp = session3.post(f"{BASE_URL}/auth/register", json=admin_data)
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        passed = (
            resp.status_code == 201 and
            data['user'].get('role') == 'customer'  # Should be coerced to customer
        )
        
        print_test("Admin role coerced to customer", passed, 
                   f"Requested: admin, Got: {data.get('user', {}).get('role')}")
        
    except Exception as e:
        print_test("Admin role coercion", False, f"Exception: {str(e)}")
    
    # Test 4: POST /api/auth/register - super_admin role coercion
    print("\n--- Test 4: Super Admin Role Coercion ---")
    session4 = requests.Session()
    superadmin_email = random_email()
    superadmin_data = {
        "name": "Test Super Admin Attempt",
        "email": superadmin_email,
        "password": "superadmin123",
        "role": "super_admin"
    }
    
    try:
        resp = session4.post(f"{BASE_URL}/auth/register", json=superadmin_data)
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        passed = (
            resp.status_code == 201 and
            data['user'].get('role') == 'customer'  # Should be coerced to customer
        )
        
        print_test("Super_admin role coerced to customer", passed, 
                   f"Requested: super_admin, Got: {data.get('user', {}).get('role')}")
        
    except Exception as e:
        print_test("Super_admin role coercion", False, f"Exception: {str(e)}")
    
    # Test 5: POST /api/auth/register - Missing name field
    print("\n--- Test 5: Missing Name Field ---")
    try:
        resp = requests.post(f"{BASE_URL}/auth/register", json={
            "email": random_email(),
            "password": "test123"
        })
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        passed = resp.status_code == 400
        print_test("Missing name returns 400", passed, f"Error: {data.get('error')}")
        
    except Exception as e:
        print_test("Missing name validation", False, f"Exception: {str(e)}")
    
    # Test 6: POST /api/auth/register - Password too short
    print("\n--- Test 6: Password Too Short ---")
    try:
        resp = requests.post(f"{BASE_URL}/auth/register", json={
            "name": "Test User",
            "email": random_email(),
            "password": "12345"  # Only 5 chars
        })
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        passed = resp.status_code == 400
        print_test("Password < 6 chars returns 400", passed, f"Error: {data.get('error')}")
        
    except Exception as e:
        print_test("Password length validation", False, f"Exception: {str(e)}")
    
    # Test 7: POST /api/auth/register - Duplicate email
    print("\n--- Test 7: Duplicate Email ---")
    try:
        resp = requests.post(f"{BASE_URL}/auth/register", json=customer_data)
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        passed = (
            resp.status_code == 409 and
            'Email already registered' in data.get('error', '')
        )
        print_test("Duplicate email returns 409", passed, f"Error: {data.get('error')}")
        
    except Exception as e:
        print_test("Duplicate email validation", False, f"Exception: {str(e)}")
    
    # Test 8: POST /api/auth/login - Correct credentials
    print("\n--- Test 8: Login with Correct Credentials ---")
    login_session = requests.Session()
    try:
        resp = login_session.post(f"{BASE_URL}/auth/login", json={
            "email": customer_email,
            "password": "secret123"
        })
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            data.get('ok') == True and
            'user' in data and
            'token' in data and
            data['user'].get('email') == customer_email and
            'passwordHash' not in data['user'] and
            '_id' not in data['user']
        )
        
        cookie_set = 's2s_token' in login_session.cookies
        print_test("Login with correct credentials returns 200", passed, 
                   f"Cookie set: {cookie_set}")
        
        login_token = data.get('token')
        
    except Exception as e:
        print_test("Login with correct credentials", False, f"Exception: {str(e)}")
        return
    
    # Test 9: POST /api/auth/login - Wrong password
    print("\n--- Test 9: Login with Wrong Password ---")
    try:
        resp = requests.post(f"{BASE_URL}/auth/login", json={
            "email": customer_email,
            "password": "wrongpassword"
        })
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        passed = (
            resp.status_code == 401 and
            'Invalid credentials' in data.get('error', '')
        )
        print_test("Wrong password returns 401", passed, f"Error: {data.get('error')}")
        
    except Exception as e:
        print_test("Wrong password validation", False, f"Exception: {str(e)}")
    
    # Test 10: POST /api/auth/login - Unknown email
    print("\n--- Test 10: Login with Unknown Email ---")
    try:
        resp = requests.post(f"{BASE_URL}/auth/login", json={
            "email": "nonexistent@example.com",
            "password": "test123"
        })
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        passed = (
            resp.status_code == 401 and
            'Invalid credentials' in data.get('error', '')
        )
        print_test("Unknown email returns 401", passed, f"Error: {data.get('error')}")
        
    except Exception as e:
        print_test("Unknown email validation", False, f"Exception: {str(e)}")
    
    # Test 11: POST /api/auth/login - Default super admin
    print("\n--- Test 11: Login as Default Super Admin ---")
    admin_session = requests.Session()
    try:
        resp = admin_session.post(f"{BASE_URL}/auth/login", json={
            "email": "admin@search2service.in",
            "password": "admin123"
        })
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            data.get('ok') == True and
            data['user'].get('role') == 'super_admin' and
            data['user'].get('email') == 'admin@search2service.in' and
            'passwordHash' not in data['user'] and
            '_id' not in data['user']
        )
        print_test("Super admin login successful", passed, 
                   f"Role: {data.get('user', {}).get('role')}")
        
    except Exception as e:
        print_test("Super admin login", False, f"Exception: {str(e)}")
    
    # Test 12: GET /api/auth/me - With valid cookie
    print("\n--- Test 12: GET /api/auth/me with Cookie ---")
    try:
        resp = login_session.get(f"{BASE_URL}/auth/me")
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'user' in data and
            data['user'] is not None and
            data['user'].get('email') == customer_email and
            'passwordHash' not in data['user'] and
            '_id' not in data['user']
        )
        print_test("GET /api/auth/me with cookie returns user", passed, 
                   f"Email: {data.get('user', {}).get('email')}")
        
    except Exception as e:
        print_test("GET /api/auth/me with cookie", False, f"Exception: {str(e)}")
    
    # Test 13: GET /api/auth/me - Without cookie (fresh session)
    print("\n--- Test 13: GET /api/auth/me without Cookie ---")
    try:
        fresh_session = requests.Session()
        resp = fresh_session.get(f"{BASE_URL}/auth/me")
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and  # Should be 200, NOT 401
            'user' in data and
            data['user'] is None
        )
        print_test("GET /api/auth/me without cookie returns {user: null} with 200", passed, 
                   f"User: {data.get('user')}")
        
    except Exception as e:
        print_test("GET /api/auth/me without cookie", False, f"Exception: {str(e)}")
    
    # Test 14: Bearer token fallback
    print("\n--- Test 14: Bearer Token Fallback ---")
    try:
        fresh_session = requests.Session()
        headers = {"Authorization": f"Bearer {login_token}"}
        resp = fresh_session.get(f"{BASE_URL}/auth/me", headers=headers)
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'user' in data and
            data['user'] is not None and
            data['user'].get('email') == customer_email and
            'passwordHash' not in data['user'] and
            '_id' not in data['user']
        )
        print_test("Bearer token authentication works", passed, 
                   f"Email: {data.get('user', {}).get('email')}")
        
    except Exception as e:
        print_test("Bearer token fallback", False, f"Exception: {str(e)}")
    
    # Test 15: POST /api/auth/logout
    print("\n--- Test 15: Logout ---")
    try:
        resp = login_session.post(f"{BASE_URL}/auth/logout")
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            data.get('ok') == True
        )
        print_test("Logout returns 200 {ok: true}", passed)
        
    except Exception as e:
        print_test("Logout", False, f"Exception: {str(e)}")
    
    # Test 16: GET /api/auth/me after logout
    print("\n--- Test 16: GET /api/auth/me after Logout ---")
    try:
        resp = login_session.get(f"{BASE_URL}/auth/me")
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'user' in data and
            data['user'] is None
        )
        print_test("After logout, /api/auth/me returns {user: null}", passed, 
                   f"User: {data.get('user')}")
        
    except Exception as e:
        print_test("GET /api/auth/me after logout", False, f"Exception: {str(e)}")
    
    # Test 17: Role restrictions - state_manager
    print("\n--- Test 17: State Manager Role Coercion ---")
    try:
        resp = requests.post(f"{BASE_URL}/auth/register", json={
            "name": "Test State Manager",
            "email": random_email(),
            "password": "test123",
            "role": "state_manager"
        })
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        passed = (
            resp.status_code == 201 and
            data['user'].get('role') == 'customer'
        )
        print_test("State_manager role coerced to customer", passed, 
                   f"Requested: state_manager, Got: {data.get('user', {}).get('role')}")
        
    except Exception as e:
        print_test("State_manager role coercion", False, f"Exception: {str(e)}")
    
    # Test 18: Role restrictions - district_manager
    print("\n--- Test 18: District Manager Role Coercion ---")
    try:
        resp = requests.post(f"{BASE_URL}/auth/register", json={
            "name": "Test District Manager",
            "email": random_email(),
            "password": "test123",
            "role": "district_manager"
        })
        print(f"Status: {resp.status_code}")
        data = resp.json()
        
        passed = (
            resp.status_code == 201 and
            data['user'].get('role') == 'customer'
        )
        print_test("District_manager role coerced to customer", passed, 
                   f"Requested: district_manager, Got: {data.get('user', {}).get('role')}")
        
    except Exception as e:
        print_test("District_manager role coercion", False, f"Exception: {str(e)}")
    
    print("\n" + "="*80)
    print("AUTH ENDPOINT TESTING COMPLETE")
    print("="*80 + "\n")

if __name__ == "__main__":
    test_auth_endpoints()

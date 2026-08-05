#!/usr/bin/env python3
"""
Media Upload & GridFS Test Suite for Search2Service
Tests POST /api/uploads, GET /api/files/:id, GET /api/media, and POST /api/reviews with photos
"""

import requests
import json
import sys
import io
from datetime import datetime
from PIL import Image

# Read base URL from .env
BASE_URL = "https://unified-services-now.preview.emergentagent.com/api"

def print_test(name, passed, details=""):
    """Print test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status}: {name}")
    if details:
        print(f"   {details}")
    return passed

def create_test_image(format='JPEG', size_kb=50):
    """Create a test image in memory"""
    img = Image.new('RGB', (800, 600), color='red')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format=format)
    img_bytes.seek(0)
    return img_bytes

def create_test_pdf(size_kb=50):
    """Create a simple test PDF in memory"""
    # Minimal PDF structure
    pdf_content = b"""%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
>>
>>
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Test PDF) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000317 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
410
%%EOF
"""
    return io.BytesIO(pdf_content)

def create_large_file(size_mb=11):
    """Create a large file exceeding the limit"""
    size_bytes = size_mb * 1024 * 1024
    return io.BytesIO(b'X' * size_bytes)

def test_upload_jpeg():
    """Test POST /api/uploads with JPEG image"""
    print("\n=== Testing POST /api/uploads (JPEG) ===")
    try:
        img_bytes = create_test_image('JPEG')
        files = {'file': ('test_image.jpg', img_bytes, 'image/jpeg')}
        data = {
            'context': 'review-photo',
            'providerId': 'test-provider-123',
            'ownerId': 'test-user-456'
        }
        
        resp = requests.post(f"{BASE_URL}/uploads", files=files, data=data, timeout=30)
        result = resp.json()
        
        # Verify response structure
        passed = (
            resp.status_code == 201 and
            result.get('ok') == True and
            'id' in result and
            'fileId' in result and
            'url' in result and
            'mimeType' in result and
            'size' in result and
            'originalName' in result and
            'context' in result and
            'providerId' in result and
            'createdAt' in result and
            result.get('mimeType') == 'image/jpeg' and
            result.get('context') == 'review-photo' and
            result.get('providerId') == 'test-provider-123' and
            result.get('url').startswith('/api/files/') and
            len(result.get('fileId', '')) == 24  # MongoDB ObjectId is 24 hex chars
        )
        
        details = f"Status: {resp.status_code}, fileId: {result.get('fileId')}, size: {result.get('size')} bytes, url: {result.get('url')}"
        
        # Store fileId for later tests
        if passed:
            global test_jpeg_file_id, test_jpeg_url, test_jpeg_size
            test_jpeg_file_id = result.get('fileId')
            test_jpeg_url = result.get('url')
            test_jpeg_size = result.get('size')
        
        return print_test("POST /api/uploads (JPEG)", passed, details)
    except Exception as e:
        return print_test("POST /api/uploads (JPEG)", False, f"Error: {str(e)}")

def test_upload_pdf():
    """Test POST /api/uploads with PDF"""
    print("\n=== Testing POST /api/uploads (PDF) ===")
    try:
        pdf_bytes = create_test_pdf()
        files = {'file': ('test_document.pdf', pdf_bytes, 'application/pdf')}
        data = {'context': 'provider-document'}
        
        resp = requests.post(f"{BASE_URL}/uploads", files=files, data=data, timeout=30)
        result = resp.json()
        
        passed = (
            resp.status_code == 201 and
            result.get('ok') == True and
            'fileId' in result and
            result.get('mimeType') == 'application/pdf' and
            result.get('context') == 'provider-document'
        )
        
        details = f"Status: {resp.status_code}, fileId: {result.get('fileId')}, mimeType: {result.get('mimeType')}"
        
        return print_test("POST /api/uploads (PDF)", passed, details)
    except Exception as e:
        return print_test("POST /api/uploads (PDF)", False, f"Error: {str(e)}")

def test_upload_unsupported_type():
    """Test POST /api/uploads with unsupported file type (.txt) - should return 415"""
    print("\n=== Testing POST /api/uploads (Unsupported .txt) ===")
    try:
        txt_bytes = io.BytesIO(b'This is a test text file')
        files = {'file': ('test.txt', txt_bytes, 'text/plain')}
        
        resp = requests.post(f"{BASE_URL}/uploads", files=files, timeout=30)
        result = resp.json()
        
        passed = (
            resp.status_code == 415 and
            'error' in result and
            'Unsupported file type' in result.get('error', '')
        )
        
        details = f"Status: {resp.status_code}, Error: {result.get('error')}"
        
        return print_test("POST /api/uploads (Unsupported .txt → 415)", passed, details)
    except Exception as e:
        return print_test("POST /api/uploads (Unsupported .txt → 415)", False, f"Error: {str(e)}")

def test_upload_missing_file():
    """Test POST /api/uploads without file field - should return 400"""
    print("\n=== Testing POST /api/uploads (Missing file) ===")
    try:
        # Send empty form data
        data = {'context': 'test'}
        
        resp = requests.post(f"{BASE_URL}/uploads", data=data, timeout=30)
        result = resp.json()
        
        passed = (
            resp.status_code == 400 and
            'error' in result and
            'file is required' in result.get('error', '')
        )
        
        details = f"Status: {resp.status_code}, Error: {result.get('error')}"
        
        return print_test("POST /api/uploads (Missing file → 400)", passed, details)
    except Exception as e:
        return print_test("POST /api/uploads (Missing file → 400)", False, f"Error: {str(e)}")

def test_upload_exceeds_limit():
    """Test POST /api/uploads with 11 MB file - should return 413"""
    print("\n=== Testing POST /api/uploads (11 MB file exceeds limit) ===")
    try:
        large_file = create_large_file(11)
        files = {'file': ('large_file.jpg', large_file, 'image/jpeg')}
        
        resp = requests.post(f"{BASE_URL}/uploads", files=files, timeout=60)
        result = resp.json()
        
        passed = (
            resp.status_code == 413 and
            'error' in result and
            'File exceeds 10 MB limit' in result.get('error', '')
        )
        
        details = f"Status: {resp.status_code}, Error: {result.get('error')}"
        
        return print_test("POST /api/uploads (11 MB → 413)", passed, details)
    except Exception as e:
        return print_test("POST /api/uploads (11 MB → 413)", False, f"Error: {str(e)}")

def test_download_file():
    """Test GET /api/files/:id - download uploaded file"""
    print("\n=== Testing GET /api/files/:id (Download) ===")
    
    if not test_jpeg_file_id:
        return print_test("GET /api/files/:id", False, "No fileId available (upload test may have failed)")
    
    try:
        resp = requests.get(f"{BASE_URL}/files/{test_jpeg_file_id}", timeout=30)
        
        # Verify response headers
        content_type = resp.headers.get('Content-Type', '')
        content_length = resp.headers.get('Content-Length', '')
        content_disposition = resp.headers.get('Content-Disposition', '')
        cache_control = resp.headers.get('Cache-Control', '')
        x_content_type_options = resp.headers.get('X-Content-Type-Options', '')
        
        passed = (
            resp.status_code == 200 and
            content_type == 'image/jpeg' and
            int(content_length) == test_jpeg_size and
            'inline' in content_disposition and
            'filename=' in content_disposition and
            'public' in cache_control and
            'max-age=31536000' in cache_control and
            'immutable' in cache_control and
            x_content_type_options == 'nosniff' and
            len(resp.content) == test_jpeg_size
        )
        
        details = f"Status: {resp.status_code}, Content-Type: {content_type}, Content-Length: {content_length}, Cache-Control: {cache_control}, X-Content-Type-Options: {x_content_type_options}, Body size: {len(resp.content)} bytes"
        
        return print_test("GET /api/files/:id (Download)", passed, details)
    except Exception as e:
        return print_test("GET /api/files/:id (Download)", False, f"Error: {str(e)}")

def test_download_invalid_id():
    """Test GET /api/files/:id with invalid ObjectId - should return 400"""
    print("\n=== Testing GET /api/files/:id (Invalid ID) ===")
    try:
        resp = requests.get(f"{BASE_URL}/files/not-an-id", timeout=30)
        result = resp.json()
        
        passed = (
            resp.status_code == 400 and
            'error' in result and
            'Invalid file id' in result.get('error', '')
        )
        
        details = f"Status: {resp.status_code}, Error: {result.get('error')}"
        
        return print_test("GET /api/files/not-an-id (Invalid ID → 400)", passed, details)
    except Exception as e:
        return print_test("GET /api/files/not-an-id (Invalid ID → 400)", False, f"Error: {str(e)}")

def test_download_nonexistent_id():
    """Test GET /api/files/:id with non-existent ObjectId - should return 404"""
    print("\n=== Testing GET /api/files/:id (Non-existent ID) ===")
    try:
        # Valid ObjectId format but doesn't exist
        resp = requests.get(f"{BASE_URL}/files/aaaaaaaaaaaaaaaaaaaaaaaa", timeout=30)
        
        passed = resp.status_code == 404
        
        details = f"Status: {resp.status_code}"
        
        return print_test("GET /api/files/aaaaaaaaaaaaaaaaaaaaaaaa (Non-existent → 404)", passed, details)
    except Exception as e:
        return print_test("GET /api/files/aaaaaaaaaaaaaaaaaaaaaaaa (Non-existent → 404)", False, f"Error: {str(e)}")

def test_media_list_no_filter():
    """Test GET /api/media - list all uploaded media"""
    print("\n=== Testing GET /api/media (No filter) ===")
    try:
        resp = requests.get(f"{BASE_URL}/media", timeout=30)
        result = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'items' in result and
            isinstance(result['items'], list) and
            len(result['items']) > 0
        )
        
        # Verify items structure (no _id, no ObjectId leaks)
        if passed and result['items']:
            first_item = result['items'][0]
            has_required_fields = all(
                field in first_item 
                for field in ['id', 'fileId', 'url', 'mimeType', 'size', 'originalName', 'context', 'createdAt']
            )
            no_mongo_id = '_id' not in first_item
            
            if not has_required_fields or not no_mongo_id:
                passed = False
                details = f"Status: {resp.status_code}, Items: {len(result['items'])}, ERROR: Missing fields or _id leak"
            else:
                details = f"Status: {resp.status_code}, Items: {len(result['items'])}, All fields present, no _id leak ✓"
        else:
            details = f"Status: {resp.status_code}, Items: {len(result.get('items', []))}"
        
        return print_test("GET /api/media (No filter)", passed, details)
    except Exception as e:
        return print_test("GET /api/media (No filter)", False, f"Error: {str(e)}")

def test_media_list_filter_context():
    """Test GET /api/media?context=review-photo"""
    print("\n=== Testing GET /api/media?context=review-photo ===")
    try:
        resp = requests.get(f"{BASE_URL}/media?context=review-photo", timeout=30)
        result = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'items' in result and
            isinstance(result['items'], list)
        )
        
        # Verify all items have the correct context
        if passed and result['items']:
            all_correct_context = all(item.get('context') == 'review-photo' for item in result['items'])
            if not all_correct_context:
                passed = False
                details = f"Status: {resp.status_code}, Items: {len(result['items'])}, ERROR: Some items have wrong context"
            else:
                details = f"Status: {resp.status_code}, Items: {len(result['items'])}, All have context='review-photo' ✓"
        else:
            details = f"Status: {resp.status_code}, Items: {len(result.get('items', []))}"
        
        return print_test("GET /api/media?context=review-photo", passed, details)
    except Exception as e:
        return print_test("GET /api/media?context=review-photo", False, f"Error: {str(e)}")

def test_media_list_filter_provider():
    """Test GET /api/media?providerId=test-provider-123"""
    print("\n=== Testing GET /api/media?providerId=test-provider-123 ===")
    try:
        resp = requests.get(f"{BASE_URL}/media?providerId=test-provider-123", timeout=30)
        result = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'items' in result and
            isinstance(result['items'], list)
        )
        
        # Verify all items have the correct providerId
        if passed and result['items']:
            all_correct_provider = all(item.get('providerId') == 'test-provider-123' for item in result['items'])
            if not all_correct_provider:
                passed = False
                details = f"Status: {resp.status_code}, Items: {len(result['items'])}, ERROR: Some items have wrong providerId"
            else:
                details = f"Status: {resp.status_code}, Items: {len(result['items'])}, All have providerId='test-provider-123' ✓"
        else:
            details = f"Status: {resp.status_code}, Items: {len(result.get('items', []))}"
        
        return print_test("GET /api/media?providerId=test-provider-123", passed, details)
    except Exception as e:
        return print_test("GET /api/media?providerId=test-provider-123", False, f"Error: {str(e)}")

def test_media_list_filter_owner():
    """Test GET /api/media?ownerId=test-user-456"""
    print("\n=== Testing GET /api/media?ownerId=test-user-456 ===")
    try:
        resp = requests.get(f"{BASE_URL}/media?ownerId=test-user-456", timeout=30)
        result = resp.json()
        
        passed = (
            resp.status_code == 200 and
            'items' in result and
            isinstance(result['items'], list)
        )
        
        # Verify all items have the correct ownerId
        if passed and result['items']:
            all_correct_owner = all(item.get('ownerId') == 'test-user-456' for item in result['items'])
            if not all_correct_owner:
                passed = False
                details = f"Status: {resp.status_code}, Items: {len(result['items'])}, ERROR: Some items have wrong ownerId"
            else:
                details = f"Status: {resp.status_code}, Items: {len(result['items'])}, All have ownerId='test-user-456' ✓"
        else:
            details = f"Status: {resp.status_code}, Items: {len(result.get('items', []))}"
        
        return print_test("GET /api/media?ownerId=test-user-456", passed, details)
    except Exception as e:
        return print_test("GET /api/media?ownerId=test-user-456", False, f"Error: {str(e)}")

def test_review_with_photos():
    """Test POST /api/reviews with photos array and verify integration"""
    print("\n=== Testing POST /api/reviews with photos array ===")
    results = []
    
    # First get a valid provider ID
    try:
        resp = requests.get(f"{BASE_URL}/providers?limit=1", timeout=10)
        data = resp.json()
        
        if not data.get('items') or len(data['items']) == 0:
            return print_test("POST /api/reviews with photos", False, "No providers found")
        
        provider_id = data['items'][0].get('id')
        
        if not provider_id:
            return print_test("POST /api/reviews with photos", False, "Provider ID not found")
        
    except Exception as e:
        return print_test("POST /api/reviews with photos (setup)", False, f"Error: {str(e)}")
    
    # Upload 3 photos first
    photo_urls = []
    try:
        for i in range(3):
            img_bytes = create_test_image('JPEG')
            files = {'file': (f'review_photo_{i}.jpg', img_bytes, 'image/jpeg')}
            data_upload = {'context': 'review-photo', 'providerId': provider_id}
            
            resp = requests.post(f"{BASE_URL}/uploads", files=files, data=data_upload, timeout=30)
            result = resp.json()
            
            if resp.status_code == 201 and result.get('url'):
                photo_urls.append(result['url'])
        
        if len(photo_urls) != 3:
            return print_test("POST /api/reviews with photos (upload)", False, f"Failed to upload 3 photos, got {len(photo_urls)}")
        
        results.append(print_test("Upload 3 review photos", True, f"Uploaded: {photo_urls}"))
        
    except Exception as e:
        return print_test("POST /api/reviews with photos (upload)", False, f"Error: {str(e)}")
    
    # Create review with photos
    try:
        review_payload = {
            "providerId": provider_id,
            "userName": "Priya Sharma",
            "rating": 5,
            "comment": "Amazing service with great attention to detail!",
            "photos": photo_urls
        }
        
        resp = requests.post(f"{BASE_URL}/reviews", json=review_payload, timeout=10)
        result = resp.json()
        
        passed = (
            resp.status_code == 200 and
            result.get('ok') == True and
            'review' in result and
            'photos' in result['review'] and
            isinstance(result['review']['photos'], list) and
            len(result['review']['photos']) == 3 and
            result['review']['photos'] == photo_urls
        )
        
        results.append(print_test(
            "POST /api/reviews with photos (create)",
            passed,
            f"Status: {resp.status_code}, Photos in review: {len(result.get('review', {}).get('photos', []))}"
        ))
        
        review_id = result.get('review', {}).get('id')
        
    except Exception as e:
        results.append(print_test("POST /api/reviews with photos (create)", False, f"Error: {str(e)}"))
        return False
    
    # Verify photos are persisted in provider detail
    try:
        resp = requests.get(f"{BASE_URL}/providers/{provider_id}", timeout=10)
        data = resp.json()
        
        # Find the review we just created
        review_found = None
        for r in data.get('reviews', []):
            if r.get('userName') == "Priya Sharma" and r.get('comment') == "Amazing service with great attention to detail!":
                review_found = r
                break
        
        passed = (
            resp.status_code == 200 and
            review_found is not None and
            'photos' in review_found and
            isinstance(review_found['photos'], list) and
            len(review_found['photos']) == 3 and
            review_found['photos'] == photo_urls
        )
        
        results.append(print_test(
            "POST /api/reviews with photos (verification)",
            passed,
            f"Status: {resp.status_code}, Review found: {review_found is not None}, Photos intact: {review_found.get('photos') == photo_urls if review_found else False}"
        ))
        
    except Exception as e:
        results.append(print_test("POST /api/reviews with photos (verification)", False, f"Error: {str(e)}"))
    
    return all(results)

def test_review_photos_truncation():
    """Test POST /api/reviews with 8 photos - should truncate to 6"""
    print("\n=== Testing POST /api/reviews with 8 photos (truncation to 6) ===")
    
    # First get a valid provider ID
    try:
        resp = requests.get(f"{BASE_URL}/providers?limit=1", timeout=10)
        data = resp.json()
        
        if not data.get('items') or len(data['items']) == 0:
            return print_test("POST /api/reviews photos truncation", False, "No providers found")
        
        provider_id = data['items'][0].get('id')
        
    except Exception as e:
        return print_test("POST /api/reviews photos truncation (setup)", False, f"Error: {str(e)}")
    
    # Create review with 8 photo URLs (mock URLs for testing truncation logic)
    try:
        photo_urls = [f"/api/files/photo{i}" for i in range(8)]
        
        review_payload = {
            "providerId": provider_id,
            "userName": "Test User Truncation",
            "rating": 4,
            "comment": "Testing photo truncation",
            "photos": photo_urls
        }
        
        resp = requests.post(f"{BASE_URL}/reviews", json=review_payload, timeout=10)
        result = resp.json()
        
        passed = (
            resp.status_code == 200 and
            result.get('ok') == True and
            'review' in result and
            'photos' in result['review'] and
            isinstance(result['review']['photos'], list) and
            len(result['review']['photos']) == 6  # Should be truncated to 6
        )
        
        details = f"Status: {resp.status_code}, Sent 8 photos, Stored: {len(result.get('review', {}).get('photos', []))} (expected 6)"
        
        return print_test("POST /api/reviews (8 photos → truncate to 6)", passed, details)
        
    except Exception as e:
        return print_test("POST /api/reviews photos truncation", False, f"Error: {str(e)}")

def main():
    """Run all media upload tests"""
    print("=" * 80)
    print("Search2Service Media Upload & GridFS Test Suite")
    print("=" * 80)
    print(f"Base URL: {BASE_URL}")
    print(f"Test started at: {datetime.now().isoformat()}")
    print("=" * 80)
    
    # Initialize global variables for file tracking
    global test_jpeg_file_id, test_jpeg_url, test_jpeg_size
    test_jpeg_file_id = None
    test_jpeg_url = None
    test_jpeg_size = None
    
    results = []
    
    # Run all tests in order
    results.append(("Upload JPEG", test_upload_jpeg()))
    results.append(("Upload PDF", test_upload_pdf()))
    results.append(("Upload Unsupported .txt → 415", test_upload_unsupported_type()))
    results.append(("Upload Missing file → 400", test_upload_missing_file()))
    results.append(("Upload 11 MB → 413", test_upload_exceeds_limit()))
    results.append(("Download File", test_download_file()))
    results.append(("Download Invalid ID → 400", test_download_invalid_id()))
    results.append(("Download Non-existent → 404", test_download_nonexistent_id()))
    results.append(("List Media (No filter)", test_media_list_no_filter()))
    results.append(("List Media (context filter)", test_media_list_filter_context()))
    results.append(("List Media (providerId filter)", test_media_list_filter_provider()))
    results.append(("List Media (ownerId filter)", test_media_list_filter_owner()))
    results.append(("Review with Photos", test_review_with_photos()))
    results.append(("Review Photos Truncation", test_review_photos_truncation()))
    
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

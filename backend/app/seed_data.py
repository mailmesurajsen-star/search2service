import uuid
import random
import re
from datetime import datetime, timedelta
from app.db import get_db
from app.auth import hash_password

CATEGORY_GROUPS = [
    {
        "group": "Healthcare",
        "icon": "Stethoscope",
        "color": "from-rose-500 to-pink-600",
        "items": [
            "Doctor", "Hospital", "Clinic", "Dentist", "Eye Specialist", "Skin Specialist",
            "ENT", "Orthopedic", "Cardiologist", "Neurologist", "Child Specialist",
            "Gynecologist", "Physiotherapist", "Pathology", "Medical Store", "Ambulance", "Blood Bank"
        ]
    },
    {
        "group": "Beauty & Wellness",
        "icon": "Sparkles",
        "color": "from-fuchsia-500 to-purple-600",
        "items": ["Beauty Parlour", "Ladies Salon", "Gents Parlour", "Spa"]
    },
    {
        "group": "Home Services",
        "icon": "Wrench",
        "color": "from-amber-500 to-orange-600",
        "items": [
            "Electrician", "Plumber", "Carpenter", "Painter", "AC Repair",
            "Fridge Repair", "Washing Machine Repair", "RO Repair"
        ]
    },
    {
        "group": "Repair Services",
        "icon": "Cpu",
        "color": "from-slate-600 to-slate-800",
        "items": ["Computer Repair", "Laptop Repair", "Mobile Repair", "CCTV Installation"]
    },
    {
        "group": "Events & Photography",
        "icon": "Camera",
        "color": "from-indigo-500 to-blue-700",
        "items": ["Photographer", "Videographer", "Marriage Hall", "Banquet Hall"]
    },
    {
        "group": "Food & Hospitality",
        "icon": "Utensils",
        "color": "from-red-500 to-orange-600",
        "items": ["Hotel", "Restaurant", "Cafe", "Bakery", "Sweet Shop"]
    },
    {
        "group": "Education",
        "icon": "GraduationCap",
        "color": "from-emerald-500 to-teal-600",
        "items": [
            "School", "College", "Coaching", "Tuition", "Library",
            "Book Store", "Stationery", "Uniform Shop"
        ]
    },
    {
        "group": "Printing & Tailor",
        "icon": "Printer",
        "color": "from-cyan-500 to-blue-600",
        "items": ["Tailor", "I Card Printing", "Flex Printing", "Digital Printing"]
    },
    {
        "group": "Job & Career",
        "icon": "Briefcase",
        "color": "from-blue-600 to-indigo-700",
        "items": ["Job Portal"]
    },
    {
        "group": "Real Estate",
        "icon": "Home",
        "color": "from-green-600 to-emerald-700",
        "items": ["Real Estate"]
    },
    {
        "group": "Travel & Transport",
        "icon": "Plane",
        "color": "from-sky-500 to-blue-600",
        "items": ["Tours & Travels", "Taxi", "Bus Booking", "Courier", "Packers & Movers"]
    },
    {
        "group": "Pets",
        "icon": "Dog",
        "color": "from-yellow-500 to-amber-600",
        "items": ["Pet Shop", "Veterinary Doctor"]
    },
    {
        "group": "Government Services",
        "icon": "Landmark",
        "color": "from-orange-500 to-red-600",
        "items": [
            "CSC Center", "Common Service Center", "Online Form Fill Up", "PAN Card",
            "Aadhaar Services", "Passport", "Income Certificate", "Caste Certificate",
            "Residence Certificate", "Police Verification", "Birth Certificate",
            "Death Certificate", "Marriage Registration", "Driving License", "Voter ID"
        ]
    },
    {
        "group": "Finance & Legal",
        "icon": "Scale",
        "color": "from-stone-600 to-neutral-800",
        "items": ["Insurance", "Loan Consultant", "CA", "Advocate", "GST Consultant", "Income Tax Consultant"]
    }
]

POPULAR = {
    'Doctor', 'Electrician', 'Plumber', 'Hotel', 'Restaurant', 'Beauty Parlour',
    'AC Repair', 'Photographer', 'Mobile Repair', 'Tuition', 'CSC Center',
    'Taxi', 'Packers & Movers', 'Advocate', 'Real Estate'
}

CATEGORY_ICONS = {
    # Healthcare
    'Doctor': 'Stethoscope',
    'Hospital': 'Hospital',
    'Clinic': 'Cross',
    'Dentist': 'Smile',
    'Eye Specialist': 'Eye',
    'Skin Specialist': 'Hand',
    'ENT': 'Ear',
    'Orthopedic': 'Bone',
    'Cardiologist': 'HeartPulse',
    'Neurologist': 'Brain',
    'Child Specialist': 'Baby',
    'Gynecologist': 'Venus',
    'Physiotherapist': 'Activity',
    'Pathology': 'TestTubes',
    'Medical Store': 'Pill',
    'Ambulance': 'Ambulance',
    'Blood Bank': 'Droplet',
    # Beauty & Wellness
    'Beauty Parlour': 'Palette',
    'Ladies Salon': 'Scissors',
    'Gents Parlour': 'UserRound',
    'Spa': 'Flower2',
    # Home Services
    'Electrician': 'Zap',
    'Plumber': 'Wrench',
    'Carpenter': 'Hammer',
    'Painter': 'Paintbrush',
    'AC Repair': 'AirVent',
    'Fridge Repair': 'Refrigerator',
    'Washing Machine Repair': 'WashingMachine',
    'RO Repair': 'Droplets',
    # Repair Services
    'Computer Repair': 'Monitor',
    'Laptop Repair': 'Laptop',
    'Mobile Repair': 'Smartphone',
    'CCTV Installation': 'Cctv',
    # Events & Photography
    'Photographer': 'Camera',
    'Videographer': 'Video',
    'Marriage Hall': 'PartyPopper',
    'Banquet Hall': 'Building',
    # Food & Hospitality
    'Hotel': 'BedDouble',
    'Restaurant': 'UtensilsCrossed',
    'Cafe': 'Coffee',
    'Bakery': 'Croissant',
    'Sweet Shop': 'CakeSlice',
    # Education
    'School': 'School',
    'College': 'GraduationCap',
    'Coaching': 'BookOpen',
    'Tuition': 'PenLine',
    'Library': 'Library',
    'Book Store': 'BookMarked',
    'Stationery': 'Pen',
    'Uniform Shop': 'Shirt',
    # Printing & Tailor
    'Tailor': 'Ruler',
    'I Card Printing': 'IdCard',
    'Flex Printing': 'Printer',
    'Digital Printing': 'PrinterCheck',
    # Job & Career
    'Job Portal': 'Briefcase',
    # Real Estate
    'Real Estate': 'Home',
    # Travel & Transport
    'Tours & Travels': 'Plane',
    'Taxi': 'Car',
    'Bus Booking': 'Bus',
    'Courier': 'Package',
    'Packers & Movers': 'Truck',
    # Pets
    'Pet Shop': 'Dog',
    'Veterinary Doctor': 'Cat',
    # Government Services
    'CSC Center': 'Landmark',
    'Common Service Center': 'Building2',
    'Online Form Fill Up': 'FileText',
    'PAN Card': 'CreditCard',
    'Aadhaar Services': 'Fingerprint',
    'Passport': 'BookMarked',
    'Income Certificate': 'Receipt',
    'Caste Certificate': 'FileBadge',
    'Residence Certificate': 'MapPin',
    'Police Verification': 'Shield',
    'Birth Certificate': 'Baby',
    'Death Certificate': 'FileHeart',
    'Marriage Registration': 'Heart',
    'Driving License': 'CarFront',
    'Voter ID': 'Vote',
    # Finance & Legal
    'Insurance': 'ShieldCheck',
    'Loan Consultant': 'IndianRupee',
    'CA': 'Calculator',
    'Advocate': 'Gavel',
    'GST Consultant': 'Percent',
    'Income Tax Consultant': 'FileSpreadsheet',
}

from app.india_locations import INDIA_LOCATIONS

LOCATIONS = INDIA_LOCATIONS

FIRST = ['Rahul', 'Amit', 'Priya', 'Neha', 'Vikram', 'Rajesh', 'Sunita', 'Anjali', 'Suresh', 'Deepak', 'Kavita', 'Sanjay', 'Meera', 'Arjun', 'Ravi', 'Pooja', 'Rohit', 'Kiran', 'Vijay', 'Anita', 'Manoj', 'Shreya', 'Karan', 'Divya', 'Nikhil', 'Simran', 'Ashok', 'Naina', 'Gaurav', 'Riya']
LAST = ['Sharma', 'Verma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Reddy', 'Iyer', 'Nair', 'Menon', 'Khan', 'Shah', 'Joshi', 'Rao', 'Bhat', 'Desai', 'Mehta', 'Kapoor', 'Chopra', 'Bansal']
BUSINESS_SUFFIX = ['Enterprises', 'Services', 'Care', 'Point', 'Solutions', 'Hub', 'Center', 'Studio', 'World', 'Palace', 'House', 'Corner', 'Mart', 'Zone']
DOC_SPEC = {
    'Doctor': 'General Physician',
    'Dentist': 'Dental Surgery',
    'Eye Specialist': 'Ophthalmology',
    'Skin Specialist': 'Dermatology',
    'ENT': 'Ear Nose Throat',
    'Orthopedic': 'Orthopedics',
    'Cardiologist': 'Cardiology',
    'Neurologist': 'Neurology',
    'Child Specialist': 'Pediatrics',
    'Gynecologist': 'Gynecology',
    'Physiotherapist': 'Physiotherapy'
}

IMG = [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
]

def slugify(text: str) -> str:
    text = re.sub(r'[^a-zA-Z0-9]+', '-', text.lower())
    return text.strip('-')

def phone_number() -> str:
    n = 7000000000 + random.randint(0, 2999999999)
    s = str(n)
    return f"+91 {s[:5]} {s[5:]}"

def build_categories():
    cats = []
    for g in CATEGORY_GROUPS:
        for name in g["items"]:
            cats.append({
                "id": str(uuid.uuid4()),
                "name": name,
                "slug": slugify(name),
                "group": g["group"],
                "icon": CATEGORY_ICONS.get(name, g["icon"]),
                "groupIcon": g["icon"],
                "color": g["color"],
                "popular": name in POPULAR,
                "iconVersion": 2,
            })
    return cats

def build_providers(categories):
    providers = []
    for cat in categories:
        count = 8 if cat.get("popular") else 3
        for _ in range(count):
            loc = random.choice(LOCATIONS)
            area = random.choice(loc["areas"])
            is_doc = cat["name"] in DOC_SPEC
            person = f"{random.choice(FIRST)} {random.choice(LAST)}"
            biz_name = f"Dr. {person}" if is_doc else f"{random.choice(LAST)} {cat['name']} {random.choice(BUSINESS_SUFFIX)}"
            rating = round(random.uniform(3.6, 5.0), 1)
            
            clean_name = re.sub(r'[^a-zA-Z0-9]+', '', biz_name.lower())
            email = f"{clean_name}@example.com"
            website = f"https://{clean_name}.in" if random.random() > 0.5 else None
            phone = phone_number()
            whatsapp = phone_number()
            
            services = ['Consultation', 'Follow-up', 'Emergency Care', 'Online Consultation'] if is_doc else [cat["name"], f"{cat['name']} Installation", f"{cat['name']} Repair", 'Home Service']
            price_from = (300 + random.randint(0, 9) * 100) if is_doc else (100 + random.randint(0, 19) * 50)
            price_to = (1500 + random.randint(0, 14) * 100) if is_doc else (500 + random.randint(0, 29) * 100)
            fees = (300 + random.randint(0, 9) * 100) if is_doc else None
            
            description = (
                f"{biz_name} is an experienced {DOC_SPEC[cat['name']]} specialist providing quality healthcare services. Book an appointment online for consultation."
                if is_doc else
                f"{biz_name} offers professional {cat['name'].lower()} services in {area}, {loc['city']}. Trusted by hundreds of customers with quality workmanship and fair pricing."
            )
            
            providers.append({
                "id": str(uuid.uuid4()),
                "name": biz_name,
                "ownerName": person,
                "categoryId": cat["id"],
                "categoryName": cat["name"],
                "categorySlug": cat["slug"],
                "group": cat["group"],
                "specialization": DOC_SPEC.get(cat["name"]),
                "experience": (2 + random.randint(0, 24)) if is_doc else None,
                "qualification": random.choice(['MBBS', 'MBBS, MD', 'BDS', 'MDS', 'MBBS, MS', 'BAMS', 'MBBS, DM']) if is_doc else None,
                "state": loc["state"],
                "district": loc["district"],
                "city": loc["city"],
                "area": area,
                "address": f"{random.randint(1, 300)}, {area}, {loc['city']}, {loc['state']}",
                "phone": phone,
                "whatsapp": whatsapp,
                "email": email,
                "website": website,
                "description": description,
                "services": services,
                "priceFrom": price_from,
                "priceTo": price_to,
                "fees": fees,
                "rating": rating,
                "reviewCount": 5 + random.randint(0, 295),
                "verified": random.random() > 0.3,
                "premium": random.random() > 0.7,
                "featured": random.random() > 0.85,
                "images": [random.choice(IMG), random.choice(IMG), random.choice(IMG)],
                "banner": random.choice(IMG),
                "timings": {
                    "open": "09:00 AM",
                    "close": "08:00 PM" if is_doc else "09:00 PM",
                    "days": "Mon - Sat",
                    "morning": "09:00 AM - 01:00 PM",
                    "evening": "05:00 PM - 09:00 PM",
                    "holiday": "Sunday"
                },
                "upi": f"{clean_name}@paytm",
                "offers": [f"Flat {10 + random.randint(0, 30)}% off on first booking"] if random.random() > 0.6 else [],
                "createdAt": datetime.utcnow().isoformat()
            })
    return providers

def build_reviews(providers):
    comments = [
        'Excellent service! Very professional and on time.',
        'Highly recommended. Quality work at fair price.',
        'Best in the area. Will book again.',
        'Prompt response and good attitude. Thanks!',
        'Satisfied with the service. 5 stars.',
        'Good experience overall. Would recommend to friends.',
        'Very knowledgeable and helpful. Great job.',
        'Fair pricing and quick turnaround.'
    ]
    reviews = []
    for p in providers:
        count = min(4, 1 + random.randint(0, 3))
        for _ in range(count):
            person = f"{random.choice(FIRST)} {random.choice(LAST)}"
            days_ago = random.randint(0, 89)
            date_str = (datetime.utcnow() - timedelta(days=days_ago)).isoformat()
            reviews.append({
                "id": str(uuid.uuid4()),
                "providerId": p["id"],
                "userName": person,
                "rating": random.randint(3, 5),
                "comment": random.choice(comments),
                "photos": [],
                "createdAt": date_str
            })
    return reviews

def build_jobs():
    titles = [
        'Software Engineer', 'Data Analyst', 'Sales Executive', 'Digital Marketing Manager',
        'HR Executive', 'Customer Support', 'Graphic Designer', 'Accountant',
        'Delivery Partner', 'Nurse', 'Receptionist', 'Teacher (Maths)',
        'Content Writer', 'Backend Developer', 'UI/UX Designer'
    ]
    companies = [
        'TechNova', 'Bharat Digital', 'Skyline Corp', 'GreenLeaf', 'Urban Retail',
        'MediCare Plus', 'EduWorld', 'FinEdge', 'SwiftLogix', 'BrightMinds'
    ]
    jobs = []
    for _ in range(25):
        loc = random.choice(LOCATIONS)
        salary_min = 2 + random.randint(0, 9)
        salary_max = 4 + random.randint(0, 14)
        exp_min = random.randint(0, 6)
        exp_max = exp_min + 2 + random.randint(0, 4)
        days_ago = 1 + random.randint(0, 13)
        jobs.append({
            "id": str(uuid.uuid4()),
            "title": random.choice(titles),
            "company": random.choice(companies),
            "city": loc["city"],
            "state": loc["state"],
            "salary": f"₹ {salary_min}L - {salary_max}L / year",
            "experience": f"{exp_min}-{exp_max} yrs",
            "type": random.choice(['Full-time', 'Part-time', 'Contract', 'Remote']),
            "posted": f"{days_ago} days ago",
            "description": "Join our team and work on exciting projects. Great work culture and growth opportunities.",
            "createdAt": datetime.utcnow().isoformat()
        })
    return jobs

def build_hero_slides():
    return [
        {
            "id": str(uuid.uuid4()),
            "badge": "🇮🇳 India’s Complete Services Marketplace",
            "title": "Find trusted services",
            "highlightText": "near you — in seconds.",
            "subtitle": "Doctors, home services, hotels, restaurants, jobs, government forms — everything you need on one platform.",
            "imageUrl": "https://images.pexels.com/photos/31786661/pexels-photo-31786661.jpeg",
            "overlayGradient": "from-blue-950/40 via-blue-900/40 to-orange-800/40",
            "ctaText": "Explore Categories",
            "ctaLink": "/categories",
            "order": 1,
            "isActive": True,
            "createdAt": datetime.utcnow().isoformat(),
            "updatedAt": datetime.utcnow().isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "badge": "🩺 Verified Healthcare & Doctors",
            "title": "Find top-rated doctors & clinics",
            "highlightText": "in your city.",
            "subtitle": "Consult certified physicians, dentists, pediatricians, diagnostic labs & 24x7 emergency medical support.",
            "imageUrl": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80",
            "overlayGradient": "from-slate-950/40 via-blue-950/40 to-cyan-950/40",
            "ctaText": "Find Doctors",
            "ctaLink": "/search?group=Healthcare",
            "order": 2,
            "isActive": True,
            "createdAt": datetime.utcnow().isoformat(),
            "updatedAt": datetime.utcnow().isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "badge": "⚡ Fast & Reliable Home Experts",
            "title": "Electricians, plumbers & AC repair",
            "highlightText": "at your doorstep.",
            "subtitle": "Background-checked professionals ready to fix, install, clean, and renovate your home with upfront pricing.",
            "imageUrl": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1920&q=80",
            "overlayGradient": "from-slate-950/40 via-amber-950/40 to-orange-950/40",
            "ctaText": "Book Home Services",
            "ctaLink": "/search?group=Home+Services",
            "order": 3,
            "isActive": True,
            "createdAt": datetime.utcnow().isoformat(),
            "updatedAt": datetime.utcnow().isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "badge": "💼 Verified Businesses & Job Opportunities",
            "title": "Grow your business or find your next career",
            "highlightText": "across India.",
            "subtitle": "Discover leading IT specialists, tax consultants, hotels, catering, job vacancies & legal advisors.",
            "imageUrl": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80",
            "overlayGradient": "from-indigo-950/40 via-purple-950/40 to-slate-950/40",
            "ctaText": "View Job Openings",
            "ctaLink": "/search?group=Job+%26+Career",
            "order": 4,
            "isActive": True,
            "createdAt": datetime.utcnow().isoformat(),
            "updatedAt": datetime.utcnow().isoformat(),
        },
    ]

def build_ads():
    now = datetime.utcnow()
    start_date = (now - timedelta(days=5)).strftime("%Y-%m-%d")
    end_date = (now + timedelta(days=45)).strftime("%Y-%m-%d")

    return [
        {
            "id": str(uuid.uuid4()),
            "title": "⚡ 50% Off Summer AC & Appliance Repair",
            "subtitle": "Certified technicians at your doorstep within 60 minutes across all major Indian cities. 100% genuine spares with warranty.",
            "imageUrl": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",
            "targetUrl": "/search?category=ac-repair",
            "placement": "homepage_banner",
            "badge": "🔥 Summer Super Saver",
            "ctaText": "Book AC Service",
            "advertiserName": "Urban Cool Tech",
            "advertiserPhone": "+91 98765 11223",
            "gradient": "from-amber-600/10 via-orange-600/10 to-red-700/10",
            "startDate": start_date,
            "endDate": end_date,
            "status": "active",
            "priority": 1,
            "impressions": 1420,
            "clicks": 184,
            "createdAt": datetime.utcnow().isoformat(),
            "updatedAt": datetime.utcnow().isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "title": "🩺 Free First Consultation & 20% Off Diagnostics",
            "subtitle": "Consult top specialist doctors & NABL accredited labs near you with verified patient ratings.",
            "imageUrl": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
            "targetUrl": "/search?group=Healthcare",
            "placement": "search_top",
            "badge": "✨ Sponsored Healthcare",
            "ctaText": "Find Specialists",
            "advertiserName": "MediCare Plus Clinics",
            "advertiserPhone": "+91 98765 22334",
            "gradient": "from-blue-600/10 via-indigo-600/10 to-cyan-700/10",
            "startDate": start_date,
            "endDate": end_date,
            "status": "active",
            "priority": 1,
            "impressions": 2850,
            "clicks": 312,
            "createdAt": datetime.utcnow().isoformat(),
            "updatedAt": datetime.utcnow().isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "title": "💼 Urgent Hiring: 500+ Local Service Technicians & Staff",
            "subtitle": "Direct placement with salary up to ₹35,000/month. Verified employers with zero recruitment fees.",
            "imageUrl": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
            "targetUrl": "/search?group=Job+%26+Career",
            "placement": "search_sidebar",
            "badge": "💼 Career Spotlight",
            "ctaText": "Apply Online",
            "advertiserName": "FastHire Services India",
            "advertiserPhone": "+91 98765 33445",
            "gradient": "from-indigo-600/10 via-purple-600/10 to-slate-800/10",
            "startDate": start_date,
            "endDate": end_date,
            "status": "active",
            "priority": 1,
            "impressions": 1980,
            "clicks": 165,
            "createdAt": datetime.utcnow().isoformat(),
            "updatedAt": datetime.utcnow().isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "title": "🎉 Monsoon Mega Sale: Flat ₹200 Cashback on Home Cleaning",
            "subtitle": "Deep cleaning, sanitization & pest control by background-checked professionals.",
            "imageUrl": "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
            "targetUrl": "/search?group=Home+Services",
            "placement": "popup_modal",
            "badge": "🎁 Festive Special",
            "ctaText": "Claim Cashback",
            "advertiserName": "CleanPro India",
            "advertiserPhone": "+91 98765 44556",
            "gradient": "from-fuchsia-600/10 via-pink-600/10 to-rose-700/10",
            "startDate": start_date,
            "endDate": end_date,
            "status": "active",
            "priority": 1,
            "impressions": 950,
            "clicks": 128,
            "createdAt": datetime.utcnow().isoformat(),
            "updatedAt": datetime.utcnow().isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "title": "📱 List Your Business & Reach 10,000+ Customers Every Month",
            "subtitle": "Join Search2Service Partner Network today with zero listing fee and instant customer leads.",
            "imageUrl": "https://images.pexels.com/photos/31786661/pexels-photo-31786661.jpeg",
            "targetUrl": "/auth?mode=register&role=provider",
            "placement": "footer_banner",
            "badge": "🚀 Partner Program",
            "ctaText": "List Business Now",
            "advertiserName": "Search2Service Growth",
            "advertiserPhone": "+91 98765 55667",
            "gradient": "from-slate-900/10 via-blue-950/10 to-indigo-900/10",
            "startDate": start_date,
            "endDate": end_date,
            "status": "active",
            "priority": 1,
            "impressions": 3200,
            "clicks": 410,
            "createdAt": datetime.utcnow().isoformat(),
            "updatedAt": datetime.utcnow().isoformat(),
        }
    ]

def build_locations():
    from app.india_locations import INDIA_LOCATIONS
    docs = []
    for loc in INDIA_LOCATIONS:
        docs.append({
            "id": str(uuid.uuid4()),
            "state": loc.get("state", "").strip(),
            "district": loc.get("district", "").strip(),
            "city": loc.get("city", "").strip(),
            "areas": [a.strip() for a in loc.get("areas", []) if a.strip()],
            "pincode": loc.get("pincode", ""),
            "tier": loc.get("tier", "Tier 2"),
            "isActive": True,
            "isCustom": False,
            "createdAt": datetime.utcnow().isoformat(),
            "updatedAt": datetime.utcnow().isoformat()
        })
    return docs

async def ensure_seed():
    db = get_db()
    
    # 1. Seed categories if empty (structural reference data — kept even after dummy-data cleanup)
    cat_count = await db.categories.count_documents({})
    if cat_count == 0:
        cats = build_categories()
        if cats:
            await db.categories.insert_many(cats)
    # NOTE: demo providers/reviews/jobs are intentionally no longer auto-seeded here —
    # they were placeholder/dummy listings for local development only. Real providers
    # are added by users via Business Profile or by admins via the Admin Console.

    # 2. Seed default hero slides if empty
    slide_count = await db.hero_slides.count_documents({})
    if slide_count == 0:
        slides = build_hero_slides()
        if slides:
            await db.hero_slides.insert_many(slides)

    # NOTE: demo advertisements are intentionally no longer auto-seeded here —
    # real campaigns are created by admins via Admin Console > Ads Manager.

    # 4. Seed default locations if empty
    loc_count = await db.locations.count_documents({})
    if loc_count == 0:
        locs = build_locations()
        if locs:
            await db.locations.insert_many(locs)

    # 5. Ensure default super admin exists
    admin_exists = await db.users.find_one({"role": "super_admin"})
    if not admin_exists:
        pw_hash = hash_password("Suraj@160880")
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "name": "Super Admin",
            "email": "mailme.surajsen@gmail.com",
            "phone": "",
            "role": "super_admin",
            "passwordHash": pw_hash,
            "verified": True,
            "createdAt": datetime.utcnow().isoformat()
        })

    # 6. Idempotent category icon migration (v2)
    sample = await db.categories.find_one({})
    if sample and sample.get("iconVersion") != 2:
        for name, icon in CATEGORY_ICONS.items():
            await db.categories.update_many({"name": name}, {"$set": {"icon": icon, "iconVersion": 2}})
        for g in CATEGORY_GROUPS:
            await db.categories.update_many({"group": g["group"]}, {"$set": {"groupIcon": g["icon"]}})


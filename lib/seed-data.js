// Seed data for Search2Service - Phase 1
import { v4 as uuid } from 'uuid';
import { INDIA_LOCATIONS } from './india-locations';

export const CATEGORY_GROUPS = [
  { group: 'Healthcare', icon: 'Stethoscope', color: 'from-rose-500 to-pink-600', items: ['Doctor','Hospital','Clinic','Dentist','Eye Specialist','Skin Specialist','ENT','Orthopedic','Cardiologist','Neurologist','Child Specialist','Gynecologist','Physiotherapist','Pathology','Medical Store','Ambulance','Blood Bank'] },
  { group: 'Beauty & Wellness', icon: 'Sparkles', color: 'from-fuchsia-500 to-purple-600', items: ['Beauty Parlour','Ladies Salon','Gents Parlour','Spa'] },
  { group: 'Home Services', icon: 'Wrench', color: 'from-amber-500 to-orange-600', items: ['Electrician','Plumber','Carpenter','Painter','AC Repair','Fridge Repair','Washing Machine Repair','RO Repair'] },
  { group: 'Repair Services', icon: 'Cpu', color: 'from-slate-600 to-slate-800', items: ['Computer Repair','Laptop Repair','Mobile Repair','CCTV Installation'] },
  { group: 'Events & Photography', icon: 'Camera', color: 'from-indigo-500 to-blue-700', items: ['Photographer','Videographer','Marriage Hall','Banquet Hall'] },
  { group: 'Food & Hospitality', icon: 'Utensils', color: 'from-red-500 to-orange-600', items: ['Hotel','Restaurant','Cafe','Bakery','Sweet Shop'] },
  { group: 'Education', icon: 'GraduationCap', color: 'from-emerald-500 to-teal-600', items: ['School','College','Coaching','Tuition','Library','Book Store','Stationery','Uniform Shop'] },
  { group: 'Printing & Tailor', icon: 'Printer', color: 'from-cyan-500 to-blue-600', items: ['Tailor','I Card Printing','Flex Printing','Digital Printing'] },
  { group: 'Job & Career', icon: 'Briefcase', color: 'from-blue-600 to-indigo-700', items: ['Job Portal'] },
  { group: 'Real Estate', icon: 'Home', color: 'from-green-600 to-emerald-700', items: ['Real Estate'] },
  { group: 'Travel & Transport', icon: 'Plane', color: 'from-sky-500 to-blue-600', items: ['Tours & Travels','Taxi','Bus Booking','Courier','Packers & Movers'] },
  { group: 'Pets', icon: 'Dog', color: 'from-yellow-500 to-amber-600', items: ['Pet Shop','Veterinary Doctor'] },
  { group: 'Government Services', icon: 'Landmark', color: 'from-orange-500 to-red-600', items: ['CSC Center','Common Service Center','Online Form Fill Up','PAN Card','Aadhaar Services','Passport','Income Certificate','Caste Certificate','Residence Certificate','Police Verification','Birth Certificate','Death Certificate','Marriage Registration','Driving License','Voter ID'] },
  { group: 'Finance & Legal', icon: 'Scale', color: 'from-stone-600 to-neutral-800', items: ['Insurance','Loan Consultant','CA','Advocate','GST Consultant','Income Tax Consultant'] },
];

const POPULAR = new Set(['Doctor','Electrician','Plumber','Hotel','Restaurant','Beauty Parlour','AC Repair','Photographer','Mobile Repair','Tuition','CSC Center','Taxi','Packers & Movers','Advocate','Real Estate']);

// Per-category icon mapping — every service gets its own logo
export const CATEGORY_ICONS = {
  // Healthcare
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
  // Beauty & Wellness
  'Beauty Parlour': 'Palette',
  'Ladies Salon': 'Scissors',
  'Gents Parlour': 'UserRound',
  'Spa': 'Flower2',
  // Home Services
  'Electrician': 'Zap',
  'Plumber': 'Wrench',
  'Carpenter': 'Hammer',
  'Painter': 'Paintbrush',
  'AC Repair': 'AirVent',
  'Fridge Repair': 'Refrigerator',
  'Washing Machine Repair': 'WashingMachine',
  'RO Repair': 'Droplets',
  // Repair Services
  'Computer Repair': 'Monitor',
  'Laptop Repair': 'Laptop',
  'Mobile Repair': 'Smartphone',
  'CCTV Installation': 'Cctv',
  // Events & Photography
  'Photographer': 'Camera',
  'Videographer': 'Video',
  'Marriage Hall': 'PartyPopper',
  'Banquet Hall': 'Building',
  // Food & Hospitality
  'Hotel': 'BedDouble',
  'Restaurant': 'UtensilsCrossed',
  'Cafe': 'Coffee',
  'Bakery': 'Croissant',
  'Sweet Shop': 'CakeSlice',
  // Education
  'School': 'School',
  'College': 'GraduationCap',
  'Coaching': 'BookOpen',
  'Tuition': 'PenLine',
  'Library': 'Library',
  'Book Store': 'BookMarked',
  'Stationery': 'Pen',
  'Uniform Shop': 'Shirt',
  // Printing & Tailor
  'Tailor': 'Ruler',
  'I Card Printing': 'IdCard',
  'Flex Printing': 'Printer',
  'Digital Printing': 'PrinterCheck',
  // Job & Career
  'Job Portal': 'Briefcase',
  // Real Estate
  'Real Estate': 'Home',
  // Travel & Transport
  'Tours & Travels': 'Plane',
  'Taxi': 'Car',
  'Bus Booking': 'Bus',
  'Courier': 'Package',
  'Packers & Movers': 'Truck',
  // Pets
  'Pet Shop': 'Dog',
  'Veterinary Doctor': 'Cat',
  // Government Services
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
  // Finance & Legal
  'Insurance': 'ShieldCheck',
  'Loan Consultant': 'IndianRupee',
  'CA': 'Calculator',
  'Advocate': 'Gavel',
  'GST Consultant': 'Percent',
  'Income Tax Consultant': 'FileSpreadsheet',
};

export function buildCategories() {
  const cats = [];
  for (const g of CATEGORY_GROUPS) {
    for (const name of g.items) {
      cats.push({
        id: uuid(),
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''),
        group: g.group,
        icon: CATEGORY_ICONS[name] || g.icon,
        groupIcon: g.icon,
        color: g.color,
        popular: POPULAR.has(name),
        iconVersion: 2,
      });
    }
  }
  return cats;
}

const LOCATIONS = INDIA_LOCATIONS;

const FIRST = ['Rahul','Amit','Priya','Neha','Vikram','Rajesh','Sunita','Anjali','Suresh','Deepak','Kavita','Sanjay','Meera','Arjun','Ravi','Pooja','Rohit','Kiran','Vijay','Anita','Manoj','Shreya','Karan','Divya','Nikhil','Simran','Ashok','Naina','Gaurav','Riya'];
const LAST = ['Sharma','Verma','Patel','Singh','Kumar','Gupta','Reddy','Iyer','Nair','Menon','Khan','Shah','Joshi','Rao','Bhat','Desai','Mehta','Kapoor','Chopra','Bansal'];
const BUSINESS_SUFFIX = ['Enterprises','Services','Care','Point','Solutions','Hub','Center','Studio','World','Palace','House','Corner','Mart','Zone'];
const DOC_SPEC = { 'Doctor':'General Physician','Dentist':'Dental Surgery','Eye Specialist':'Ophthalmology','Skin Specialist':'Dermatology','ENT':'Ear Nose Throat','Orthopedic':'Orthopedics','Cardiologist':'Cardiology','Neurologist':'Neurology','Child Specialist':'Pediatrics','Gynecologist':'Gynecology','Physiotherapist':'Physiotherapy' };

function rnd(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function phone(){ return '+91 ' + (7000000000 + Math.floor(Math.random()*3000000000)).toString().replace(/(\d{5})(\d{5})/,'$1 $2'); }

const IMG = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
];

export function buildProviders(categories) {
  const providers = [];
  for (const cat of categories) {
    const count = cat.popular ? 8 : 3;
    for (let i = 0; i < count; i++) {
      const loc = rnd(LOCATIONS);
      const area = rnd(loc.areas);
      const isDoc = !!DOC_SPEC[cat.name];
      const person = `${rnd(FIRST)} ${rnd(LAST)}`;
      const bizName = isDoc ? `Dr. ${person}` : `${rnd(LAST)} ${cat.name} ${rnd(BUSINESS_SUFFIX)}`;
      const rating = (3.6 + Math.random()*1.4).toFixed(1);
      providers.push({
        id: uuid(),
        name: bizName,
        ownerName: person,
        categoryId: cat.id,
        categoryName: cat.name,
        categorySlug: cat.slug,
        group: cat.group,
        specialization: isDoc ? DOC_SPEC[cat.name] : null,
        experience: isDoc ? (2 + Math.floor(Math.random()*25)) : null,
        qualification: isDoc ? rnd(['MBBS','MBBS, MD','BDS','MDS','MBBS, MS','BAMS','MBBS, DM']) : null,
        state: loc.state,
        district: loc.district,
        city: loc.city,
        area,
        address: `${Math.floor(Math.random()*300)+1}, ${area}, ${loc.city}, ${loc.state}`,
        phone: phone(),
        whatsapp: phone(),
        email: `${bizName.toLowerCase().replace(/[^a-z0-9]+/g,'')}@example.com`,
        website: Math.random() > 0.5 ? `https://${bizName.toLowerCase().replace(/[^a-z0-9]+/g,'')}.in` : null,
        description: isDoc
          ? `${bizName} is an experienced ${DOC_SPEC[cat.name]} specialist providing quality healthcare services. Book an appointment online for consultation.`
          : `${bizName} offers professional ${cat.name.toLowerCase()} services in ${area}, ${loc.city}. Trusted by hundreds of customers with quality workmanship and fair pricing.`,
        services: isDoc ? ['Consultation','Follow-up','Emergency Care','Online Consultation'] : [cat.name, `${cat.name} Installation`, `${cat.name} Repair`, 'Home Service'],
        priceFrom: isDoc ? 300 + Math.floor(Math.random()*10)*100 : 100 + Math.floor(Math.random()*20)*50,
        priceTo: isDoc ? 1500 + Math.floor(Math.random()*15)*100 : 500 + Math.floor(Math.random()*30)*100,
        fees: isDoc ? 300 + Math.floor(Math.random()*10)*100 : null,
        rating: parseFloat(rating),
        reviewCount: 5 + Math.floor(Math.random()*300),
        verified: Math.random() > 0.3,
        premium: Math.random() > 0.7,
        featured: Math.random() > 0.85,
        images: [rnd(IMG), rnd(IMG), rnd(IMG)],
        banner: rnd(IMG),
        timings: { open: '09:00 AM', close: isDoc ? '08:00 PM' : '09:00 PM', days: 'Mon - Sat', morning: '09:00 AM - 01:00 PM', evening: '05:00 PM - 09:00 PM', holiday: 'Sunday' },
        upi: `${bizName.toLowerCase().replace(/[^a-z0-9]+/g,'')}@paytm`,
        offers: Math.random() > 0.6 ? [`Flat ${10 + Math.floor(Math.random()*30)}% off on first booking`] : [],
        createdAt: new Date().toISOString(),
      });
    }
  }
  return providers;
}

export function buildReviews(providers) {
  const revs = [];
  const COMMENTS = [
    'Excellent service! Very professional and on time.',
    'Highly recommended. Quality work at fair price.',
    'Best in the area. Will book again.',
    'Prompt response and good attitude. Thanks!',
    'Satisfied with the service. 5 stars.',
    'Good experience overall. Would recommend to friends.',
    'Very knowledgeable and helpful. Great job.',
    'Fair pricing and quick turnaround.',
  ];
  for (const p of providers) {
    const n = Math.min(4, 1 + Math.floor(Math.random()*4));
    for (let i=0; i<n; i++) {
      revs.push({
        id: uuid(),
        providerId: p.id,
        userName: `${rnd(FIRST)} ${rnd(LAST)}`,
        rating: 3 + Math.floor(Math.random()*3),
        comment: rnd(COMMENTS),
        createdAt: new Date(Date.now() - Math.floor(Math.random()*90)*86400000).toISOString(),
      });
    }
  }
  return revs;
}

export function buildJobs() {
  const titles = ['Software Engineer','Data Analyst','Sales Executive','Digital Marketing Manager','HR Executive','Customer Support','Graphic Designer','Accountant','Delivery Partner','Nurse','Receptionist','Teacher (Maths)','Content Writer','Backend Developer','UI/UX Designer'];
  const companies = ['TechNova','Bharat Digital','Skyline Corp','GreenLeaf','Urban Retail','MediCare Plus','EduWorld','FinEdge','SwiftLogix','BrightMinds'];
  const jobs = [];
  for (let i=0;i<25;i++) {
    const loc = rnd(LOCATIONS);
    jobs.push({
      id: uuid(),
      title: rnd(titles),
      company: rnd(companies),
      city: loc.city,
      state: loc.state,
      salary: `₹ ${(2 + Math.floor(Math.random()*10))}L - ${(4 + Math.floor(Math.random()*15))}L / year`,
      experience: `${Math.floor(Math.random()*7)}-${2 + Math.floor(Math.random()*7)} yrs`,
      type: rnd(['Full-time','Part-time','Contract','Remote']),
      posted: `${1 + Math.floor(Math.random()*14)} days ago`,
      description: 'Join our team and work on exciting projects. Great work culture and growth opportunities.',
      createdAt: new Date().toISOString(),
    });
  }
  return jobs;
}

export function buildHeroSlides() {
  return [
    {
      id: uuid(),
      badge: '🇮🇳 India’s Complete Services Marketplace',
      title: 'Find trusted services',
      highlightText: 'near you — in seconds.',
      subtitle: 'Doctors, home services, hotels, restaurants, jobs, government forms — everything you need on one platform.',
      imageUrl: 'https://images.pexels.com/photos/31786661/pexels-photo-31786661.jpeg',
      overlayGradient: 'from-blue-950/90 via-blue-900/85 to-orange-800/80',
      ctaText: 'Explore Categories',
      ctaLink: '/categories',
      order: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuid(),
      badge: '🩺 Verified Healthcare & Doctors',
      title: 'Find top-rated doctors & clinics',
      highlightText: 'in your city.',
      subtitle: 'Consult certified physicians, dentists, pediatricians, diagnostic labs & 24x7 emergency medical support.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80',
      overlayGradient: 'from-slate-950/90 via-blue-950/85 to-cyan-950/80',
      ctaText: 'Find Doctors',
      ctaLink: '/search?group=Healthcare',
      order: 2,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuid(),
      badge: '⚡ Fast & Reliable Home Experts',
      title: 'Electricians, plumbers & AC repair',
      highlightText: 'at your doorstep.',
      subtitle: 'Background-checked professionals ready to fix, install, clean, and renovate your home with upfront pricing.',
      imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1920&q=80',
      overlayGradient: 'from-slate-950/90 via-amber-950/85 to-orange-950/80',
      ctaText: 'Book Home Services',
      ctaLink: '/search?group=Home+Services',
      order: 3,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuid(),
      badge: '💼 Verified Businesses & Job Opportunities',
      title: 'Grow your business or find your next career',
      highlightText: 'across India.',
      subtitle: 'Discover leading IT specialists, tax consultants, hotels, catering, job vacancies & legal advisors.',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
      overlayGradient: 'from-indigo-950/90 via-purple-950/85 to-slate-950/80',
      ctaText: 'View Job Openings',
      ctaLink: '/search?group=Job+%26+Career',
      order: 4,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

export function buildAds() {
  const now = new Date();
  const startDate = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const endDate = new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return [
    {
      id: uuid(),
      title: '⚡ 50% Off Summer AC & Appliance Repair',
      subtitle: 'Certified technicians at your doorstep within 60 minutes across all major Indian cities. 100% genuine spares with warranty.',
      imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80',
      targetUrl: '/search?category=ac-repair',
      placement: 'homepage_banner',
      badge: '🔥 Summer Super Saver',
      ctaText: 'Book AC Service',
      advertiserName: 'Urban Cool Tech',
      advertiserPhone: '+91 98765 11223',
      gradient: 'from-amber-600 via-orange-600 to-red-700',
      startDate: startDate,
      endDate: endDate,
      status: 'active',
      priority: 1,
      impressions: 1420,
      clicks: 184,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuid(),
      title: '🩺 Free First Consultation & 20% Off Diagnostics',
      subtitle: 'Consult top specialist doctors & NABL accredited labs near you with verified patient ratings.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      targetUrl: '/search?group=Healthcare',
      placement: 'search_top',
      badge: '✨ Sponsored Healthcare',
      ctaText: 'Find Specialists',
      advertiserName: 'MediCare Plus Clinics',
      advertiserPhone: '+91 98765 22334',
      gradient: 'from-blue-600 via-indigo-600 to-cyan-700',
      startDate: startDate,
      endDate: endDate,
      status: 'active',
      priority: 1,
      impressions: 2850,
      clicks: 312,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuid(),
      title: '💼 Urgent Hiring: 500+ Local Service Technicians & Staff',
      subtitle: 'Direct placement with salary up to ₹35,000/month. Verified employers with zero recruitment fees.',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      targetUrl: '/search?group=Job+%26+Career',
      placement: 'search_sidebar',
      badge: '💼 Career Spotlight',
      ctaText: 'Apply Online',
      advertiserName: 'FastHire Services India',
      advertiserPhone: '+91 98765 33445',
      gradient: 'from-indigo-600 via-purple-600 to-slate-800',
      startDate: startDate,
      endDate: endDate,
      status: 'active',
      priority: 1,
      impressions: 1980,
      clicks: 165,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuid(),
      title: '🎉 Monsoon Mega Sale: Flat ₹200 Cashback on Home Cleaning',
      subtitle: 'Deep cleaning, sanitization & pest control by background-checked professionals.',
      imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      targetUrl: '/search?group=Home+Services',
      placement: 'popup_modal',
      badge: '🎁 Festive Special',
      ctaText: 'Claim Cashback',
      advertiserName: 'CleanPro India',
      advertiserPhone: '+91 98765 44556',
      gradient: 'from-fuchsia-600 via-pink-600 to-rose-700',
      startDate: startDate,
      endDate: endDate,
      status: 'active',
      priority: 1,
      impressions: 950,
      clicks: 128,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuid(),
      title: '📱 List Your Business & Reach 10,000+ Customers Every Month',
      subtitle: 'Join Search2Service Partner Network today with zero listing fee and instant customer leads.',
      imageUrl: 'https://images.pexels.com/photos/31786661/pexels-photo-31786661.jpeg',
      targetUrl: '/auth?mode=register&role=provider',
      placement: 'footer_banner',
      badge: '🚀 Partner Program',
      ctaText: 'List Business Now',
      advertiserName: 'Search2Service Growth',
      advertiserPhone: '+91 98765 55667',
      gradient: 'from-slate-900 via-blue-950 to-indigo-900',
      startDate: startDate,
      endDate: endDate,
      status: 'active',
      priority: 1,
      impressions: 3200,
      clicks: 410,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];
}


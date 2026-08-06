// Seed data for Search2Service - Phase 1
import { v4 as uuid } from 'uuid';

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

const LOCATIONS = [
  { state: 'Maharashtra', district: 'Mumbai', city: 'Mumbai', areas: ['Andheri','Bandra','Powai','Dadar','Borivali'] },
  { state: 'Maharashtra', district: 'Pune', city: 'Pune', areas: ['Kothrud','Hinjewadi','Kharadi','Baner','Viman Nagar'] },
  { state: 'Delhi', district: 'New Delhi', city: 'Delhi', areas: ['Connaught Place','Karol Bagh','Saket','Dwarka','Rohini'] },
  { state: 'Karnataka', district: 'Bengaluru', city: 'Bengaluru', areas: ['Koramangala','Indiranagar','Whitefield','HSR Layout','Jayanagar'] },
  { state: 'Tamil Nadu', district: 'Chennai', city: 'Chennai', areas: ['T. Nagar','Adyar','Velachery','Anna Nagar','Mylapore'] },
  { state: 'Telangana', district: 'Hyderabad', city: 'Hyderabad', areas: ['Gachibowli','Hitec City','Banjara Hills','Kukatpally','Madhapur'] },
  { state: 'West Bengal', district: 'Kolkata', city: 'Kolkata', areas: ['Salt Lake','Park Street','Howrah','New Town','Ballygunge'] },
  { state: 'Gujarat', district: 'Ahmedabad', city: 'Ahmedabad', areas: ['Bodakdev','Satellite','Vastrapur','Navrangpura','Maninagar'] },
  { state: 'Rajasthan', district: 'Jaipur', city: 'Jaipur', areas: ['C-Scheme','Malviya Nagar','Vaishali Nagar','Mansarovar','Raja Park'] },
  { state: 'Uttar Pradesh', district: 'Lucknow', city: 'Lucknow', areas: ['Hazratganj','Gomti Nagar','Aliganj','Indira Nagar','Alambagh'] },
];

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

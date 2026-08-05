'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Search, MapPin, Star, ShieldCheck, Phone, MessageCircle, Stethoscope, Sparkles, Wrench, Cpu, Camera, Utensils,
  GraduationCap, Printer, Briefcase, Home, Plane, Dog, Landmark, Scale, ChevronRight, Download, Smartphone,
  Verified, TrendingUp, Clock, HeartHandshake, Award, Users, Building2, IndianRupee
} from 'lucide-react';

const ICONS = { Stethoscope, Sparkles, Wrench, Cpu, Camera, Utensils, GraduationCap, Printer, Briefcase, Home, Plane, Dog, Landmark, Scale };

function Icon({ name, className }) {
  const C = ICONS[name] || Sparkles;
  return <C className={className} />;
}

export default function App() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [locations, setLocations] = useState({ states: [], cities: [] });
  const [popularCats, setPopularCats] = useState([]);
  const [groupedCats, setGroupedCats] = useState({});
  const [featured, setFeatured] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [gov, setGov] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState({ providers: 0, doctors: 0, categories: 0, customers: 0 });

  useEffect(() => {
    (async () => {
      const [locs, pop, grp, feat, docs, hot, rest, govs, jobsR, tests, st] = await Promise.all([
        fetch('/api/locations').then(r => r.json()),
        fetch('/api/categories?popular=true').then(r => r.json()),
        fetch('/api/categories?grouped=true').then(r => r.json()),
        fetch('/api/providers?premium=true&limit=8').then(r => r.json()),
        fetch('/api/doctors?limit=8').then(r => r.json()),
        fetch('/api/hotels?limit=6').then(r => r.json()),
        fetch('/api/restaurants?limit=6').then(r => r.json()),
        fetch('/api/gov-services').then(r => r.json()),
        fetch('/api/jobs?limit=6').then(r => r.json()),
        fetch('/api/reviews/recent').then(r => r.json()),
        fetch('/api/stats').then(r => r.json()),
      ]);
      setLocations({ states: locs.states || [], cities: locs.cities || [] });
      setPopularCats(pop.categories || []);
      setGroupedCats(grp.groups || {});
      setFeatured(feat.items || []);
      setDoctors(docs.items || []);
      setHotels(hot.items || []);
      setRestaurants(rest.items || []);
      setGov(govs.items || []);
      setJobs(jobsR.items || []);
      setTestimonials(tests.items || []);
      setStats(st);
    })();
  }, []);

  const doSearch = () => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (state) params.set('state', state);
    if (city) params.set('city', city);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur bg-white/85 border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-orange-500 grid place-items-center text-white font-bold">S2</div>
            <div>
              <div className="font-bold text-lg leading-none">Search2Service</div>
              <div className="text-[10px] text-muted-foreground">One platform for every service</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/categories" className="hover:text-blue-600">Categories</Link>
            <Link href="/search?group=Healthcare" className="hover:text-blue-600">Doctors</Link>
            <Link href="/search?category=hotel" className="hover:text-blue-600">Hotels</Link>
            <Link href="/search?group=Job+%26+Career" className="hover:text-blue-600">Jobs</Link>
            <Link href="/search?group=Government+Services" className="hover:text-blue-600">Gov Services</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Login</Button>
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-orange-500 hover:opacity-90 text-white">List Business</Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/31786661/pexels-photo-31786661.jpeg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/85 to-orange-700/80" />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl text-white">
            <Badge className="bg-white/15 text-white border-white/30 backdrop-blur mb-4 hover:bg-white/20">🇮🇳 India’s Complete Services Marketplace</Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">Find trusted services<br /><span className="bg-gradient-to-r from-orange-300 to-yellow-200 bg-clip-text text-transparent">near you — in seconds.</span></h1>
            <p className="text-lg text-blue-50 max-w-2xl mb-8">Doctors, home services, hotels, restaurants, jobs, government forms — everything you need on one platform.</p>

            <Card className="bg-white/95 backdrop-blur shadow-2xl border-0">
              <CardContent className="p-4 md:p-5">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                  <div className="md:col-span-5 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input placeholder="Search services, doctors, businesses..." className="pl-10 h-12 text-base border-slate-200" value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && doSearch()} />
                  </div>
                  <div className="md:col-span-3">
                    <Select value={state} onValueChange={setState}>
                      <SelectTrigger className="h-12"><MapPin className="w-4 h-4 mr-2 text-slate-400" /><SelectValue placeholder="State" /></SelectTrigger>
                      <SelectContent>{locations.states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Select value={city} onValueChange={setCity}>
                      <SelectTrigger className="h-12"><SelectValue placeholder="City" /></SelectTrigger>
                      <SelectContent>{locations.cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-orange-500 hover:opacity-90 text-white text-base font-semibold" onClick={doSearch}><Search className="w-4 h-4 mr-2" />Search</Button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
                  <span>Popular:</span>
                  {['Electrician','Doctor','AC Repair','Beauty Parlour','Plumber','Photographer'].map(t => (
                    <button key={t} onClick={() => { setQ(t); setTimeout(doSearch, 50); }} className="underline underline-offset-2 hover:text-blue-600">{t}</button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
              {[{icon: Users, label: 'Happy Customers', val: `${(stats.customers/1000).toFixed(0)}K+`},
                {icon: Building2, label: 'Verified Providers', val: `${stats.providers}+`},
                {icon: Stethoscope, label: 'Doctors Listed', val: `${stats.doctors}+`},
                {icon: TrendingUp, label: 'Service Categories', val: `${stats.categories}+`}].map((s, i) => (
                <div key={i} className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20">
                  <s.icon className="w-6 h-6 mb-2 text-orange-300" />
                  <div className="text-2xl font-bold">{s.val}</div>
                  <div className="text-xs text-blue-100">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <SectionHeader title="Popular Services" subtitle="Most searched services this week" cta={{ href: '/categories', label: 'View All' }} />
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mt-8">
            {popularCats.map(c => (
              <Link key={c.id} href={`/search?category=${c.slug}`} className="group">
                <div className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all text-center">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} grid place-items-center mx-auto mb-2 text-white group-hover:scale-110 transition-transform`}>
                    <Icon name={c.icon} className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-medium text-slate-700 group-hover:text-blue-600">{c.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ALL CATEGORIES BY GROUP */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHeader title="Browse By Category" subtitle="80+ categories across every industry" />
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groupedCats).slice(0, 9).map(([group, items]) => (
              <Card key={group} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${items[0]?.color || 'from-blue-500 to-blue-700'} grid place-items-center text-white`}>
                      <Icon name={items[0]?.icon} className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg">{group}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {items.slice(0, 8).map(i => (
                      <Link key={i.id} href={`/search?category=${i.slug}`} className="text-sm px-3 py-1 rounded-full bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-700">{i.name}</Link>
                    ))}
                    {items.length > 8 && <span className="text-sm text-slate-400">+{items.length - 8} more</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PREMIUM PROVIDERS */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <SectionHeader title="Premium Providers" subtitle="Top-rated verified businesses" cta={{ href: '/search?premium=true', label: 'See All' }} icon={<Award className="w-5 h-5 text-orange-500" />} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
            {featured.map(p => <ProviderCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* FEATURED DOCTORS */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHeader title="Featured Doctors" subtitle="Book appointments with top specialists" cta={{ href: '/search?group=Healthcare', label: 'View All Doctors' }} icon={<Stethoscope className="w-5 h-5 text-rose-500" />} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
            {doctors.map(d => (
              <Link key={d.id} href={`/providers/${d.id}`} className="group">
                <Card className="h-full hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-rose-100 to-pink-200 relative">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${d.images?.[0]})` }} />
                    {d.premium && <Badge className="absolute top-3 left-3 bg-orange-500 hover:bg-orange-500">PREMIUM</Badge>}
                  </div>
                  <CardContent className="p-4">
                    <div className="font-bold group-hover:text-blue-600">{d.name}</div>
                    <div className="text-sm text-rose-600 font-medium">{d.specialization}</div>
                    <div className="text-xs text-slate-500 mt-1">{d.qualification} • {d.experience}+ yrs exp</div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 text-sm"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /><span className="font-semibold">{d.rating}</span><span className="text-slate-400">({d.reviewCount})</span></div>
                      <div className="text-sm font-bold flex items-center"><IndianRupee className="w-3.5 h-3.5" />{d.fees}</div>
                    </div>
                    <div className="text-xs text-slate-500 mt-2 flex items-center gap-1"><MapPin className="w-3 h-3" />{d.city}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOTELS + RESTAURANTS row */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10">
          <div>
            <SectionHeader title="Latest Hotels" subtitle="Book stays across India" cta={{ href: '/search?category=hotel', label: 'All Hotels' }} />
            <div className="grid grid-cols-2 gap-4 mt-6">
              {hotels.slice(0,4).map(h => <MiniCard key={h.id} p={h} />)}
            </div>
          </div>
          <div>
            <SectionHeader title="Restaurants" subtitle="Order food or book a table" cta={{ href: '/search?category=restaurant', label: 'All Restaurants' }} />
            <div className="grid grid-cols-2 gap-4 mt-6">
              {restaurants.slice(0,4).map(r => <MiniCard key={r.id} p={r} />)}
            </div>
          </div>
        </div>
      </section>

      {/* GOVERNMENT + EMERGENCY */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 overflow-hidden">
              <CardContent className="p-8">
                <Landmark className="w-10 h-10 mb-3" />
                <h3 className="text-2xl font-bold mb-2">Government Services</h3>
                <p className="text-orange-50 mb-4">PAN, Aadhaar, Passport, Certificates & more. Get help from CSC centers near you.</p>
                <div className="flex flex-wrap gap-2">
                  {['PAN Card','Aadhaar Services','Passport','Driving License','Voter ID','Income Certificate'].map(g => (
                    <Link key={g} href={`/search?q=${encodeURIComponent(g)}`} className="text-sm px-3 py-1 rounded-full bg-white/20 hover:bg-white/30">{g}</Link>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-rose-600 to-red-700 text-white border-0 overflow-hidden">
              <CardContent className="p-8">
                <HeartHandshake className="w-10 h-10 mb-3" />
                <h3 className="text-2xl font-bold mb-2">Emergency Services</h3>
                <p className="text-rose-50 mb-4">Ambulance, Blood Bank, Hospital — available 24/7 across cities.</p>
                <div className="flex flex-wrap gap-2">
                  {['Ambulance','Blood Bank','Hospital','Pathology','Medical Store'].map(g => (
                    <Link key={g} href={`/search?q=${encodeURIComponent(g)}`} className="text-sm px-3 py-1 rounded-full bg-white/20 hover:bg-white/30">{g}</Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* JOBS */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <SectionHeader title="Latest Jobs" subtitle="Find opportunities across India" cta={{ href: '/search?group=Job+%26+Career', label: 'All Jobs' }} icon={<Briefcase className="w-5 h-5 text-blue-600" />} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
            {jobs.map(j => (
              <Card key={j.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-bold text-lg">{j.title}</div>
                      <div className="text-sm text-slate-600">{j.company}</div>
                    </div>
                    <Badge variant="outline">{j.type}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-600 mt-3">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{j.city}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{j.experience}</span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-700"><IndianRupee className="w-3.5 h-3.5" />{j.salary.replace('₹ ','')}</span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-slate-400">Posted {j.posted}</span>
                    <Button size="sm" variant="outline">Apply Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHeader title="Customer Reviews" subtitle="What our customers are saying" />
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            {testimonials.slice(0, 6).map(t => (
              <Card key={t.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex mb-3">{[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />)}</div>
                  <p className="text-slate-700 mb-4">“{t.comment}”</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 grid place-items-center text-white font-bold">{t.userName[0]}</div>
                    <div>
                      <div className="font-semibold">{t.userName}</div>
                      <div className="text-xs text-slate-500">Reviewed {t.provider?.name} • {t.provider?.city}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DOWNLOAD APP */}
      <section className="py-16 bg-gradient-to-br from-blue-900 via-blue-800 to-orange-700 text-white">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Smartphone className="w-12 h-12 mb-3" />
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Get the Search2Service App</h2>
            <p className="text-blue-100 mb-6">Book services, track orders, get exclusive offers and manage everything on the go.</p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-black hover:bg-black/80"><Download className="w-4 h-4 mr-2" />Google Play</Button>
              <Button size="lg" className="bg-black hover:bg-black/80"><Download className="w-4 h-4 mr-2" />App Store</Button>
            </div>
            <div className="flex items-center gap-6 mt-8 text-sm">
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" />100% Secure</div>
              <div className="flex items-center gap-2"><Verified className="w-4 h-4" />Verified Providers</div>
              <div className="flex items-center gap-2"><Star className="w-4 h-4" />4.8/5 Rating</div>
            </div>
          </div>
          <div className="relative h-64 md:h-80">
            <div className="absolute inset-0 bg-white/10 backdrop-blur rounded-3xl border border-white/20 p-6">
              <div className="h-full flex flex-col justify-center items-center text-center">
                <Smartphone className="w-24 h-24 mb-4 text-orange-300" />
                <div className="text-2xl font-bold">Available on all devices</div>
                <div className="text-blue-100 mt-2">iOS • Android • PWA • Web</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <SectionHeader title="Frequently Asked Questions" subtitle="Everything you need to know" />
          <Accordion type="single" collapsible className="mt-8">
            {[
              ['How does Search2Service work?', 'Search for any service you need, filter by state/city/area, view provider profiles, ratings and reviews, and contact them directly via call, WhatsApp or online booking.'],
              ['Is it free for customers?', 'Yes! Searching, browsing, and contacting service providers on Search2Service is 100% free for customers.'],
              ['How can I list my business?', 'Click “List Business” at the top, register your business, upload photos, add services & pricing, and start receiving customers.'],
              ['Are providers verified?', 'We verify every business through document checks and customer feedback. Look for the verified badge.'],
              ['How do I book a doctor appointment?', 'Search for the doctor or specialization, view their profile, and click “Book Appointment” to schedule online or offline consultation.'],
              ['What payment methods are supported?', 'We support UPI, credit/debit cards, net banking, and wallets via Razorpay. Cash on service is also available with most providers.'],
            ].map(([q, a], i) => (
              <AccordionItem key={i} value={`i${i}`}>
                <AccordionTrigger className="text-left">{q}</AccordionTrigger>
                <AccordionContent className="text-slate-600">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-orange-500 grid place-items-center text-white font-bold">S2</div>
                <div className="font-bold text-white text-lg">Search2Service</div>
              </div>
              <p className="text-sm text-slate-400">One platform for every service. Trusted by thousands of businesses and customers across India.</p>
            </div>
            <div>
              <div className="font-semibold text-white mb-3">Popular</div>
              <ul className="space-y-2 text-sm">
                {['Doctor','Electrician','Hotel','Restaurant','Beauty Parlour','AC Repair'].map(l => (
                  <li key={l}><Link href={`/search?q=${encodeURIComponent(l)}`} className="hover:text-white">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-semibold text-white mb-3">Company</div>
              <ul className="space-y-2 text-sm">
                {['About Us','Careers','Blog','Press','Contact'].map(l => (
                  <li key={l}><span className="hover:text-white cursor-pointer">{l}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-semibold text-white mb-3">Legal</div>
              <ul className="space-y-2 text-sm">
                {['Privacy Policy','Terms & Conditions','Refund Policy','Disclaimer','Support'].map(l => (
                  <li key={l}><span className="hover:text-white cursor-pointer">{l}</span></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-10 pt-6 text-sm text-slate-500 flex flex-col md:flex-row justify-between gap-2">
            <div>© {new Date().getFullYear()} Search2Service. All rights reserved.</div>
            <div>Made with ❤️ in India</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({ title, subtitle, cta, icon }) {
  return (
    <div className="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        </div>
        {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {cta && <Link href={cta.href} className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">{cta.label} <ChevronRight className="w-4 h-4" /></Link>}
    </div>
  );
}

function ProviderCard({ p }) {
  const router = useRouter();
  const go = () => router.push(`/providers/${p.id}`);
  return (
    <Card onClick={go} className="h-full hover:shadow-xl transition-all group overflow-hidden cursor-pointer">
      <div className="aspect-video bg-cover bg-center relative" style={{ backgroundImage: `url(${p.images?.[0]})` }}>
        {p.premium && <Badge className="absolute top-3 left-3 bg-orange-500 hover:bg-orange-500">PREMIUM</Badge>}
        {p.verified && <div className="absolute top-3 right-3 bg-white/90 rounded-full p-1"><ShieldCheck className="w-4 h-4 text-emerald-600" /></div>}
      </div>
      <CardContent className="p-4">
        <div className="font-bold group-hover:text-blue-600 truncate">{p.name}</div>
        <div className="text-xs text-slate-500 mt-0.5">{p.categoryName}</div>
        <div className="flex items-center gap-1 mt-2 text-sm">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{p.rating}</span>
          <span className="text-slate-400">({p.reviewCount})</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500 mt-2"><MapPin className="w-3 h-3" />{p.area}, {p.city}</div>
        <div className="flex gap-2 mt-3">
          <a href={`tel:${p.phone}`} onClick={e => e.stopPropagation()} className="flex-1 h-8 rounded bg-blue-50 text-blue-700 text-xs font-medium grid place-items-center hover:bg-blue-100"><Phone className="w-3 h-3 mr-1" />Call</a>
          <a href={`https://wa.me/${p.whatsapp?.replace(/\D/g,'')}`} onClick={e => e.stopPropagation()} className="flex-1 h-8 rounded bg-emerald-50 text-emerald-700 text-xs font-medium grid place-items-center hover:bg-emerald-100"><MessageCircle className="w-3 h-3 mr-1" />WhatsApp</a>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniCard({ p }) {
  return (
    <Link href={`/providers/${p.id}`}>
      <Card className="hover:shadow-lg transition-shadow overflow-hidden group">
        <div className="aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${p.images?.[0]})` }} />
        <CardContent className="p-3">
          <div className="font-semibold text-sm truncate group-hover:text-blue-600">{p.name}</div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1 text-xs"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /><span>{p.rating}</span></div>
            <div className="text-xs text-slate-500">{p.city}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

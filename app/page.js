'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ConciergeChat } from '@/components/concierge-chat';
import { AdBanner } from '@/components/ad-banner';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { HeroSlider } from '@/components/hero-slider';
import {
  MapPin, Star, ShieldCheck, Phone, MessageCircle, Stethoscope, Sparkles, Wrench, Cpu, Camera, Utensils,
  GraduationCap, Printer, Briefcase, Home, Plane, Dog, Landmark, Scale, ChevronRight, Download, Smartphone,
  Verified, Clock, HeartHandshake, Award, Building2, IndianRupee,
  Hospital, Cross, Smile, Eye, Hand, Ear, Bone, HeartPulse, Brain, Baby, Venus, Activity, TestTubes, Pill, Ambulance, Droplet,
  Palette, Scissors, UserRound, Flower2, Zap, Hammer, Paintbrush, AirVent, Refrigerator, WashingMachine, Droplets,
  Monitor, Laptop, Cctv, Video, PartyPopper, Building, BedDouble, UtensilsCrossed, Coffee, Croissant, CakeSlice,
  School, BookOpen, PenLine, Library, BookMarked, Pen, Shirt, Ruler, IdCard, PrinterCheck, Car, Bus, Package, Truck, Cat,
  FileText, CreditCard, Fingerprint, Receipt, FileBadge, Shield, FileHeart, Heart, CarFront, Vote,
  Calculator, Gavel, Percent, FileSpreadsheet,
} from 'lucide-react';

const ICONS = {
  Stethoscope, Sparkles, Wrench, Cpu, Camera, Utensils, GraduationCap, Printer, Briefcase, Home, Plane, Dog, Landmark, Scale,
  Hospital, Cross, Smile, Eye, Hand, Ear, Bone, HeartPulse, Brain, Baby, Venus, Activity, TestTubes, Pill, Ambulance, Droplet,
  Palette, Scissors, UserRound, Flower2, Zap, Hammer, Paintbrush, AirVent, Refrigerator, WashingMachine, Droplets,
  Monitor, Laptop, Cctv, Video, PartyPopper, Building, BedDouble, UtensilsCrossed, Coffee, Croissant, CakeSlice,
  School, BookOpen, PenLine, Library, BookMarked, Pen, Shirt, Ruler, IdCard, PrinterCheck, Car, Bus, Package, Truck, Cat,
  FileText, CreditCard, Fingerprint, Receipt, FileBadge, Shield, FileHeart, Heart, CarFront, Vote,
  Calculator, Gavel, Percent, FileSpreadsheet, Building2,
};

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
  const [appLinks, setAppLinks] = useState({ playStoreUrl: '', appStoreUrl: '' });

  // Hero Slider State (slide index/autoplay is now owned by <HeroSlider>)
  const [heroSlides, setHeroSlides] = useState([]);

  useEffect(() => {
    (async () => {
      const [locs, pop, grp, feat, docs, hot, rest, govs, jobsR, tests, st, slidesRes, settingsRes] = await Promise.all([
        fetch('/api/locations').then(r => r.json()).catch(() => ({})),
        fetch('/api/categories?popular=true').then(r => r.json()).catch(() => ({})),
        fetch('/api/categories?grouped=true').then(r => r.json()).catch(() => ({})),
        fetch('/api/providers?premium=true&limit=8').then(r => r.json()).catch(() => ({})),
        fetch('/api/doctors?limit=8').then(r => r.json()).catch(() => ({})),
        fetch('/api/hotels?limit=6').then(r => r.json()).catch(() => ({})),
        fetch('/api/restaurants?limit=6').then(r => r.json()).catch(() => ({})),
        fetch('/api/gov-services').then(r => r.json()).catch(() => ({})),
        fetch('/api/jobs?limit=6').then(r => r.json()).catch(() => ({})),
        fetch('/api/reviews/recent').then(r => r.json()).catch(() => ({})),
        fetch('/api/stats').then(r => r.json()).catch(() => ({})),
        fetch('/api/hero-slides').then(r => r.json()).catch(() => ({ slides: [] })),
        fetch('/api/settings').then(r => r.json()).catch(() => ({})),
      ]);
      setLocations({ states: locs?.states || [], cities: locs?.cities || [] });
      setPopularCats(pop?.categories || []);
      setGroupedCats(grp?.groups || {});
      setFeatured(feat?.items || []);
      setDoctors(docs?.items || []);
      setHotels(hot?.items || []);
      setRestaurants(rest?.items || []);
      setGov(govs?.items || []);
      setJobs(jobsR?.items || []);
      setTestimonials(tests?.items || []);
      if (st) setStats(st);
      if (slidesRes?.slides && slidesRes.slides.length > 0) {
        setHeroSlides(slidesRes.slides);
      }
      setAppLinks({ playStoreUrl: settingsRes?.playStoreUrl || '', appStoreUrl: settingsRes?.appStoreUrl || '' });
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
      <SiteHeader />

      {/* HERO SLIDER SECTION */}
      <HeroSlider
        heroSlides={heroSlides}
        q={q} setQ={setQ}
        state={state} setState={setState}
        city={city} setCity={setCity}
        locations={locations} setLocations={setLocations}
        doSearch={doSearch}
        stats={stats}
      />

      {/* POPULAR CATEGORIES */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4">
          <SectionHeader title="Popular Services" subtitle="Most searched services this week" cta={{ href: '/categories', label: 'View All' }} />
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mt-8">
            {popularCats.map(c => (
              <Link key={c.id} href={`/search?category=${c.slug}`} className="group">
                <div className="bg-white rounded-2xl p-4 border border-border hover:border-accent/50 hover:shadow-lg transition-all text-center">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} grid place-items-center mx-auto mb-2 text-white group-hover:scale-110 transition-transform`}>
                    <Icon name={c.icon} className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{c.name}</div>
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
                      <Icon name={items[0]?.groupIcon || items[0]?.icon} className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg">{group}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {items.slice(0, 8).map(i => (
                      <Link key={i.id} href={`/search?category=${i.slug}`} className="text-sm px-3 py-1 rounded-full bg-muted hover:bg-accent/10 hover:text-accent text-muted-foreground transition-colors">{i.name}</Link>
                    ))}
                    {items.length > 8 && <span className="text-sm text-muted-foreground">+{items.length - 8} more</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SPONSORED PROMOTIONAL BANNER AD */}
      <section className="py-6 bg-muted/30">
        <div className="container mx-auto px-4">
          <AdBanner placement="homepage_banner" />
        </div>
      </section>

      {/* FEATURED PREMIUM PROVIDERS */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4">
          <SectionHeader title="Premium Providers" subtitle="Top-rated verified businesses" cta={{ href: '/search?premium=true', label: 'See All' }} icon={<Award className="w-5 h-5 text-[#F5A623]" />} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
            {featured.map(p => <ProviderCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* FEATURED DOCTORS */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHeader title="Featured Doctors" subtitle="Book appointments with top specialists" cta={{ href: '/search?group=Healthcare', label: 'View All Doctors' }} icon={<Stethoscope className="w-5 h-5 text-accent" />} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
            {doctors.map(d => (
              <Link key={d.id} href={`/providers/${d.id}`} className="group">
                <Card className="h-full hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="aspect-square bg-muted relative">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${d.images?.[0]})` }} />
                    {d.premium && <Badge className="absolute top-3 left-3 bg-[#F5A623] hover:bg-[#F5A623] text-white">PREMIUM</Badge>}
                  </div>
                  <CardContent className="p-4">
                    <div className="font-bold group-hover:text-primary transition-colors">{d.name}</div>
                    <div className="text-sm text-accent font-medium">{d.specialization}</div>
                    <div className="text-xs text-muted-foreground mt-1">{d.qualification} • {d.experience}+ yrs exp</div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 text-sm"><Star className="w-4 h-4 fill-[#F5A623] text-[#F5A623]" /><span className="font-semibold">{d.rating}</span><span className="text-muted-foreground">({d.reviewCount})</span></div>
                      <div className="text-sm font-bold flex items-center"><IndianRupee className="w-3.5 h-3.5" />{d.fees}</div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1"><MapPin className="w-3 h-3" />{d.city}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOTELS + RESTAURANTS row */}
      <section className="py-16 bg-muted/40">
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
            <Card className="bg-primary text-white border-0 overflow-hidden">
              <CardContent className="p-8">
                <Landmark className="w-10 h-10 mb-3" />
                <h3 className="text-2xl font-bold mb-2">Government Services</h3>
                <p className="text-white/85 mb-4">PAN, Aadhaar, Passport, Certificates & more. Get help from CSC centers near you.</p>
                <div className="flex flex-wrap gap-2">
                  {['PAN Card','Aadhaar Services','Passport','Driving License','Voter ID','Income Certificate'].map(g => (
                    <Link key={g} href={`/search?q=${encodeURIComponent(g)}`} className="text-sm px-3 py-1 rounded-full bg-white/20 hover:bg-white/30">{g}</Link>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-accent text-white border-0 overflow-hidden">
              <CardContent className="p-8">
                <HeartHandshake className="w-10 h-10 mb-3" />
                <h3 className="text-2xl font-bold mb-2">Emergency Services</h3>
                <p className="text-white/85 mb-4">Ambulance, Blood Bank, Hospital — available 24/7 across cities.</p>
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
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4">
          <SectionHeader title="Latest Jobs" subtitle="Find opportunities across India" cta={{ href: '/search?group=Job+%26+Career', label: 'All Jobs' }} icon={<Briefcase className="w-5 h-5 text-accent" />} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
            {jobs.map(j => (
              <Card key={j.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-bold text-lg">{j.title}</div>
                      <div className="text-sm text-muted-foreground">{j.company}</div>
                    </div>
                    <Badge variant="outline">{j.type}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-3">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{j.city}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{j.experience}</span>
                    <span className="flex items-center gap-1 font-semibold text-accent"><IndianRupee className="w-3.5 h-3.5" />{j.salary.replace('₹ ','')}</span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-muted-foreground">Posted {j.posted}</span>
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
                  <div className="flex mb-3">{[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'fill-[#F5A623] text-[#F5A623]' : 'text-border'}`} />)}</div>
                  <p className="text-foreground mb-4">“{t.comment}”</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary grid place-items-center text-primary-foreground font-bold">{t.userName[0]}</div>
                    <div>
                      <div className="font-semibold">{t.userName}</div>
                      <div className="text-xs text-muted-foreground">Reviewed {t.provider?.name} • {t.provider?.city}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DOWNLOAD APP */}
      <section className="py-16 bg-gradient-to-br from-primary to-accent text-white">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Smartphone className="w-12 h-12 mb-3" />
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Get the Search2Service App</h2>
            <p className="text-white/85 mb-6">Book services, track orders, get exclusive offers and manage everything on the go.</p>
            <div className="flex flex-wrap gap-3">
              {appLinks.playStoreUrl ? (
                <a href={appLinks.playStoreUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-black hover:bg-black/80"><Download className="w-4 h-4 mr-2" />Google Play</Button>
                </a>
              ) : (
                <Button size="lg" disabled className="bg-black/50 cursor-not-allowed"><Download className="w-4 h-4 mr-2" />Google Play</Button>
              )}
              {appLinks.appStoreUrl ? (
                <a href={appLinks.appStoreUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-black hover:bg-black/80"><Download className="w-4 h-4 mr-2" />App Store</Button>
                </a>
              ) : (
                <Button size="lg" disabled className="bg-black/50 cursor-not-allowed"><Download className="w-4 h-4 mr-2" />App Store</Button>
              )}
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
                <Smartphone className="w-24 h-24 mb-4 text-[#5EEAD4]" />
                <div className="text-2xl font-bold">Available on all devices</div>
                <div className="text-white/85 mt-2">iOS • Android • PWA • Web</div>
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
                <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FOOTER */}
      <SiteFooter />

      {/* Promotional Popup Modal / Toast */}
      <AdBanner placement="popup_modal" />

      {/* Floating AI Concierge */}
      <ConciergeChat />
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
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {cta && <Link href={cta.href} className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1 transition-colors">{cta.label} <ChevronRight className="w-4 h-4" /></Link>}
    </div>
  );
}

function ProviderCard({ p }) {
  const router = useRouter();
  const go = () => router.push(`/providers/${p.id}`);
  return (
    <div onClick={go} className="cursor-pointer h-full">
    <Card className="h-full hover:shadow-xl transition-all group overflow-hidden">
      <div className="aspect-video bg-cover bg-center relative" style={{ backgroundImage: `url(${p.images?.[0]})` }}>
        {p.premium && <Badge className="absolute top-3 left-3 bg-[#F5A623] hover:bg-[#F5A623] text-white">PREMIUM</Badge>}
        {p.verified && <div className="absolute top-3 right-3 bg-white/90 rounded-full p-1"><ShieldCheck className="w-4 h-4 text-accent" /></div>}
      </div>
      <CardContent className="p-4">
        <div className="font-bold group-hover:text-primary transition-colors truncate">{p.name}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{p.categoryName}</div>
        <div className="flex items-center gap-1 mt-2 text-sm">
          <Star className="w-4 h-4 fill-[#F5A623] text-[#F5A623]" />
          <span className="font-semibold">{p.rating}</span>
          <span className="text-muted-foreground">({p.reviewCount})</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2"><MapPin className="w-3 h-3" />{p.area}, {p.city}</div>
        <div className="flex gap-2 mt-3">
          <a href={`tel:${p.phone}`} onClick={e => e.stopPropagation()} className="flex-1 h-8 rounded bg-primary/10 text-primary text-xs font-medium grid place-items-center hover:bg-primary/15"><Phone className="w-3 h-3 mr-1" />Call</a>
          <a href={`https://wa.me/${p.whatsapp?.replace(/\D/g,'')}`} onClick={e => e.stopPropagation()} className="flex-1 h-8 rounded bg-emerald-50 text-emerald-700 text-xs font-medium grid place-items-center hover:bg-emerald-100"><MessageCircle className="w-3 h-3 mr-1" />WhatsApp</a>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}

function MiniCard({ p }) {
  return (
    <Link href={`/providers/${p.id}`}>
      <Card className="hover:shadow-lg transition-shadow overflow-hidden group">
        <div className="aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${p.images?.[0]})` }} />
        <CardContent className="p-3">
          <div className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{p.name}</div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1 text-xs"><Star className="w-3 h-3 fill-[#F5A623] text-[#F5A623]" /><span>{p.rating}</span></div>
            <div className="text-xs text-muted-foreground">{p.city}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

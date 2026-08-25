'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Star, ShieldCheck, Phone, MessageCircle, Filter, SlidersHorizontal, ChevronLeft, IndianRupee } from 'lucide-react';
import { AdBanner } from '@/components/ad-banner';

function SearchInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(sp.get('q') || '');
  const [state, setState] = useState(sp.get('state') || '');
  const [city, setCity] = useState(sp.get('city') || '');
  const [category, setCategory] = useState(sp.get('category') || '');
  const [group, setGroup] = useState(sp.get('group') || '');
  const [sort, setSort] = useState('featured');
  const [premium, setPremium] = useState(sp.get('premium') === 'true');
  const [verified, setVerified] = useState(false);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState({ states: [], cities: [] });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/locations').then(r => r.json()).then(d => setLocations({ states: d.states || [], cities: d.cities || [] }));
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(d.categories || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (state) params.set('state', state);
    if (city) params.set('city', city);
    if (category) params.set('category', category);
    if (group) params.set('group', group);
    if (premium) params.set('premium', 'true');
    if (verified) params.set('verified', 'true');
    params.set('sort', sort);
    params.set('limit', '48');
    fetch(`/api/providers?${params.toString()}`).then(r => r.json()).then(d => {
      setItems(d.items || []); setTotal(d.total || 0); setLoading(false);
    });
  }, [q, state, city, category, group, premium, verified, sort]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <ChevronLeft className="w-5 h-5" />
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-orange-500 grid place-items-center text-white font-bold text-xs">S2</div>
            <span className="font-bold hidden sm:inline">Search2Service</span>
          </Link>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search services, businesses..." className="pl-9 h-10" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 grid lg:grid-cols-[280px_1fr] gap-6">
        {/* FILTERS */}
        <aside className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2 font-semibold"><SlidersHorizontal className="w-4 h-4" />Filters</div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Category</label>
                <Select value={category || 'all'} onValueChange={v => setCategory(v === 'all' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
                  <SelectContent className="max-h-72">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(c => <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">State</label>
                <Select value={state || 'all'} onValueChange={v => {
                  const nextState = v === 'all' ? '' : v;
                  setState(nextState);
                  setCity('');
                  fetch(`/api/locations${nextState ? `?state=${encodeURIComponent(nextState)}` : ''}`)
                    .then(r => r.json())
                    .then(d => setLocations(prev => ({ ...prev, cities: d.cities || [] })));
                }}>
                  <SelectTrigger><SelectValue placeholder="All States" /></SelectTrigger>
                  <SelectContent className="max-h-72">
                    <SelectItem value="all">🇮🇳 All States (Pan-India)</SelectItem>
                    {locations.states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">City</label>
                <Select value={city || 'all'} onValueChange={v => setCity(v === 'all' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="All Cities" /></SelectTrigger>
                  <SelectContent className="max-h-72">
                    <SelectItem value="all">All Cities</SelectItem>
                    {locations.cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={premium} onChange={e => setPremium(e.target.checked)} className="rounded" />
                  Premium only
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={verified} onChange={e => setVerified(e.target.checked)} className="rounded" />
                  Verified only
                </label>
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => { setQ(''); setState(''); setCity(''); setCategory(''); setGroup(''); setPremium(false); setVerified(false); }}>Clear filters</Button>
            </CardContent>
          </Card>

          {/* SPONSORED SIDEBAR AD */}
          <AdBanner placement="search_sidebar" />
        </aside>

        {/* RESULTS */}
        <div>
          {/* SPONSORED TOP BANNER */}
          <AdBanner placement="search_top" className="mb-6" />

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{loading ? 'Searching...' : `${total} results`}</h1>
              <div className="text-sm text-slate-500 mt-1">
                {[category && categories.find(c => c.slug === category)?.name, city, state].filter(Boolean).join(' • ') || 'All services across India'}
              </div>
            </div>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(9)].map((_, i) => <div key={i} className="h-64 bg-slate-200 rounded-xl animate-pulse" />)}
            </div>
          ) : items.length === 0 ? (
            <Card><CardContent className="p-12 text-center">
              <Filter className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <div className="text-lg font-semibold">No results found</div>
              <div className="text-slate-500 text-sm mt-1">Try changing your filters or search terms.</div>
            </CardContent></Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map(p => (
                <div key={p.id} onClick={() => router.push(`/providers/${p.id}`)} className="cursor-pointer h-full">
                <Card className="h-full hover:shadow-xl transition-shadow group overflow-hidden">
                    <div className="aspect-video bg-cover bg-center relative" style={{ backgroundImage: `url(${p.images?.[0]})` }}>
                      {p.premium && <Badge className="absolute top-3 left-3 bg-orange-500 hover:bg-orange-500">PREMIUM</Badge>}
                      {p.verified && <div className="absolute top-3 right-3 bg-white/90 rounded-full p-1"><ShieldCheck className="w-4 h-4 text-emerald-600" /></div>}
                    </div>
                    <CardContent className="p-4">
                      <div className="font-bold group-hover:text-blue-600">{p.name}</div>
                      {p.doctorName && <div className="text-xs text-slate-600 font-medium">{p.doctorName}</div>}
                      <div className="text-xs text-slate-500 mt-0.5">{p.categoryName} {p.specialization && `• ${p.specialization}`}</div>
                      <div className="flex items-center gap-1 mt-2 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{p.rating}</span>
                        <span className="text-slate-400">({p.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-2"><MapPin className="w-3 h-3" />{p.area}, {p.city}</div>
                      {p.fees && <div className="text-xs text-slate-600 mt-1 flex items-center">Consultation: <IndianRupee className="w-3 h-3" />{p.fees}</div>}
                      <div className="flex gap-2 mt-3">
                        <a href={`tel:${p.phone}`} onClick={e => e.stopPropagation()} className="flex-1 h-8 rounded bg-blue-50 text-blue-700 text-xs font-medium grid place-items-center hover:bg-blue-100"><Phone className="w-3 h-3 mr-1" />Call</a>
                        <a href={`https://wa.me/${p.whatsapp?.replace(/\D/g,'')}`} onClick={e => e.stopPropagation()} className="flex-1 h-8 rounded bg-emerald-50 text-emerald-700 text-xs font-medium grid place-items-center hover:bg-emerald-100"><MessageCircle className="w-3 h-3 mr-1" />WhatsApp</a>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return <Suspense fallback={<div className="p-8">Loading...</div>}><SearchInner /></Suspense>;
}

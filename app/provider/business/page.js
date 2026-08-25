'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/lib/use-auth';
import { FileUploader } from '@/components/file-uploader';
import { ChevronLeft, Save, Store, MapPin, Phone, Mail, Globe, Clock, IndianRupee, CreditCard, Wallet, X, PlusCircle, Sparkles, Map, Wand2, Briefcase, Trash2, Loader2 } from 'lucide-react';

const PAYMENT_METHODS = ['UPI', 'Cash', 'Card', 'Net Banking', 'Razorpay', 'PayTM', 'PhonePe', 'Google Pay'];

export default function BusinessProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [cats, setCats] = useState([]);
  const [locs, setLocs] = useState({ states: [], districts: [], cities: [], areas: [] });
  const [b, setB] = useState({
    name: '', description: '', categorySlug: '', state: '', district: '', city: '', area: '', address: '',
    phone: '', whatsapp: '', email: '', website: '',
    services: [], priceFrom: '', priceTo: '', fees: '',
    offers: [], upi: '', razorpayKeyId: '', paymentMethods: ['UPI', 'Cash'],
    banner: '', images: [],
    timings: { days: 'Mon - Sat', morning: '09:00 AM - 01:00 PM', evening: '05:00 PM - 09:00 PM', holiday: 'Sunday', open: '09:00 AM', close: '09:00 PM' },
    location: { lat: '', lng: '', embedUrl: '' },
    doctorName: '', specialization: '', qualification: '', experience: '',
  });
  const [serviceInput, setServiceInput] = useState('');
  const [offerInput, setOfferInput] = useState('');
  const [generatingDesc, setGeneratingDesc] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [postingJob, setPostingJob] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', type: 'Full-time', salary: '', experience: '', description: '' });

  useEffect(() => {
    if (!loading && !user) router.replace('/auth?next=/provider/business');
    else if (user && !['provider', 'admin', 'super_admin'].includes(user.role)) router.replace('/');
    else if (user && user.role === 'provider' && !user.plan) router.replace('/provider/plan');
  }, [user, loading, router]);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCats(d.categories || []));
    fetch('/api/locations').then(r => r.json()).then(setLocs);
    fetch('/api/provider/business').then(r => r.json()).then(d => { if (d.business) setB(prev => ({ ...prev, ...d.business, priceFrom: d.business.priceFrom || '', priceTo: d.business.priceTo || '', fees: d.business.fees || '', experience: d.business.experience || '', location: d.business.location || prev.location })); });
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const r = await fetch('/api/provider/jobs');
      const d = await r.json();
      setJobs(d.items || []);
    } catch (e) { console.error(e); }
    finally { setLoadingJobs(false); }
  };

  const generateDescription = async () => {
    if (!b.name || !b.categorySlug) { toast.error('Add business name and category first'); return; }
    setGeneratingDesc(true);
    try {
      const r = await fetch('/api/provider/ai-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: b.name,
          categoryName: selectedCat?.name || '',
          city: b.city,
          specialization: b.specialization,
          qualification: b.qualification,
          services: b.services,
        }),
      });
      const d = await r.json();
      if (r.ok && d.description) { setB(x => ({ ...x, description: d.description })); toast.success('AI description generated!'); }
      else toast.error(d.error || d.detail || 'Failed to generate description');
    } catch (e) { toast.error('Network error while generating description'); }
    finally { setGeneratingDesc(false); }
  };

  const publishJob = async () => {
    if (!newJob.title.trim()) { toast.error('Job title is required'); return; }
    if (!b.name || !b.categorySlug || !b.city) { toast.error('Save your business profile before publishing a job'); return; }
    setPostingJob(true);
    try {
      const r = await fetch('/api/provider/jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newJob) });
      const d = await r.json();
      if (r.ok) {
        toast.success('Job published!');
        setNewJob({ title: '', type: 'Full-time', salary: '', experience: '', description: '' });
        fetchJobs();
      } else toast.error(d.error || d.detail || 'Failed to publish job');
    } catch (e) { toast.error('Network error while publishing job'); }
    finally { setPostingJob(false); }
  };

  const deleteJob = async (jobId) => {
    if (!confirm('Remove this job listing?')) return;
    try {
      const r = await fetch(`/api/provider/jobs/${jobId}`, { method: 'DELETE' });
      if (r.ok) { toast.success('Job removed'); fetchJobs(); }
      else { const d = await r.json().catch(() => ({})); toast.error(d.error || d.detail || 'Failed to remove job'); }
    } catch (e) { toast.error('Network error while removing job'); }
  };

  useEffect(() => {
    if (b.state) fetch(`/api/locations?state=${encodeURIComponent(b.state)}`).then(r => r.json()).then(setLocs);
    if (b.city) fetch(`/api/locations?state=${encodeURIComponent(b.state)}&city=${encodeURIComponent(b.city)}`).then(r => r.json()).then(setLocs);
  }, [b.state, b.city]);

  const save = async () => {
    if (!b.name || !b.categorySlug || !b.city) { toast.error('Business name, category, and city are required'); return; }
    setSaving(true);
    const r = await fetch('/api/provider/business', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) });
    const d = await r.json();
    setSaving(false);
    if (r.ok) { toast.success('Business profile saved! You are now live in search.'); }
    else toast.error(d.error || 'Failed to save');
  };

  const togglePM = (m) => setB(x => ({ ...x, paymentMethods: x.paymentMethods.includes(m) ? x.paymentMethods.filter(p => p !== m) : [...x.paymentMethods, m] }));

  const selectedCat = cats.find(c => c.slug === b.categorySlug);
  const isDoctor = selectedCat && ['Doctor', 'Dentist', 'Eye Specialist', 'Skin Specialist', 'ENT', 'Orthopedic', 'Cardiologist', 'Neurologist', 'Child Specialist', 'Gynecologist', 'Physiotherapist'].includes(selectedCat.name);

  if (loading || !user) return <div className="p-12 text-center text-slate-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <Link href="/provider/dashboard" className="flex items-center gap-1 text-sm"><ChevronLeft className="w-4 h-4" />Dashboard</Link>
          <div className="flex-1" />
          <Button onClick={save} disabled={saving} className="bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90 text-white"><Save className="w-4 h-4 mr-1" />{saving ? 'Saving...' : 'Save & Go Live'}</Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 grid place-items-center text-white"><Store className="w-6 h-6" /></div>
          <div>
            <h1 className="text-2xl font-bold">Business Profile</h1>
            <p className="text-slate-500 text-sm">Set up your business so customers can find and book you</p>
          </div>
        </div>

        {/* BASIC INFO */}
        <Card><CardContent className="p-5 space-y-4">
          <h3 className="font-bold flex items-center gap-2"><Store className="w-4 h-4" />Basic Info</h3>
          <div>
            <Label>Business Name *</Label>
            <Input className="mt-1" value={b.name} onChange={e => setB({ ...b, name: e.target.value })} placeholder="e.g., Sharma Electricals" />
          </div>
          <div>
            <Label>Category *</Label>
            <Select value={b.categorySlug} onValueChange={v => setB({ ...b, categorySlug: v })}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Choose your service category" /></SelectTrigger>
              <SelectContent className="max-h-80">{cats.map(c => <SelectItem key={c.id} value={c.slug}>{c.name} — {c.group}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label>Description</Label>
              <Button type="button" size="sm" variant="outline" onClick={generateDescription} disabled={generatingDesc} className="h-7 text-xs gap-1.5 text-purple-700 border-purple-200 hover:bg-purple-50">
                {generatingDesc ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                {generatingDesc ? 'Generating…' : 'Generate with AI'}
              </Button>
            </div>
            <Textarea className="mt-1" rows={4} value={b.description} onChange={e => setB({ ...b, description: e.target.value })} placeholder="Tell customers what makes your business special…" />
          </div>
          {isDoctor && (
            <div className="pt-2 border-t space-y-3">
              <div><Label>Doctor Name</Label><Input className="mt-1" value={b.doctorName} onChange={e => setB({ ...b, doctorName: e.target.value })} placeholder="e.g., Dr. Rajesh Sharma" /></div>
              <div className="grid sm:grid-cols-3 gap-3">
                <div><Label>Specialization</Label><Input className="mt-1" value={b.specialization} onChange={e => setB({ ...b, specialization: e.target.value })} placeholder="e.g., Cardiology" /></div>
                <div><Label>Qualification</Label><Input className="mt-1" value={b.qualification} onChange={e => setB({ ...b, qualification: e.target.value })} placeholder="MBBS, MD" /></div>
                <div><Label>Experience (yrs)</Label><Input className="mt-1" type="number" value={b.experience} onChange={e => setB({ ...b, experience: e.target.value })} /></div>
              </div>
            </div>
          )}
        </CardContent></Card>

        {/* BANNER + GALLERY */}
        <Card><CardContent className="p-5 space-y-4">
          <h3 className="font-bold flex items-center gap-2"><Sparkles className="w-4 h-4" />Banner & Gallery</h3>
          <div>
            <Label>Shop Banner (1200x400 recommended)</Label>
            <div className="mt-2">
              <FileUploader context="provider-banner" ownerId={user.id} accept="image/jpeg,image/png,image/webp" buttonLabel="Upload shop banner" onUploaded={(f) => setB(x => ({ ...x, banner: f.url }))} />
              {b.banner && <div className="mt-3 relative w-full h-40 bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${b.banner})` }}><button onClick={() => setB(x => ({ ...x, banner: '' }))} className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-red-600 text-white rounded-full grid place-items-center"><X className="w-4 h-4" /></button></div>}
            </div>
          </div>
          <div>
            <Label>Gallery Photos</Label>
            <div className="mt-2">
              <FileUploader context="provider-gallery" ownerId={user.id} multiple accept="image/jpeg,image/png,image/webp" buttonLabel="Add gallery photos" onUploaded={(files) => setB(x => ({ ...x, images: [...(x.images || []), ...(Array.isArray(files) ? files : [files]).map(f => f.url)] }))} />
              {b.images?.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
                  {b.images.map((url, i) => (
                    <div key={i} className="relative aspect-video bg-cover bg-center rounded-lg group" style={{ backgroundImage: `url(${url})` }}>
                      <button onClick={() => setB(x => ({ ...x, images: x.images.filter((_, j) => j !== i) }))} className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-red-600 text-white rounded-full grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent></Card>

        {/* LOCATION */}
        <Card><CardContent className="p-5 space-y-4">
          <h3 className="font-bold flex items-center gap-2"><MapPin className="w-4 h-4" />Location</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>State *</Label>
              <Select value={b.state} onValueChange={v => setB({ ...b, state: v, district: '', city: '', area: '' })}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Choose state" /></SelectTrigger>
                <SelectContent className="max-h-72">{locs.states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>District</Label>
              <Select value={b.district} onValueChange={v => setB({ ...b, district: v })}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="District" /></SelectTrigger>
                <SelectContent className="max-h-72">{locs.districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>City *</Label>
              <Select value={b.city} onValueChange={v => setB({ ...b, city: v })}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="City" /></SelectTrigger>
                <SelectContent className="max-h-72">{locs.cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Area / Locality</Label>
              <Input className="mt-1" list="area-options" value={b.area} onChange={e => setB({ ...b, area: e.target.value })} placeholder="e.g., Bandra West" />
              <datalist id="area-options">{locs.areas.map(a => <option key={a} value={a} />)}</datalist>
            </div>
          </div>
          <div>
            <Label>Full Address</Label>
            <Textarea className="mt-1" rows={2} value={b.address} onChange={e => setB({ ...b, address: e.target.value })} placeholder="Shop no, Building, Street, Landmark…" />
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div><Label>Latitude</Label><Input className="mt-1" value={b.location.lat} onChange={e => setB({ ...b, location: { ...b.location, lat: e.target.value } })} placeholder="19.0760" /></div>
            <div><Label>Longitude</Label><Input className="mt-1" value={b.location.lng} onChange={e => setB({ ...b, location: { ...b.location, lng: e.target.value } })} placeholder="72.8777" /></div>
            <div className="flex items-end"><Button variant="outline" size="sm" className="w-full" onClick={() => { if (navigator.geolocation) navigator.geolocation.getCurrentPosition(p => { setB(x => ({ ...x, location: { ...x.location, lat: String(p.coords.latitude), lng: String(p.coords.longitude) } })); toast.success('Location captured'); }); }}><Map className="w-4 h-4 mr-1" />Use current</Button></div>
          </div>
          {b.address && (
            <div className="pt-2">
              <Label>Map Preview</Label>
              <div className="mt-2 rounded-lg overflow-hidden border h-56">
                <iframe title="map" src={`https://maps.google.com/maps?q=${encodeURIComponent(b.address)}&output=embed`} className="w-full h-full" />
              </div>
            </div>
          )}
        </CardContent></Card>

        {/* CONTACT */}
        <Card><CardContent className="p-5 space-y-3">
          <h3 className="font-bold flex items-center gap-2"><Phone className="w-4 h-4" />Contact</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>Phone *</Label><Input className="mt-1" value={b.phone} onChange={e => setB({ ...b, phone: e.target.value })} placeholder="+91 98765 43210" /></div>
            <div><Label>WhatsApp</Label><Input className="mt-1" value={b.whatsapp} onChange={e => setB({ ...b, whatsapp: e.target.value })} placeholder="+91 98765 43210" /></div>
            <div><Label>Email</Label><Input className="mt-1" value={b.email} onChange={e => setB({ ...b, email: e.target.value })} placeholder="you@business.com" /></div>
            <div><Label>Website</Label><Input className="mt-1" value={b.website} onChange={e => setB({ ...b, website: e.target.value })} placeholder="https://yourbusiness.in" /></div>
          </div>
        </CardContent></Card>

        {/* SERVICES + PRICING */}
        <Card><CardContent className="p-5 space-y-3">
          <h3 className="font-bold flex items-center gap-2"><IndianRupee className="w-4 h-4" />Services & Pricing</h3>
          <div>
            <Label>Services offered</Label>
            <div className="flex gap-2 mt-1">
              <Input value={serviceInput} onChange={e => setServiceInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && serviceInput.trim()) { setB(x => ({ ...x, services: [...x.services, serviceInput.trim()] })); setServiceInput(''); } }} placeholder="e.g., AC Installation" />
              <Button variant="outline" onClick={() => { if (serviceInput.trim()) { setB(x => ({ ...x, services: [...x.services, serviceInput.trim()] })); setServiceInput(''); } }}><PlusCircle className="w-4 h-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {b.services.map((s, i) => (
                <Badge key={i} className="bg-blue-100 text-blue-800 hover:bg-blue-100 pr-1">{s}<button onClick={() => setB(x => ({ ...x, services: x.services.filter((_, j) => j !== i) }))} className="ml-1"><X className="w-3 h-3" /></button></Badge>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div><Label>Price From (₹)</Label><Input className="mt-1" type="number" value={b.priceFrom} onChange={e => setB({ ...b, priceFrom: e.target.value })} /></div>
            <div><Label>Price To (₹)</Label><Input className="mt-1" type="number" value={b.priceTo} onChange={e => setB({ ...b, priceTo: e.target.value })} /></div>
            {isDoctor && <div><Label>Consultation Fee (₹)</Label><Input className="mt-1" type="number" value={b.fees} onChange={e => setB({ ...b, fees: e.target.value })} /></div>}
          </div>
          <div>
            <Label>Offers / Discounts</Label>
            <div className="flex gap-2 mt-1">
              <Input value={offerInput} onChange={e => setOfferInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && offerInput.trim()) { setB(x => ({ ...x, offers: [...x.offers, offerInput.trim()] })); setOfferInput(''); } }} placeholder="e.g., Flat 20% off on first booking" />
              <Button variant="outline" onClick={() => { if (offerInput.trim()) { setB(x => ({ ...x, offers: [...x.offers, offerInput.trim()] })); setOfferInput(''); } }}><PlusCircle className="w-4 h-4" /></Button>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              {b.offers.map((o, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-1.5 rounded-md bg-orange-50 border border-orange-200 text-orange-800 text-sm">
                  <span>🎉 {o}</span>
                  <button onClick={() => setB(x => ({ ...x, offers: x.offers.filter((_, j) => j !== i) }))}><X className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        </CardContent></Card>

        {/* TIMINGS */}
        <Card><CardContent className="p-5 space-y-3">
          <h3 className="font-bold flex items-center gap-2"><Clock className="w-4 h-4" />Business Timings</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>Working Days</Label><Input className="mt-1" value={b.timings.days} onChange={e => setB({ ...b, timings: { ...b.timings, days: e.target.value } })} /></div>
            <div><Label>Weekly Off</Label><Input className="mt-1" value={b.timings.holiday} onChange={e => setB({ ...b, timings: { ...b.timings, holiday: e.target.value } })} /></div>
            <div><Label>Morning Hours</Label><Input className="mt-1" value={b.timings.morning} onChange={e => setB({ ...b, timings: { ...b.timings, morning: e.target.value } })} /></div>
            <div><Label>Evening Hours</Label><Input className="mt-1" value={b.timings.evening} onChange={e => setB({ ...b, timings: { ...b.timings, evening: e.target.value } })} /></div>
          </div>
        </CardContent></Card>

        {/* PAYMENT */}
        <Card><CardContent className="p-5 space-y-3">
          <h3 className="font-bold flex items-center gap-2"><CreditCard className="w-4 h-4" />Payment Setup (Your own gateway)</h3>
          <p className="text-xs text-slate-500">Customers will pay you directly using these methods — Search2Service takes no cut.</p>
          <div>
            <Label>Accepted Payment Methods</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {PAYMENT_METHODS.map(m => (
                <button key={m} onClick={() => togglePM(m)} className={`px-3 py-1.5 rounded-full border text-sm ${b.paymentMethods.includes(m) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}>{m}</button>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>UPI ID</Label><Input className="mt-1" value={b.upi} onChange={e => setB({ ...b, upi: e.target.value })} placeholder="yourname@paytm" /></div>
            <div><Label>Razorpay Key ID (optional)</Label><Input className="mt-1" value={b.razorpayKeyId} onChange={e => setB({ ...b, razorpayKeyId: e.target.value })} placeholder="rzp_live_xxxxxxxxxx" /></div>
          </div>
          <div className="text-xs text-slate-500 flex gap-2 items-start"><Wallet className="w-4 h-4 flex-shrink-0 mt-0.5" /><span>Your UPI ID is shown on your profile so customers can pay directly. Razorpay Key ID is optional — add it if you want a “Pay Online” button on your booking flow.</span></div>
        </CardContent></Card>

        {/* JOB PUBLISH */}
        <Card><CardContent className="p-5 space-y-4">
          <div>
            <h3 className="font-bold flex items-center gap-2"><Briefcase className="w-4 h-4" />Publish a Job Opening</h3>
            <p className="text-xs text-slate-500 mt-0.5">Hiring? Post a job opening — it appears on the Search2Service Jobs page under your business name.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2"><Label>Job Title *</Label><Input className="mt-1" value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} placeholder="e.g., Front Desk Executive" /></div>
            <div>
              <Label>Job Type</Label>
              <Select value={newJob.type} onValueChange={v => setNewJob({ ...newJob, type: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Experience Required</Label><Input className="mt-1" value={newJob.experience} onChange={e => setNewJob({ ...newJob, experience: e.target.value })} placeholder="e.g., 1-3 yrs" /></div>
            <div className="sm:col-span-2"><Label>Salary</Label><Input className="mt-1" value={newJob.salary} onChange={e => setNewJob({ ...newJob, salary: e.target.value })} placeholder="e.g., ₹15,000 - 25,000 / month" /></div>
            <div className="sm:col-span-2"><Label>Job Description</Label><Textarea className="mt-1" rows={3} value={newJob.description} onChange={e => setNewJob({ ...newJob, description: e.target.value })} placeholder="Responsibilities, requirements, perks…" /></div>
          </div>
          <div className="flex justify-end">
            <Button onClick={publishJob} disabled={postingJob} className="bg-blue-600 hover:bg-blue-500 text-white">
              {postingJob ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Briefcase className="w-4 h-4 mr-2" />}
              {postingJob ? 'Publishing…' : 'Publish Job'}
            </Button>
          </div>

          {jobs.length > 0 && (
            <div className="pt-3 border-t space-y-2">
              <Label>Your Published Jobs ({jobs.length})</Label>
              {jobs.map(j => (
                <div key={j.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <div className="text-sm font-semibold">{j.title}</div>
                    <div className="text-xs text-slate-500">{j.type} • {j.experience} • {j.salary}</div>
                  </div>
                  <button onClick={() => deleteJob(j.id)} className="text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          )}
          {loadingJobs && jobs.length === 0 && <div className="text-xs text-slate-400">Loading your jobs…</div>}
        </CardContent></Card>

        <div className="flex justify-end pt-2">
          <Button onClick={save} disabled={saving} size="lg" className="bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90 text-white"><Save className="w-4 h-4 mr-2" />{saving ? 'Saving...' : 'Save & Go Live'}</Button>
        </div>
      </div>
    </div>
  );
}

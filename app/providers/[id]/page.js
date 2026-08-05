'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { FileUploader } from '@/components/file-uploader';
import {
  ChevronLeft, MapPin, Star, ShieldCheck, Phone, MessageCircle, Mail, Globe, Clock, IndianRupee,
  Award, CheckCircle2, Calendar, User, Send
} from 'lucide-react';

export default function ProviderPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ userName: '', rating: 5, comment: '', photos: [] });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/providers/${id}`).then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, [id]);

  const submitReview = async () => {
    if (!reviewForm.userName || !reviewForm.comment) { toast.error('Please add your name and review'); return; }
    setSubmitting(true);
    const res = await fetch('/api/reviews', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ providerId: id, ...reviewForm }),
    }).then(r => r.json());
    setSubmitting(false);
    if (res.ok) {
      toast.success('Thanks for your review!');
      setReviewForm({ userName: '', rating: 5, comment: '', photos: [] });
      const d = await fetch(`/api/providers/${id}`).then(r => r.json()); setData(d);
    } else toast.error('Failed to submit');
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading...</div>;
  if (!data?.provider) return <div className="p-12 text-center">Provider not found</div>;

  const p = data.provider;
  const isDoctor = !!p.specialization;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"><ChevronLeft className="w-4 h-4" />Back</button>
          <Link href="/" className="flex items-center gap-2 ml-auto">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-orange-500 grid place-items-center text-white font-bold text-xs">S2</div>
            <span className="font-bold">Search2Service</span>
          </Link>
        </div>
      </header>

      {/* BANNER */}
      <div className="h-56 md:h-72 bg-cover bg-center relative" style={{ backgroundImage: `url(${p.banner || p.images?.[0]})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 container mx-auto px-4 pb-5 text-white">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {p.premium && <Badge className="bg-orange-500 hover:bg-orange-500"><Award className="w-3 h-3 mr-1" />PREMIUM</Badge>}
                {p.verified && <Badge className="bg-emerald-500 hover:bg-emerald-500"><ShieldCheck className="w-3 h-3 mr-1" />VERIFIED</Badge>}
                <Badge variant="outline" className="border-white/50 text-white">{p.categoryName}</Badge>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold">{p.name}</h1>
              {isDoctor && <div className="text-orange-200 mt-1">{p.specialization} • {p.qualification} • {p.experience}+ years experience</div>}
              <div className="flex items-center gap-3 mt-2 text-sm">
                <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /><b>{p.rating}</b> <span className="text-slate-200">({p.reviewCount} reviews)</span></span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{p.area}, {p.city}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <a href={`tel:${p.phone}`}><Button className="bg-white text-blue-700 hover:bg-blue-50"><Phone className="w-4 h-4 mr-2" />Call Now</Button></a>
              <a href={`https://wa.me/${p.whatsapp?.replace(/\D/g,'')}`} target="_blank"><Button className="bg-emerald-500 hover:bg-emerald-600 text-white"><MessageCircle className="w-4 h-4 mr-2" />WhatsApp</Button></a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 grid lg:grid-cols-[1fr_360px] gap-6">
        <div>
          <Tabs defaultValue="overview">
            <TabsList className="bg-white border">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({data.reviews.length})</TabsTrigger>
              {isDoctor && <TabsTrigger value="book">Book Appointment</TabsTrigger>}
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-4">
              <Card><CardContent className="p-6">
                <h3 className="font-bold mb-2">About</h3>
                <p className="text-slate-700">{p.description}</p>
              </CardContent></Card>

              <Card><CardContent className="p-6">
                <h3 className="font-bold mb-3">Services</h3>
                <div className="flex flex-wrap gap-2">
                  {p.services?.map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm"><CheckCircle2 className="w-3.5 h-3.5" />{s}</div>
                  ))}
                </div>
                {p.offers?.length > 0 && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="font-semibold text-orange-700 mb-1">Special Offers</div>
                    {p.offers.map((o, i) => <div key={i} className="text-sm text-orange-800">🎉 {o}</div>)}
                  </div>
                )}
              </CardContent></Card>

              <Card><CardContent className="p-6">
                <h3 className="font-bold mb-3">Timings</h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-500" /><b>{p.timings?.days}</b></div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-500" />Morning: {p.timings?.morning}</div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-500" />Evening: {p.timings?.evening}</div>
                  <div className="flex items-center gap-2 text-rose-600"><Clock className="w-4 h-4" />Closed: {p.timings?.holiday}</div>
                </div>
              </CardContent></Card>
            </TabsContent>

            <TabsContent value="gallery" className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {p.images?.map((img, i) => (
                  <div key={i} className="aspect-video bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${img})` }} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-4 space-y-4">
              <Card><CardContent className="p-6">
                <h3 className="font-bold mb-3">Write a Review</h3>
                <div className="grid gap-3">
                  <Input placeholder="Your name" value={reviewForm.userName} onChange={e => setReviewForm({ ...reviewForm, userName: e.target.value })} />
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">Rating:</span>
                    {[1,2,3,4,5].map(n => (
                      <button key={n} onClick={() => setReviewForm({ ...reviewForm, rating: n })}>
                        <Star className={`w-6 h-6 ${n <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                  <Textarea placeholder="Share your experience..." value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} rows={3} />
                  <div>
                    <div className="text-xs text-slate-500 mb-2">Add photos (optional)</div>
                    <FileUploader
                      context="review-photo"
                      providerId={id}
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      buttonLabel="Add photos to your review"
                      onUploaded={(files) => setReviewForm(f => ({ ...f, photos: [...(f.photos || []), ...(Array.isArray(files) ? files : [files])].map(x => x.url) }))}
                    />
                  </div>
                  <Button onClick={submitReview} disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white"><Send className="w-4 h-4 mr-2" />{submitting ? 'Submitting...' : 'Submit Review'}</Button>
                </div>
              </CardContent></Card>

              {data.reviews.length === 0 && <div className="text-slate-500 text-sm text-center py-6">No reviews yet. Be the first!</div>}
              {data.reviews.map(r => (
                <Card key={r.id}><CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 grid place-items-center text-white font-bold">{r.userName[0]}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold">{r.userName}</div>
                        <div className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="flex mt-0.5">{[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />)}</div>
                      <p className="text-slate-700 text-sm mt-1">{r.comment}</p>
                      {r.photos?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {r.photos.map((url, i) => (
                            <a key={i} href={url} target="_blank" rel="noreferrer">
                              <img src={url} alt="review" className="w-16 h-16 object-cover rounded border hover:scale-105 transition-transform" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent></Card>
              ))}
            </TabsContent>

            {isDoctor && (
              <TabsContent value="book" className="mt-4">
                <Card><CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Book Appointment</h3>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div><div className="font-semibold">Consultation Fee</div><div className="text-xs text-slate-500">Per visit</div></div>
                      <div className="font-bold text-lg flex items-center"><IndianRupee className="w-4 h-4" />{p.fees}</div>
                    </div>
                    <Input placeholder="Patient name" />
                    <Input placeholder="Phone number" />
                    <Input type="date" />
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline">Morning Slot</Button>
                      <Button variant="outline">Evening Slot</Button>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => toast.success('Appointment request sent! Provider will confirm via WhatsApp/SMS.')}><Calendar className="w-4 h-4 mr-2" />Confirm Appointment</Button>
                    <div className="text-xs text-center text-slate-500">Full payment & video consultation coming in Phase 10</div>
                  </div>
                </CardContent></Card>
              </TabsContent>
            )}
          </Tabs>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-4">
          <Card><CardContent className="p-5 space-y-3">
            <h3 className="font-bold">Contact Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-blue-600" />{p.phone}</div>
              <div className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-emerald-600" />{p.whatsapp}</div>
              <div className="flex items-start gap-2"><Mail className="w-4 h-4 text-slate-600 mt-0.5" /><span className="break-all">{p.email}</span></div>
              {p.website && <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-slate-600" /><a href={p.website} target="_blank" className="text-blue-600 hover:underline">{p.website}</a></div>}
              <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-rose-600 mt-0.5" /><span>{p.address}</span></div>
            </div>
            <div className="pt-2">
              <Button variant="outline" className="w-full" asChild>
                <a target="_blank" href={`https://maps.google.com/?q=${encodeURIComponent(p.address)}`}><MapPin className="w-4 h-4 mr-2" />View on Map</a>
              </Button>
            </div>
          </CardContent></Card>

          <Card><CardContent className="p-5">
            <h3 className="font-bold mb-2">Pay via UPI</h3>
            <div className="bg-slate-100 rounded-lg p-3 text-sm break-all">{p.upi}</div>
            <Button variant="outline" className="w-full mt-2" size="sm" onClick={() => { navigator.clipboard.writeText(p.upi); toast.success('UPI ID copied'); }}>Copy UPI ID</Button>
          </CardContent></Card>

          {data.similar?.length > 0 && (
            <Card><CardContent className="p-5">
              <h3 className="font-bold mb-3">Similar Providers</h3>
              <div className="space-y-3">
                {data.similar.map(s => (
                  <Link key={s.id} href={`/providers/${s.id}`} className="flex gap-3 hover:bg-slate-50 rounded p-1">
                    <div className="w-14 h-14 rounded bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url(${s.images?.[0]})` }} />
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate">{s.name}</div>
                      <div className="text-xs text-slate-500">{s.area}, {s.city}</div>
                      <div className="flex items-center gap-1 text-xs"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{s.rating}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent></Card>
          )}
        </aside>
      </div>
    </div>
  );
}

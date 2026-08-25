'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/use-auth';
import { Store, Users, ClipboardList, Star, Image as ImageIcon, TrendingUp, Wallet, LogOut, Sparkles, ExternalLink, Crown } from 'lucide-react';

export default function ProviderDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [biz, setBiz] = useState(null);
  const [analytics, setAnalytics] = useState({ views: 0, leads: 0, bookings: 0, revenue: 0, reviews: 0, rating: 0 });
  const [bookingStats, setBookingStats] = useState({ total: 0, pending: 0 });

  useEffect(() => {
    if (!loading && !user) router.replace('/auth?next=/provider/dashboard');
    else if (user && !['provider', 'admin', 'super_admin'].includes(user.role)) router.replace('/');
    else if (user && user.role === 'provider' && !user.plan) router.replace('/provider/plan');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/provider/business').then(r => r.json()).then(d => setBiz(d.business));
    fetch('/api/provider/analytics').then(r => r.json()).then(setAnalytics);
    fetch('/api/provider/bookings').then(r => r.json()).then(d => setBookingStats(d.stats || { total: 0, pending: 0 }));
  }, [user]);

  if (loading || !user) return <div className="p-12 text-center text-slate-500">Loading...</div>;

  const stats = [
    { icon: Users, label: 'Total Leads', value: analytics.leads, color: 'from-blue-500 to-indigo-600' },
    { icon: ClipboardList, label: 'Bookings', value: bookingStats.total, color: 'from-emerald-500 to-teal-600' },
    { icon: Star, label: 'Avg Rating', value: analytics.rating || '—', color: 'from-amber-500 to-orange-600' },
    { icon: Wallet, label: 'Revenue', value: `₹${(analytics.revenue || 0).toLocaleString('en-IN')}`, color: 'from-fuchsia-500 to-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 grid place-items-center text-white font-bold text-xs">S2</div>
            <span className="font-bold">Provider Portal</span>
          </Link>
          <div className="flex-1" />
          <div className="text-sm text-slate-600 hidden sm:block">{user.name}</div>
          <Button size="sm" variant="outline" onClick={async () => { await logout(); router.push('/'); }}><LogOut className="w-3.5 h-3.5 mr-1" />Sign out</Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white border-0 mb-6 overflow-hidden relative">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          <CardContent className="p-8 flex flex-col md:flex-row md:items-center gap-4 relative">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur grid place-items-center"><Store className="w-8 h-8" /></div>
            <div className="flex-1">
              <div className="text-2xl font-bold">Welcome, {user.name}!</div>
              <div className="text-orange-50 text-sm">{biz ? <>Your business <b>{biz.name}</b> is live in search. {bookingStats.pending > 0 && <span className="text-yellow-100">You have {bookingStats.pending} pending booking{bookingStats.pending > 1 ? 's' : ''} to review.</span>}</> : "Your business isn't listed yet — complete onboarding to start receiving leads."}</div>
            </div>
            <div className="flex gap-2">
              <Link href="/provider/business"><Button className="bg-white text-orange-700 hover:bg-orange-50 font-semibold"><Sparkles className="w-4 h-4 mr-1" />{biz ? 'Edit Business' : 'Complete Business Setup'}</Button></Link>
              {biz && <Link href={`/providers/${biz.id}`}><Button variant="outline" className="border-white/50 text-white hover:bg-white/10"><ExternalLink className="w-4 h-4 mr-1" />View Live</Button></Link>}
            </div>
          </CardContent>
        </Card>

        {(user.plan || 'basic') === 'basic' ? (
          <Card className="mb-6 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
            <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 grid place-items-center text-white flex-shrink-0"><Crown className="w-5 h-5" /></div>
                <div>
                  <div className="font-semibold text-sm">You're on the Basic (Free) plan</div>
                  <div className="text-xs text-slate-500">Upgrade to Premium for priority placement, unlimited photos & the PREMIUM badge.</div>
                </div>
              </div>
              <Link href="/provider/plan"><Button size="sm" className="bg-gradient-to-r from-amber-500 to-red-600 hover:opacity-90 text-white whitespace-nowrap">View Plans</Button></Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 border-emerald-200 bg-emerald-50">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800"><Crown className="w-4 h-4" />You're on the Premium plan — priority placement active</div>
              <Link href="/provider/plan"><Button size="sm" variant="outline" className="text-xs">Manage Plan</Button></Link>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map(s => (
            <Card key={s.label}><CardContent className="p-5">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} grid place-items-center text-white mb-2`}><s.icon className="w-5 h-5" /></div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </CardContent></Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {[
            { href: '/provider/business', icon: Store, title: 'Business Profile', desc: 'Set up shop banner, gallery, timings, services & pricing', color: 'from-blue-500 to-indigo-700' },
            { href: '/provider/bookings', icon: ClipboardList, title: 'Booking Manager', desc: `View and confirm incoming appointments${bookingStats.pending ? ` — ${bookingStats.pending} pending` : ''}`, color: 'from-emerald-500 to-teal-700' },
            { href: '/provider/gallery', icon: ImageIcon, title: 'Gallery & Media', desc: 'Upload photos, videos and offer banners', color: 'from-fuchsia-500 to-purple-700' },
            { href: '/provider/analytics', icon: TrendingUp, title: 'Analytics', desc: 'Track views, clicks, and conversion trends', color: 'from-amber-500 to-orange-700' },
            { href: '/provider/plan', icon: Crown, title: 'Subscription Plan', desc: `Currently on ${(user.plan || 'basic') === 'premium' ? 'Premium' : 'Basic (Free)'} — upgrade or manage your plan`, color: 'from-amber-500 to-red-600' },
          ].map(t => (
            <Link key={t.title} href={t.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.color} grid place-items-center text-white flex-shrink-0`}><t.icon className="w-6 h-6" /></div>
                  <div>
                    <div className="font-bold">{t.title}</div>
                    <div className="text-sm text-slate-500 mt-1">{t.desc}</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

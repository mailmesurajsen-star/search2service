'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/lib/use-auth';
import { ChevronLeft, Eye, TrendingUp, Users, ClipboardList, Star, Wallet, MessageCircle } from 'lucide-react';

export default function ProviderAnalyticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState({ views: 0, leads: 0, bookings: 0, revenue: 0, reviews: 0, rating: 0, series: [] });

  useEffect(() => {
    if (!loading && !user) router.replace('/auth?next=/provider/analytics');
    else if (user && !['provider', 'admin', 'super_admin'].includes(user.role)) router.replace('/');
  }, [user, loading, router]);
  useEffect(() => { fetch('/api/provider/analytics').then(r => r.json()).then(setData); }, []);

  const maxV = Math.max(1, ...data.series.map(s => s.views));

  if (loading || !user) return <div className="p-12 text-center text-slate-500">Loading...</div>;

  const kpis = [
    { icon: Eye, label: 'Profile Views (7d)', value: data.views, color: 'from-blue-500 to-indigo-600' },
    { icon: MessageCircle, label: 'Leads (7d)', value: data.leads, color: 'from-emerald-500 to-teal-600' },
    { icon: ClipboardList, label: 'Bookings', value: data.bookings, color: 'from-fuchsia-500 to-purple-600' },
    { icon: Wallet, label: 'Est. Revenue', value: `₹${(data.revenue || 0).toLocaleString('en-IN')}`, color: 'from-amber-500 to-orange-600' },
    { icon: Star, label: 'Rating', value: data.rating || '—', color: 'from-rose-500 to-pink-600' },
    { icon: Users, label: 'Reviews', value: data.reviews, color: 'from-slate-700 to-slate-900' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <Link href="/provider/dashboard" className="flex items-center gap-1 text-sm"><ChevronLeft className="w-4 h-4" />Dashboard</Link>
          <h1 className="font-bold ml-2">Analytics</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {kpis.map(k => (
            <Card key={k.label}><CardContent className="p-4">
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${k.color} grid place-items-center text-white mb-2`}><k.icon className="w-4 h-4" /></div>
              <div className="text-xl font-bold">{k.value}</div>
              <div className="text-[11px] text-slate-500">{k.label}</div>
            </CardContent></Card>
          ))}
        </div>

        <Card><CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="font-bold flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-600" />Weekly traffic</div>
            <div className="text-xs text-slate-500">Last 7 days</div>
          </div>
          <div className="h-48 flex items-end justify-between gap-3">
            {data.series.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center gap-1" style={{ height: 160 }}>
                  <div className="w-full flex items-end gap-1 h-full">
                    <div className="flex-1 rounded-t bg-gradient-to-t from-blue-600 to-blue-400" style={{ height: `${(s.views / maxV) * 100}%` }} title={`Views: ${s.views}`} />
                    <div className="flex-1 rounded-t bg-gradient-to-t from-emerald-500 to-emerald-300" style={{ height: `${(s.leads / maxV) * 100}%` }} title={`Leads: ${s.leads}`} />
                  </div>
                </div>
                <div className="text-xs text-slate-500">{s.day}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-slate-600">
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500 inline-block" />Views</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500 inline-block" />Leads</div>
          </div>
        </CardContent></Card>
      </div>
    </div>
  );
}

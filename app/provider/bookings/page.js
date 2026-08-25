'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/use-auth';
import { toast } from 'sonner';
import { ChevronLeft, ClipboardList, Phone, Calendar, User, CheckCircle2, XCircle, Clock } from 'lucide-react';

const STATUS_STYLE = {
  pending: { color: 'bg-amber-100 text-amber-800', icon: Clock },
  confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle2 },
  completed: { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle2 },
  cancelled: { color: 'bg-rose-100 text-rose-800', icon: XCircle },
};

export default function ProviderBookingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!loading && !user) router.replace('/auth?next=/provider/bookings');
    else if (user && !['provider', 'admin', 'super_admin'].includes(user.role)) router.replace('/');
    else if (user && user.role === 'provider' && !user.plan) router.replace('/provider/plan');
  }, [user, loading, router]);

  const load = () => fetch('/api/provider/bookings').then(r => r.json()).then(d => { setItems(d.items || []); setStats(d.stats || {}); });
  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    const r = await fetch(`/api/provider/bookings/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    if (r.ok) { toast.success(`Booking ${status}`); load(); }
    else toast.error('Failed to update');
  };

  const filtered = filter === 'all' ? items : items.filter(b => b.status === filter);

  if (loading || !user) return <div className="p-12 text-center text-slate-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <Link href="/provider/dashboard" className="flex items-center gap-1 text-sm"><ChevronLeft className="w-4 h-4" />Dashboard</Link>
          <h1 className="font-bold ml-2">Booking Manager</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(k => (
            <button key={k} onClick={() => setFilter(k)} className={`p-4 rounded-xl border-2 text-left transition-all ${filter === k ? 'border-blue-500 bg-white shadow' : 'border-transparent bg-white hover:border-slate-200'}`}>
              <div className="text-xs uppercase text-slate-500 font-medium">{k}</div>
              <div className="text-2xl font-bold">{k === 'all' ? stats.total || items.length : stats[k] || 0}</div>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <Card><CardContent className="p-12 text-center">
            <ClipboardList className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <div className="font-semibold">No bookings yet</div>
            <div className="text-slate-500 text-sm mt-1">Complete your business profile so customers can book you.</div>
            <Link href="/provider/business"><Button className="mt-4 bg-blue-600 text-white">Complete Setup</Button></Link>
          </CardContent></Card>
        ) : (
          <div className="space-y-3">
            {filtered.map(b => {
              const S = STATUS_STYLE[b.status] || STATUS_STYLE.pending;
              return (
                <Card key={b.id}><CardContent className="p-4">
                  <div className="flex flex-wrap gap-4 items-start">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 grid place-items-center text-white font-bold">{b.customerName[0]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold">{b.customerName}</div>
                        <Badge className={`${S.color} hover:${S.color}`}><S.icon className="w-3 h-3 mr-1" />{b.status}</Badge>
                      </div>
                      <div className="text-sm text-slate-500 mt-1 flex flex-wrap gap-3">
                        <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{b.customerPhone || '—'}</span>
                        {b.service && <span>Service: <b>{b.service}</b></span>}
                        {b.date && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{b.date}</span>}
                        {b.slot && <span className="capitalize">Slot: {b.slot}</span>}
                      </div>
                      {b.note && <div className="text-sm text-slate-700 mt-2 bg-slate-50 rounded p-2">{b.note}</div>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {b.status === 'pending' && <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setStatus(b.id, 'confirmed')}>Confirm</Button>}
                      {b.status === 'confirmed' && <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setStatus(b.id, 'completed')}>Mark Completed</Button>}
                      {b.status !== 'cancelled' && b.status !== 'completed' && <Button size="sm" variant="outline" onClick={() => setStatus(b.id, 'cancelled')}>Cancel</Button>}
                    </div>
                  </div>
                </CardContent></Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/use-auth';
import { Users, Building2, Stethoscope, Briefcase, TrendingUp, ShieldCheck, LogOut, Settings, MessageSquare, Layers, Map, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ providers: 0, doctors: 0, categories: 0, customers: 0, reviews: 0 });

  useEffect(() => {
    if (!loading && !user) router.replace('/auth?next=/admin/dashboard&role=admin');
    else if (user && !['admin', 'super_admin'].includes(user.role)) router.replace('/');
  }, [user, loading, router]);

  useEffect(() => { fetch('/api/stats').then(r => r.json()).then(setStats); }, []);

  if (loading || !user) return <div className="p-12 text-center text-slate-500">Loading...</div>;

  const tiles = [
    { icon: Users, label: 'Customers', value: stats.customers?.toLocaleString?.() || 0, color: 'from-blue-500 to-indigo-700' },
    { icon: Building2, label: 'Providers', value: stats.providers, color: 'from-orange-500 to-red-600' },
    { icon: Stethoscope, label: 'Doctors', value: stats.doctors, color: 'from-rose-500 to-pink-600' },
    { icon: Layers, label: 'Categories', value: stats.categories, color: 'from-emerald-500 to-teal-700' },
    { icon: MessageSquare, label: 'Reviews', value: stats.reviews, color: 'from-amber-500 to-orange-600' },
    { icon: DollarSign, label: 'Revenue', value: '₹0', color: 'from-slate-700 to-slate-900' },
  ];

  const mgmt = [
    { icon: Building2, title: 'Provider Management', desc: 'Approve, edit, or feature providers', color: 'from-blue-500 to-indigo-700' },
    { icon: Layers, title: 'Category Management', desc: 'Add, edit or reorder services & subcategories', color: 'from-emerald-500 to-teal-700' },
    { icon: Map, title: 'Location Management', desc: 'States, Districts, Cities, Areas', color: 'from-purple-500 to-fuchsia-700' },
    { icon: TrendingUp, title: 'Analytics & Reports', desc: 'Complete platform insights and exports', color: 'from-amber-500 to-orange-700' },
    { icon: ShieldCheck, title: 'Role & Permissions', desc: 'Manage State/District Managers and Admins', color: 'from-slate-700 to-slate-900' },
    { icon: Settings, title: 'CMS & Settings', desc: 'FAQs, banners, coupons, notifications, SEO', color: 'from-rose-500 to-pink-700' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-800">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-orange-500 grid place-items-center text-white font-bold text-xs">S2</div>
            <span className="font-bold">Admin Console</span>
          </Link>
          <div className="flex-1" />
          <span className="text-xs bg-white/10 rounded-full px-3 py-1">{user.role.replace('_', ' ').toUpperCase()}</span>
          <Button size="sm" variant="outline" className="text-slate-900" onClick={async () => { await logout(); router.push('/'); }}><LogOut className="w-3.5 h-3.5 mr-1" />Sign out</Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Platform Overview</h1>
          <p className="text-slate-500 mt-1">Real-time stats and management tools for Search2Service</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {tiles.map(t => (
            <Card key={t.label}><CardContent className="p-4">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${t.color} grid place-items-center text-white mb-2`}><t.icon className="w-5 h-5" /></div>
              <div className="text-2xl font-bold">{t.value}</div>
              <div className="text-xs text-slate-500">{t.label}</div>
            </CardContent></Card>
          ))}
        </div>

        <h2 className="font-bold text-xl mb-4">Management</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mgmt.map(m => (
            <Card key={m.title} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.color} grid place-items-center text-white mb-3`}><m.icon className="w-6 h-6" /></div>
                <div className="font-bold">{m.title}</div>
                <div className="text-sm text-slate-500 mt-1">{m.desc}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

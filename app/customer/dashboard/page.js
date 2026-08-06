'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/use-auth';
import { User, Bookmark, Heart, Bell, Star, Wallet, ClipboardList, LogOut, ChevronRight } from 'lucide-react';

export default function CustomerDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/auth?next=/customer/dashboard');
    else if (user && !['customer', 'provider', 'admin', 'super_admin'].includes(user.role)) router.replace('/');
  }, [user, loading, router]);

  if (loading || !user) return <div className="p-12 text-center text-slate-500">Loading...</div>;

  const tiles = [
    { icon: Bookmark, label: 'My Bookings', count: 0, color: 'from-blue-500 to-blue-700' },
    { icon: ClipboardList, label: 'Appointments', count: 0, color: 'from-emerald-500 to-teal-600' },
    { icon: Heart, label: 'Wishlist', count: 0, color: 'from-rose-500 to-pink-600' },
    { icon: Star, label: 'My Reviews', count: 0, color: 'from-amber-500 to-orange-600' },
    { icon: Bell, label: 'Notifications', count: 0, color: 'from-purple-500 to-fuchsia-600' },
    { icon: Wallet, label: 'Wallet', count: '₹0', color: 'from-slate-700 to-slate-900' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-orange-500 grid place-items-center text-white font-bold text-xs">S2</div>
            <span className="font-bold">Search2Service</span>
          </Link>
          <div className="flex-1" />
          <div className="text-sm text-slate-600 hidden sm:block">Hi, {user.name}</div>
          <Button size="sm" variant="outline" onClick={async () => { await logout(); router.push('/'); }}><LogOut className="w-3.5 h-3.5 mr-1" />Sign out</Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card className="bg-gradient-to-br from-blue-600 to-orange-500 text-white border-0 mb-6">
          <CardContent className="p-8 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur grid place-items-center text-2xl font-bold">{user.name[0]}</div>
            <div>
              <div className="text-2xl font-bold">{user.name}</div>
              <div className="text-blue-50 text-sm">{user.email}</div>
              <div className="text-xs mt-1 opacity-90">Customer Account • Member since {new Date(user.createdAt).toLocaleDateString()}</div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {tiles.map(t => (
            <Card key={t.label} className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-5 flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${t.color} grid place-items-center text-white`}><t.icon className="w-5 h-5" /></div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{t.label}</div>
                  <div className="text-2xl font-bold">{t.count}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card><CardContent className="p-6">
          <h3 className="font-bold mb-3">Explore</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link href="/" className="p-4 rounded-lg bg-slate-50 hover:bg-blue-50 border block">
              <div className="font-semibold">Browse services →</div>
              <div className="text-sm text-slate-500">Find and book from 300+ providers</div>
            </Link>
            <Link href="/categories" className="p-4 rounded-lg bg-slate-50 hover:bg-blue-50 border block">
              <div className="font-semibold">All 84 categories →</div>
              <div className="text-sm text-slate-500">Healthcare, home services, jobs & more</div>
            </Link>
          </div>
        </CardContent></Card>
      </div>
    </div>
  );
}

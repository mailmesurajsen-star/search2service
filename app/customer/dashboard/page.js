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

  if (loading || !user) return <div className="p-12 text-center text-muted-foreground">Loading...</div>;

  const tiles = [
    { icon: Bookmark, label: 'My Bookings', count: 0, color: 'from-primary to-primary/80' },
    { icon: ClipboardList, label: 'Appointments', count: 0, color: 'from-accent to-accent/80' },
    { icon: Heart, label: 'Wishlist', count: 0, color: 'from-primary to-primary/80' },
    { icon: Star, label: 'My Reviews', count: 0, color: 'from-[#F5A623] to-[#D97706]' },
    { icon: Bell, label: 'Notifications', count: 0, color: 'from-accent to-accent/80' },
    { icon: Wallet, label: 'Wallet', count: '₹0', color: 'from-primary to-primary/80' },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center text-white font-bold text-xs">S2</div>
            <span className="font-bold">Search2Service</span>
          </Link>
          <div className="flex-1" />
          <div className="text-sm text-muted-foreground hidden sm:block">Hi, {user.name}</div>
          <Button size="sm" variant="outline" onClick={async () => { await logout(); router.push('/'); }}><LogOut className="w-3.5 h-3.5 mr-1" />Sign out</Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card className="bg-primary text-white border-0 mb-6">
          <CardContent className="p-8 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur grid place-items-center text-2xl font-bold">{user.name[0]}</div>
            <div>
              <div className="text-2xl font-bold">{user.name}</div>
              <div className="text-white/80 text-sm">{user.email}</div>
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
                <ChevronRight className="w-4 h-4 text-border group-hover:text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card><CardContent className="p-6">
          <h3 className="font-bold mb-3">Explore</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link href="/" className="p-4 rounded-lg bg-muted/50 hover:bg-accent/10 border block">
              <div className="font-semibold">Browse services →</div>
              <div className="text-sm text-muted-foreground">Find and book from 300+ providers</div>
            </Link>
            <Link href="/categories" className="p-4 rounded-lg bg-muted/50 hover:bg-accent/10 border block">
              <div className="font-semibold">All 84 categories →</div>
              <div className="text-sm text-muted-foreground">Healthcare, home services, jobs & more</div>
            </Link>
          </div>
        </CardContent></Card>
      </div>
    </div>
  );
}

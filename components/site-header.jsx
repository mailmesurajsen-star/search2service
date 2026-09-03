'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/use-auth';
import { Landmark, Search } from 'lucide-react';

export function SiteHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/85 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center text-white shadow-sm">
            <Search className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg leading-none tracking-tight text-foreground">Search2Service</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <Link href="/categories" className="hover:text-primary transition-colors">Services</Link>
          <Link href="/search?group=Job+%26+Career" className="hover:text-primary transition-colors">Jobs</Link>
          <Link href="/search?group=Government+Services" className="hover:text-primary transition-colors flex items-center gap-1.5"><Landmark className="w-4 h-4" />Govt Services</Link>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href={
                user.role === 'provider' ? '/provider/dashboard' :
                user.role === 'jobseeker' ? '/jobseeker/profile' :
                (user.role === 'admin' || user.role === 'super_admin') ? '/admin/dashboard' :
                '/customer/dashboard'
              }>
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <div className="w-6 h-6 rounded-full bg-primary grid place-items-center text-primary-foreground text-xs font-bold mr-1.5">{user.name[0]}</div>
                  {user.name.split(' ')[0]}
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={async () => { await logout(); router.push('/'); }}>Sign out</Button>
            </>
          ) : (
            <Link href="/auth?mode=login"><Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-5 font-semibold">Login / Register</Button></Link>
          )}
        </div>
      </div>
    </header>
  );
}

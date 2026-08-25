'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/use-auth';
import { Search, Landmark } from 'lucide-react';

export function SiteHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/85 border-b border-slate-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 grid place-items-center text-white">
            <Search className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg leading-none">Search<span className="text-indigo-600">2</span>Service</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-700">
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <Link href="/categories" className="hover:text-indigo-600">Services</Link>
          <Link href="/search?group=Job+%26+Career" className="hover:text-indigo-600">Jobs</Link>
          <Link href="/search?group=Government+Services" className="hover:text-indigo-600 flex items-center gap-1.5"><Landmark className="w-4 h-4" />Govt Services</Link>
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
                  <div className="w-6 h-6 rounded-full bg-indigo-600 grid place-items-center text-white text-xs font-bold mr-1.5">{user.name[0]}</div>
                  {user.name.split(' ')[0]}
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={async () => { await logout(); router.push('/'); }}>Sign out</Button>
            </>
          ) : (
            <Link href="/auth?mode=login"><Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-5">Login / Register</Button></Link>
          )}
        </div>
      </div>
    </header>
  );
}

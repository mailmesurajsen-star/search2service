'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 grid place-items-center text-amber-400 text-3xl font-black mb-6 shadow-2xl shadow-amber-500/10">
        404
      </div>

      <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
        Page Not Found
      </h1>
      <p className="text-slate-400 text-sm sm:text-base max-w-md mb-8">
        The page you are looking for doesn’t exist or has been moved. Explore thousands of verified local services across India.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white gap-2 font-bold px-6">
            <Home className="w-4 h-4" /> Go to Homepage
          </Button>
        </Link>
        <Link href="/search">
          <Button variant="outline" className="border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800 gap-2 font-semibold">
            <Search className="w-4 h-4" /> Search Services
          </Button>
        </Link>
      </div>
    </div>
  );
}

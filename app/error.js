'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Next.js Client Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/30 grid place-items-center text-red-400 mb-6 shadow-2xl shadow-red-500/10">
        <AlertTriangle className="w-10 h-10" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
        Something went wrong
      </h1>
      <p className="text-slate-400 text-sm max-w-md mb-8">
        {error?.message || 'An unexpected error occurred while loading this page. Please try refreshing or return home.'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          onClick={() => reset ? reset() : window.location.reload()}
          className="bg-red-600 hover:bg-red-500 text-white gap-2 font-bold px-6"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </Button>
        <Link href="/">
          <Button variant="outline" className="border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800 gap-2 font-semibold">
            <Home className="w-4 h-4" /> Go to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}

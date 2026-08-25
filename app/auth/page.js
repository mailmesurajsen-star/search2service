'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Lock, User, Phone, LogIn, UserPlus, Loader2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/use-auth';
import { SiteHeader } from '@/components/site-header';

const REGISTER_ROLES = [
  { key: 'customer', label: 'Customer (Book Services)' },
  { key: 'provider', label: 'Provider (List Business)' },
  { key: 'jobseeker', label: 'Job Seeker (Find Work)' },
];

function AuthInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const { refresh } = useAuth();
  const [mode, setMode] = useState(sp.get('mode') || 'login'); // 'login' | 'register'
  const [role, setRole] = useState(REGISTER_ROLES.some(r => r.key === sp.get('role')) ? sp.get('role') : 'customer');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try {
      const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, phone: form.phone, password: form.password, role };
      const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Failed');
      toast.success(mode === 'login' ? `Welcome back, ${d.user.name}!` : `Welcome to Search2Service, ${d.user.name}!`);
      await refresh();
      // Admin/super_admin always land in the Admin Console — a stale `next` param from
      // bouncing off a provider/customer/jobseeker page should never hijack an admin login.
      const next = (d.user.role === 'admin' || d.user.role === 'super_admin')
        ? '/admin/dashboard'
        : sp.get('next') || (
            d.user.role === 'provider' ? (d.user.plan ? '/provider/dashboard' : '/provider/plan') :
            d.user.role === 'jobseeker' ? '/jobseeker/profile' :
            '/customer/dashboard'
          );
      router.push(next);
    } catch (e) { toast.error(e.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />

      <div className="container mx-auto px-4 py-14 max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">{mode === 'login' ? 'Welcome Back' : 'Create a new account'}</h1>
          <p className="text-slate-500 mt-2 text-sm">{mode === 'login' ? 'Sign in to your account to continue' : 'Access the Search2Service platform'}</p>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 mb-6 border-b border-slate-200">
              <button
                onClick={() => setMode('login')}
                className={`flex items-center justify-center gap-1.5 pb-3 text-sm font-semibold border-b-2 transition-colors ${mode === 'login' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                <LogIn className="w-4 h-4" />Login
              </button>
              <button
                onClick={() => setMode('register')}
                className={`flex items-center justify-center gap-1.5 pb-3 text-sm font-semibold border-b-2 transition-colors ${mode === 'register' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                <UserPlus className="w-4 h-4" />Register
              </button>
            </div>

            {mode === 'login' ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Email Address</Label>
                  <div className="relative mt-1.5">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input className="pl-9 focus-visible:ring-indigo-500" placeholder="name@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Password</Label>
                  <div className="relative mt-1.5">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input className="pl-9 focus-visible:ring-indigo-500" type="password" placeholder="••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} onKeyDown={e => e.key === 'Enter' && submit()} />
                  </div>
                </div>
                <div className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-2.5 flex gap-2">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div><b>Demo admin:</b> admin@search2service.in / admin123</div>
                </div>
                <Button disabled={busy} onClick={submit} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <><LogIn className="w-4 h-4 mr-1.5" />Sign In</>}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">I want to register as</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="mt-1.5 focus:ring-indigo-500"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {REGISTER_ROLES.map(r => <SelectItem key={r.key} value={r.key}>{r.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Full Name</Label>
                  <div className="relative mt-1.5">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input className="pl-9 focus-visible:ring-indigo-500" placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Email Address</Label>
                  <div className="relative mt-1.5">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input className="pl-9 focus-visible:ring-indigo-500" placeholder="name@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Phone (optional)</Label>
                  <div className="relative mt-1.5">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input className="pl-9 focus-visible:ring-indigo-500" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Password</Label>
                  <div className="relative mt-1.5">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input className="pl-9 focus-visible:ring-indigo-500" type="password" placeholder="At least 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} onKeyDown={e => e.key === 'Enter' && submit()} />
                  </div>
                </div>
                <Button disabled={busy} onClick={submit} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <><UserPlus className="w-4 h-4 mr-1.5" />Create Account</>}
                </Button>
              </div>
            )}

            <div className="text-center mt-4 text-xs text-slate-500">
              By continuing you agree to Search2Service&apos;s Terms and Privacy Policy.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return <Suspense fallback={<div className="p-12 text-center">Loading...</div>}><AuthInner /></Suspense>;
}

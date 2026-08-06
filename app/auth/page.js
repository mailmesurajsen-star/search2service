'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Mail, Lock, User, Phone, LogIn, UserPlus, ShieldCheck, Store, Briefcase, ChevronLeft, Loader2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/use-auth';

const ROLE_CARDS = [
  { key: 'customer', title: 'Customer', desc: 'Book services, doctors, hotels & more', icon: User, color: 'from-blue-500 to-indigo-600' },
  { key: 'provider', title: 'Provider', desc: 'List your business & receive bookings', icon: Store, color: 'from-orange-500 to-red-600' },
  { key: 'admin', title: 'Admin', desc: 'Manage the entire platform', icon: ShieldCheck, color: 'from-slate-700 to-slate-900', loginOnly: true },
];

function AuthInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const { refresh } = useAuth();
  const [mode, setMode] = useState(sp.get('mode') || 'login'); // 'login' | 'register'
  const [role, setRole] = useState(sp.get('role') || 'customer');
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
      const next = sp.get('next') || (
        d.user.role === 'provider' ? '/provider/dashboard' :
        (d.user.role === 'admin' || d.user.role === 'super_admin') ? '/admin/dashboard' :
        '/customer/dashboard'
      );
      router.push(next);
    } catch (e) { toast.error(e.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-orange-500 grid place-items-center text-white font-bold text-xs">S2</div>
            <span className="font-bold">Search2Service</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">{mode === 'login' ? 'Welcome Back' : 'Join Search2Service'}</h1>
          <p className="text-slate-500 mt-2">{mode === 'login' ? 'Sign in to your account to continue' : 'Choose your account type and get started in seconds'}</p>
        </div>

        {/* ROLE CARDS */}
        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          {ROLE_CARDS.map(rc => {
            const disabled = mode === 'register' && rc.loginOnly;
            const active = role === rc.key;
            return (
              <button
                key={rc.key}
                onClick={() => !disabled && setRole(rc.key)}
                disabled={disabled}
                className={`text-left rounded-2xl p-4 border-2 transition-all ${disabled ? 'opacity-40 cursor-not-allowed border-slate-200 bg-white' : active ? 'border-blue-500 bg-white shadow-lg scale-[1.02]' : 'border-slate-200 bg-white hover:border-slate-300'}`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${rc.color} grid place-items-center text-white mb-2`}>
                  <rc.icon className="w-5 h-5" />
                </div>
                <div className="font-bold flex items-center gap-2">{rc.title} {disabled && <span className="text-[10px] text-slate-400 font-normal">(sign in only)</span>}</div>
                <div className="text-xs text-slate-500 mt-0.5">{rc.desc}</div>
              </button>
            );
          })}
        </div>

        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <Tabs value={mode} onValueChange={setMode}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="login"><LogIn className="w-4 h-4 mr-1" />Sign In</TabsTrigger>
                <TabsTrigger value="register"><UserPlus className="w-4 h-4 mr-1" />Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <div className="relative mt-1">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input className="pl-9" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Password</Label>
                  <div className="relative mt-1">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input className="pl-9" type="password" placeholder="••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} onKeyDown={e => e.key === 'Enter' && submit()} />
                  </div>
                </div>
                {role === 'admin' && (
                  <div className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-2.5 flex gap-2">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div><b>Demo admin:</b> admin@search2service.in / admin123</div>
                  </div>
                )}
                <Button disabled={busy} onClick={submit} className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:opacity-90 text-white">
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <><LogIn className="w-4 h-4 mr-1" />Sign In as {ROLE_CARDS.find(r => r.key === role)?.title}</>}
                </Button>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <div>
                  <Label>Full Name</Label>
                  <div className="relative mt-1">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input className="pl-9" placeholder="Rahul Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <div className="relative mt-1">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input className="pl-9" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Phone (optional)</Label>
                  <div className="relative mt-1">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input className="pl-9" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Password</Label>
                  <div className="relative mt-1">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input className="pl-9" type="password" placeholder="At least 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} onKeyDown={e => e.key === 'Enter' && submit()} />
                  </div>
                </div>
                <Button disabled={busy} onClick={submit} className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:opacity-90 text-white">
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <><UserPlus className="w-4 h-4 mr-1" />Create {ROLE_CARDS.find(r => r.key === role)?.title} Account</>}
                </Button>
              </TabsContent>
            </Tabs>

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

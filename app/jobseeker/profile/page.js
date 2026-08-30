'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '@/lib/use-auth';
import { FileUploader } from '@/components/file-uploader';
import { ChevronLeft, Save, UserCircle2, MapPin, Phone, Mail, FileText, X, LogOut, CheckCircle2 } from 'lucide-react';

export default function JobSeekerProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [p, setP] = useState({ name: '', address: '', phone: '', email: '', photo: '', resumeUrl: '', resumeName: '' });

  useEffect(() => {
    if (!loading && !user) router.replace('/auth?next=/jobseeker/profile&role=jobseeker');
    else if (user && !['jobseeker', 'admin', 'super_admin'].includes(user.role)) router.replace('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/jobseeker/profile').then(r => r.json()).then(d => {
      if (d.profile) setP(prev => ({ ...prev, ...d.profile }));
      else setP(prev => ({ ...prev, name: user.name || '', email: user.email || '', phone: user.phone || '' }));
    });
  }, [user]);

  const save = async () => {
    if (!p.name.trim() || !p.phone.trim()) { toast.error('Name and contact number are required'); return; }
    setSaving(true);
    try {
      const r = await fetch('/api/jobseeker/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
      const d = await r.json();
      if (r.ok) toast.success('Profile saved!');
      else toast.error(d.error || d.detail || 'Failed to save profile');
    } catch (e) { toast.error('Network error while saving profile'); }
    finally { setSaving(false); }
  };

  if (loading || !user) return <div className="p-12 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1 text-sm"><ChevronLeft className="w-4 h-4" />Home</Link>
          <div className="flex-1" />
          <Button size="sm" variant="outline" onClick={async () => { await logout(); router.push('/'); }}><LogOut className="w-3.5 h-3.5 mr-1" />Sign out</Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary grid place-items-center text-white"><UserCircle2 className="w-6 h-6" /></div>
          <div>
            <h1 className="text-2xl font-bold">Job Seeker Profile</h1>
            <p className="text-muted-foreground text-sm">Complete your profile so employers can find and contact you</p>
          </div>
        </div>

        {/* PHOTO */}
        <Card><CardContent className="p-5 space-y-3">
          <h3 className="font-bold flex items-center gap-2"><UserCircle2 className="w-4 h-4" />Profile Photo</h3>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-muted bg-cover bg-center border border-border flex-shrink-0 grid place-items-center overflow-hidden" style={p.photo ? { backgroundImage: `url(${p.photo})` } : {}}>
              {!p.photo && <UserCircle2 className="w-10 h-10 text-border" />}
            </div>
            <div className="flex-1">
              <FileUploader context="jobseeker-photo" ownerId={user.id} accept="image/jpeg,image/png,image/webp" buttonLabel="Upload profile photo" onUploaded={(f) => setP(x => ({ ...x, photo: f.url }))} />
              {p.photo && <button onClick={() => setP(x => ({ ...x, photo: '' }))} className="text-xs text-red-600 mt-1 flex items-center gap-1"><X className="w-3 h-3" />Remove photo</button>}
            </div>
          </div>
        </CardContent></Card>

        {/* BASIC INFO */}
        <Card><CardContent className="p-5 space-y-4">
          <h3 className="font-bold flex items-center gap-2"><UserCircle2 className="w-4 h-4" />Basic Details</h3>
          <div>
            <Label>Full Name *</Label>
            <Input className="mt-1" value={p.name} onChange={e => setP({ ...p, name: e.target.value })} placeholder="e.g., Rahul Sharma" />
          </div>
          <div>
            <Label className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />Address</Label>
            <Textarea className="mt-1" rows={2} value={p.address} onChange={e => setP({ ...p, address: e.target.value })} placeholder="House no, Street, City, State, Pincode" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />Contact Number *</Label>
              <Input className="mt-1" value={p.phone} onChange={e => setP({ ...p, phone: e.target.value })} placeholder="+91 98765 43210" />
            </div>
            <div>
              <Label className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />Email</Label>
              <Input className="mt-1" value={p.email} onChange={e => setP({ ...p, email: e.target.value })} placeholder="you@example.com" />
            </div>
          </div>
        </CardContent></Card>

        {/* RESUME */}
        <Card><CardContent className="p-5 space-y-3">
          <h3 className="font-bold flex items-center gap-2"><FileText className="w-4 h-4" />Resume</h3>
          {p.resumeUrl ? (
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-2 text-sm text-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
                <a href={p.resumeUrl} target="_blank" rel="noreferrer" className="font-medium underline">{p.resumeName || 'View uploaded resume'}</a>
              </div>
              <button onClick={() => setP(x => ({ ...x, resumeUrl: '', resumeName: '' }))} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
            </div>
          ) : (
            <FileUploader
              context="jobseeker-resume"
              ownerId={user.id}
              accept="application/pdf"
              buttonLabel="Upload resume (PDF)"
              onUploaded={(f) => setP(x => ({ ...x, resumeUrl: f.url, resumeName: f.originalName }))}
            />
          )}
        </CardContent></Card>

        <div className="flex justify-end pt-2">
          <Button onClick={save} disabled={saving} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground"><Save className="w-4 h-4 mr-2" />{saving ? 'Saving...' : 'Save Profile'}</Button>
        </div>
      </div>
    </div>
  );
}

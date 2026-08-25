'use client';
import { useState } from 'react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Name, email and message are required');
      return;
    }
    setSending(true);
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const d = await r.json();
      if (r.ok) {
        toast.success('Message sent! Our team will get back to you soon.');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else toast.error(d.error || d.detail || 'Failed to send message');
    } catch (e) { toast.error('Network error while sending message'); }
    finally { setSending(false); }
  };

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <section className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Contact Us</h1>
          <p className="text-slate-300 mt-4 text-base sm:text-lg leading-relaxed">
            Questions, feedback, or partnership ideas — we'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14 max-w-4xl">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600 grid place-items-center text-white mb-2"><Phone className="w-5 h-5" /></div>
              <div className="font-semibold text-slate-900">Call Us</div>
              <div className="text-sm text-slate-500">+91 98765 43210</div>
            </div>
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600 grid place-items-center text-white mb-2"><Mail className="w-5 h-5" /></div>
              <div className="font-semibold text-slate-900">Email Us</div>
              <div className="text-sm text-slate-500">support@search2service.in</div>
            </div>
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600 grid place-items-center text-white mb-2"><MapPin className="w-5 h-5" /></div>
              <div className="font-semibold text-slate-900">Head Office</div>
              <div className="text-sm text-slate-500">Lucknow, Uttar Pradesh, India</div>
            </div>
          </div>

          <Card className="md:col-span-2">
            <CardContent className="p-6">
              <form onSubmit={submit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name *</Label>
                    <Input className="mt-1" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                  </div>
                  <div>
                    <Label>Email Address *</Label>
                    <Input className="mt-1" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <Label>Subject</Label>
                  <Input className="mt-1" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="How can we help?" />
                </div>
                <div>
                  <Label>Message *</Label>
                  <Textarea className="mt-1" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us more..." />
                </div>
                <Button type="submit" disabled={sending} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  {sending ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

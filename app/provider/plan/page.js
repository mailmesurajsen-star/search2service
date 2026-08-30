'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/lib/use-auth';
import { ChevronLeft, Check, Crown, Sparkles, Loader2, ShieldCheck, ReceiptText, CheckCircle2, ArrowRight } from 'lucide-react';

const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 'Free',
    tagline: 'Get started and get discovered',
    color: 'from-slate-600 to-slate-800',
    features: [
      'Business listing in search & category pages',
      'Up to 4 gallery photos',
      'Standard placement in search results',
      'Booking manager & customer reviews',
      'Standard email support',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹499',
    priceSuffix: '/ month',
    tagline: 'Get more leads, faster',
    color: 'from-amber-500 via-orange-500 to-red-600',
    popular: true,
    features: [
      'Everything in Basic, plus:',
      '⭐ PREMIUM badge on your business profile',
      'Priority placement — shown first in search & category results',
      'Unlimited gallery photos',
      'Priority WhatsApp support',
    ],
  },
];

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load payment gateway'));
    document.body.appendChild(script);
  });
}

export default function ProviderPlanPage() {
  const { user, loading, refresh } = useAuth();
  const router = useRouter();
  const [switching, setSwitching] = useState(null);
  const [gatewayStatus, setGatewayStatus] = useState(null); // null = unknown yet, { enabled, amount, keyId }
  const [paidInvoice, setPaidInvoice] = useState(null);

  useEffect(() => {
    if (!loading && !user) router.replace('/auth?next=/provider/plan');
    else if (user && !['provider', 'admin', 'super_admin'].includes(user.role)) router.replace('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/provider/plan/gateway-status').then(r => r.json()).then(setGatewayStatus).catch(() => setGatewayStatus({ enabled: false }));
  }, [user]);

  if (loading || !user) return <div className="p-12 text-center text-muted-foreground">Loading...</div>;

  const currentPlan = user.plan || null;

  const switchToBasic = async () => {
    const r = await fetch('/api/provider/plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan: 'basic' }) });
    const d = await r.json();
    if (r.ok) {
      toast.success('Switched to Basic plan.');
      await refresh();
      router.push('/provider/dashboard');
    } else toast.error(d.error || d.detail || 'Failed to update plan');
  };

  const payAndActivatePremium = async () => {
    let checkout;
    try {
      const checkoutRes = await fetch('/api/provider/plan/checkout', { method: 'POST' });
      checkout = await checkoutRes.json();
      if (!checkoutRes.ok) { toast.error(checkout.error || checkout.detail || 'Failed to start checkout'); setSwitching(null); return; }
      await loadRazorpayScript();
    } catch (e) {
      toast.error(e.message || 'Failed to start checkout');
      setSwitching(null);
      return;
    }

    const rzp = new window.Razorpay({
      key: checkout.keyId,
      amount: checkout.amount,
      currency: checkout.currency,
      order_id: checkout.orderId,
      name: checkout.name,
      description: checkout.description,
      prefill: { name: user.name || '', email: user.email || '', contact: user.phone || '' },
      theme: { color: '#ea580c' },
      handler: async (response) => {
        try {
          const vr = await fetch('/api/provider/plan/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const vd = await vr.json();
          if (vr.ok) {
            toast.success('Payment confirmed — Premium activated!');
            await refresh();
            setPaidInvoice(vd.invoice || null);
          } else toast.error(vd.error || vd.detail || 'Payment verification failed');
        } catch (e) { toast.error('Payment verification failed'); }
        finally { setSwitching(null); }
      },
      modal: { ondismiss: () => setSwitching(null) },
    });
    rzp.on('payment.failed', () => { toast.error('Payment failed. Please try again.'); setSwitching(null); });
    rzp.open();
  };

  const choosePlan = async (planId) => {
    if (planId === currentPlan) return;
    setSwitching(planId);
    try {
      if (planId === 'premium') {
        await payAndActivatePremium();
        return; // switching cleared inside handler/dismiss callbacks
      }
      await switchToBasic();
    } catch (e) { toast.error(e.message || 'Something went wrong'); }
    finally { if (planId !== 'premium') setSwitching(null); }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          {user.plan ? (
            <Link href="/provider/dashboard" className="flex items-center gap-1 text-sm"><ChevronLeft className="w-4 h-4" />Dashboard</Link>
          ) : (
            <span className="text-sm font-semibold text-foreground">Welcome! Choose a plan to continue</span>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {paidInvoice ? (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 grid place-items-center text-emerald-600 mx-auto mb-4"><CheckCircle2 className="w-9 h-9" /></div>
              <h1 className="text-2xl font-bold">Payment Confirmed</h1>
              <p className="text-muted-foreground mt-1 text-sm">Your Premium plan is now active. Here's your bill for this transaction.</p>
            </div>

            <Card className="border-emerald-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-dashed border-border">
                  <div className="flex items-center gap-2 font-bold text-foreground"><ReceiptText className="w-5 h-5 text-emerald-600" /> Invoice</div>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">PAID</Badge>
                </div>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Invoice No.</span><span className="font-mono font-semibold text-foreground">{paidInvoice.invoiceNumber}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Billed To</span><span className="font-medium text-foreground">{user.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><span className="font-medium text-foreground">Premium (Monthly)</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Payment ID</span><span className="font-mono text-xs text-foreground/80">{paidInvoice.razorpayPaymentId}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="text-foreground">{paidInvoice.paidAt ? new Date(paidInvoice.paidAt).toLocaleString('en-IN') : ''}</span></div>
                </div>
                <div className="flex justify-between items-center mt-5 pt-4 border-t border-dashed border-border">
                  <span className="font-bold text-foreground">Amount Paid</span>
                  <span className="text-2xl font-extrabold text-emerald-700">₹{paidInvoice.amount}</span>
                </div>
              </CardContent>
            </Card>

            <Button onClick={() => router.push('/provider/dashboard')} className="w-full mt-6 bg-primary hover:bg-primary/90 text-white">
              Continue to Dashboard <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        ) : (
        <>
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary grid place-items-center text-white mx-auto mb-3"><Crown className="w-7 h-7" /></div>
          <h1 className="text-3xl font-bold">Choose Your Plan</h1>
          <p className="text-muted-foreground mt-1">Pick the plan that fits your business — upgrade or downgrade anytime.</p>
          <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 inline-flex items-center gap-1.5 px-3 py-1 rounded-full mt-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Secure checkout via Razorpay — Premium activates only after payment is confirmed
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {PLANS.map(p => {
            const isCurrent = currentPlan === p.id;
            return (
              <Card key={p.id} className={`relative overflow-hidden ${p.popular ? 'border-[#F5A623]/40 shadow-lg shadow-[#F5A623]/10' : ''}`}>
                {p.popular && (
                  <div className="absolute top-0 right-0 bg-[#F5A623] text-white text-[11px] font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> MOST POPULAR
                  </div>
                )}
                <CardContent className="p-6 space-y-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold">{p.name}</h3>
                      {isCurrent && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Current Plan</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{p.tagline}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold">{p.id === 'premium' && gatewayStatus?.enabled && gatewayStatus?.amount ? `₹${gatewayStatus.amount}` : p.price}</span>
                    {p.priceSuffix && <span className="text-sm text-muted-foreground">{p.priceSuffix}</span>}
                  </div>

                  <ul className="space-y-2.5">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => choosePlan(p.id)}
                    disabled={isCurrent || switching === p.id}
                    className={`w-full ${p.id === 'premium' ? 'bg-[#F5A623] hover:bg-[#F5A623]/90 text-white' : ''}`}
                    variant={p.id === 'premium' ? 'default' : 'outline'}
                  >
                    {switching === p.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    {isCurrent ? 'Currently Active' : switching === p.id ? (p.id === 'premium' ? 'Opening checkout…' : 'Activating…') : p.id === 'premium' ? 'Pay & Upgrade to Premium' : currentPlan ? 'Switch to Basic' : 'Choose Basic (Free)'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        </>
        )}
      </div>
    </div>
  );
}

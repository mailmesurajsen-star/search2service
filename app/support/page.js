import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { LifeBuoy, Phone, Mail, MessageCircle, ChevronRight } from 'lucide-react';

export const metadata = { title: 'Support — Search2Service' };

const FAQS = [
  {
    q: 'How do I book a service provider?',
    a: 'Search for the service you need, open a provider profile, and tap "Call Now" or "WhatsApp" to connect directly, or use the booking button where available.',
  },
  {
    q: 'How do I list my business on Search2Service?',
    a: 'Register as a Provider from the Login / Register page, then complete your Business Profile with photos, services, pricing, and location to go live in search.',
  },
  {
    q: 'Is Search2Service free to use for customers?',
    a: 'Yes, browsing and contacting providers is completely free for customers. Providers can choose between a Basic (free) plan or a Premium paid plan for priority placement.',
  },
  {
    q: 'How do I cancel or get a refund on a booking?',
    a: 'Please see our Refund Policy for cancellation timelines. For a specific booking, contact the provider directly or reach out to our support team.',
  },
  {
    q: 'How do I report a fake or incorrect listing?',
    a: 'Use the Contact page to report the listing with the provider name and city — our team verifies and reviews it promptly.',
  },
  {
    q: 'How do I apply for a job posted on the platform?',
    a: 'Open the job listing and use the contact details provided, or register as a Job Seeker to build a profile with your resume for providers to find you.',
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <section className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 grid place-items-center mx-auto mb-4"><LifeBuoy className="w-7 h-7" /></div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Support Center</h1>
          <p className="text-slate-300 mt-4 text-base sm:text-lg leading-relaxed">
            Find answers to common questions, or reach out to our team directly.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14 max-w-4xl">
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          <a href="tel:+919876543210" className="flex items-center gap-3 border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 grid place-items-center text-white shrink-0"><Phone className="w-5 h-5" /></div>
            <div>
              <div className="font-semibold text-sm text-slate-900">Call Support</div>
              <div className="text-xs text-slate-500">+91 98765 43210</div>
            </div>
          </a>
          <a href="mailto:support@search2service.in" className="flex items-center gap-3 border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 grid place-items-center text-white shrink-0"><Mail className="w-5 h-5" /></div>
            <div>
              <div className="font-semibold text-sm text-slate-900">Email Support</div>
              <div className="text-xs text-slate-500">support@search2service.in</div>
            </div>
          </a>
          <Link href="/contact" className="flex items-center gap-3 border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 grid place-items-center text-white shrink-0"><MessageCircle className="w-5 h-5" /></div>
            <div>
              <div className="font-semibold text-sm text-slate-900">Contact Form</div>
              <div className="text-xs text-slate-500">Send us a message</div>
            </div>
          </Link>
        </div>

        <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQS.map(f => (
            <details key={f.q} className="group border border-slate-200 rounded-xl p-4 open:border-indigo-200 open:bg-indigo-50/30">
              <summary className="flex items-center justify-between cursor-pointer font-semibold text-sm text-slate-900 list-none">
                {f.q}
                <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform shrink-0" />
              </summary>
              <p className="text-sm text-slate-600 leading-relaxed mt-2.5">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-slate-500">
          Still need help? <Link href="/contact" className="text-indigo-600 font-semibold hover:underline">Reach out to our support team</Link>.
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

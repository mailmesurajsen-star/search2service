import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CalendarDays, Tag, ArrowRight } from 'lucide-react';

export const metadata = { title: 'Blog — Search2Service' };

const POSTS = [
  {
    title: 'How to Choose the Right Doctor Near You',
    excerpt: 'A quick checklist to verify qualifications, read genuine reviews, and book your first appointment with confidence.',
    tag: 'Healthcare',
    date: 'Aug 2026',
  },
  {
    title: '5 Questions to Ask Before Hiring a Home Service Expert',
    excerpt: 'From pricing transparency to verified badges — here is what to check before letting anyone into your home.',
    tag: 'Home Services',
    date: 'Aug 2026',
  },
  {
    title: 'A Simple Guide to Government Services: PAN, Aadhaar & More',
    excerpt: 'Everything you need to know about applying for common government documents through your nearest CSC center.',
    tag: 'Government Services',
    date: 'Jul 2026',
  },
  {
    title: 'How Providers Can Get More Bookings on Search2Service',
    excerpt: 'Tips on completing your business profile, uploading great photos, and responding fast to leads.',
    tag: 'For Providers',
    date: 'Jul 2026',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <section className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Search2Service Blog</h1>
          <p className="text-slate-300 mt-4 text-base sm:text-lg leading-relaxed">
            Tips, guides, and updates to help you get the most out of local services across India.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14 max-w-4xl">
        <div className="grid sm:grid-cols-2 gap-6">
          {POSTS.map(p => (
            <article key={p.title} className="border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-indigo-200 transition">
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-full"><Tag className="w-3 h-3" />{p.tag}</span>
                <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" />{p.date}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 leading-snug mb-2">{p.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">{p.excerpt}</p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">
                Read more <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-slate-500">
          More stories coming soon — check back regularly for fresh tips and platform updates.
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

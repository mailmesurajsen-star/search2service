import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Briefcase, MapPin, Clock, Mail, Sparkles, Users, TrendingUp, HeartHandshake } from 'lucide-react';

export const metadata = { title: 'Careers — Search2Service' };

const OPENINGS = [
  { title: 'Backend Engineer (Python / FastAPI)', type: 'Full-time', location: 'Remote / Lucknow', dept: 'Engineering' },
  { title: 'Frontend Engineer (React / Next.js)', type: 'Full-time', location: 'Remote / Lucknow', dept: 'Engineering' },
  { title: 'City Growth Manager', type: 'Full-time', location: 'Multiple Cities', dept: 'Operations' },
  { title: 'Customer Support Executive', type: 'Full-time', location: 'Lucknow', dept: 'Support' },
  { title: 'Provider Onboarding Associate', type: 'Full-time', location: 'Multiple Cities', dept: 'Operations' },
];

const VALUES = [
  { icon: Users, title: 'Customer First', desc: 'Every decision starts with what helps our customers and providers most.' },
  { icon: TrendingUp, title: 'Move Fast', desc: 'We ship, learn, and iterate quickly across every city we serve.' },
  { icon: HeartHandshake, title: 'Trust & Transparency', desc: 'No hidden fees, no fake listings — trust is our core product.' },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <section className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> We're hiring across India
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Build the future of local services with us</h1>
          <p className="text-slate-300 mt-4 text-base sm:text-lg leading-relaxed">
            Join a team that's helping millions of Indians find trusted services near them, every single day.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14 max-w-4xl">
        <div className="grid sm:grid-cols-3 gap-5 mb-14">
          {VALUES.map(v => (
            <div key={v.title} className="rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 grid place-items-center text-white mb-3"><v.icon className="w-5 h-5" /></div>
              <div className="font-bold text-slate-900">{v.title}</div>
              <div className="text-sm text-slate-500 mt-1">{v.desc}</div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-indigo-600" /> Open Positions</h2>
        <div className="space-y-3">
          {OPENINGS.map(o => (
            <div key={o.title} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition">
              <div>
                <div className="font-semibold text-slate-900">{o.title}</div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
                  <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{o.dept}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{o.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{o.type}</span>
                </div>
              </div>
              <a
                href={`mailto:careers@search2service.in?subject=${encodeURIComponent('Application: ' + o.title)}`}
                className="inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition shrink-0"
              >
                <Mail className="w-4 h-4" /> Apply Now
              </a>
            </div>
          ))}
        </div>

        <div className="mt-10 text-sm text-slate-500 text-center">
          Don't see a role that fits? Send your resume to{' '}
          <a href="mailto:careers@search2service.in" className="text-indigo-600 font-semibold hover:underline">careers@search2service.in</a>{' '}
          — we're always looking for great people.
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

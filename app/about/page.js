import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ShieldCheck, Users, Building2, MapPin, Target, Heart } from 'lucide-react';

export const metadata = { title: 'About Us — Search2Service' };

const STATS = [
  { icon: Building2, value: '300+', label: 'Verified Providers' },
  { icon: Users, value: '25,000+', label: 'Happy Customers' },
  { icon: MapPin, value: '10+', label: 'Cities Covered' },
  { icon: ShieldCheck, value: '80+', label: 'Service Categories' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">About Search2Service</h1>
          <p className="text-white/80 mt-4 text-base sm:text-lg leading-relaxed">
            India's complete services marketplace — connecting customers with trusted doctors, home service experts,
            hotels, restaurants, job opportunities, and government form assistance, all on one platform.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14 max-w-4xl">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5 -mt-24 mb-14">
          {STATS.map(s => (
            <div key={s.label} className="bg-white rounded-2xl shadow-lg border border-border p-5 text-center">
              <div className="w-11 h-11 rounded-xl bg-primary grid place-items-center text-white mx-auto mb-3"><s.icon className="w-5 h-5" /></div>
              <div className="text-2xl font-extrabold text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-10">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-2"><Target className="w-5 h-5 text-accent" /> Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              We started Search2Service with a simple goal — make it effortless for anyone in India to find a
              trusted, verified service provider nearby, whether they need a doctor, an electrician, a wedding
              photographer, or help filling out a government form. No more asking around or relying on unverified
              listings — just search, compare, and connect.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-2"><Heart className="w-5 h-5 text-accent" /> What We Do</h2>
            <p className="text-muted-foreground leading-relaxed">
              Search2Service brings together healthcare, home services, hospitality, education, government services,
              jobs, and dozens of other categories under one roof. Every listed business goes through a verification
              process, and customers can browse ratings, reviews, and pricing before making a decision — all in their
              own city and language.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-2"><ShieldCheck className="w-5 h-5 text-accent" /> Why Trust Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              We verify every provider profile, moderate reviews, and give businesses tools to respond to customers
              directly. Our platform is built for transparency — real ratings, real contact details, and real
              bookings, with no middleman fees hidden in the fine print.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

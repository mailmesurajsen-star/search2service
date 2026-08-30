import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Newspaper, Mail, Download, Image as ImageIcon } from 'lucide-react';

export const metadata = { title: 'Press — Search2Service' };

export default function PressPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Press & Media</h1>
          <p className="text-white/80 mt-4 text-base sm:text-lg leading-relaxed">
            Resources for journalists and media professionals covering Search2Service.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14 max-w-4xl space-y-10">
        <div>
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Newspaper className="w-5 h-5 text-accent" /> About Search2Service</h2>
          <p className="text-muted-foreground leading-relaxed">
            Search2Service is India's complete local services marketplace, connecting customers with verified
            doctors, home service experts, hotels, restaurants, job listings, and government form assistance —
            across 80+ categories and 10+ cities. Our mission is to make finding a trusted local service as simple
            as a single search.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-accent" /> Brand Assets</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Our logo, brand colors, and product screenshots are available for editorial use. Please reach out to our
            media team for the latest press kit.
          </p>
          <a
            href="mailto:press@search2service.in?subject=Press%20Kit%20Request"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground text-sm font-semibold px-5 py-2.5 rounded-xl transition"
          >
            <Download className="w-4 h-4" /> Request Press Kit
          </a>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Mail className="w-5 h-5 text-accent" /> Media Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            For interviews, quotes, or partnership announcements, please write to us at{' '}
            <a href="mailto:press@search2service.in" className="text-primary font-semibold hover:underline">press@search2service.in</a>.
            We aim to respond to all media inquiries within 2 business days.
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

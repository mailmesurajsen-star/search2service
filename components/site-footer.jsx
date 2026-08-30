import Link from 'next/link';

const COMPANY_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Refund Policy', href: '/refund-policy' },
  { label: 'Disclaimer', href: '/disclaimer' },
  { label: 'Support', href: '/support' },
];

export function SiteFooter() {
  return (
    <footer className="bg-primary text-white/70 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center text-white font-bold border border-white/15">S2</div>
              <div className="font-bold text-white text-lg">Search2Service</div>
            </div>
            <p className="text-sm text-white/60">One platform for every service. Trusted by thousands of businesses and customers across India.</p>
          </div>
          <div>
            <div className="font-semibold text-white mb-3">Popular</div>
            <ul className="space-y-2 text-sm">
              {['Doctor', 'Electrician', 'Hotel', 'Restaurant', 'Beauty Parlour', 'AC Repair'].map(l => (
                <li key={l}><Link href={`/search?q=${encodeURIComponent(l)}`} className="hover:text-[#5EEAD4] transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-semibold text-white mb-3">Company</div>
            <ul className="space-y-2 text-sm">
              {COMPANY_LINKS.map(l => (
                <li key={l.href}><Link href={l.href} className="hover:text-[#5EEAD4] transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-semibold text-white mb-3">Legal</div>
            <ul className="space-y-2 text-sm">
              {LEGAL_LINKS.map(l => (
                <li key={l.href}><Link href={l.href} className="hover:text-[#5EEAD4] transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 text-sm text-white/50 flex flex-col md:flex-row justify-between gap-2">
          <div>© {new Date().getFullYear()} Search2Service. All rights reserved.</div>
          <div>Made with ❤️ in India</div>
        </div>
      </div>
    </footer>
  );
}

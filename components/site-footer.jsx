'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Facebook, Instagram, Twitter, Youtube, Linkedin, Phone } from 'lucide-react';

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
  const [social, setSocial] = useState({
    facebookUrl: '', instagramUrl: '', twitterUrl: '', youtubeUrl: '', linkedinUrl: '', whatsappNumber: '',
    facebookIcon: '', instagramIcon: '', twitterIcon: '', youtubeIcon: '', linkedinIcon: '', whatsappIcon: '',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        setSocial({
          facebookUrl: data?.facebookUrl || '',
          instagramUrl: data?.instagramUrl || '',
          twitterUrl: data?.twitterUrl || '',
          youtubeUrl: data?.youtubeUrl || '',
          linkedinUrl: data?.linkedinUrl || '',
          whatsappNumber: data?.whatsappNumber || '',
          facebookIcon: data?.facebookIcon || '',
          instagramIcon: data?.instagramIcon || '',
          twitterIcon: data?.twitterIcon || '',
          youtubeIcon: data?.youtubeIcon || '',
          linkedinIcon: data?.linkedinIcon || '',
          whatsappIcon: data?.whatsappIcon || '',
        });
      })
      .catch(() => {});
  }, []);

  const socialIcons = [
    { key: 'facebookUrl', Icon: Facebook, href: social.facebookUrl, label: 'Facebook', customIcon: social.facebookIcon },
    { key: 'instagramUrl', Icon: Instagram, href: social.instagramUrl, label: 'Instagram', customIcon: social.instagramIcon },
    { key: 'twitterUrl', Icon: Twitter, href: social.twitterUrl, label: 'Twitter / X', customIcon: social.twitterIcon },
    { key: 'youtubeUrl', Icon: Youtube, href: social.youtubeUrl, label: 'YouTube', customIcon: social.youtubeIcon },
    { key: 'linkedinUrl', Icon: Linkedin, href: social.linkedinUrl, label: 'LinkedIn', customIcon: social.linkedinIcon },
    { key: 'whatsappNumber', Icon: Phone, href: social.whatsappNumber ? `https://wa.me/${social.whatsappNumber.replace(/[^0-9]/g, '')}` : '', label: 'WhatsApp', customIcon: social.whatsappIcon },
  ].filter((s) => s.href);

  return (
    <footer className="bg-primary text-white/70 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center text-white border border-white/15"><Search className="w-5 h-5" /></div>
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
        {socialIcons.length > 0 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            {socialIcons.map(({ key, Icon, href, label, customIcon }) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#5EEAD4] hover:text-primary grid place-items-center text-white/70 transition-colors overflow-hidden"
              >
                {customIcon ? (
                  <img src={customIcon} alt={label} className="w-full h-full object-cover" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </a>
            ))}
          </div>
        )}
        <div className="border-t border-white/10 mt-6 pt-6 text-sm text-white/50 flex flex-col md:flex-row justify-between gap-2">
          <div>© {new Date().getFullYear()} Search2Service. All rights reserved.</div>
          <div>Made with ❤️ in India</div>
        </div>
      </div>
    </footer>
  );
}

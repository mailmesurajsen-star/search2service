import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/lib/use-auth';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], display: 'swap', variable: '--font-jakarta' });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://search2service.com';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'India Services Marketplace | Search2Service',
    template: '%s | Search2Service',
  },
  description: 'Find trusted doctors, home services, hotels, restaurants, jobs and government service providers across India with Search2Service.',
  keywords: [
    'search2service', 'local services india', 'find doctor near me', 'book doctor appointment online',
    'home services india', 'electrician near me', 'plumber near me', 'ac repair service',
    'beauty parlour near me', 'salon booking', 'hotel booking india', 'restaurant near me',
    'wedding photographer', 'event planner india', 'tailor near me', 'printing services',
    'jobs near me', 'job vacancies india', 'real estate agent', 'property near me',
    'cab and travel booking', 'pet services india', 'government services online',
    'legal and finance services', 'verified service providers india', 'local business directory india',
    'urban company', 'justdial', 'practo', 'sulekha',
  ].join(', '),
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'India Services Marketplace | Search2Service',
    description: 'Find trusted doctors, home services, hotels, restaurants, jobs and government service providers across India with Search2Service.',
    url: SITE_URL,
    siteName: 'Search2Service',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5779676733459906" crossOrigin="anonymous"></script>
        <script async custom-element="amp-auto-ads" src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js"></script>
      </head>
      <body className={`${jakarta.variable} ${jakarta.className} bg-background text-foreground antialiased`}>
        <amp-auto-ads type="adsense" data-ad-client="ca-pub-5779676733459906"></amp-auto-ads>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

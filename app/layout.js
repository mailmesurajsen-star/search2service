import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/lib/use-auth';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], display: 'swap', variable: '--font-jakarta' });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://search2service.com';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Search2Service — One Platform for Every Service',
    template: '%s | Search2Service',
  },
  description: 'Search2Service is India\'s all-in-one local services marketplace — find verified doctors, home & repair services, hotels, restaurants, jobs, government services, real estate, education and more near you.',
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
    title: 'Search2Service — One Platform for Every Service',
    description: 'India\'s all-in-one local services marketplace — verified doctors, home services, hotels, jobs, government services and more near you.',
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
      <body className={`${jakarta.variable} ${jakarta.className} bg-background text-foreground antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

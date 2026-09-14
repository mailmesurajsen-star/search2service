import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/lib/use-auth';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], display: 'swap', variable: '--font-jakarta' });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://search2service.cloud';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Search2Service — One Platform for Every Service',
    template: '%s | Search2Service',
  },
  description: 'Find trusted local services in India — doctors, home services, hotels, jobs, government services and more. All in one place.',
  keywords: 'search2service, local services india, find doctor, home services, urban company, justdial, practo',
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Search2Service — One Platform for Every Service',
    description: 'Find trusted local services in India — all in one place.',
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

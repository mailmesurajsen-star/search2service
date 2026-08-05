import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'Search2Service — One Platform for Every Service',
  description: 'Find trusted local services in India — doctors, home services, hotels, jobs, government services and more. All in one place.',
  keywords: 'search2service, local services india, find doctor, home services, urban company, justdial, practo',
  openGraph: {
    title: 'Search2Service — One Platform for Every Service',
    description: 'Find trusted local services in India — all in one place.',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

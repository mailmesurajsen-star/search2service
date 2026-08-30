import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Scale } from 'lucide-react';

export function LegalPage({ title, updatedDate, children }) {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <section className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="w-11 h-11 rounded-xl bg-accent grid place-items-center text-white mb-4"><Scale className="w-5 h-5" /></div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{title}</h1>
          <p className="text-white/70 text-sm mt-2">Last updated: {updatedDate}</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 max-w-3xl prose-legal">
        <div className="space-y-8 text-sm sm:text-[15px] leading-relaxed text-muted-foreground">
          {children}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

export function LegalSection({ title, children }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-foreground mb-2">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

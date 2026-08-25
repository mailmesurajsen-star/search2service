'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Sparkles, ExternalLink, Phone, ArrowRight, X, Megaphone, Tag, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function AdBanner({ placement = 'homepage_banner', className = '', initialAd = null }) {
  const [ads, setAds] = useState(initialAd ? [initialAd] : []);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [loading, setLoading] = useState(!initialAd);
  const [isPaused, setIsPaused] = useState(false);
  const impressionRecorded = useRef(new Set());

  useEffect(() => {
    let isMounted = true;
    async function fetchAds() {
      try {
        const res = await fetch(`/api/ads?placement=${encodeURIComponent(placement)}&status=active&limit=10`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.ads && data.ads.length > 0) {
            setAds(data.ads);
            setCurrentIdx(0);
          }
        }
      } catch (err) {
        console.error('Failed to fetch ads for', placement, err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchAds();
    return () => { isMounted = false; };
  }, [placement]);

  // Auto-rotate through ads like a slider when more than one active ad exists for this placement
  useEffect(() => {
    if (ads.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIdx(i => (i + 1) % ads.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [ads.length, isPaused]);

  const activeAd = ads[currentIdx];
  const goToSlide = (idx) => setCurrentIdx(idx);
  const goNext = () => setCurrentIdx(i => (i + 1) % ads.length);
  const goPrev = () => setCurrentIdx(i => (i - 1 + ads.length) % ads.length);

  // Record impression once when activeAd is loaded
  useEffect(() => {
    if (activeAd && activeAd.id && !impressionRecorded.current.has(activeAd.id)) {
      impressionRecorded.current.add(activeAd.id);
      fetch(`/api/ads/${activeAd.id}/impression`, { method: 'POST' }).catch(() => {});
    }
  }, [activeAd]);

  const handleAdClick = () => {
    if (activeAd && activeAd.id) {
      fetch(`/api/ads/${activeAd.id}/click`, { method: 'POST' }).catch(() => {});
    }
  };

  if (loading || !activeAd || isDismissed) {
    return null;
  }

  // 1. SEARCH TOP SPONSORED BANNER
  if (placement === 'search_top') {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/90 via-indigo-950/80 to-slate-900 border border-blue-800/40 p-4 md:p-5 shadow-lg ${className}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            {activeAd.imageUrl ? (
              <div
                className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-cover bg-center shrink-0 border border-white/20 shadow-md"
                style={{ backgroundImage: `url(${activeAd.imageUrl})` }}
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-blue-600/30 border border-blue-400/30 grid place-items-center text-blue-300 shrink-0">
                <Megaphone className="w-6 h-6" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                  Sponsored
                </span>
                {activeAd.badge && (
                  <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-[10px] py-0">
                    {activeAd.badge}
                  </Badge>
                )}
                {activeAd.advertiserName && (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> {activeAd.advertiserName}
                  </span>
                )}
              </div>
              <h4 className="font-bold text-white text-sm sm:text-base tracking-tight leading-snug">
                {activeAd.title}
              </h4>
              {activeAd.subtitle && (
                <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                  {activeAd.subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {activeAd.advertiserPhone && (
              <a
                href={`tel:${activeAd.advertiserPhone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 transition"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> {activeAd.advertiserPhone}
              </a>
            )}
            <Link
              href={activeAd.targetUrl || '/'}
              onClick={handleAdClick}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md shadow-orange-500/20 transition-all hover:scale-105"
            >
              {activeAd.ctaText || 'Claim Offer'} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
        {ads.length > 1 && (
          <div className="flex items-center gap-1.5 mt-3">
            {ads.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                aria-label={`Show ad ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === currentIdx ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/25 hover:bg-white/40'}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // 2. SEARCH SIDEBAR BANNER CARD
  if (placement === 'search_sidebar') {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-4 shadow-xl text-left ${className}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
            Featured Partner
          </span>
          {activeAd.badge && (
            <span className="text-[10px] text-blue-300 bg-blue-950/60 border border-blue-800 px-2 py-0.5 rounded">
              {activeAd.badge}
            </span>
          )}
        </div>

        {activeAd.imageUrl && (
          <div
            className="w-full h-32 rounded-xl bg-cover bg-center mb-3 border border-white/10 shadow-inner relative overflow-hidden"
            style={{ backgroundImage: `url(${activeAd.imageUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
          </div>
        )}

        <h4 className="font-bold text-white text-sm leading-snug mb-1">
          {activeAd.title}
        </h4>
        {activeAd.subtitle && (
          <p className="text-xs text-slate-400 line-clamp-2 mb-3">
            {activeAd.subtitle}
          </p>
        )}

        <div className="space-y-2 pt-1 border-t border-slate-800/80">
          {activeAd.advertiserName && (
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>By {activeAd.advertiserName}</span>
              {activeAd.advertiserPhone && <span className="text-slate-300 font-mono">{activeAd.advertiserPhone}</span>}
            </div>
          )}
          <Link
            href={activeAd.targetUrl || '/'}
            onClick={handleAdClick}
            className="w-full text-center block py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02]"
          >
            {activeAd.ctaText || 'Learn More'}
          </Link>
        </div>
        {ads.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {ads.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                aria-label={`Show ad ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === currentIdx ? 'w-5 bg-blue-500' : 'w-1.5 bg-slate-700 hover:bg-slate-600'}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // 3. POPUP MODAL PROMO TOAST
  if (placement === 'popup_modal') {
    return (
      <div
        className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-slate-900 border border-blue-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-slideIn"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="absolute top-2.5 right-2.5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Close Ad"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          {activeAd.imageUrl && (
            <div
              className="w-16 h-16 rounded-xl bg-cover bg-center shrink-0 border border-white/20"
              style={{ backgroundImage: `url(${activeAd.imageUrl})` }}
            />
          )}
          <div>
            <div className="inline-block text-[10px] font-bold uppercase bg-orange-500/20 text-orange-400 border border-orange-500/30 px-1.5 py-0.5 rounded mb-1">
              {activeAd.badge || 'Exclusive Deal'}
            </div>
            <h4 className="font-bold text-white text-xs leading-tight mb-1">
              {activeAd.title}
            </h4>
            <p className="text-[11px] text-slate-300 line-clamp-2 mb-2.5">
              {activeAd.subtitle}
            </p>
            <Link
              href={activeAd.targetUrl || '/'}
              onClick={() => { handleAdClick(); setIsDismissed(true); }}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg transition"
            >
              {activeAd.ctaText || 'Claim Deal'} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. HOMEPAGE / GENERAL WIDE PROMOTIONAL BANNER
  return (
    <div
      className={`relative overflow-hidden rounded-3xl text-white p-6 sm:p-8 md:p-10 shadow-2xl border border-white/10 group ${!activeAd.imageUrl ? `bg-gradient-to-r ${activeAd.gradient || 'from-blue-900 via-indigo-900 to-orange-800'}` : ''} ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background image (full visibility, with a dark overlay for text contrast) */}
      {activeAd.imageUrl ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${activeAd.imageUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        </>
      ) : (
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      )}

      <div className="relative z-10 max-w-3xl">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-[11px] font-black uppercase tracking-widest bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full shadow-sm">
            SPONSORED PROMO
          </span>
          {activeAd.badge && (
            <span className="text-xs font-semibold bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full border border-white/20">
              {activeAd.badge}
            </span>
          )}
          {activeAd.advertiserName && (
            <span className="text-xs text-blue-100 font-medium">
              by {activeAd.advertiserName}
            </span>
          )}
        </div>

        <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-2">
          {activeAd.title}
        </h3>

        {activeAd.subtitle && (
          <p className="text-sm sm:text-base text-blue-50/90 leading-relaxed mb-6 max-w-2xl">
            {activeAd.subtitle}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={activeAd.targetUrl || '/'}
            onClick={handleAdClick}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-sm px-6 py-3 rounded-2xl shadow-xl shadow-orange-500/30 transition-all hover:scale-105"
          >
            {activeAd.ctaText || 'Claim Offer Now'} <ArrowRight className="w-4 h-4" />
          </Link>

          {activeAd.advertiserPhone && (
            <a
              href={`tel:${activeAd.advertiserPhone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-2 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white border border-white/20 font-semibold text-xs px-4 py-3 rounded-2xl transition"
            >
              <Phone className="w-4 h-4 text-emerald-400" /> Call Advertiser
            </a>
          )}
        </div>
      </div>

      {ads.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous ad"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/30 hover:bg-black/60 text-white/90 hover:text-white backdrop-blur-md border border-white/20 grid place-items-center transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next ad"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/30 hover:bg-black/60 text-white/90 hover:text-white backdrop-blur-md border border-white/20 grid place-items-center transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 right-6 z-20 flex items-center gap-1.5">
            {ads.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                aria-label={`Show ad ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === currentIdx ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

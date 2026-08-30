'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Search, MapPin, Sparkles, ChevronLeft, ChevronRight, Users, Building2, Stethoscope, TrendingUp } from 'lucide-react';

const DEFAULT_SLIDE = {
  badge: '🇮🇳 India’s Complete Services Marketplace',
  title: 'Find trusted services',
  highlightText: 'near you — in seconds.',
  subtitle: 'Doctors, home services, hotels, restaurants, jobs, government forms — everything you need on one platform.',
  imageUrl: 'https://images.pexels.com/photos/31786661/pexels-photo-31786661.jpeg',
  overlayGradient: 'from-primary/95 via-primary/80 to-primary/20',
  ctaText: 'Explore Categories',
  ctaLink: '/categories',
};

const POPULAR_SEARCHES = ['Electrician', 'Doctor', 'AC Repair', 'Beauty Parlour', 'Plumber', 'Photographer'];

export function HeroSlider({ heroSlides = [], q, setQ, state, setState, city, setCity, locations, setLocations, doSearch, stats }) {
  const [api, setApi] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = heroSlides.length > 0 ? heroSlides : [DEFAULT_SLIDE];

  useEffect(() => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    api.on('select', onSelect);
    return () => api.off('select', onSelect);
  }, [api]);

  // Autoplay via the existing Carousel's exposed API — no embla-carousel-autoplay plugin installed.
  useEffect(() => {
    if (!api || slides.length <= 1 || isPaused) return;
    const timer = setInterval(() => api.scrollNext(), 5000);
    return () => clearInterval(timer);
  }, [api, slides.length, isPaused]);

  const statTiles = [
    { icon: Users, label: 'Happy Customers', val: `${((stats?.customers || 0) / 1000).toFixed(0)}K+` },
    { icon: Building2, label: 'Verified Providers', val: `${stats?.providers || 0}+` },
    { icon: Stethoscope, label: 'Doctors Listed', val: `${stats?.doctors || 0}+` },
    { icon: TrendingUp, label: 'Service Categories', val: `${stats?.categories || 0}+` },
  ];

  return (
    <section
      className="relative overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
        <CarouselContent className="ml-0">
          {slides.map((slide, idx) => (
            <CarouselItem key={slide.id || idx} className="pl-0">
              <div className="relative min-h-[580px] md:min-h-[640px] flex items-center">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.imageUrl})` }}
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlayGradient || DEFAULT_SLIDE.overlayGradient}`} />

                <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
                  <div className="max-w-4xl text-white">
                    {slide.badge && (
                      <div className="inline-flex items-center gap-1.5 bg-white/15 text-white border border-white/25 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold mb-4 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        {slide.badge}
                      </div>
                    )}

                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">
                      {slide.title}{' '}
                      {slide.highlightText && (
                        <>
                          <br className="hidden sm:inline" />
                          <span className="text-[#5EEAD4]">{slide.highlightText}</span>
                        </>
                      )}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 mb-8">
                      {slide.subtitle && (
                        <p className="text-base sm:text-lg text-white/85 max-w-2xl leading-relaxed">
                          {slide.subtitle}
                        </p>
                      )}
                      {slide.ctaText && (
                        <Link href={slide.ctaLink || '/categories'}>
                          <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-xs px-4 h-9 gap-1.5">
                            {slide.ctaText} <ChevronRight className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      )}
                    </div>

                    {/* Search Box Card */}
                    <Card className="bg-white shadow-2xl">
                      <CardContent className="p-4 md:p-5">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                          <div className="md:col-span-5 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              placeholder="Search services, doctors, businesses..."
                              className="pl-10 h-12 text-base"
                              value={q}
                              onChange={e => setQ(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && doSearch()}
                            />
                          </div>
                          <div className="md:col-span-3">
                            <Select value={state || 'all'} onValueChange={(val) => {
                              const nextState = val === 'all' ? '' : val;
                              setState(nextState);
                              setCity('');
                              fetch(`/api/locations${nextState ? `?state=${encodeURIComponent(nextState)}` : ''}`)
                                .then(r => r.json())
                                .then(d => setLocations(prev => ({ ...prev, cities: d.cities || [] })));
                            }}>
                              <SelectTrigger className="h-12"><MapPin className="w-4 h-4 mr-2 text-muted-foreground" /><SelectValue placeholder="All States" /></SelectTrigger>
                              <SelectContent className="max-h-72">
                                <SelectItem value="all">🇮🇳 All States (Pan-India)</SelectItem>
                                {locations.states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="md:col-span-2">
                            <Select value={city || 'all'} onValueChange={(val) => setCity(val === 'all' ? '' : val)}>
                              <SelectTrigger className="h-12"><SelectValue placeholder="All Cities" /></SelectTrigger>
                              <SelectContent className="max-h-72">
                                <SelectItem value="all">All Cities</SelectItem>
                                {locations.cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="md:col-span-2">
                            <Button className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground text-base font-semibold" onClick={doSearch}>
                              <Search className="w-4 h-4 mr-2" />Search
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Popular Search Pills */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-white/80 mr-1">Popular:</span>
                      {POPULAR_SEARCHES.map(t => (
                        <button
                          key={t}
                          onClick={() => { setQ(t); setTimeout(doSearch, 50); }}
                          className="text-sm px-3 py-1 rounded-full bg-white/15 border border-white/25 text-white/90 hover:bg-white/25 transition-colors backdrop-blur-md"
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                      {statTiles.map((s, i) => (
                        <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 hover:bg-white/15 transition shadow-sm">
                          <s.icon className="w-5 h-5 mb-1.5 text-accent" />
                          <div className="text-xl md:text-2xl font-bold">{s.val}</div>
                          <div className="text-xs text-white/75">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            aria-label="Previous Slide"
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/25 grid place-items-center transition-all opacity-80 hover:opacity-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            aria-label="Next Slide"
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/25 grid place-items-center transition-all opacity-80 hover:opacity-100"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => api?.scrollTo(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${idx === selectedIndex ? 'w-8 bg-accent' : 'w-2 bg-white/40 hover:bg-white/70'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

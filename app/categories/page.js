'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  ChevronLeft, Search, Stethoscope, Sparkles, Wrench, Cpu, Camera, Utensils, GraduationCap, Printer, Briefcase, Home, Plane, Dog, Landmark, Scale,
  Hospital, Cross, Smile, Eye, Hand, Ear, Bone, HeartPulse, Brain, Baby, Venus, Activity, TestTubes, Pill, Ambulance, Droplet,
  Palette, Scissors, UserRound, Flower2, Zap, Hammer, Paintbrush, AirVent, Refrigerator, WashingMachine, Droplets,
  Monitor, Laptop, Cctv, Video, PartyPopper, Building, BedDouble, UtensilsCrossed, Coffee, Croissant, CakeSlice,
  School, BookOpen, PenLine, Library, BookMarked, Pen, Shirt, Ruler, IdCard, PrinterCheck, Car, Bus, Package, Truck, Cat,
  FileText, CreditCard, Fingerprint, Receipt, FileBadge, Shield, FileHeart, Heart, CarFront, Vote,
  Calculator, Gavel, Percent, FileSpreadsheet, Building2,
} from 'lucide-react';

const ICONS = {
  Stethoscope, Sparkles, Wrench, Cpu, Camera, Utensils, GraduationCap, Printer, Briefcase, Home, Plane, Dog, Landmark, Scale,
  Hospital, Cross, Smile, Eye, Hand, Ear, Bone, HeartPulse, Brain, Baby, Venus, Activity, TestTubes, Pill, Ambulance, Droplet,
  Palette, Scissors, UserRound, Flower2, Zap, Hammer, Paintbrush, AirVent, Refrigerator, WashingMachine, Droplets,
  Monitor, Laptop, Cctv, Video, PartyPopper, Building, BedDouble, UtensilsCrossed, Coffee, Croissant, CakeSlice,
  School, BookOpen, PenLine, Library, BookMarked, Pen, Shirt, Ruler, IdCard, PrinterCheck, Car, Bus, Package, Truck, Cat,
  FileText, CreditCard, Fingerprint, Receipt, FileBadge, Shield, FileHeart, Heart, CarFront, Vote,
  Calculator, Gavel, Percent, FileSpreadsheet, Building2,
};
function Icon({ name, className }) { const C = ICONS[name] || Sparkles; return <C className={className} />; }

export default function CategoriesPage() {
  const [groups, setGroups] = useState({});
  const [q, setQ] = useState('');

  useEffect(() => {
    fetch('/api/categories?grouped=true').then(r => r.json()).then(d => setGroups(d.groups || {}));
  }, []);

  const filter = (list) => q ? list.filter(c => c.name.toLowerCase().includes(q.toLowerCase())) : list;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1 text-sm"><ChevronLeft className="w-4 h-4" />Home</Link>
          <div className="flex-1 max-w-md ml-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Filter categories..." className="pl-9 h-10" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Browse All Categories</h1>
        <p className="text-slate-500 mb-8">Find any service across {Object.values(groups).reduce((a, b) => a + b.length, 0)}+ categories</p>

        <div className="space-y-8">
          {Object.entries(groups).map(([group, items]) => {
            const filtered = filter(items);
            if (filtered.length === 0) return null;
            return (
              <div key={group}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${items[0]?.color} grid place-items-center text-white`}>
                    <Icon name={items[0]?.groupIcon || items[0]?.icon} className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">{group}</h2>
                  <span className="text-sm text-slate-500">({filtered.length})</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {filtered.map(c => (
                    <Link key={c.id} href={`/search?category=${c.slug}`}>
                      <Card className="hover:shadow-md hover:border-blue-400 transition-all">
                        <CardContent className="p-3 flex items-center gap-2">
                          <div className={`w-9 h-9 rounded-md bg-gradient-to-br ${c.color} grid place-items-center text-white flex-shrink-0`}>
                            <Icon name={c.icon} className="w-4 h-4" />
                          </div>
                          <div className="text-sm font-medium truncate">{c.name}</div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

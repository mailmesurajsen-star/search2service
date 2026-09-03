'use client';
import { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/lib/use-auth';
import { FileUploader } from '@/components/file-uploader';
import { toast } from 'sonner';
import {
  Users, Building2, Stethoscope, TrendingUp, ShieldCheck, LogOut, Settings,
  MessageSquare, Layers, Map, Calendar, Search, Plus, Trash2, Edit, CheckCircle,
  XCircle, Star, Phone, Mail, MapPin, Eye, AlertCircle, RefreshCw, Save, Check,
  SlidersHorizontal, ChevronRight, ArrowLeft, Sparkles, ArrowUp, ArrowDown, ExternalLink,
  Image as ImageIcon, ToggleLeft, ToggleRight, Play, LayoutTemplate,
  Megaphone, BadgePercent, Radio, MousePointerClick, Flame, Copy, CalendarDays,
  Target, BarChart3, Layers3, Landmark, CreditCard, Wallet, KeyRound, IndianRupee, Crown, Smartphone
} from 'lucide-react';

const PRESET_IMAGES = [
  { label: '🇮🇳 India Marketplace', url: 'https://images.pexels.com/photos/31786661/pexels-photo-31786661.jpeg', gradient: 'from-blue-950/90 via-blue-900/85 to-orange-800/80', badge: '🇮🇳 India’s Complete Services Marketplace' },
  { label: '🩺 Healthcare & Doctors', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80', gradient: 'from-slate-950/90 via-blue-950/85 to-cyan-950/80', badge: '🩺 Verified Healthcare & Doctors' },
  { label: '⚡ Home Repair & Experts', url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1920&q=80', gradient: 'from-slate-950/90 via-amber-950/85 to-orange-950/80', badge: '⚡ Fast & Reliable Home Experts' },
  { label: '💼 Jobs & Business', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80', gradient: 'from-indigo-950/90 via-purple-950/85 to-slate-950/80', badge: '💼 Verified Businesses & Job Opportunities' },
  { label: '✨ Salon & Spa Beauty', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=80', gradient: 'from-slate-950/90 via-fuchsia-950/85 to-purple-950/80', badge: '✨ Top Salons & Beauty Experts' },
  { label: '🍽️ Food & Restaurants', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80', gradient: 'from-slate-950/90 via-red-950/85 to-amber-950/80', badge: '🍽️ Famous Restaurants & Cafes' },
];

const GRADIENT_PRESETS = [
  { label: 'Brand (Blue to Orange)', value: 'from-blue-950/40 via-blue-900/40 to-orange-800/40', bg: 'bg-gradient-to-r from-blue-900 to-orange-600' },
  { label: 'Healthcare Cyan', value: 'from-slate-950/40 via-blue-950/40 to-cyan-950/40', bg: 'bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-700' },
  { label: 'Warm Amber', value: 'from-slate-950/40 via-amber-950/40 to-orange-950/40', bg: 'bg-gradient-to-r from-slate-900 via-amber-800 to-orange-700' },
  { label: 'Deep Indigo', value: 'from-slate-950/40 via-indigo-950/40 to-blue-900/40', bg: 'bg-gradient-to-r from-slate-950 via-indigo-900 to-blue-800' },
  { label: 'Purple Velvet', value: 'from-indigo-950/40 via-purple-950/40 to-slate-950/40', bg: 'bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900' },
  { label: 'Emerald Teal', value: 'from-slate-950/40 via-emerald-950/40 to-teal-950/40', bg: 'bg-gradient-to-r from-slate-950 via-emerald-900 to-teal-800' },
];

const PLACEMENT_OPTIONS = [
  { value: 'homepage_banner', label: '🏠 Homepage Middle Banner', desc: 'Prominent wide banner displayed between homepage sections', badgeColor: 'bg-primary/10 text-primary border-primary/30' },
  { value: 'search_top', label: '🔍 Search Top Sponsored Ad', desc: 'Highlighted sponsored banner at the top of search result listings', badgeColor: 'bg-amber-950 text-amber-300 border-amber-800' },
  { value: 'search_sidebar', label: '📑 Search & Category Sidebar', desc: 'Vertical card banner in the search and category filters sidebar', badgeColor: 'bg-accent/10 text-accent/80 border-accent/30' },
  { value: 'popup_modal', label: '💬 Floating Promo Toast / Modal', desc: 'Bottom-right floating promotional card with dismiss button', badgeColor: 'bg-accent/10 text-accent border-accent/30' },
  { value: 'footer_banner', label: '📌 Above Footer Sticky Banner', desc: 'Full-width banner placed above the website footer', badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800' },
];

const AD_PRESETS = [
  {
    label: '⚡ Summer AC & Appliance 50% Off',
    title: '⚡ 50% Off Summer AC & Appliance Repair',
    subtitle: 'Certified technicians at your doorstep within 60 minutes across India.',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80',
    targetUrl: '/search?category=ac-repair',
    placement: 'homepage_banner',
    badge: '🔥 Summer Super Saver',
    ctaText: 'Book AC Service',
    advertiserName: 'Urban Cool Tech',
    advertiserPhone: '+91 98765 11223',
    gradient: 'from-amber-600/10 via-orange-600/10 to-red-700/10'
  },
  {
    label: '🩺 Doctor Consultation & Diagnostic',
    title: '🩺 Free First Consultation & 20% Off Diagnostics',
    subtitle: 'Consult top specialist doctors & NABL accredited labs near you.',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    targetUrl: '/search?group=Healthcare',
    placement: 'search_top',
    badge: '✨ Sponsored Healthcare',
    ctaText: 'Find Specialists',
    advertiserName: 'MediCare Plus Clinics',
    advertiserPhone: '+91 98765 22334',
    gradient: 'from-blue-600/10 via-indigo-600/10 to-cyan-700/10'
  },
  {
    label: '💼 Urgent Hiring: Staff & Technicians',
    title: '💼 Urgent Hiring: 500+ Local Service Technicians & Staff',
    subtitle: 'Direct placement with salary up to ₹35,000/month. Zero recruitment fees.',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    targetUrl: '/search?group=Job+%26+Career',
    placement: 'search_sidebar',
    badge: '💼 Career Spotlight',
    ctaText: 'Apply Online',
    advertiserName: 'FastHire Services India',
    advertiserPhone: '+91 98765 33445',
    gradient: 'from-indigo-600/10 via-purple-600/10 to-slate-800/10'
  },
  {
    label: '🎉 Deep Cleaning Cashback Mega Sale',
    title: '🎉 Monsoon Mega Sale: Flat ₹200 Cashback on Home Cleaning',
    subtitle: 'Deep cleaning, sanitization & pest control by verified experts.',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    targetUrl: '/search?group=Home+Services',
    placement: 'popup_modal',
    badge: '🎁 Festive Special',
    ctaText: 'Claim Cashback',
    advertiserName: 'CleanPro India',
    advertiserPhone: '+91 98765 44556',
    gradient: 'from-fuchsia-600/10 via-pink-600/10 to-rose-700/10'
  },
  {
    label: '🚀 Partner With Us - List Business',
    title: '📱 List Your Business & Reach 10,000+ Customers Every Month',
    subtitle: 'Join Search2Service Partner Network today with zero listing fee.',
    imageUrl: 'https://images.pexels.com/photos/31786661/pexels-photo-31786661.jpeg',
    targetUrl: '/auth?mode=register&role=provider',
    placement: 'footer_banner',
    badge: '🚀 Partner Program',
    ctaText: 'List Business Now',
    advertiserName: 'Search2Service Growth',
    advertiserPhone: '+91 98765 55667',
    gradient: 'from-slate-900/10 via-blue-950/10 to-indigo-900/10'
  }
];

const ALL_INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

function AdminDashboardContent() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active Tab state
  const [activeTab, setActiveTab] = useState('overview');

  // Stats & Analytics State
  const [stats, setStats] = useState({ providers: 0, doctors: 0, categories: 0, customers: 0, reviews: 0, bookings: 0 });
  const [analyticsData, setAnalyticsData] = useState(null);

  // Providers Management State
  const [providers, setProviders] = useState([]);
  const [providerStats, setProviderStats] = useState({});
  const [providerSearch, setProviderSearch] = useState('');
  const [providerCategory, setProviderCategory] = useState('all');
  const [providerStatus, setProviderStatus] = useState('all');
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [isAddProviderOpen, setIsAddProviderOpen] = useState(false);
  const [newProvider, setNewProvider] = useState({
    name: '', categorySlug: 'doctor', city: 'Lucknow', state: 'Uttar Pradesh',
    phone: '', email: '', priceFrom: '₹199', description: '', status: 'active', verified: true
  });

  // Government Service Upload State
  const [isAddGovtServiceOpen, setIsAddGovtServiceOpen] = useState(false);
  const [newGovtService, setNewGovtService] = useState({
    name: '', categorySlug: 'csc-center', customCategoryName: '', website: '', banner: '', status: 'active', verified: true
  });
  const [isCustomGovtType, setIsCustomGovtType] = useState(false);
  const [editingGovtService, setEditingGovtService] = useState(null);

  // Category Management State
  const [categories, setCategories] = useState([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '', slug: '', group: 'Healthcare', icon: 'Stethoscope',
    color: 'from-rose-500 to-pink-600', description: ''
  });

  // Users & Role Management State
  const [usersList, setUsersList] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Locations Management State
  const [locationsData, setLocationsData] = useState({ cities: [], states: [] });
  const [locationsList, setLocationsList] = useState([]);
  const [locationStats, setLocationStats] = useState({ totalStates: 0, totalDistricts: 0, totalCities: 0, totalAreas: 0, customLocations: 0 });
  const [locationSearch, setLocationSearch] = useState('');
  const [locationStateFilter, setLocationStateFilter] = useState('all');
  const [locationStatusFilter, setLocationStatusFilter] = useState('all');
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [quickAreaInput, setQuickAreaInput] = useState({});
  const [newLocation, setNewLocation] = useState({
    state: 'Maharashtra',
    customState: '',
    district: '',
    city: '',
    areas: '',
    pincode: '',
    tier: 'Tier 2',
    isActive: true
  });

  // Bookings Management State
  const [bookingsList, setBookingsList] = useState([]);
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [bookingSearch, setBookingSearch] = useState('');

  // Platform Settings State
  const [settings, setSettings] = useState({
    platformName: 'Search2Service',
    supportPhone: '+91 9876543210',
    supportEmail: 'support@search2service.in',
    emergencyNotice: '24x7 Emergency Services are active across major cities.',
    noticeActive: true,
    maintenanceMode: false,
    playStoreUrl: '',
    appStoreUrl: ''
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState('');

  // Payment Gateway & Billing State
  const [gateway, setGateway] = useState({ provider: 'razorpay', keyId: '', keySecret: '', enabled: false, premiumAmount: 499, hasSecret: false });
  const [savingGateway, setSavingGateway] = useState(false);
  const [billingList, setBillingList] = useState([]);
  const [billingStats, setBillingStats] = useState({ totalRevenue: 0, paidTransactions: 0, activePremiumProviders: 0 });
  const [loadingBilling, setLoadingBilling] = useState(false);

  // Hero Slider State
  const [heroSlides, setHeroSlides] = useState([]);
  const [loadingSlides, setLoadingSlides] = useState(false);
  const [isAddSlideOpen, setIsAddSlideOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [newSlide, setNewSlide] = useState({
    title: '',
    highlightText: '',
    badge: '🇮🇳 India’s Complete Services Marketplace',
    subtitle: 'Doctors, home services, hotels, restaurants, jobs, government forms — everything you need on one platform.',
    imageUrl: 'https://images.pexels.com/photos/31786661/pexels-photo-31786661.jpeg',
    overlayGradient: 'from-blue-950/40 via-blue-900/40 to-orange-800/40',
    ctaText: 'Explore Categories',
    ctaLink: '/categories',
    order: 1,
    isActive: true
  });

  // Ads & Banners Management State
  const [adsList, setAdsList] = useState([]);
  const [adsStats, setAdsStats] = useState({ totalAds: 0, activeAds: 0, inactiveAds: 0, totalImpressions: 0, totalClicks: 0, averageCTR: 0 });
  const [adSearch, setAdSearch] = useState('');
  const [adPlacementFilter, setAdPlacementFilter] = useState('all');
  const [adStatusFilter, setAdStatusFilter] = useState('all');
  const [loadingAds, setLoadingAds] = useState(false);
  const [isAddAdOpen, setIsAddAdOpen] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [copiedAdId, setCopiedAdId] = useState(null);
  const [newAd, setNewAd] = useState({
    title: '',
    subtitle: '',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80',
    targetUrl: '/search?category=ac-repair',
    placement: 'homepage_banner',
    badge: '🔥 Summer Super Saver',
    ctaText: 'Book AC Service',
    advertiserName: '',
    advertiserPhone: '',
    gradient: 'from-amber-600/10 via-orange-600/10 to-red-700/10',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'active',
    priority: 1
  });

  // Authentication check
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth?next=/admin/dashboard&role=admin');
    } else if (user && !['admin', 'super_admin', 'state_manager', 'district_manager'].includes(user.role)) {
      router.replace('/');
    }
  }, [user, loading, router]);

  // Initial Load
  const fetchOverviewStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchProviders = useCallback(async () => {
    setLoadingProviders(true);
    try {
      const params = new URLSearchParams();
      if (providerSearch.trim()) params.set('q', providerSearch.trim());
      if (providerCategory !== 'all') params.set('category', providerCategory);
      if (providerStatus !== 'all') params.set('status', providerStatus);
      params.set('limit', '50');

      const res = await fetch(`/api/admin/providers?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProviders(data.items || []);
        setProviderStats(data.stats || {});
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProviders(false);
    }
  }, [providerSearch, providerCategory, providerStatus]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const params = new URLSearchParams();
      if (userSearch.trim()) params.set('q', userSearch.trim());
      if (userRoleFilter !== 'all') params.set('role', userRoleFilter);
      params.set('limit', '50');

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setUsersList(data.items || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingUsers(false);
    }
  }, [userSearch, userRoleFilter]);

  const fetchLocations = useCallback(async () => {
    setLoadingLocations(true);
    try {
      const params = new URLSearchParams();
      if (locationSearch.trim()) params.set('q', locationSearch.trim());
      if (locationStateFilter !== 'all') params.set('state', locationStateFilter);
      if (locationStatusFilter !== 'all') params.set('status', locationStatusFilter);
      params.set('limit', '200');

      const [resList, resSummary] = await Promise.all([
        fetch(`/api/admin/locations?${params.toString()}`),
        fetch('/api/admin/locations-summary')
      ]);

      if (resList.ok) {
        const data = await resList.json();
        setLocationsList(data.items || []);
        if (data.stats) setLocationStats(data.stats);
      }
      if (resSummary.ok) {
        const dataSummary = await resSummary.json();
        setLocationsData(dataSummary);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLocations(false);
    }
  }, [locationSearch, locationStateFilter, locationStatusFilter]);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (bookingStatusFilter !== 'all') params.set('status', bookingStatusFilter);
      if (bookingSearch.trim()) params.set('q', bookingSearch.trim());

      const res = await fetch(`/api/admin/bookings?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setBookingsList(data.items || []);
      }
    } catch (e) {
      console.error(e);
    }
  }, [bookingStatusFilter, bookingSearch]);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) setSettings(data.settings);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchGateway = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/payment-gateway');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) setGateway(prev => ({ ...prev, ...data.settings, keySecret: '' }));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchBilling = useCallback(async () => {
    setLoadingBilling(true);
    try {
      const res = await fetch('/api/admin/billing');
      if (res.ok) {
        const data = await res.json();
        setBillingList(data.items || []);
        if (data.stats) setBillingStats(data.stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBilling(false);
    }
  }, []);

  const fetchHeroSlides = useCallback(async () => {
    setLoadingSlides(true);
    try {
      const res = await fetch('/api/admin/hero-slides');
      if (res.ok) {
        const data = await res.json();
        setHeroSlides(data.slides || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSlides(false);
    }
  }, []);

  const fetchAds = useCallback(async () => {
    setLoadingAds(true);
    try {
      const params = new URLSearchParams();
      if (adSearch.trim()) params.set('q', adSearch.trim());
      if (adPlacementFilter !== 'all') params.set('placement', adPlacementFilter);
      if (adStatusFilter !== 'all') params.set('status', adStatusFilter);
      params.set('limit', '100');

      const res = await fetch(`/api/admin/ads?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAdsList(data.items || []);
        if (data.stats) setAdsStats(data.stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAds(false);
    }
  }, [adSearch, adPlacementFilter, adStatusFilter]);

  useEffect(() => {
    fetchOverviewStats();
    fetchCategories();
    fetchHeroSlides();
    fetchAds();
    fetchGateway();
  }, [fetchOverviewStats, fetchCategories, fetchHeroSlides, fetchAds, fetchGateway]);

  useEffect(() => {
    if (activeTab === 'providers' || activeTab === 'overview') fetchProviders();
    if (activeTab === 'categories') fetchCategories();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'locations') fetchLocations();
    if (activeTab === 'analytics') fetchAnalytics();
    if (activeTab === 'bookings') fetchBookings();
    if (activeTab === 'settings') fetchSettings();
    if (activeTab === 'payment-gateway') { fetchGateway(); fetchBilling(); }
    if (activeTab === 'hero-slider' || activeTab === 'overview') fetchHeroSlides();
    if (activeTab === 'ads' || activeTab === 'overview') fetchAds();
  }, [activeTab, fetchProviders, fetchCategories, fetchUsers, fetchLocations, fetchAnalytics, fetchBookings, fetchSettings, fetchGateway, fetchBilling, fetchHeroSlides, fetchAds]);

  // Provider Actions
  const handleUpdateProviderStatus = async (providerId, updates) => {
    try {
      const res = await fetch(`/api/admin/providers/${providerId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        fetchProviders();
        fetchOverviewStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProvider = async (providerId, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/providers/${providerId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProviders();
        fetchOverviewStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateProvider = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProvider),
      });
      if (res.ok) {
        setIsAddProviderOpen(false);
        setNewProvider({
          name: '', categorySlug: 'doctor', city: 'Lucknow', state: 'Uttar Pradesh',
          phone: '', email: '', priceFrom: '₹199', description: '', status: 'active', verified: true
        });
        fetchProviders();
        fetchOverviewStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateGovtService = async (e) => {
    e.preventDefault();
    if (!newGovtService.name.trim()) {
      toast.error('Service name is required');
      return;
    }
    if (isCustomGovtType && !newGovtService.customCategoryName.trim()) {
      toast.error('Enter a name for the custom service type');
      return;
    }
    try {
      let categorySlug = newGovtService.categorySlug;

      if (isCustomGovtType) {
        const catRes = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newGovtService.customCategoryName.trim(),
            group: 'Government Services',
            icon: 'Landmark',
            groupIcon: 'Landmark',
            color: 'from-orange-500 to-red-600',
          }),
        });
        const catData = await catRes.json();
        if (!catRes.ok) {
          toast.error(catData.error || catData.detail || 'Failed to create custom service type');
          return;
        }
        categorySlug = catData.category.slug;
        fetchCategories();
      }

      const { customCategoryName, ...payload } = newGovtService;
      const res = await fetch('/api/admin/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, categorySlug }),
      });
      if (res.ok) {
        toast.success('Government service listed successfully!');
        setIsAddGovtServiceOpen(false);
        setIsCustomGovtType(false);
        setNewGovtService({
          name: '', categorySlug: 'csc-center', customCategoryName: '', website: '', banner: '', status: 'active', verified: true
        });
        fetchProviders();
        fetchOverviewStats();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || data.detail || 'Failed to add government service');
      }
    } catch (e) {
      console.error(e);
      toast.error('Network error: ' + (e.message || 'Failed to add government service'));
    }
  };

  const handleSaveEditGovtService = async (e) => {
    e.preventDefault();
    if (!editingGovtService) return;
    if (!editingGovtService.name.trim()) {
      toast.error('Service name is required');
      return;
    }
    try {
      const res = await fetch(`/api/admin/providers/${editingGovtService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingGovtService.name,
          categorySlug: editingGovtService.categorySlug,
          website: editingGovtService.website,
          banner: editingGovtService.banner,
        }),
      });
      if (res.ok) {
        toast.success('Government service updated!');
        setEditingGovtService(null);
        fetchProviders();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || data.detail || 'Failed to update government service');
      }
    } catch (e) {
      console.error(e);
      toast.error('Network error: ' + (e.message || 'Failed to update government service'));
    }
  };

  const handleSaveEditProvider = async (e) => {
    e.preventDefault();
    if (!editingProvider) return;
    try {
      const res = await fetch(`/api/admin/providers/${editingProvider.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProvider),
      });
      if (res.ok) {
        setEditingProvider(null);
        fetchProviders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Category Actions
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });
      if (res.ok) {
        setIsAddCategoryOpen(false);
        setNewCategory({
          name: '', slug: '', group: 'Healthcare', icon: 'Stethoscope',
          color: 'from-rose-500 to-pink-600', description: ''
        });
        fetchCategories();
        fetchOverviewStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveEditCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      const res = await fetch(`/api/admin/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCategory),
      });
      if (res.ok) {
        setEditingCategory(null);
        fetchCategories();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCategory = async (categoryId, name) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCategories();
        fetchOverviewStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // User Actions
  const handleChangeUserRole = async (userId, newRole) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleUserVerify = async (userId, currentStatus) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: !currentStatus }),
      });
      if (res.ok) fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteUser = async (userId, email) => {
    if (!confirm(`Delete user ${email}?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      if (res.ok) fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  // Location Actions
  const handleCreateLocation = async (e) => {
    e.preventDefault();
    try {
      const stateToUse = newLocation.state === 'CUSTOM' ? newLocation.customState : newLocation.state;
      const rawAreas = typeof newLocation.areas === 'string' ? newLocation.areas.split(',') : [];
      const areas = rawAreas.map(a => a.trim()).filter(Boolean);

      const res = await fetch('/api/admin/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: stateToUse,
          district: newLocation.district || newLocation.city,
          city: newLocation.city,
          areas,
          pincode: newLocation.pincode,
          tier: newLocation.tier,
          isActive: newLocation.isActive
        }),
      });

      if (res.ok) {
        setIsAddLocationOpen(false);
        setNewLocation({
          state: 'Maharashtra',
          customState: '',
          district: '',
          city: '',
          areas: '',
          pincode: '',
          tier: 'Tier 2',
          isActive: true
        });
        fetchLocations();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveEditLocation = async (e) => {
    e.preventDefault();
    if (!editingLocation) return;
    try {
      const rawAreas = typeof editingLocation.areas === 'string'
        ? editingLocation.areas.split(',')
        : Array.isArray(editingLocation.areas) ? editingLocation.areas : [];
      const areas = rawAreas.map(a => a.trim()).filter(Boolean);

      const res = await fetch(`/api/admin/locations/${editingLocation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: editingLocation.state,
          district: editingLocation.district,
          city: editingLocation.city,
          areas,
          pincode: editingLocation.pincode,
          tier: editingLocation.tier,
          isActive: editingLocation.isActive
        }),
      });

      if (res.ok) {
        setEditingLocation(null);
        fetchLocations();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteLocation = async (locId, cityName) => {
    if (!confirm(`Are you sure you want to delete location "${cityName}"?`)) return;
    try {
      const res = await fetch(`/api/admin/locations/${locId}`, { method: 'DELETE' });
      if (res.ok) fetchLocations();
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuickAddArea = async (locId, areaText) => {
    if (!areaText || !areaText.trim()) return;
    try {
      const res = await fetch(`/api/admin/locations/${locId}/areas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ area: areaText.trim() }),
      });
      if (res.ok) {
        setQuickAreaInput(prev => ({ ...prev, [locId]: '' }));
        fetchLocations();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteArea = async (locId, areaName) => {
    try {
      const res = await fetch(`/api/admin/locations/${locId}/areas/${encodeURIComponent(areaName)}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchLocations();
    } catch (e) {
      console.error(e);
    }
  };

  // Booking Actions
  const handleChangeBookingStatus = async (bookingId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchBookings();
    } catch (e) {
      console.error(e);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSettingsSavedMessage('Platform settings saved successfully!');
        setTimeout(() => setSettingsSavedMessage(''), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingSettings(false);
    }
  };

  // Payment Gateway Actions
  const handleSaveGateway = async (e) => {
    e.preventDefault();
    setSavingGateway(true);
    try {
      const res = await fetch('/api/admin/payment-gateway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gateway),
      });
      if (res.ok) {
        toast.success('Payment gateway settings saved!');
        fetchGateway();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || data.detail || 'Failed to save gateway settings');
      }
    } catch (e) {
      console.error(e);
      toast.error('Network error while saving gateway settings');
    } finally {
      setSavingGateway(false);
    }
  };

  // Hero Slide Actions
  const handleCreateSlide = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/hero-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newSlide,
          order: parseInt(newSlide.order) || (heroSlides.length + 1),
        }),
      });
      if (res.ok) {
        setIsAddSlideOpen(false);
        setNewSlide({
          title: '',
          highlightText: '',
          badge: '🇮🇳 India’s Complete Services Marketplace',
          subtitle: '',
          imageUrl: 'https://images.pexels.com/photos/31786661/pexels-photo-31786661.jpeg',
          overlayGradient: 'from-blue-950/40 via-blue-900/40 to-orange-800/40',
          ctaText: 'Explore Categories',
          ctaLink: '/categories',
          order: heroSlides.length + 2,
          isActive: true,
        });
        fetchHeroSlides();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveEditSlide = async (e) => {
    e.preventDefault();
    if (!editingSlide) return;
    try {
      const res = await fetch(`/api/admin/hero-slides/${editingSlide.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingSlide,
          order: parseInt(editingSlide.order) || 1,
        }),
      });
      if (res.ok) {
        setEditingSlide(null);
        fetchHeroSlides();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleSlideActive = async (slideId, currentStatus) => {
    try {
      const res = await fetch(`/api/admin/hero-slides/${slideId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) fetchHeroSlides();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSlide = async (slideId, title) => {
    if (!confirm(`Are you sure you want to delete slide "${title || 'Untitled'}"?`)) return;
    try {
      const res = await fetch(`/api/admin/hero-slides/${slideId}`, { method: 'DELETE' });
      if (res.ok) fetchHeroSlides();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMoveSlideOrder = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= heroSlides.length) return;
    const updated = [...heroSlides];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const slideOrders = updated.map((s, idx) => ({ id: s.id, order: idx + 1 }));
    setHeroSlides(updated);

    try {
      await fetch('/api/admin/hero-slides/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slideOrders }),
      });
      fetchHeroSlides();
    } catch (e) {
      console.error(e);
    }
  };

  // Ads & Banners Actions
  const handleCreateAd = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAd),
      });
      if (res.ok) {
        toast.success('Ad campaign created successfully!');
        setIsAddAdOpen(false);
        setNewAd({
          title: '',
          subtitle: '',
          imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80',
          targetUrl: '/search?category=ac-repair',
          placement: 'homepage_banner',
          badge: '🔥 Summer Super Saver',
          ctaText: 'Book AC Service',
          advertiserName: '',
          advertiserPhone: '',
          gradient: 'from-amber-600/10 via-orange-600/10 to-red-700/10',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'active',
          priority: 1
        });
        fetchAds();
        fetchOverviewStats();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || data.detail || 'Failed to create ad campaign');
      }
    } catch (e) {
      console.error(e);
      toast.error('Network error: ' + (e.message || 'Failed to create ad campaign'));
    }
  };

  const handleSaveEditAd = async (e) => {
    e.preventDefault();
    if (!editingAd) return;
    try {
      const res = await fetch(`/api/admin/ads/${editingAd.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingAd),
      });
      if (res.ok) {
        toast.success('Ad campaign updated successfully!');
        setEditingAd(null);
        fetchAds();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || data.detail || 'Failed to update ad campaign');
      }
    } catch (e) {
      console.error(e);
      toast.error('Network error: ' + (e.message || 'Failed to update ad campaign'));
    }
  };

  const handleToggleAdStatus = async (adId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch(`/api/admin/ads/${adId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        toast.success(`Ad campaign marked as ${nextStatus}`);
        fetchAds();
        fetchOverviewStats();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || data.detail || 'Failed to update ad status');
      }
    } catch (e) {
      console.error(e);
      toast.error('Network error: ' + (e.message || 'Failed to update ad status'));
    }
  };

  const handleDeleteAd = async (adId, title) => {
    if (!confirm(`Are you sure you want to delete ad campaign "${title || 'Untitled'}"?`)) return;
    try {
      const res = await fetch(`/api/admin/ads/${adId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Ad campaign deleted');
        fetchAds();
        fetchOverviewStats();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || data.detail || 'Failed to delete ad');
      }
    } catch (e) {
      console.error(e);
      toast.error('Network error: ' + (e.message || 'Failed to delete ad'));
    }
  };

  const handleMoveAdPriority = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= adsList.length) return;
    const updated = [...adsList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const adOrders = updated.map((ad, idx) => ({ id: ad.id, priority: idx + 1 }));
    setAdsList(updated);

    try {
      const res = await fetch('/api/admin/ads/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adOrders }),
      });
      if (res.ok) {
        fetchAds();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || data.detail || 'Failed to reorder ads');
      }
    } catch (e) {
      console.error(e);
      toast.error('Network error: ' + (e.message || 'Failed to reorder ads'));
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-card flex flex-col items-center justify-center text-white">
        <RefreshCw className="w-8 h-8 animate-spin text-accent mb-3" />
        <div className="text-muted-foreground">Loading Search2Service Admin Console...</div>
      </div>
    );
  }

  const overviewTiles = [
    { icon: Users, label: 'Customers', value: stats.customers || 0, color: 'from-primary to-primary/80', tab: 'users' },
    { icon: Building2, label: 'Providers', value: stats.providers || 0, color: 'from-accent to-accent/80', tab: 'providers' },
    { icon: Megaphone, label: 'Live Ads & Banners', value: adsStats.activeAds || 0, color: 'from-[#F5A623] to-[#D97706]', tab: 'ads' },
    { icon: Stethoscope, label: 'Doctors & Clinics', value: stats.doctors || 0, color: 'from-primary to-primary/80', tab: 'providers' },
    { icon: Layers, label: 'Categories', value: stats.categories || 0, color: 'from-accent to-accent/80', tab: 'categories' },
    { icon: Calendar, label: 'Bookings', value: stats.bookings || 0, color: 'from-primary to-primary/80', tab: 'bookings' },
  ];

  const mgmtModules = [
    { id: 'ads', icon: Megaphone, title: 'Ads & Banners Manager', desc: 'Create, schedule, target placements & track banner analytics', color: 'from-[#F5A623] to-[#D97706]', count: `${adsStats.totalAds || 0} campaigns` },
    { id: 'hero-slider', icon: Sparkles, title: 'Hero Section Slider', desc: 'Create, reorder & customize homepage rotating banners', color: 'from-accent to-accent/80', count: `${heroSlides.length || 0} slides` },
    { id: 'providers', icon: Building2, title: 'Provider Management', desc: 'Approve, verify, edit, or feature service providers', color: 'from-primary to-primary/80', count: `${providerStats.total || stats.providers} listings` },
    { id: 'categories', icon: Layers, title: 'Category Management', desc: 'Add, edit or organize services & subcategories', color: 'from-accent to-accent/80', count: `${categories.length || stats.categories} categories` },
    { id: 'locations', icon: Map, title: 'Location Management', desc: 'Manage covered States, Districts, Cities & Areas', color: 'from-primary to-primary/80', count: 'All India coverage' },
    { id: 'analytics', icon: TrendingUp, title: 'Analytics & Reports', desc: 'Platform insights, growth metrics, category breakdowns', color: 'from-accent to-accent/80', count: 'Live Analytics' },
    { id: 'users', icon: ShieldCheck, title: 'Role & Permissions', desc: 'Manage user access, promote State/District Managers', color: 'from-primary to-primary/80', count: `${stats.customers || 0} users` },
    { id: 'settings', icon: Settings, title: 'CMS & Settings', desc: 'Emergency banners, helpline, SEO and platform toggles', color: 'from-accent to-accent/80', count: 'Platform Config' },
    { id: 'payment-gateway', icon: CreditCard, title: 'Payment Gateway', desc: 'Connect Razorpay for Premium plan checkout & view billing', color: 'from-primary to-primary/80', count: gateway.enabled ? 'Connected' : 'Not configured' },
  ];

  return (
    <div className="dark min-h-screen bg-background text-foreground font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent grid place-items-center text-white shadow-md shadow-accent/20">
                <Search className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-foreground">
                Admin Console
              </span>
            </Link>
            <Badge variant="outline" className="ml-2 bg-accent/10 text-accent border-accent/30 text-[11px] px-2.5 py-0.5">
              {user.role.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-xs text-muted-foreground hover:text-white transition flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> View Public Portal
            </Link>
            <div className="h-4 w-px bg-muted" />
            <Button
              size="sm"
              variant="destructive"
              className="bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/60 text-xs"
              onClick={async () => { await logout(); router.push('/'); }}
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-3 mb-6 border-b border-border scrollbar-none">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'ads', label: 'Ads & Banners', icon: Megaphone },
              { id: 'hero-slider', label: 'Hero Slider', icon: Sparkles },
              { id: 'providers', label: 'Providers', icon: Building2 },
              { id: 'categories', label: 'Categories', icon: Layers },
              { id: 'locations', label: 'Locations', icon: Map },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'users', label: 'Users & Roles', icon: ShieldCheck },
              { id: 'bookings', label: 'Bookings', icon: Calendar },
              { id: 'settings', label: 'CMS Settings', icon: Settings },
              { id: 'payment-gateway', label: 'Payment Gateway', icon: CreditCard },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab !== 'overview' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActiveTab('overview')}
              className="text-xs bg-card border-border text-foreground hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Overview
            </Button>
          )}
        </div>

        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW & DASHBOARD */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-primary/60 via-primary/30 to-card border border-accent/20 rounded-2xl p-6 relative overflow-hidden shadow-xl">
              <div className="relative z-10 max-w-2xl">
                <Badge className="bg-accent/20 text-accent border-accent/30 mb-2">Platform Control Room</Badge>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                  Welcome, {user.name || 'Admin'}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage search listings, categories, verification approvals, user permissions, and real-time operations across Search2Service.
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {overviewTiles.map((t) => (
                <Card
                  key={t.label}
                  onClick={() => setActiveTab(t.tab)}
                  className="bg-card/80 border-border hover:border-border transition cursor-pointer hover:shadow-lg"
                >
                  <CardContent className="p-4">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${t.color} grid place-items-center text-white mb-3 shadow-md`}>
                      <t.icon className="w-4 h-4" />
                    </div>
                    <div className="text-2xl font-bold text-white tracking-tight">{t.value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{t.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Management Section Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-accent" /> Platform Management Modules
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Click any module below to open its full control panel</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {mgmtModules.map((m) => (
                  <Card
                    key={m.id}
                    onClick={() => setActiveTab(m.id)}
                    className="bg-card/90 border-border hover:border-accent/50 hover:bg-card transition-all cursor-pointer group shadow-md hover:shadow-accent/10"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.color} grid place-items-center text-white mb-3 shadow-lg group-hover:scale-105 transition`}>
                          <m.icon className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-medium bg-muted text-foreground px-2.5 py-0.5 rounded-full">
                          {m.count}
                        </span>
                      </div>
                      <div className="font-bold text-white text-base group-hover:text-accent transition flex items-center justify-between">
                        {m.title}
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition" />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{m.desc}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Actions: Pending Approvals Alert */}
            {providerStats.pending > 0 && (
              <div className="bg-amber-950/30 border border-amber-800/60 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-sm font-semibold text-amber-200">
                      {providerStats.pending} Provider Registrations Pending Approval
                    </div>
                    <div className="text-xs text-amber-400/80">
                      Review business profiles and KYC verification before activating.
                    </div>
                  </div>
                </div>
                <Button size="sm" onClick={() => { setProviderStatus('pending'); setActiveTab('providers'); }} className="bg-amber-600 hover:bg-amber-500 text-white text-xs">
                  Review Now
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: PROVIDER MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'providers' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-accent" /> Provider Management
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Manage listings, approve pending applications, verify credentials, and edit business profiles.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => setIsAddGovtServiceOpen(true)} variant="outline" className="bg-primary/10 hover:bg-primary/20 border-primary/30 text-primary text-xs gap-1.5">
                  <Landmark className="w-4 h-4" /> Add Government Service
                </Button>
                <Button onClick={() => setIsAddProviderOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs gap-1.5 shadow-md shadow-blue-600/30">
                  <Plus className="w-4 h-4" /> Add New Provider
                </Button>
              </div>
            </div>

            {/* Filter Bar */}
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                    <Input
                      placeholder="Search name, phone, city..."
                      value={providerSearch}
                      onChange={(e) => setProviderSearch(e.target.value)}
                      className="pl-9 bg-background border-border text-xs text-white placeholder:text-muted-foreground"
                    />
                  </div>

                  {/* Category Filter */}
                  <select
                    value={providerCategory}
                    onChange={(e) => setProviderCategory(e.target.value)}
                    className="bg-background border border-border rounded-md px-3 py-2 text-xs text-foreground"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>

                  {/* Status Filter */}
                  <select
                    value={providerStatus}
                    onChange={(e) => setProviderStatus(e.target.value)}
                    className="bg-background border border-border rounded-md px-3 py-2 text-xs text-foreground"
                  >
                    <option value="all">All Statuses ({providers.length})</option>
                    <option value="active">Active Only</option>
                    <option value="pending">Pending Approval</option>
                    <option value="suspended">Suspended</option>
                  </select>

                  {/* Refresh Button */}
                  <Button variant="outline" size="sm" onClick={fetchProviders} className="bg-background border-border text-foreground text-xs gap-1">
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingProviders ? 'animate-spin' : ''}`} /> Refresh Listings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Providers Table / Cards */}
            {loadingProviders ? (
              <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                <RefreshCw className="w-6 h-6 animate-spin text-accent mb-2" />
                <span>Loading providers...</span>
              </div>
            ) : providers.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
                <Building2 className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                <div className="text-base font-semibold text-muted-foreground">No Providers Found</div>
                <p className="text-xs text-muted-foreground mt-1">Try clearing search filters or add a new provider.</p>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-background/80 border-b border-border text-muted-foreground uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3.5 px-4">Business / Provider</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Location</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-center">Verified</th>
                        <th className="py-3.5 px-4 text-center">Featured</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {providers.map((p) => (
                        <tr key={p.id} className="hover:bg-muted/40 transition">
                          {/* Business Name & Contact */}
                          <td className="py-3 px-4">
                            <div className="font-semibold text-white text-sm">{p.name}</div>
                            <div className="text-muted-foreground text-[11px] flex items-center gap-2 mt-0.5">
                              {p.phone && <span className="flex items-center gap-0.5"><Phone className="w-3 h-3 text-muted-foreground" /> {p.phone}</span>}
                              {p.rating && <span className="flex items-center gap-0.5 text-amber-400"><Star className="w-3 h-3 fill-amber-400" /> {p.rating}</span>}
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="bg-accent/10 border-accent/30 text-accent/80 text-[11px]">
                              {p.categoryName || p.categorySlug || 'Service'}
                            </Badge>
                          </td>

                          {/* Location */}
                          <td className="py-3 px-4 text-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              {p.city || 'Lucknow'}, {p.state || 'UP'}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4">
                            <Badge className={`text-[10px] uppercase font-bold ${
                              p.status === 'active'
                                ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                                : p.status === 'pending'
                                ? 'bg-amber-950 text-amber-400 border-amber-800'
                                : 'bg-red-950 text-red-400 border-red-800'
                            }`}>
                              {p.status || 'active'}
                            </Badge>
                          </td>

                          {/* Verified Toggle */}
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleUpdateProviderStatus(p.id, { verified: !p.verified })}
                              title="Click to toggle Verified status"
                              className={`p-1.5 rounded-lg border transition ${
                                p.verified
                                  ? 'bg-accent/20 text-accent border-accent/40 hover:bg-accent/30'
                                  : 'bg-background text-muted-foreground border-border hover:text-muted-foreground'
                              }`}
                            >
                              <ShieldCheck className="w-4 h-4" />
                            </button>
                          </td>

                          {/* Featured Toggle */}
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleUpdateProviderStatus(p.id, { featured: !p.featured })}
                              title="Click to toggle Featured status"
                              className={`p-1.5 rounded-lg border transition ${
                                p.featured
                                  ? 'bg-amber-950/80 text-amber-400 border-amber-700 hover:bg-amber-900'
                                  : 'bg-background text-muted-foreground border-border hover:text-muted-foreground'
                              }`}
                            >
                              <Star className={`w-4 h-4 ${p.featured ? 'fill-amber-400' : ''}`} />
                            </button>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {p.status === 'pending' && (
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateProviderStatus(p.id, { status: 'active', verified: true })}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white h-7 px-2 text-[11px] gap-1"
                                >
                                  <Check className="w-3 h-3" /> Approve
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => p.group === 'Government Services' ? setEditingGovtService(p) : setEditingProvider(p)}
                                className="bg-background border-border text-foreground hover:text-white h-7 px-2 text-[11px]"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteProvider(p.id, p.name)}
                                className="bg-red-950/80 hover:bg-red-900 text-red-300 border-red-800/60 h-7 px-2 text-[11px]"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: CATEGORY MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Layers className="w-6 h-6 text-emerald-400" /> Category Management
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Create, organize, and customize marketplace categories, icons, and service groups.
                </p>
              </div>
              <Button onClick={() => setIsAddCategoryOpen(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 shadow-md shadow-emerald-600/30">
                <Plus className="w-4 h-4" /> Add New Category
              </Button>
            </div>

            {/* Category Search */}
            <div className="max-w-md">
              <Input
                placeholder="Search categories..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="bg-card border-border text-xs text-white placeholder:text-muted-foreground"
              />
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories
                .filter(c => !categorySearch || c.name.toLowerCase().includes(categorySearch.toLowerCase()) || (c.group && c.group.toLowerCase().includes(categorySearch.toLowerCase())))
                .map((cat) => (
                  <Card key={cat.id || cat.slug} className="bg-card border-border hover:border-border transition shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color || 'from-blue-500 to-indigo-600'} grid place-items-center text-white font-bold text-sm shadow-md`}>
                          {cat.name.charAt(0)}
                        </div>
                        <Badge variant="outline" className="bg-background border-border text-muted-foreground text-[10px]">
                          {cat.group || 'Services'}
                        </Badge>
                      </div>

                      <div className="font-bold text-white text-sm">{cat.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">slug: <code className="text-accent">/{cat.slug}</code></div>
                      {cat.description && <div className="text-xs text-muted-foreground mt-2 line-clamp-2">{cat.description}</div>}

                      <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-border/80">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingCategory(cat)}
                          className="bg-background border-border text-foreground hover:text-white h-7 px-2 text-[11px] gap-1"
                        >
                          <Edit className="w-3 h-3" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          className="bg-red-950/80 hover:bg-red-900 text-red-300 border-red-800/60 h-7 px-2 text-[11px]"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: LOCATION MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'locations' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Map className="w-6 h-6 text-primary" /> Location & Coverage Management
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Add, edit, organize Indian States, Districts, Cities, and Localities/Areas for Pan-India marketplace coverage.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsAddLocationOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white text-xs gap-1.5 shadow-lg shadow-purple-600/20 font-bold"
                >
                  <Plus className="w-4 h-4" /> Add New Location / City
                </Button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-card/90 border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 grid place-items-center text-primary">
                    <Map className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {locationStats.totalStates || locationsData.totalStates || 36} States / UTs
                    </div>
                    <div className="text-xs text-muted-foreground">Active Covered States</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/90 border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 grid place-items-center text-accent">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {locationStats.totalCities || locationsData.totalCities || locationsList.length} Cities
                    </div>
                    <div className="text-xs text-muted-foreground">Covered Cities & Towns</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/90 border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 grid place-items-center text-emerald-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-400">
                      {(locationStats.totalAreas || 0).toLocaleString()} Areas
                    </div>
                    <div className="text-xs text-muted-foreground">Registered Localities & Hubs</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/90 border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 grid place-items-center text-amber-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-400">
                      {locationStats.customLocations || locationsList.filter(l => l.isCustom).length} Hubs
                    </div>
                    <div className="text-xs text-muted-foreground">Custom Admin Added</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick State Pills Filter */}
            <div className="bg-card/60 border border-border rounded-xl p-3">
              <div className="text-xs font-semibold text-foreground mb-2 flex items-center justify-between">
                <span>Filter by State:</span>
                <span className="text-[11px] text-muted-foreground">{locationsList.length} locations shown</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => setLocationStateFilter('all')}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                    locationStateFilter === 'all'
                      ? 'bg-primary text-white border-primary font-semibold shadow'
                      : 'bg-background text-muted-foreground border-border hover:text-foreground'
                  }`}
                >
                  All States ({locationStats.totalStates || 36})
                </button>
                {ALL_INDIAN_STATES.map((st, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLocationStateFilter(st)}
                    className={`text-[11px] px-2 py-1 rounded-lg border transition ${
                      locationStateFilter === st
                        ? 'bg-primary text-white border-primary font-semibold shadow'
                        : 'bg-background text-muted-foreground border-border hover:text-foreground'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Search & Filter Toolbar */}
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-6 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search city, district, state, or locality..."
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      className="pl-9 bg-background border-border text-xs text-white placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <select
                      value={locationStateFilter}
                      onChange={(e) => setLocationStateFilter(e.target.value)}
                      className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs text-foreground"
                    >
                      <option value="all">All States</option>
                      {ALL_INDIAN_STATES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <select
                      value={locationStatusFilter}
                      onChange={(e) => setLocationStatusFilter(e.target.value)}
                      className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs text-foreground"
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active Covered</option>
                      <option value="custom">Custom Added Hubs</option>
                      <option value="inactive">Inactive / Hidden</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Locations Cards Grid */}
            {loadingLocations ? (
              <div className="p-12 text-center text-muted-foreground bg-card rounded-xl border border-border flex flex-col items-center justify-center">
                <RefreshCw className="w-6 h-6 animate-spin text-primary mb-2" />
                <span>Loading location dataset...</span>
              </div>
            ) : locationsList.length === 0 ? (
              <div className="p-12 text-center bg-card/70 border border-border rounded-2xl">
                <Map className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white">No Locations Found</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1 mb-4">
                  No cities or locations matched your query. You can add a new city or locality right now.
                </p>
                <Button
                  onClick={() => setIsAddLocationOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-white text-xs font-bold"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> Add Location / City
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {locationsList.map((loc, idx) => (
                  <div
                    key={loc.id || idx}
                    className="bg-card/90 border border-border hover:border-border rounded-2xl p-4 flex flex-col justify-between shadow-xl transition space-y-3"
                  >
                    {/* Header */}
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/30">
                            {loc.state}
                          </span>
                          {loc.district && loc.district !== loc.city && (
                            <span className="text-[10px] text-muted-foreground ml-1.5">
                              • Dist: {loc.district}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {loc.isCustom && (
                            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[9px] py-0">
                              Custom
                            </Badge>
                          )}
                          <Badge className="bg-accent/10 text-accent/80 border-accent/30 text-[10px] py-0">
                            {loc.tier || 'Tier 2'}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          {loc.city}
                        </h3>
                        <Badge className="bg-background text-foreground border-border text-[11px]">
                          {loc.providerCount || 0} Providers
                        </Badge>
                      </div>

                      {loc.pincode && (
                        <div className="text-[11px] text-muted-foreground mt-1">
                          Postal Code: <span className="text-foreground font-mono">{loc.pincode}</span>
                        </div>
                      )}
                    </div>

                    {/* Areas Tag Cloud */}
                    <div className="space-y-2 pt-2 border-t border-border/80">
                      <div className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-primary" />
                          Localities / Areas ({loc.areas?.length || 0}):
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto pr-1">
                        {(loc.areas || []).map((area, aIdx) => (
                          <span
                            key={aIdx}
                            className="inline-flex items-center gap-1 text-[10px] bg-background text-foreground px-2 py-0.5 rounded border border-border group hover:border-red-900"
                          >
                            <span>{area}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteArea(loc.id, area)}
                              className="text-muted-foreground hover:text-red-400 text-xs font-bold leading-none"
                              title={`Remove ${area}`}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Inline Quick Add Area */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleQuickAddArea(loc.id, quickAreaInput[loc.id]);
                        }}
                        className="flex items-center gap-1.5 pt-1"
                      >
                        <Input
                          placeholder="+ Add locality (e.g. Sector 18)..."
                          value={quickAreaInput[loc.id] || ''}
                          onChange={(e) => setQuickAreaInput({ ...quickAreaInput, [loc.id]: e.target.value })}
                          className="h-7 bg-background border-border text-[11px] text-white placeholder:text-muted-foreground px-2"
                        />
                        <Button
                          type="submit"
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 bg-background border-border hover:bg-muted text-primary text-xs shrink-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </form>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-border/80">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingLocation(loc)}
                        className="h-7 px-2 bg-background border-border hover:bg-muted text-accent text-[11px] gap-1"
                      >
                        <Edit className="w-3 h-3" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteLocation(loc.id, loc.city)}
                        className="h-7 px-2 bg-red-950/80 hover:bg-red-900 border border-red-800/60 text-red-300 text-[11px]"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: ANALYTICS & REPORTS */}
        {/* ========================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-amber-400" /> Analytics & Growth Reports
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Real-time insights on marketplace supply, demand, customer registrations, and service activity.
              </p>
            </div>

            {analyticsData && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="text-xs text-muted-foreground">Total User Accounts</div>
                      <div className="text-2xl font-bold text-white mt-1">{analyticsData.overview?.totalUsers}</div>
                      <div className="text-[11px] text-muted-foreground mt-1">
                        {analyticsData.overview?.customers} Customers · {analyticsData.overview?.providerUsers} Providers
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="text-xs text-muted-foreground">Active Listings</div>
                      <div className="text-2xl font-bold text-emerald-400 mt-1">{analyticsData.overview?.activeProviders}</div>
                      <div className="text-[11px] text-muted-foreground mt-1">
                        {analyticsData.overview?.verifiedProviders} Verified Badges
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="text-xs text-muted-foreground">Total Bookings Processed</div>
                      <div className="text-2xl font-bold text-accent mt-1">{analyticsData.overview?.totalBookings}</div>
                      <div className="text-[11px] text-muted-foreground mt-1">
                        {analyticsData.overview?.completedBookings} Completed
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="text-xs text-muted-foreground">Customer Reviews</div>
                      <div className="text-2xl font-bold text-amber-400 mt-1">{analyticsData.overview?.totalReviews}</div>
                      <div className="text-[11px] text-muted-foreground mt-1">4.7 Avg Platform Rating</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Category Breakdown */}
                <Card className="bg-card border-border">
                  <CardHeader className="p-4 border-b border-border">
                    <CardTitle className="text-base text-white">Top Categories by Provider Density</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {(analyticsData.categoryStats || []).map((c, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-foreground">{c.name} ({c.group})</span>
                          <span className="text-accent">{c.providerCount} listings</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-accent to-accent/70 rounded-full"
                            style={{ width: `${Math.min(100, Math.max(8, c.providerCount * 12))}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: USERS & ROLE MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-primary" /> Users & Permissions Management
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Manage user roles (Promote to Admin, State Manager, District Manager), verify accounts, and manage platform staff.
                </p>
              </div>
            </div>

            {/* Filter Bar */}
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                    <Input
                      placeholder="Search users by name, email, phone..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="pl-9 bg-background border-border text-xs text-white placeholder:text-muted-foreground"
                    />
                  </div>
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="bg-background border border-border rounded-md px-3 py-2 text-xs text-foreground"
                  >
                    <option value="all">All Roles</option>
                    <option value="customer">Customer</option>
                    <option value="provider">Provider</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="state_manager">State Manager</option>
                    <option value="district_manager">District Manager</option>
                  </select>
                  <Button variant="outline" size="sm" onClick={fetchUsers} className="bg-background border-border text-foreground text-xs gap-1">
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingUsers ? 'animate-spin' : ''}`} /> Refresh Users
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-background/80 border-b border-border text-muted-foreground uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4">User Name</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">Phone</th>
                      <th className="py-3.5 px-4">Assigned Role</th>
                      <th className="py-3.5 px-4 text-center">Verified</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-muted/40 transition">
                        <td className="py-3 px-4 font-semibold text-white">{u.name}</td>
                        <td className="py-3 px-4 text-foreground">{u.email}</td>
                        <td className="py-3 px-4 text-muted-foreground">{u.phone || '—'}</td>
                        <td className="py-3 px-4">
                          <select
                            value={u.role || 'customer'}
                            onChange={(e) => handleChangeUserRole(u.id, e.target.value)}
                            className="bg-background border border-border rounded px-2 py-1 text-xs text-accent font-semibold"
                          >
                            <option value="customer">Customer</option>
                            <option value="provider">Provider</option>
                            <option value="state_manager">State Manager</option>
                            <option value="district_manager">District Manager</option>
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleToggleUserVerify(u.id, u.verified)}
                            className={`p-1 rounded-md border text-xs ${
                              u.verified
                                ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                                : 'bg-background text-muted-foreground border-border'
                            }`}
                          >
                            {u.verified ? <Check className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={u.id === user.id}
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            className="bg-red-950/80 hover:bg-red-900 text-red-300 border-red-800/60 h-7 px-2 text-[11px]"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: BOOKINGS MODERATION */}
        {/* ========================================================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary" /> Bookings & Appointments Moderation
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Monitor and moderate customer bookings, appointment schedules, and service completions.
              </p>
            </div>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    placeholder="Search bookings by customer, service or phone..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    className="bg-background border-border text-xs text-white placeholder:text-muted-foreground"
                  />
                  <select
                    value={bookingStatusFilter}
                    onChange={(e) => setBookingStatusFilter(e.target.value)}
                    className="bg-background border border-border rounded-md px-3 py-2 text-xs text-foreground"
                  >
                    <option value="all">All Bookings ({bookingsList.length})</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-background/80 border-b border-border text-muted-foreground uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Service</th>
                      <th className="py-3.5 px-4">Date & Slot</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {bookingsList.map((b) => (
                      <tr key={b.id} className="hover:bg-muted/40 transition">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{b.customerName}</div>
                          <div className="text-muted-foreground text-[11px]">{b.customerPhone}</div>
                        </td>
                        <td className="py-3 px-4 text-accent font-medium">{b.serviceName}</td>
                        <td className="py-3 px-4 text-foreground">{b.bookingDate} · {b.timeSlot}</td>
                        <td className="py-3 px-4">
                          <Badge className={`text-[10px] uppercase font-bold ${
                            b.status === 'completed'
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                              : b.status === 'confirmed'
                              ? 'bg-accent/10 text-accent border-accent/30'
                              : b.status === 'cancelled'
                              ? 'bg-red-950 text-red-400 border-red-800'
                              : 'bg-amber-950 text-amber-400 border-amber-800'
                          }`}>
                            {b.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <select
                            value={b.status}
                            onChange={(e) => handleChangeBookingStatus(b.id, e.target.value)}
                            className="bg-background border border-border rounded px-2 py-1 text-xs text-foreground"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 8: CMS & SETTINGS */}
        {/* ========================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-3xl animate-fadeIn">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Settings className="w-6 h-6 text-accent" /> Platform CMS & System Settings
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Configure platform emergency banners, support helpline, customer contact details, and platform controls.
              </p>
            </div>

            {settingsSavedMessage && (
              <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 p-3 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> {settingsSavedMessage}
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-5 bg-card border border-border rounded-2xl p-6 shadow-xl">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Platform Name</label>
                <Input
                  value={settings.platformName}
                  onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                  className="bg-background border-border text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Support Phone / Helpline</label>
                  <Input
                    value={settings.supportPhone}
                    onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                    className="bg-background border-border text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Support Email</label>
                  <Input
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                    className="bg-background border-border text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Emergency & Notification Banner Text</label>
                <Input
                  value={settings.emergencyNotice}
                  onChange={(e) => setSettings({ ...settings, emergencyNotice: e.target.value })}
                  className="bg-background border-border text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" /> Mobile App Download Links
                </label>
                <p className="text-[11px] text-muted-foreground mb-2">Shown on the homepage "Get the Search2Service App" banner.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-muted-foreground mb-1">Google Play Store Link</label>
                    <Input
                      value={settings.playStoreUrl}
                      onChange={(e) => setSettings({ ...settings, playStoreUrl: e.target.value })}
                      placeholder="https://play.google.com/store/apps/details?id=..."
                      className="bg-background border-border text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-muted-foreground mb-1">Apple App Store Link</label>
                    <Input
                      value={settings.appStoreUrl}
                      onChange={(e) => setSettings({ ...settings, appStoreUrl: e.target.value })}
                      placeholder="https://apps.apple.com/app/..."
                      className="bg-background border-border text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="noticeActive"
                  checked={settings.noticeActive}
                  onChange={(e) => setSettings({ ...settings, noticeActive: e.target.checked })}
                  className="w-4 h-4 rounded bg-background border-border text-accent focus:ring-0"
                />
                <label htmlFor="noticeActive" className="text-xs text-foreground cursor-pointer">
                  Display Emergency Notice Banner on Homepage
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="w-4 h-4 rounded bg-background border-border text-red-600 focus:ring-0"
                />
                <label htmlFor="maintenanceMode" className="text-xs text-red-300 cursor-pointer">
                  Enable Platform Maintenance Mode
                </label>
              </div>

              <div className="pt-4 border-t border-border">
                <Button type="submit" disabled={savingSettings} className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs gap-1.5">
                  <Save className="w-3.5 h-3.5" /> {savingSettings ? 'Saving...' : 'Save System Settings'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: PAYMENT GATEWAY & BILLING */}
        {/* ========================================================= */}
        {activeTab === 'payment-gateway' && (
          <div className="space-y-6 max-w-3xl animate-fadeIn">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-primary" /> Payment Gateway & Billing
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Connect Razorpay to power real checkout for the Premium provider plan, and track billing transactions.
              </p>
            </div>

            <form onSubmit={handleSaveGateway} className="space-y-5 bg-card border border-border rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white flex items-center gap-2"><KeyRound className="w-4 h-4 text-primary" /> Razorpay Configuration</h3>
                <Badge className={gateway.enabled ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800' : 'bg-muted text-muted-foreground border-border'} variant="outline">
                  {gateway.enabled ? 'Live' : 'Disabled'}
                </Badge>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Razorpay Key ID</label>
                <Input
                  value={gateway.keyId}
                  onChange={(e) => setGateway({ ...gateway, keyId: e.target.value })}
                  placeholder="rzp_live_xxxxxxxxxxxxx"
                  className="bg-background border-border text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Razorpay Key Secret</label>
                <Input
                  type="password"
                  value={gateway.keySecret}
                  onChange={(e) => setGateway({ ...gateway, keySecret: e.target.value })}
                  placeholder={gateway.hasSecret ? '•••••••• (leave blank to keep existing)' : 'Enter key secret'}
                  className="bg-background border-border text-xs text-white font-mono"
                />
                <p className="text-[11px] text-muted-foreground mt-1">Stored server-side only, never shown back in full.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Premium Plan Price (₹ / month)</label>
                <Input
                  type="number"
                  value={gateway.premiumAmount}
                  onChange={(e) => setGateway({ ...gateway, premiumAmount: parseInt(e.target.value) || 0 })}
                  className="bg-background border-border text-xs text-white max-w-[160px]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="gatewayEnabled"
                  checked={gateway.enabled}
                  onChange={(e) => setGateway({ ...gateway, enabled: e.target.checked })}
                  className="w-4 h-4 rounded bg-background border-border text-primary focus:ring-0"
                />
                <label htmlFor="gatewayEnabled" className="text-xs text-foreground cursor-pointer">
                  Enable live checkout — when off, providers get Premium instantly in demo mode (no charge)
                </label>
              </div>

              <div className="pt-4 border-t border-border">
                <Button type="submit" disabled={savingGateway} className="bg-primary hover:bg-primary/90 text-white text-xs gap-1.5">
                  <Save className="w-3.5 h-3.5" /> {savingGateway ? 'Saving...' : 'Save Gateway Settings'}
                </Button>
              </div>
            </form>

            {/* Billing Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 grid place-items-center text-white mb-2"><IndianRupee className="w-4 h-4" /></div>
                  <div className="text-xl font-bold text-white">₹{(billingStats.totalRevenue || 0).toLocaleString('en-IN')}</div>
                  <div className="text-xs text-muted-foreground">Total Revenue</div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/80 grid place-items-center text-white mb-2"><Wallet className="w-4 h-4" /></div>
                  <div className="text-xl font-bold text-white">{billingStats.paidTransactions || 0}</div>
                  <div className="text-xs text-muted-foreground">Paid Transactions</div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-red-600 grid place-items-center text-white mb-2"><Crown className="w-4 h-4" /></div>
                  <div className="text-xl font-bold text-white">{billingStats.activePremiumProviders || 0}</div>
                  <div className="text-xs text-muted-foreground">Active Premium Providers</div>
                </CardContent>
              </Card>
            </div>

            {/* Transactions List */}
            <Card className="bg-card border-border">
              <CardContent className="p-5">
                <h3 className="font-bold text-white mb-3 flex items-center gap-2"><CreditCard className="w-4 h-4 text-primary" /> Recent Checkout Transactions</h3>
                {loadingBilling ? (
                  <div className="text-xs text-muted-foreground py-6 text-center">Loading transactions...</div>
                ) : billingList.length === 0 ? (
                  <div className="text-xs text-muted-foreground py-6 text-center">No billing transactions yet.</div>
                ) : (
                  <div className="space-y-2">
                    {billingList.map(t => (
                      <div key={t.id} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-background border border-border">
                        <div>
                          <div className="text-sm font-semibold text-white">{t.ownerName || 'Provider'}</div>
                          <div className="text-[11px] text-muted-foreground">{t.razorpayOrderId} {t.createdAt ? `• ${new Date(t.createdAt).toLocaleString('en-IN')}` : ''}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-white">₹{t.amount}</span>
                          <Badge
                            variant="outline"
                            className={
                              t.status === 'paid' ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800' :
                              t.status === 'failed' ? 'bg-red-950/60 text-red-300 border-red-800' :
                              'bg-amber-950/60 text-amber-300 border-amber-800'
                            }
                          >
                            {t.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: ADS & BANNERS MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'ads' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Megaphone className="w-6 h-6 text-amber-400" /> Advertisements & Marketing Banners (Ads Manager)
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Create, schedule, target placements, and monitor impressions & clicks for sponsored promotions across Search2Service.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsAddAdOpen(true)}
                  className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:opacity-95 text-white text-xs gap-1.5 shadow-lg shadow-orange-500/20 font-bold"
                >
                  <Plus className="w-4 h-4" /> Create New Ad Campaign
                </Button>
              </div>
            </div>

            {/* Campaign Performance KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-card/90 border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 grid place-items-center text-accent">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{adsStats.totalAds || adsList.length}</div>
                    <div className="text-xs text-muted-foreground">Total Ad Campaigns</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/90 border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 grid place-items-center text-emerald-400">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-400">{adsStats.activeAds || adsList.filter(a => a.status === 'active').length}</div>
                    <div className="text-xs text-muted-foreground">Live Running Ads</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/90 border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 grid place-items-center text-primary">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{(adsStats.totalImpressions || 0).toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Total Ad Views (Impressions)</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/90 border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 grid place-items-center text-amber-400">
                    <MousePointerClick className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-400">
                      {(adsStats.totalClicks || 0).toLocaleString()} <span className="text-xs font-normal text-muted-foreground">({adsStats.averageCTR || 0}% CTR)</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Total Clicks & Conversion</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preset Inspiration Pills */}
            <div className="bg-card/60 border border-border rounded-xl p-4">
              <div className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Quick-Start Ad Campaign Presets (Click to create a ready-made sponsored banner):
              </div>
              <div className="flex flex-wrap gap-2">
                {AD_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setNewAd({
                        title: preset.title,
                        subtitle: preset.subtitle,
                        imageUrl: preset.imageUrl,
                        targetUrl: preset.targetUrl,
                        placement: preset.placement,
                        badge: preset.badge,
                        ctaText: preset.ctaText,
                        advertiserName: preset.advertiserName,
                        advertiserPhone: preset.advertiserPhone,
                        gradient: preset.gradient,
                        startDate: new Date().toISOString().split('T')[0],
                        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        status: 'active',
                        priority: adsList.length + 1
                      });
                      setIsAddAdOpen(true);
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-muted/90 hover:bg-border border border-border/80 text-foreground hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span>{preset.label}</span>
                    <Plus className="w-3 h-3 text-amber-400 group-hover:scale-125 transition" />
                  </button>
                ))}
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-6 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search campaigns by title, advertiser, phone or URL..."
                      value={adSearch}
                      onChange={(e) => setAdSearch(e.target.value)}
                      className="pl-9 bg-background border-border text-xs text-white placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <select
                      value={adPlacementFilter}
                      onChange={(e) => setAdPlacementFilter(e.target.value)}
                      className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs text-foreground"
                    >
                      <option value="all">All Placements (Pan-Site)</option>
                      {PLACEMENT_OPTIONS.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <select
                      value={adStatusFilter}
                      onChange={(e) => setAdStatusFilter(e.target.value)}
                      className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs text-foreground"
                    >
                      <option value="all">All Statuses ({adsList.length})</option>
                      <option value="active">Active (Running)</option>
                      <option value="inactive">Inactive / Paused</option>
                      <option value="expired">Expired</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ads List Grid */}
            {loadingAds ? (
              <div className="p-12 text-center text-muted-foreground bg-card rounded-xl border border-border flex flex-col items-center justify-center">
                <RefreshCw className="w-6 h-6 animate-spin text-amber-500 mb-2" />
                <span>Loading advertising campaigns...</span>
              </div>
            ) : adsList.length === 0 ? (
              <div className="p-12 text-center bg-card/70 border border-border rounded-2xl">
                <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white">No Advertisements Found</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1 mb-4">
                  Create your first marketing banner or sponsored promotion to monetize and highlight key partner services.
                </p>
                <Button
                  onClick={() => setIsAddAdOpen(true)}
                  className="bg-gradient-to-r from-amber-500 to-rose-600 hover:opacity-90 text-white text-xs font-bold"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> Create First Ad Campaign
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {adsList.map((ad, idx) => {
                  const placementObj = PLACEMENT_OPTIONS.find(p => p.value === ad.placement) || PLACEMENT_OPTIONS[0];
                  const isLive = ad.status === 'active';
                  const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : '0.0';

                  return (
                    <div
                      key={ad.id || idx}
                      className={`rounded-2xl border overflow-hidden transition-all bg-card/90 shadow-xl flex flex-col ${
                        isLive ? 'border-border hover:border-amber-500/50' : 'border-border/60 opacity-75'
                      }`}
                    >
                      {/* Banner Mockup Header */}
                      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-background flex flex-col justify-end p-4 sm:p-5">
                        {ad.imageUrl ? (
                          <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
                            style={{ backgroundImage: `url(${ad.imageUrl})` }}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-card grid place-items-center text-muted-foreground">
                            <ImageIcon className="w-12 h-12" />
                          </div>
                        )}
                        
                        <div className={`absolute inset-0 bg-gradient-to-br ${ad.gradient || 'from-blue-950/40 via-blue-900/40 to-orange-800/40'}`} />

                        {/* Top Badges & Position Controls */}
                        <div className="relative z-10 flex items-center justify-between gap-2 mb-auto flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-md border border-white/10">
                              Priority #{ad.priority || idx + 1}
                            </span>
                            {isLive ? (
                              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] py-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" /> Active
                              </Badge>
                            ) : (
                              <Badge className="bg-muted text-muted-foreground border-border text-[10px] py-0 capitalize">
                                {ad.status || 'Inactive'}
                              </Badge>
                            )}
                            <span className={`text-[10px] px-2 py-0.5 rounded font-medium border ${placementObj.badgeColor}`}>
                              {placementObj.label.split(' ')[0]} {ad.placement}
                            </span>
                          </div>

                          {/* Order Priority Buttons */}
                          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md p-1 rounded-lg border border-white/10">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveAdPriority(idx, 'up')}
                              className="p-1 rounded hover:bg-white/20 text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
                              title="Move Priority Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === adsList.length - 1}
                              onClick={() => handleMoveAdPriority(idx, 'down')}
                              className="p-1 rounded hover:bg-white/20 text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
                              title="Move Priority Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Banner Content Mockup */}
                        <div className="relative z-10 text-white space-y-1">
                          {ad.badge && (
                            <div className="inline-block bg-white/15 backdrop-blur-md border border-white/25 text-white text-[11px] px-2.5 py-0.5 rounded-full font-medium mb-0.5">
                              {ad.badge}
                            </div>
                          )}
                          <h4 className="text-base sm:text-lg font-bold leading-tight line-clamp-1">
                            {ad.title}
                          </h4>
                          {ad.subtitle && (
                            <p className="text-xs text-white/85 line-clamp-1 max-w-md">
                              {ad.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Performance Stats & Advertiser Info Bar */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-card border-t border-border">
                        {/* Live Metrics Row */}
                        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-background/80 border border-border/80 text-center">
                          <div>
                            <div className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                              <Eye className="w-3 h-3 text-primary" /> Impressions
                            </div>
                            <div className="text-sm font-bold text-white">{(ad.impressions || 0).toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                              <MousePointerClick className="w-3 h-3 text-amber-400" /> Clicks
                            </div>
                            <div className="text-sm font-bold text-amber-400">{(ad.clicks || 0).toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                              <TrendingUp className="w-3 h-3 text-emerald-400" /> CTR %
                            </div>
                            <div className="text-sm font-bold text-emerald-400">{ctr}%</div>
                          </div>
                        </div>

                        {/* Advertiser & Target Info */}
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-foreground">
                              <Building2 className="w-3.5 h-3.5 text-accent" />
                              <strong className="text-white">{ad.advertiserName || 'Search2Service Platform'}</strong>
                            </span>
                            {ad.advertiserPhone && (
                              <span className="flex items-center gap-1 text-foreground font-mono text-[11px]">
                                <Phone className="w-3 h-3 text-emerald-400" /> {ad.advertiserPhone}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-[11px] pt-1">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <CalendarDays className="w-3 h-3 text-muted-foreground" />
                              {ad.startDate || 'Immediate'} → {ad.endDate || 'No Expiry'}
                            </span>
                            <Link
                              href={ad.targetUrl || '/'}
                              target="_blank"
                              className="text-accent hover:text-accent/80 flex items-center gap-1 truncate max-w-[200px]"
                            >
                              <ExternalLink className="w-3 h-3 shrink-0" />
                              <span className="truncate">{ad.targetUrl || '/'}</span>
                            </Link>
                          </div>
                        </div>

                        {/* Action Buttons Toolbar */}
                        <div className="pt-2 border-t border-border/80 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleAdStatus(ad.id, ad.status)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                              isLive
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900'
                                : 'bg-muted text-muted-foreground border border-border hover:bg-border'
                            }`}
                          >
                            {isLive ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-muted-foreground" />}
                            <span>{isLive ? 'Active (Live)' : 'Paused'}</span>
                          </button>

                          <div className="flex items-center gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                navigator.clipboard.writeText(window.location.origin + (ad.targetUrl || '/'));
                                setCopiedAdId(ad.id);
                                setTimeout(() => setCopiedAdId(null), 2000);
                              }}
                              className="h-8 px-2.5 bg-background border-border hover:bg-muted text-foreground text-xs"
                              title="Copy Destination Link"
                            >
                              {copiedAdId === ad.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingAd(ad)}
                              className="h-8 px-2.5 bg-background border-border hover:bg-muted text-accent text-xs gap-1"
                            >
                              <Edit className="w-3.5 h-3.5" /> Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteAd(ad.id, ad.title)}
                              className="h-8 px-2 bg-red-950/80 hover:bg-red-900 border border-red-800/60 text-red-300 text-xs"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: HERO SLIDER MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'hero-slider' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-amber-400" /> Hero Section Slider CMS
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Create, reorder, customize, and preview dynamic hero banner slides displayed on the public homepage.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsAddSlideOpen(true)}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs gap-1.5 shadow-lg shadow-accent/20"
                >
                  <Plus className="w-4 h-4" /> Add New Hero Slide
                </Button>
              </div>
            </div>

            {/* Quick Status Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-card/90 border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 grid place-items-center text-accent">
                    <LayoutTemplate className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{heroSlides.length}</div>
                    <div className="text-xs text-muted-foreground">Total Hero Slides</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/90 border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 grid place-items-center text-emerald-400">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-400">{heroSlides.filter(s => s.isActive).length}</div>
                    <div className="text-xs text-muted-foreground">Active (Live on Homepage)</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/90 border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted/80 border border-border grid place-items-center text-muted-foreground">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-muted-foreground">{heroSlides.filter(s => !s.isActive).length}</div>
                    <div className="text-xs text-muted-foreground">Drafts / Inactive</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preset Inspiration Pills */}
            <div className="bg-card/60 border border-border rounded-xl p-4">
              <div className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> Quick-Start Slide Presets (Click to create a curated banner):
              </div>
              <div className="flex flex-wrap gap-2">
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setNewSlide({
                        title: preset.label.replace(/^[^\w]+/, '').trim(),
                        highlightText: 'near you in seconds.',
                        badge: preset.badge,
                        subtitle: 'Top-rated, verified experts ready to serve across India.',
                        imageUrl: preset.url,
                        overlayGradient: preset.gradient,
                        ctaText: 'Explore Now',
                        ctaLink: '/categories',
                        order: heroSlides.length + 1,
                        isActive: true
                      });
                      setIsAddSlideOpen(true);
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-muted/90 hover:bg-border border border-border/80 text-foreground hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span>{preset.label}</span>
                    <Plus className="w-3 h-3 text-accent group-hover:scale-125 transition" />
                  </button>
                ))}
              </div>
            </div>

            {/* Slides List / Grid */}
            {loadingSlides ? (
              <div className="p-12 text-center text-muted-foreground bg-card rounded-xl border border-border flex flex-col items-center justify-center">
                <RefreshCw className="w-6 h-6 animate-spin text-accent mb-2" />
                <span>Loading hero slides...</span>
              </div>
            ) : heroSlides.length === 0 ? (
              <div className="p-12 text-center bg-card/70 border border-border rounded-2xl">
                <LayoutTemplate className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white">No Hero Slides Configured</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1 mb-4">
                  Add your first hero banner slide to showcase key marketplace categories, featured services, and promotions on the homepage.
                </p>
                <Button onClick={() => setIsAddSlideOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs">
                  <Plus className="w-4 h-4 mr-1.5" /> Create First Slide
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {heroSlides.map((slide, idx) => (
                  <div
                    key={slide.id || idx}
                    className={`rounded-2xl border overflow-hidden transition-all bg-card/90 shadow-xl flex flex-col ${
                      slide.isActive ? 'border-border hover:border-accent/50' : 'border-border/60 opacity-75'
                    }`}
                  >
                    {/* Visual Slide Mockup Header */}
                    <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-background flex flex-col justify-end p-4 sm:p-5">
                      {/* Background Image */}
                      {slide.imageUrl ? (
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
                          style={{ backgroundImage: `url(${slide.imageUrl})` }}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-card grid place-items-center text-muted-foreground">
                          <ImageIcon className="w-12 h-12" />
                        </div>
                      )}
                      
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${slide.overlayGradient || 'from-blue-950/40 via-blue-900/40 to-orange-800/40'}`} />

                      {/* Top Badges & Position */}
                      <div className="relative z-10 flex items-center justify-between gap-2 mb-auto">
                        <div className="flex items-center gap-2">
                          <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-white/10">
                            Slide #{idx + 1}
                          </span>
                          {slide.isActive ? (
                            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] py-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" /> Live
                            </Badge>
                          ) : (
                            <Badge className="bg-muted text-muted-foreground border-border text-[10px] py-0">
                              Inactive
                            </Badge>
                          )}
                        </div>

                        {/* Order controls */}
                        <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md p-1 rounded-lg border border-white/10">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveSlideOrder(idx, 'up')}
                            className="p-1 rounded hover:bg-white/20 text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === heroSlides.length - 1}
                            onClick={() => handleMoveSlideOrder(idx, 'down')}
                            className="p-1 rounded hover:bg-white/20 text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Slide Content Preview */}
                      <div className="relative z-10 text-white space-y-1">
                        {slide.badge && (
                          <div className="inline-block bg-white/15 backdrop-blur-md border border-white/25 text-white text-[11px] px-2.5 py-0.5 rounded-full font-medium mb-1">
                            {slide.badge}
                          </div>
                        )}
                        <h4 className="text-lg font-bold leading-tight line-clamp-2">
                          {slide.title}{' '}
                          {slide.highlightText && (
                            <span className="bg-gradient-to-r from-orange-300 via-amber-200 to-yellow-200 bg-clip-text text-transparent">
                              {slide.highlightText}
                            </span>
                          )}
                        </h4>
                        {slide.subtitle && (
                          <p className="text-xs text-white/85 line-clamp-1 max-w-md">
                            {slide.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Meta & Footer Bar */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-card">
                      <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2">
                        {slide.ctaText ? (
                          <div className="flex items-center gap-1.5 text-accent font-medium">
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>CTA: <strong>{slide.ctaText}</strong> ({slide.ctaLink || '/'})</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic">No custom CTA button</span>
                        )}
                        <span className="text-[11px] text-muted-foreground">Order: {slide.order || idx + 1}</span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-border/80">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleSlideActive(slide.id, slide.isActive)}
                          className={`text-xs h-8 px-2.5 ${
                            slide.isActive
                              ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                          }`}
                        >
                          {slide.isActive ? (
                            <>
                              <ToggleRight className="w-4 h-4 mr-1.5 text-emerald-400" /> Active (Live)
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-4 h-4 mr-1.5 text-muted-foreground" /> Inactive
                            </>
                          )}
                        </Button>

                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingSlide(slide)}
                            className="bg-background border-border text-foreground hover:text-white text-xs h-8 px-3"
                          >
                            <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteSlide(slide.id, slide.title)}
                            className="bg-red-950/60 hover:bg-red-900 border border-red-800/50 text-red-300 text-xs h-8 px-2.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL: ADD NEW PROVIDER */}
      {/* ========================================================= */}
      <Dialog open={isAddProviderOpen} onOpenChange={setIsAddProviderOpen}>
        <DialogContent className="dark bg-card border-border text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Add New Service Provider</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Create and list a new verified business profile directly in Search2Service.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateProvider} className="space-y-3.5 my-2">
            <div>
              <label className="block text-xs text-foreground mb-1">Business / Doctor / Provider Name *</label>
              <Input
                required
                value={newProvider.name}
                onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })}
                placeholder="e.g., Dr. Sharma Dental Clinic"
                className="bg-background border-border text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-foreground mb-1">Category *</label>
                <select
                  value={newProvider.categorySlug}
                  onChange={(e) => setNewProvider({ ...newProvider, categorySlug: e.target.value })}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs text-foreground"
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-foreground mb-1">City *</label>
                <Input
                  required
                  value={newProvider.city}
                  onChange={(e) => setNewProvider({ ...newProvider, city: e.target.value })}
                  placeholder="Lucknow"
                  className="bg-background border-border text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-foreground mb-1">Phone Number *</label>
                <Input
                  required
                  value={newProvider.phone}
                  onChange={(e) => setNewProvider({ ...newProvider, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="bg-background border-border text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-foreground mb-1">Pricing Starts At</label>
                <Input
                  value={newProvider.priceFrom}
                  onChange={(e) => setNewProvider({ ...newProvider, priceFrom: e.target.value })}
                  placeholder="₹199"
                  className="bg-background border-border text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-foreground mb-1">Description</label>
              <Input
                value={newProvider.description}
                onChange={(e) => setNewProvider({ ...newProvider, description: e.target.value })}
                placeholder="Professional services with 10+ years experience"
                className="bg-background border-border text-xs text-white"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsAddProviderOpen(false)} className="bg-background border-border text-foreground text-xs">
                Cancel
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs">
                Create Provider
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL: ADD GOVERNMENT SERVICE */}
      {/* ========================================================= */}
      <Dialog open={isAddGovtServiceOpen} onOpenChange={(open) => { setIsAddGovtServiceOpen(open); if (!open) setIsCustomGovtType(false); }}>
        <DialogContent className="dark bg-card border-border text-white max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Landmark className="w-5 h-5 text-primary" /> Add Government Service
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              List a Government Services listing — CSC Center, PAN Card, Aadhaar, Passport, Certificates & more.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateGovtService} className="space-y-3.5 my-2">
            <div>
              <label className="block text-xs text-foreground mb-1">Service / Center Name *</label>
              <Input
                required
                value={newGovtService.name}
                onChange={(e) => setNewGovtService({ ...newGovtService, name: e.target.value })}
                placeholder="e.g., Jan Seva CSC Center"
                className="bg-background border-border text-xs text-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs text-foreground">Service Type *</label>
                <button
                  type="button"
                  onClick={() => setIsCustomGovtType(!isCustomGovtType)}
                  className="text-[11px] text-primary hover:text-primary/80"
                >
                  {isCustomGovtType ? '← Choose from existing list' : '+ Add custom service type'}
                </button>
              </div>
              {!isCustomGovtType ? (
                <select
                  value={newGovtService.categorySlug}
                  onChange={(e) => setNewGovtService({ ...newGovtService, categorySlug: e.target.value })}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs text-foreground"
                >
                  {categories.filter(c => c.group === 'Government Services').map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              ) : (
                <Input
                  value={newGovtService.customCategoryName}
                  onChange={(e) => setNewGovtService({ ...newGovtService, customCategoryName: e.target.value })}
                  placeholder="e.g., Ration Card Services"
                  className="bg-background border-border text-xs text-white"
                />
              )}
            </div>

            <div>
              <label className="block text-xs text-foreground mb-1">Website Link</label>
              <Input
                type="url"
                value={newGovtService.website}
                onChange={(e) => setNewGovtService({ ...newGovtService, website: e.target.value })}
                placeholder="https://csc.gov.in"
                className="bg-background border-border text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-foreground mb-1">Logo Upload</label>
              {newGovtService.banner && (
                <div className="mb-2 h-24 rounded-lg bg-cover bg-center border border-border" style={{ backgroundImage: `url(${newGovtService.banner})` }} />
              )}
              <FileUploader
                context="govt-service"
                ownerId={user.id}
                buttonLabel="Click or drag image to upload"
                accept="image/jpeg,image/png,image/webp"
                onUploaded={(media) => {
                  if (media && media.url) {
                    setNewGovtService(prev => ({ ...prev, banner: media.url }));
                  }
                }}
              />
            </div>

            <DialogFooter className="pt-3 border-t border-border">
              <Button type="button" variant="outline" onClick={() => { setIsAddGovtServiceOpen(false); setIsCustomGovtType(false); }} className="bg-background border-border text-foreground text-xs">
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white text-xs">
                List Government Service
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL: EDIT GOVERNMENT SERVICE */}
      {/* ========================================================= */}
      <Dialog open={!!editingGovtService} onOpenChange={(open) => !open && setEditingGovtService(null)}>
        <DialogContent className="dark bg-card border-border text-white max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Landmark className="w-5 h-5 text-primary" /> Edit Government Service
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update the service name, type, website link, or logo.
            </DialogDescription>
          </DialogHeader>

          {editingGovtService && (
            <form onSubmit={handleSaveEditGovtService} className="space-y-3.5 my-2">
              <div>
                <label className="block text-xs text-foreground mb-1">Service / Center Name *</label>
                <Input
                  required
                  value={editingGovtService.name || ''}
                  onChange={(e) => setEditingGovtService({ ...editingGovtService, name: e.target.value })}
                  className="bg-background border-border text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-foreground mb-1">Service Type *</label>
                <select
                  value={editingGovtService.categorySlug || ''}
                  onChange={(e) => setEditingGovtService({ ...editingGovtService, categorySlug: e.target.value })}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs text-foreground"
                >
                  {categories.filter(c => c.group === 'Government Services').map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-foreground mb-1">Website Link</label>
                <Input
                  type="url"
                  value={editingGovtService.website || ''}
                  onChange={(e) => setEditingGovtService({ ...editingGovtService, website: e.target.value })}
                  placeholder="https://csc.gov.in"
                  className="bg-background border-border text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-foreground mb-1">Logo Upload</label>
                {editingGovtService.banner && (
                  <div className="mb-2 h-24 rounded-lg bg-cover bg-center border border-border" style={{ backgroundImage: `url(${editingGovtService.banner})` }} />
                )}
                <FileUploader
                  context="govt-service"
                  ownerId={user.id}
                  providerId={editingGovtService.id}
                  buttonLabel="Click or drag image to upload"
                  accept="image/jpeg,image/png,image/webp"
                  onUploaded={(media) => {
                    if (media && media.url) {
                      setEditingGovtService(prev => ({ ...prev, banner: media.url }));
                    }
                  }}
                />
              </div>

              <DialogFooter className="pt-3 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setEditingGovtService(null)} className="bg-background border-border text-foreground text-xs">
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white text-xs">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL: EDIT PROVIDER */}
      {/* ========================================================= */}
      <Dialog open={!!editingProvider} onOpenChange={(open) => !open && setEditingProvider(null)}>
        <DialogContent className="dark bg-card border-border text-white max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Edit Provider Profile</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update listing details, contacts, and verification badges.
            </DialogDescription>
          </DialogHeader>

          {editingProvider && (
            <form onSubmit={handleSaveEditProvider} className="space-y-3.5 my-2">
              {editingProvider.group === 'Government Services' && (
                <Badge className="bg-primary/10 text-primary border-primary/30 gap-1.5">
                  <Landmark className="w-3 h-3" /> Government Service Listing
                </Badge>
              )}

              <div>
                <label className="block text-xs text-foreground mb-1">Business / Service Name</label>
                <Input
                  value={editingProvider.name || ''}
                  onChange={(e) => setEditingProvider({ ...editingProvider, name: e.target.value })}
                  className="bg-background border-border text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-foreground mb-1">Category</label>
                <select
                  value={editingProvider.categorySlug || ''}
                  onChange={(e) => {
                    const cat = categories.find(c => c.slug === e.target.value);
                    setEditingProvider({
                      ...editingProvider,
                      categorySlug: e.target.value,
                      categoryName: cat?.name || editingProvider.categoryName,
                      group: cat?.group || editingProvider.group,
                    });
                  }}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs text-foreground"
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.group} — {c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-foreground mb-1">Phone</label>
                  <Input
                    value={editingProvider.phone || ''}
                    onChange={(e) => setEditingProvider({ ...editingProvider, phone: e.target.value })}
                    className="bg-background border-border text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-foreground mb-1">City</label>
                  <Input
                    value={editingProvider.city || ''}
                    onChange={(e) => setEditingProvider({ ...editingProvider, city: e.target.value })}
                    className="bg-background border-border text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-foreground mb-1">State</label>
                  <select
                    value={editingProvider.state || ''}
                    onChange={(e) => setEditingProvider({ ...editingProvider, state: e.target.value })}
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs text-foreground"
                  >
                    <option value="">Select state</option>
                    {ALL_INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-foreground mb-1">Fee / Price Starts At</label>
                  <Input
                    value={editingProvider.priceFrom || ''}
                    onChange={(e) => setEditingProvider({ ...editingProvider, priceFrom: e.target.value })}
                    placeholder="₹50"
                    className="bg-background border-border text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-foreground mb-1">Address</label>
                <Input
                  value={editingProvider.address || ''}
                  onChange={(e) => setEditingProvider({ ...editingProvider, address: e.target.value })}
                  placeholder="Shop no., street, landmark"
                  className="bg-background border-border text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-foreground mb-1">Description</label>
                <Input
                  value={editingProvider.description || ''}
                  onChange={(e) => setEditingProvider({ ...editingProvider, description: e.target.value })}
                  className="bg-background border-border text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-foreground mb-1">Photo / Logo</label>
                {editingProvider.banner && (
                  <div className="mb-2 h-24 rounded-lg bg-cover bg-center border border-border" style={{ backgroundImage: `url(${editingProvider.banner})` }} />
                )}
                <FileUploader
                  context="provider-banner"
                  ownerId={user.id}
                  providerId={editingProvider.id}
                  buttonLabel="Click or drag image to upload"
                  accept="image/jpeg,image/png,image/webp"
                  onUploaded={(media) => {
                    if (media && media.url) {
                      setEditingProvider(prev => ({ ...prev, banner: media.url }));
                    }
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-foreground mb-1">Status</label>
                  <select
                    value={editingProvider.status || 'active'}
                    onChange={(e) => setEditingProvider({ ...editingProvider, status: e.target.value })}
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs text-foreground"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending Approval</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-foreground mb-1">Verified</label>
                  <button
                    type="button"
                    onClick={() => setEditingProvider({ ...editingProvider, verified: !editingProvider.verified })}
                    className={`w-full flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs border ${editingProvider.verified ? 'bg-emerald-950/50 border-emerald-800 text-emerald-300' : 'bg-background border-border text-muted-foreground'}`}
                  >
                    {editingProvider.verified ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    {editingProvider.verified ? 'Verified' : 'Not Verified'}
                  </button>
                </div>
              </div>

              <DialogFooter className="pt-3 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setEditingProvider(null)} className="bg-background border-border text-foreground text-xs">
                  Cancel
                </Button>
                <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL: ADD NEW CATEGORY */}
      {/* ========================================================= */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="dark bg-card border-border text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Add New Service Category</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateCategory} className="space-y-3.5 my-2">
            <div>
              <label className="block text-xs text-foreground mb-1">Category Name *</label>
              <Input
                required
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="e.g. Physiotherapy"
                className="bg-background border-border text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-foreground mb-1">Service Group *</label>
              <select
                value={newCategory.group}
                onChange={(e) => setNewCategory({ ...newCategory, group: e.target.value })}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs text-foreground"
              >
                <option value="Healthcare">Healthcare</option>
                <option value="Home Services">Home Services</option>
                <option value="Beauty & Wellness">Beauty & Wellness</option>
                <option value="Repair Services">Repair Services</option>
                <option value="Events & Photography">Events & Photography</option>
                <option value="Food & Hospitality">Food & Hospitality</option>
                <option value="Education">Education</option>
                <option value="Printing & Tailor">Printing & Tailor</option>
                <option value="Job & Career">Job & Career</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Travel & Transport">Travel & Transport</option>
                <option value="Government Services">Government Services</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-foreground mb-1">Description</label>
              <Input
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder="Find top clinics and services"
                className="bg-background border-border text-xs text-white"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsAddCategoryOpen(false)} className="bg-background border-border text-foreground text-xs">
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs">
                Create Category
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL: EDIT CATEGORY */}
      {/* ========================================================= */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent className="dark bg-card border-border text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Edit Category</DialogTitle>
          </DialogHeader>

          {editingCategory && (
            <form onSubmit={handleSaveEditCategory} className="space-y-3.5 my-2">
              <div>
                <label className="block text-xs text-foreground mb-1">Category Name</label>
                <Input
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="bg-background border-border text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-foreground mb-1">Service Group</label>
                <Input
                  value={editingCategory.group || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, group: e.target.value })}
                  className="bg-background border-border text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-foreground mb-1">Description</label>
                <Input
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="bg-background border-border text-xs text-white"
                />
              </div>

              <DialogFooter className="pt-3 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setEditingCategory(null)} className="bg-background border-border text-foreground text-xs">
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL: ADD NEW HERO SLIDE */}
      {/* ========================================================= */}
      <Dialog open={isAddSlideOpen} onOpenChange={setIsAddSlideOpen}>
        <DialogContent className="dark bg-card border-border text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" /> Add New Hero Banner Slide
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Configure background image, title, highlight gradient, badge, and CTA for the homepage slider.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSlide} className="space-y-4 my-2">
            {/* Live Interactive Preview Box */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Live Banner Preview</label>
              <div className="relative h-44 w-full rounded-xl overflow-hidden border border-border bg-background flex flex-col justify-end p-4 shadow-inner">
                {newSlide.imageUrl && (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${newSlide.imageUrl})` }}
                  />
                )}
                <div className={`absolute inset-0 bg-gradient-to-br ${newSlide.overlayGradient || 'from-blue-950/40 via-blue-900/40 to-orange-800/40'}`} />
                <div className="relative z-10 text-white space-y-1">
                  {newSlide.badge && (
                    <span className="inline-block bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                      {newSlide.badge}
                    </span>
                  )}
                  <div className="text-base font-bold leading-tight">
                    {newSlide.title || 'Find trusted services'}{' '}
                    <span className="bg-gradient-to-r from-orange-300 via-amber-200 to-yellow-200 bg-clip-text text-transparent">
                      {newSlide.highlightText || 'near you in seconds.'}
                    </span>
                  </div>
                  {newSlide.subtitle && (
                    <p className="text-[11px] text-white/85 line-clamp-1">{newSlide.subtitle}</p>
                  )}
                  {newSlide.ctaText && (
                    <div className="pt-1">
                      <span className="inline-flex items-center text-[10px] bg-accent text-accent-foreground px-2.5 py-1 rounded-md font-semibold">
                        {newSlide.ctaText} <ChevronRight className="w-3 h-3 ml-1" />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Badge & Order */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-foreground mb-1">Badge / Tag Text</label>
                <Input
                  value={newSlide.badge}
                  onChange={(e) => setNewSlide({ ...newSlide, badge: e.target.value })}
                  placeholder="e.g. 🇮🇳 India's Complete Services Marketplace"
                  className="bg-background border-border text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-foreground mb-1">Display Order</label>
                <Input
                  type="number"
                  min="1"
                  value={newSlide.order}
                  onChange={(e) => setNewSlide({ ...newSlide, order: e.target.value })}
                  className="bg-background border-border text-xs text-white"
                />
              </div>
            </div>

            {/* Title & Highlight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-foreground mb-1">Main Heading (White text) *</label>
                <Input
                  required
                  value={newSlide.title}
                  onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                  placeholder="e.g. Find trusted services"
                  className="bg-background border-border text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-foreground mb-1">Highlight Text (Gradient gold)</label>
                <Input
                  value={newSlide.highlightText}
                  onChange={(e) => setNewSlide({ ...newSlide, highlightText: e.target.value })}
                  placeholder="e.g. near you — in seconds."
                  className="bg-background border-border text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-foreground mb-1">Subtitle / Description</label>
              <Input
                value={newSlide.subtitle}
                onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                placeholder="e.g. Doctors, electricians, plumbers, hotels & legal experts."
                className="bg-background border-border text-xs text-white"
              />
            </div>

            {/* Image URL & Uploader */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-foreground">Background Image URL</label>
              <Input
                required
                value={newSlide.imageUrl}
                onChange={(e) => setNewSlide({ ...newSlide, imageUrl: e.target.value })}
                placeholder="https://... image URL"
                className="bg-background border-border text-xs text-white"
              />

              <div className="text-[11px] text-muted-foreground flex items-center justify-between">
                <span>Or pick a curated preset:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_IMAGES.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setNewSlide({ ...newSlide, imageUrl: preset.url, overlayGradient: preset.gradient })}
                    className="text-[10px] px-2 py-1 rounded bg-background hover:bg-muted border border-border text-foreground transition"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Upload local image */}
              <div className="pt-2">
                <div className="text-[11px] text-muted-foreground mb-1">Or upload image from your computer:</div>
                <FileUploader
                  context="hero-slide"
                  ownerId={user.id}
                  buttonLabel="Click or drag image to upload for Hero Slide"
                  accept="image/jpeg,image/png,image/webp"
                  onUploaded={(media) => {
                    if (media && media.url) {
                      setNewSlide(prev => ({ ...prev, imageUrl: media.url }));
                    }
                  }}
                />
              </div>
            </div>

            {/* Gradient Overlay Selection */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Color Overlay Gradient</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {GRADIENT_PRESETS.map((g, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setNewSlide({ ...newSlide, overlayGradient: g.value })}
                    className={`p-2 rounded-lg border text-left text-xs transition flex items-center gap-2 ${
                      newSlide.overlayGradient === g.value
                        ? 'border-accent bg-accent/10 text-white shadow-sm'
                        : 'border-border bg-background text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full ${g.bg} shrink-0`} />
                    <span className="truncate text-[11px]">{g.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Button & Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-foreground mb-1">CTA Button Text (Optional)</label>
                <Input
                  value={newSlide.ctaText}
                  onChange={(e) => setNewSlide({ ...newSlide, ctaText: e.target.value })}
                  placeholder="e.g. Explore Categories"
                  className="bg-background border-border text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-foreground mb-1">CTA Link Destination (Optional)</label>
                <Input
                  value={newSlide.ctaLink}
                  onChange={(e) => setNewSlide({ ...newSlide, ctaLink: e.target.value })}
                  placeholder="e.g. /categories or /search?group=Healthcare"
                  className="bg-background border-border text-xs text-white"
                />
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="slideActiveNew"
                checked={newSlide.isActive}
                onChange={(e) => setNewSlide({ ...newSlide, isActive: e.target.checked })}
                className="w-4 h-4 rounded bg-background border-border text-accent focus:ring-0"
              />
              <label htmlFor="slideActiveNew" className="text-xs text-foreground cursor-pointer">
                Publish slide immediately (Make active on Homepage slider)
              </label>
            </div>

            <DialogFooter className="pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddSlideOpen(false)}
                className="bg-background border-border text-foreground text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Create Hero Slide
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL: EDIT HERO SLIDE */}
      {/* ========================================================= */}
      <Dialog open={!!editingSlide} onOpenChange={(open) => !open && setEditingSlide(null)}>
        <DialogContent className="dark bg-card border-border text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Edit className="w-5 h-5 text-accent" /> Edit Hero Banner Slide
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update text, image, overlay gradient, and button details for this slide.
            </DialogDescription>
          </DialogHeader>

          {editingSlide && (
            <form onSubmit={handleSaveEditSlide} className="space-y-4 my-2">
              {/* Live Interactive Preview Box */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Live Banner Preview</label>
                <div className="relative h-44 w-full rounded-xl overflow-hidden border border-border bg-background flex flex-col justify-end p-4 shadow-inner">
                  {editingSlide.imageUrl && (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${editingSlide.imageUrl})` }}
                    />
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-br ${editingSlide.overlayGradient || 'from-blue-950/40 via-blue-900/40 to-orange-800/40'}`} />
                  <div className="relative z-10 text-white space-y-1">
                    {editingSlide.badge && (
                      <span className="inline-block bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                        {editingSlide.badge}
                      </span>
                    )}
                    <div className="text-base font-bold leading-tight">
                      {editingSlide.title || 'Find trusted services'}{' '}
                      <span className="bg-gradient-to-r from-orange-300 via-amber-200 to-yellow-200 bg-clip-text text-transparent">
                        {editingSlide.highlightText || 'near you in seconds.'}
                      </span>
                    </div>
                    {editingSlide.subtitle && (
                      <p className="text-[11px] text-white/85 line-clamp-1">{editingSlide.subtitle}</p>
                    )}
                    {editingSlide.ctaText && (
                      <div className="pt-1">
                        <span className="inline-flex items-center text-[10px] bg-accent text-accent-foreground px-2.5 py-1 rounded-md font-semibold">
                          {editingSlide.ctaText} <ChevronRight className="w-3 h-3 ml-1" />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Badge & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-foreground mb-1">Badge / Tag Text</label>
                  <Input
                    value={editingSlide.badge || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, badge: e.target.value })}
                    placeholder="e.g. 🇮🇳 India's Complete Services Marketplace"
                    className="bg-background border-border text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-foreground mb-1">Display Order</label>
                  <Input
                    type="number"
                    min="1"
                    value={editingSlide.order || 1}
                    onChange={(e) => setEditingSlide({ ...editingSlide, order: e.target.value })}
                    className="bg-background border-border text-xs text-white"
                  />
                </div>
              </div>

              {/* Title & Highlight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-foreground mb-1">Main Heading (White text) *</label>
                  <Input
                    required
                    value={editingSlide.title || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                    className="bg-background border-border text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-foreground mb-1">Highlight Text (Gradient gold)</label>
                  <Input
                    value={editingSlide.highlightText || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, highlightText: e.target.value })}
                    className="bg-background border-border text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-foreground mb-1">Subtitle / Description</label>
                <Input
                  value={editingSlide.subtitle || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                  className="bg-background border-border text-xs text-white"
                />
              </div>

              {/* Image URL & Uploader */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-foreground">Background Image URL</label>
                <Input
                  required
                  value={editingSlide.imageUrl || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, imageUrl: e.target.value })}
                  className="bg-background border-border text-xs text-white"
                />

                <div className="text-[11px] text-muted-foreground flex items-center justify-between">
                  <span>Or pick a curated preset:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_IMAGES.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setEditingSlide({ ...editingSlide, imageUrl: preset.url, overlayGradient: preset.gradient })}
                      className="text-[10px] px-2 py-1 rounded bg-background hover:bg-muted border border-border text-foreground transition"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Upload local image */}
                <div className="pt-2">
                  <div className="text-[11px] text-muted-foreground mb-1">Or upload a new image from your computer:</div>
                  <FileUploader
                    context="hero-slide"
                    ownerId={user.id}
                    buttonLabel="Click or drag image to replace"
                    accept="image/jpeg,image/png,image/webp"
                    onUploaded={(media) => {
                      if (media && media.url) {
                        setEditingSlide(prev => ({ ...prev, imageUrl: media.url }));
                      }
                    }}
                  />
                </div>
              </div>

              {/* Gradient Overlay Selection */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Color Overlay Gradient</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {GRADIENT_PRESETS.map((g, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setEditingSlide({ ...editingSlide, overlayGradient: g.value })}
                      className={`p-2 rounded-lg border text-left text-xs transition flex items-center gap-2 ${
                        editingSlide.overlayGradient === g.value
                          ? 'border-accent bg-accent/10 text-white shadow-sm'
                          : 'border-border bg-background text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full ${g.bg} shrink-0`} />
                      <span className="truncate text-[11px]">{g.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Button & Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-foreground mb-1">CTA Button Text (Optional)</label>
                  <Input
                    value={editingSlide.ctaText || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, ctaText: e.target.value })}
                    placeholder="e.g. Explore Categories"
                    className="bg-background border-border text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-foreground mb-1">CTA Link Destination (Optional)</label>
                  <Input
                    value={editingSlide.ctaLink || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, ctaLink: e.target.value })}
                    placeholder="e.g. /categories or /search?group=Healthcare"
                    className="bg-background border-border text-xs text-white"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="slideActiveEdit"
                  checked={editingSlide.isActive !== false}
                  onChange={(e) => setEditingSlide({ ...editingSlide, isActive: e.target.checked })}
                  className="w-4 h-4 rounded bg-background border-border text-accent focus:ring-0"
                />
                <label htmlFor="slideActiveEdit" className="text-xs text-foreground cursor-pointer">
                  Slide is Active (Visible on Homepage slider)
                </label>
              </div>

              <DialogFooter className="pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingSlide(null)}
                  className="bg-background border-border text-foreground text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL: CREATE ADVERTISEMENT CAMPAIGN */}
      {/* ========================================================= */}
      <Dialog open={isAddAdOpen} onOpenChange={setIsAddAdOpen}>
        <DialogContent className="dark bg-card border-border text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-amber-400" /> Create Advertisement Campaign
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Configure sponsored marketing banners, target placements, link destinations, and schedule dates.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateAd} className="space-y-4 my-2">
            {/* Live Interactive Preview Box */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center justify-between">
                <span>Real-Time Ad Banner Preview</span>
                <span className="text-[10px] text-amber-400 font-mono">Live Mockup</span>
              </label>
              <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-border bg-background flex flex-col justify-end p-4 shadow-2xl">
                {newAd.imageUrl && (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${newAd.imageUrl})` }}
                  />
                )}
                <div className={`absolute inset-0 bg-gradient-to-br ${newAd.gradient || 'from-amber-600/10 via-orange-600/10 to-red-700/10'}`} />

                <div className="relative z-10 text-white space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {newAd.badge && (
                      <span className="inline-block bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                        {newAd.badge}
                      </span>
                    )}
                    {newAd.advertiserName && (
                      <span className="text-[10px] text-white/85 bg-black/40 px-2 py-0.5 rounded">
                        by {newAd.advertiserName}
                      </span>
                    )}
                    <span className="text-[10px] bg-background/80 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                      {newAd.placement}
                    </span>
                  </div>

                  <h4 className="text-base font-bold leading-tight line-clamp-1">
                    {newAd.title || 'Your Campaign Heading Here'}
                  </h4>
                  {newAd.subtitle && (
                    <p className="text-[11px] text-white/85 line-clamp-1">{newAd.subtitle}</p>
                  )}

                  <div className="pt-1 flex items-center gap-2">
                    <span className="inline-flex items-center text-[10px] bg-[#F5A623] text-primary font-extrabold px-3 py-1 rounded-md shadow">
                      {newAd.ctaText || 'Claim Offer'} <ExternalLink className="w-3 h-3 ml-1" />
                    </span>
                    {newAd.advertiserPhone && (
                      <span className="text-[10px] text-white/90 bg-black/40 px-2 py-1 rounded font-mono">
                        📞 {newAd.advertiserPhone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Campaign Title */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Campaign Title / Offer Heading *</label>
              <Input
                required
                value={newAd.title}
                onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                placeholder="e.g. ⚡ 50% Off Summer AC & Appliance Repair"
                className="bg-background border-border text-xs text-white"
              />
            </div>

            {/* Subtitle / Pitch */}
            <div>
              <label className="block text-xs text-foreground mb-1">Subtitle / Offer Description</label>
              <Input
                value={newAd.subtitle}
                onChange={(e) => setNewAd({ ...newAd, subtitle: e.target.value })}
                placeholder="e.g. Certified technicians at your doorstep within 60 minutes across India."
                className="bg-background border-border text-xs text-white"
              />
            </div>

            {/* Placement & Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Display Placement *</label>
                <select
                  value={newAd.placement}
                  onChange={(e) => setNewAd({ ...newAd, placement: e.target.value })}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs text-white"
                >
                  {PLACEMENT_OPTIONS.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-foreground mb-1">Badge / Tag Text</label>
                <Input
                  value={newAd.badge}
                  onChange={(e) => setNewAd({ ...newAd, badge: e.target.value })}
                  placeholder="e.g. 🔥 Summer Super Saver or Sponsored"
                  className="bg-background border-border text-xs text-white"
                />
              </div>
            </div>

            {/* Advertiser Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-foreground mb-1">Advertiser / Sponsor Name</label>
                <Input
                  value={newAd.advertiserName}
                  onChange={(e) => setNewAd({ ...newAd, advertiserName: e.target.value })}
                  placeholder="e.g. Urban Cool Tech"
                  className="bg-background border-border text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-foreground mb-1">Advertiser Phone / WhatsApp</label>
                <Input
                  value={newAd.advertiserPhone}
                  onChange={(e) => setNewAd({ ...newAd, advertiserPhone: e.target.value })}
                  placeholder="e.g. +91 98765 11223"
                  className="bg-background border-border text-xs text-white"
                />
              </div>
            </div>

            {/* Target URL & CTA Text */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Click Target URL / Link *</label>
                <Input
                  required
                  value={newAd.targetUrl}
                  onChange={(e) => setNewAd({ ...newAd, targetUrl: e.target.value })}
                  placeholder="e.g. /search?category=ac-repair or https://partner.com"
                  className="bg-background border-border text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-foreground mb-1">CTA Button Text</label>
                <Input
                  value={newAd.ctaText}
                  onChange={(e) => setNewAd({ ...newAd, ctaText: e.target.value })}
                  placeholder="e.g. Book AC Service or Claim Offer"
                  className="bg-background border-border text-xs text-white"
                />
              </div>
            </div>

            {/* Image URL & File Uploader */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-foreground">Banner Background Image URL</label>
              <Input
                value={newAd.imageUrl}
                onChange={(e) => setNewAd({ ...newAd, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="bg-background border-border text-xs text-white"
              />

              <div className="text-[11px] text-muted-foreground flex items-center justify-between">
                <span>Or pick from preset imagery:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_IMAGES.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setNewAd({ ...newAd, imageUrl: preset.url, gradient: preset.gradient })}
                    className="text-[10px] px-2 py-1 rounded bg-background hover:bg-muted border border-border text-foreground transition"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Upload image from local machine */}
              <div className="pt-2">
                <div className="text-[11px] text-muted-foreground mb-1">Or upload an ad graphic from your device:</div>
                <FileUploader
                  context="ad-banner"
                  ownerId={user.id}
                  buttonLabel="Upload Banner Image"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onUploaded={(media) => {
                    if (media && media.url) {
                      setNewAd(prev => ({ ...prev, imageUrl: media.url }));
                    }
                  }}
                />
              </div>
            </div>

            {/* Campaign Schedule Dates & Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-foreground mb-1">Start Date</label>
                <Input
                  type="date"
                  value={newAd.startDate || ''}
                  onChange={(e) => setNewAd({ ...newAd, startDate: e.target.value })}
                  className="bg-background border-border text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-foreground mb-1">End Date (Expiry)</label>
                <Input
                  type="date"
                  value={newAd.endDate || ''}
                  onChange={(e) => setNewAd({ ...newAd, endDate: e.target.value })}
                  className="bg-background border-border text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-foreground mb-1">Display Priority (1 = Top)</label>
                <Input
                  type="number"
                  min="1"
                  value={newAd.priority}
                  onChange={(e) => setNewAd({ ...newAd, priority: parseInt(e.target.value) || 1 })}
                  className="bg-background border-border text-xs text-white"
                />
              </div>
            </div>

            {/* Status Checkbox */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="adActiveNew"
                checked={newAd.status === 'active'}
                onChange={(e) => setNewAd({ ...newAd, status: e.target.checked ? 'active' : 'inactive' })}
                className="w-4 h-4 rounded bg-background border-border text-amber-500 focus:ring-0"
              />
              <label htmlFor="adActiveNew" className="text-xs text-foreground cursor-pointer">
                Publish ad campaign immediately (Make active & visible to users)
              </label>
            </div>

            <DialogFooter className="pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddAdOpen(false)}
                className="bg-background border-border text-foreground text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-amber-500 to-rose-600 hover:opacity-95 text-white text-xs gap-1.5 font-bold"
              >
                <Plus className="w-3.5 h-3.5" /> Launch Ad Campaign
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL: EDIT ADVERTISEMENT CAMPAIGN */}
      {/* ========================================================= */}
      <Dialog open={!!editingAd} onOpenChange={(open) => !open && setEditingAd(null)}>
        <DialogContent className="dark bg-card border-border text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Edit className="w-5 h-5 text-amber-400" /> Edit Advertisement Campaign
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update banner details, placement, links, schedule, and live campaign status.
            </DialogDescription>
          </DialogHeader>

          {editingAd && (
            <form onSubmit={handleSaveEditAd} className="space-y-4 my-2">
              {/* Live Preview Box */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center justify-between">
                  <span>Live Banner Preview</span>
                  <span className="text-[10px] text-amber-400 font-mono">Live Mockup</span>
                </label>
                <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-border bg-background flex flex-col justify-end p-4 shadow-2xl">
                  {editingAd.imageUrl && (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${editingAd.imageUrl})` }}
                    />
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-br ${editingAd.gradient || 'from-amber-600/10 via-orange-600/10 to-red-700/10'}`} />

                  <div className="relative z-10 text-white space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {editingAd.badge && (
                        <span className="inline-block bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                          {editingAd.badge}
                        </span>
                      )}
                      {editingAd.advertiserName && (
                        <span className="text-[10px] text-white/85 bg-black/40 px-2 py-0.5 rounded">
                          by {editingAd.advertiserName}
                        </span>
                      )}
                      <span className="text-[10px] bg-background/80 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                        {editingAd.placement}
                      </span>
                    </div>

                    <h4 className="text-base font-bold leading-tight line-clamp-1">
                      {editingAd.title || 'Campaign Title'}
                    </h4>
                    {editingAd.subtitle && (
                      <p className="text-[11px] text-white/85 line-clamp-1">{editingAd.subtitle}</p>
                    )}

                    <div className="pt-1 flex items-center gap-2">
                      <span className="inline-flex items-center text-[10px] bg-[#F5A623] text-primary font-extrabold px-3 py-1 rounded-md shadow">
                        {editingAd.ctaText || 'Claim Offer'} <ExternalLink className="w-3 h-3 ml-1" />
                      </span>
                      {editingAd.advertiserPhone && (
                        <span className="text-[10px] text-white/90 bg-black/40 px-2 py-1 rounded font-mono">
                          📞 {editingAd.advertiserPhone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Campaign Title / Offer Heading *</label>
                <Input
                  required
                  value={editingAd.title || ''}
                  onChange={(e) => setEditingAd({ ...editingAd, title: e.target.value })}
                  className="bg-background border-border text-xs text-white"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs text-foreground mb-1">Subtitle / Offer Description</label>
                <Input
                  value={editingAd.subtitle || ''}
                  onChange={(e) => setEditingAd({ ...editingAd, subtitle: e.target.value })}
                  className="bg-background border-border text-xs text-white"
                />
              </div>

              {/* Placement & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Display Placement *</label>
                  <select
                    value={editingAd.placement || 'homepage_banner'}
                    onChange={(e) => setEditingAd({ ...editingAd, placement: e.target.value })}
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs text-white"
                  >
                    {PLACEMENT_OPTIONS.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-foreground mb-1">Badge / Tag Text</label>
                  <Input
                    value={editingAd.badge || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, badge: e.target.value })}
                    className="bg-background border-border text-xs text-white"
                  />
                </div>
              </div>

              {/* Advertiser Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-foreground mb-1">Advertiser / Sponsor Name</label>
                  <Input
                    value={editingAd.advertiserName || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, advertiserName: e.target.value })}
                    className="bg-background border-border text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-foreground mb-1">Advertiser Phone / WhatsApp</label>
                  <Input
                    value={editingAd.advertiserPhone || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, advertiserPhone: e.target.value })}
                    className="bg-background border-border text-xs text-white"
                  />
                </div>
              </div>

              {/* Target URL & CTA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Click Target URL / Link *</label>
                  <Input
                    required
                    value={editingAd.targetUrl || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, targetUrl: e.target.value })}
                    className="bg-background border-border text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-foreground mb-1">CTA Button Text</label>
                  <Input
                    value={editingAd.ctaText || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, ctaText: e.target.value })}
                    className="bg-background border-border text-xs text-white"
                  />
                </div>
              </div>

              {/* Image URL & Uploader */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-foreground">Banner Background Image URL</label>
                <Input
                  value={editingAd.imageUrl || ''}
                  onChange={(e) => setEditingAd({ ...editingAd, imageUrl: e.target.value })}
                  className="bg-background border-border text-xs text-white"
                />

                <div className="flex flex-wrap gap-1.5">
                  {PRESET_IMAGES.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setEditingAd({ ...editingAd, imageUrl: preset.url, gradient: preset.gradient })}
                      className="text-[10px] px-2 py-1 rounded bg-background hover:bg-muted border border-border text-foreground transition"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <div className="text-[11px] text-muted-foreground mb-1">Or upload new banner image:</div>
                  <FileUploader
                    context="ad-banner"
                    ownerId={user.id}
                    buttonLabel="Upload / Replace Image"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onUploaded={(media) => {
                      if (media && media.url) {
                        setEditingAd(prev => ({ ...prev, imageUrl: media.url }));
                      }
                    }}
                  />
                </div>
              </div>

              {/* Dates & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-foreground mb-1">Start Date</label>
                  <Input
                    type="date"
                    value={editingAd.startDate || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, startDate: e.target.value })}
                    className="bg-background border-border text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-foreground mb-1">End Date (Expiry)</label>
                  <Input
                    type="date"
                    value={editingAd.endDate || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, endDate: e.target.value })}
                    className="bg-background border-border text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-foreground mb-1">Display Priority</label>
                  <Input
                    type="number"
                    min="1"
                    value={editingAd.priority || 1}
                    onChange={(e) => setEditingAd({ ...editingAd, priority: parseInt(e.target.value) || 1 })}
                    className="bg-background border-border text-xs text-white"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs text-foreground mb-1">Campaign Status</label>
                <select
                  value={editingAd.status || 'active'}
                  onChange={(e) => setEditingAd({ ...editingAd, status: e.target.value })}
                  className="w-full bg-background border border-border rounded px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="active">Active (Live running on site)</option>
                  <option value="inactive">Inactive / Paused</option>
                  <option value="expired">Expired</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <DialogFooter className="pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingAd(null)}
                  className="bg-background border-border text-foreground text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-500 text-white text-xs gap-1.5 font-bold"
                >
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL: ADD LOCATION / CITY */}
      {/* ========================================================= */}
      <Dialog open={isAddLocationOpen} onOpenChange={setIsAddLocationOpen}>
        <DialogContent className="dark bg-card border-border text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> Add New Location / City
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Register a new Indian State, District, City, and Localities to expand marketplace coverage.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateLocation} className="space-y-4 my-2">
            {/* State Selection */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">State / Union Territory *</label>
              <select
                value={newLocation.state}
                onChange={(e) => setNewLocation({ ...newLocation, state: e.target.value })}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs text-white"
              >
                {ALL_INDIAN_STATES.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
                <option value="CUSTOM">+ Other / Custom State Name...</option>
              </select>
            </div>

            {/* Custom State Input if selected */}
            {newLocation.state === 'CUSTOM' && (
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">Custom State Name *</label>
                <Input
                  required
                  placeholder="Enter custom State / Territory name"
                  value={newLocation.customState}
                  onChange={(e) => setNewLocation({ ...newLocation, customState: e.target.value })}
                  className="bg-background border-primary/40 text-xs text-white"
                />
              </div>
            )}

            {/* District & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">City / Town Name *</label>
                <Input
                  required
                  placeholder="e.g. Pune, Noida, Gaya"
                  value={newLocation.city}
                  onChange={(e) => setNewLocation({ ...newLocation, city: e.target.value })}
                  className="bg-background border-border text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-foreground mb-1">District Name</label>
                <Input
                  placeholder="e.g. Pune, Gautam Buddha Nagar"
                  value={newLocation.district}
                  onChange={(e) => setNewLocation({ ...newLocation, district: e.target.value })}
                  className="bg-background border-border text-xs text-white"
                />
              </div>
            </div>

            {/* Localities / Areas */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Localities / Areas (Comma separated)
              </label>
              <Input
                placeholder="e.g. Kothrud, Hinjewadi, Viman Nagar, Baner, Wakad"
                value={newLocation.areas}
                onChange={(e) => setNewLocation({ ...newLocation, areas: e.target.value })}
                className="bg-background border-border text-xs text-white"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Enter multiple areas separated by commas. You can also add more areas later directly from the location card.
              </p>
            </div>

            {/* Pincode & Tier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-foreground mb-1">Postal / Pincode (Optional)</label>
                <Input
                  placeholder="e.g. 411038"
                  value={newLocation.pincode}
                  onChange={(e) => setNewLocation({ ...newLocation, pincode: e.target.value })}
                  className="bg-background border-border text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-foreground mb-1">Coverage Tier</label>
                <select
                  value={newLocation.tier}
                  onChange={(e) => setNewLocation({ ...newLocation, tier: e.target.value })}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs text-white"
                >
                  <option value="Tier 1">Tier 1 (Metropolitan Hub)</option>
                  <option value="Tier 2">Tier 2 (Major City / Industrial)</option>
                  <option value="Tier 3">Tier 3 (Town / Sub-district)</option>
                </select>
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="locationActiveNew"
                checked={newLocation.isActive}
                onChange={(e) => setNewLocation({ ...newLocation, isActive: e.target.checked })}
                className="w-4 h-4 rounded bg-background border-border text-primary focus:ring-0"
              />
              <label htmlFor="locationActiveNew" className="text-xs text-foreground cursor-pointer">
                Publish location immediately (Make visible in user search & provider listing)
              </label>
            </div>

            <DialogFooter className="pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddLocationOpen(false)}
                className="bg-background border-border text-foreground text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white text-xs gap-1.5 font-bold"
              >
                <Plus className="w-3.5 h-3.5" /> Save Location
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL: EDIT LOCATION */}
      {/* ========================================================= */}
      <Dialog open={!!editingLocation} onOpenChange={(open) => !open && setEditingLocation(null)}>
        <DialogContent className="dark bg-card border-border text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Edit className="w-5 h-5 text-primary" /> Edit Location / City
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update location details, coverage areas, pincode, and status.
            </DialogDescription>
          </DialogHeader>

          {editingLocation && (
            <form onSubmit={handleSaveEditLocation} className="space-y-4 my-2">
              {/* State */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">State / Union Territory *</label>
                <Input
                  required
                  value={editingLocation.state || ''}
                  onChange={(e) => setEditingLocation({ ...editingLocation, state: e.target.value })}
                  className="bg-background border-border text-xs text-white"
                />
              </div>

              {/* District & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">City / Town Name *</label>
                  <Input
                    required
                    value={editingLocation.city || ''}
                    onChange={(e) => setEditingLocation({ ...editingLocation, city: e.target.value })}
                    className="bg-background border-border text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-foreground mb-1">District Name</label>
                  <Input
                    value={editingLocation.district || ''}
                    onChange={(e) => setEditingLocation({ ...editingLocation, district: e.target.value })}
                    className="bg-background border-border text-xs text-white"
                  />
                </div>
              </div>

              {/* Localities / Areas */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Localities / Areas (Comma separated)
                </label>
                <Input
                  value={Array.isArray(editingLocation.areas) ? editingLocation.areas.join(', ') : (editingLocation.areas || '')}
                  onChange={(e) => setEditingLocation({ ...editingLocation, areas: e.target.value })}
                  className="bg-background border-border text-xs text-white"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Separate area names with commas.
                </p>
              </div>

              {/* Pincode & Tier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-foreground mb-1">Postal / Pincode</label>
                  <Input
                    value={editingLocation.pincode || ''}
                    onChange={(e) => setEditingLocation({ ...editingLocation, pincode: e.target.value })}
                    className="bg-background border-border text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-foreground mb-1">Coverage Tier</label>
                  <select
                    value={editingLocation.tier || 'Tier 2'}
                    onChange={(e) => setEditingLocation({ ...editingLocation, tier: e.target.value })}
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs text-white"
                  >
                    <option value="Tier 1">Tier 1 (Metropolitan Hub)</option>
                    <option value="Tier 2">Tier 2 (Major City / Industrial)</option>
                    <option value="Tier 3">Tier 3 (Town / Sub-district)</option>
                  </select>
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="locationActiveEdit"
                  checked={editingLocation.isActive !== false}
                  onChange={(e) => setEditingLocation({ ...editingLocation, isActive: e.target.checked })}
                  className="w-4 h-4 rounded bg-background border-border text-primary focus:ring-0"
                />
                <label htmlFor="locationActiveEdit" className="text-xs text-foreground cursor-pointer">
                  Location is Active (Visible on public search & filters)
                </label>
              </div>

              <DialogFooter className="pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingLocation(null)}
                  className="bg-background border-border text-foreground text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white text-xs gap-1.5 font-bold"
                >
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense
      fallback={
        <div className="dark min-h-screen bg-background flex flex-col items-center justify-center text-foreground">
          <div className="w-8 h-8 rounded-full border-4 border-accent border-t-transparent animate-spin mb-3" />
          <div className="text-muted-foreground text-sm">Loading Search2Service Admin Console...</div>
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}

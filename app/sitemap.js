const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://search2service.cloud';

const STATIC_ROUTES = [
  { path: '/', priority: 1.0, changeFrequency: 'daily' },
  { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/categories', priority: 0.9, changeFrequency: 'daily' },
  { path: '/search', priority: 0.9, changeFrequency: 'daily' },
  { path: '/contact', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/support', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/careers', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/press', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/refund-policy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/disclaimer', priority: 0.3, changeFrequency: 'yearly' },
];

export default function sitemap() {
  const now = new Date();
  return STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

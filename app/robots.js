const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://search2service.com';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/admin/*',
        '/auth',
        '/customer/dashboard',
        '/provider/*',
        '/jobseeker/profile',
        '/upload',
        '/api/*',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

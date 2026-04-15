export async function GET() {
  const pages = [
    '/',
    '/chat',
    '/pricing',
    '/clinic',
    '/diet',
    '/privacy',
    '/terms',
    '/contact',
    '/about',
    '/safety',
    '/press-kit',
    '/testimonials',
    '/auth/sign-in',
    '/auth/sign-up',
    '/dashboard',
    '/profile',
    '/settings'
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>https://ayura.ai${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  })
}

import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = 'https://ayurahealth.com'
  const pages = ['', '/chat']
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.map(path => `  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${path === '' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${path === '' ? '1.0' : '0.8'}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}${path}"/>
    <xhtml:link rel="alternate" hreflang="ja" href="${baseUrl}${path}"/>
    <xhtml:link rel="alternate" hreflang="hi" href="${baseUrl}${path}"/>
  </url>`).join('\n')}
</urlset>`
  return new NextResponse(sitemap, {
    headers: { 'Content-Type': 'application/xml' }
  })
}

export const dynamic = 'force-static'

export async function GET() {
  const pages = ['/', '/chat', '/pricing', '/clinic', '/diet', '/privacy', '/terms']
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url><loc>https://ayurahealth.com${p}</loc></url>`).join('\n')}
</urlset>`
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } })
}

export async function GET() {
  return new Response(`User-agent: *
Allow: /
Sitemap: https://ayurahealth.com/sitemap.xml
`, { headers: { 'Content-Type': 'text/plain' } })
}

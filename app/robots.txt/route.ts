export function GET() {
  const robots = `User-agent: *
Allow: /
Sitemap: https://ayurahealth.com/sitemap.xml
`

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}

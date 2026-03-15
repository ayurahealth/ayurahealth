import { NextResponse } from 'next/server'

export async function GET() {
  const content = `User-agent: *
Allow: /
Allow: /chat

Disallow: /api/

Sitemap: https://ayurahealth.vercel.app/sitemap.xml`
  return new NextResponse(content, {
    headers: { 'Content-Type': 'text/plain' }
  })
}

import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  // Prevent Next.js from inferring tracing root from parent lockfiles.
  outputFileTracingRoot: path.join(__dirname),
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  skipTrailingSlashRedirect: true,
  experimental: {
    preloadEntriesOnStart: false,
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      // scripts: self + inline/eval (Next.js needs these) + payment SDKs + analytics + Clerk
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://cdn.razorpay.com https://*.clerk.accounts.dev https://*.clerk.accounts.com https://www.googletagmanager.com https://fonts.googleapis.com",
      // styles: self + inline + Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // fonts
      "font-src 'self' https://fonts.gstatic.com",
      // images: self + data URIs + blob + all HTTPS (for user-uploaded images)
      "img-src 'self' data: blob: https:",
      // API connections
      [
        "connect-src 'self'",
        "https://api.groq.com",
        "https://openrouter.ai",               // VAIDYA Deep Mind
        "https://checkout.razorpay.com",        // Razorpay checkout
        "https://api.razorpay.com",             // Razorpay API
        "https://cdn.razorpay.com",             // Razorpay CDN
        "https://lumberjack.razorpay.com",      // Razorpay analytics
        "https://*.clerk.accounts.dev",           // Clerk auth (dev)
        "https://*.clerk.accounts.com",           // Clerk auth (prod)
        "https://formspree.io",                // Contact form
        "https://www.google-analytics.com",    // GA
        "https://vitals.vercel-insights.com",  // Vercel analytics
        "https://va.vercel-scripts.com",       // Vercel analytics 2
      ].join(' '),
      // iframes: only Razorpay (for payment widgets)
      "frame-src https://api.razorpay.com",
      // block all framing of our pages
      "frame-ancestors 'none'",
      // workers
      "worker-src 'self' blob:",
    ].join('; ')

    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent DNS prefetch attacks
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          // HSTS — 1 year, include subdomains
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          // Clickjacking protection
          { key: 'X-Frame-Options', value: 'DENY' },
          // MIME sniffing protection
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Referrer: only send origin cross-site
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Permissions: lock down hardware access
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=(), payment=(self "https://checkout.razorpay.com")' },
          // Full CSP
          { key: 'Content-Security-Policy', value: csp },
          // Disable speculative loading of cross-origin resources
          { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/blog', destination: '/', permanent: true },
    ]
  },
}

export default nextConfig

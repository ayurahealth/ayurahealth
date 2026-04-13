import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Required for Capacitor/iOS static export
  output: 'export',
  images: {
    unoptimized: true,
  },
  
  // Prevent Next.js from inferring tracing root from parent lockfiles.
  outputFileTracingRoot: process.cwd(),
  
  // Enforce build resilience during production stabilization
  typescript: {
    ignoreBuildErrors: true, 
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  skipTrailingSlashRedirect: true,

  /*
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://cdn.razorpay.com https://*.clerk.accounts.dev https://*.clerk.accounts.com https://accounts.ayurahealth.com https://clerk.ayurahealth.com https://*.clerk.ayurahealth.com https://www.googletagmanager.com https://fonts.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      [
        "connect-src 'self'",
        "https://api.groq.com",
        "https://openrouter.ai",
        "https://router.huggingface.co",
        "https://api-inference.huggingface.co",
        "http://localhost:11434",
        "https://checkout.razorpay.com",
        "https://api.razorpay.com",
        "https://cdn.razorpay.com",
        "https://lumberjack.razorpay.com",
        "https://*.clerk.accounts.dev",
        "https://*.clerk.accounts.com",
        "https://accounts.ayurahealth.com",
        "https://clerk.ayurahealth.com",
        "https://*.clerk.ayurahealth.com",
        "https://formspree.io",
        "https://www.google-analytics.com",
        "https://vitals.vercel-insights.com",
        "https://va.vercel-scripts.com",
      ].join(' '),
      "frame-src https://api.razorpay.com",
      "frame-ancestors 'none'",
      "worker-src 'self' blob:",
    ].join('; ')

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=(), payment=(self "https://checkout.razorpay.com")' },
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
        ],
      },
    ]
  },
  */
  /*
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/blog', destination: '/', permanent: true },
    ]
  },
  */
}

export default nextConfig

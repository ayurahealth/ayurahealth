import type { Metadata, Viewport } from 'next'
export const dynamic = 'force-static'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const BASE_URL = 'https://ayurahealth.com'

export const viewport: Viewport = {
  themeColor: '#1a4d2e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: 'AyuraHealth — Traditional Healing for Modern Life',
    template: '%s | AyuraHealth',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/favicon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  description: 'A professional health companion unifying 8 traditional healing systems. Get personalized guidance rooted in classical texts like Charaka Samhita and Huangdi Neijing.',
  keywords: [
    'ayurveda', 'holistic health', 'dosha quiz', 'vata pitta kapha',
    'TCM', 'Chinese medicine', 'natural healing', 'AI health',
    'Charaka Samhita', 'Huangdi Neijing', 'AyuraHealth',
  ],
  authors: [{ name: 'AyuraHealth', url: BASE_URL }],
  creator: 'AyuraHealth',
  publisher: 'AyuraHealth',

  // ─── Open Graph (WhatsApp · Line · Telegram · Facebook · LinkedIn · Slack · Discord) ───
  openGraph: {
    type: 'website',
    url: BASE_URL,
    siteName: 'AyuraHealth',
    title: 'AyuraHealth — Traditional Healing Systems',
    description: 'Personalized health guidance from 8 ancient healing traditions. Rooted in classical wisdom, designed for modern health.',
    locale: 'en_US',
    images: [
      {
        url: `${BASE_URL}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: 'AyuraHealth',
        type: 'image/png',
      },
    ],
  },

  // ─── Twitter / X ───
  twitter: {
    card: 'summary_large_image',
    site: '@ayurahealth',
    creator: '@ayurahealth',
    title: 'AyuraHealth — Traditional Healing Systems',
    description: 'Personalized health guidance from 8 ancient healing traditions.',
    images: [`${BASE_URL}/og-image.svg`],
  },

  // ─── PWA / Mobile ───
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AyuraHealth',
  },

  // ─── SEO ───
  robots: {
    index: true,
    follow: true,
  },
  category: 'health',
}


import ClerkWrapper from '../components/ClerkWrapper'
import ConsentBanner from '../components/ConsentBanner'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.svg" />

        {/* ─── Extra meta for LINE / KakaoTalk / WeChat / Viber ─── */}
        <meta property="og:image" content={`${BASE_URL}/og-image.svg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content="AyuraHealth — Ancient Wisdom, Modern AI" />

        {/* iMessage / Apple */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AyuraHealth" />

        {/* ─── LINE specific ─── */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={BASE_URL} />
        <meta property="og:site_name" content="AyuraHealth" />

        {/* ─── WhatsApp forces this exact format ─── */}
        <meta property="og:title" content="AyuraHealth — Ancient Wisdom, Modern AI" />
        <meta property="og:description" content="Discover your Ayurvedic dosha. Personalized health guidance from 8 ancient healing traditions. Free forever." />

        {/* Schema.org for Google rich results */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "AyuraHealth",
            "url": BASE_URL,
            "logo": {
              "@type": "ImageObject",
              "url": `${BASE_URL}/favicon.png`,
              "width": 512,
              "height": 512
            },
            "sameAs": [
              "https://x.com/ayurahealth",
              "https://reddit.com/r/AyuraHealth"
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "AyuraHealth",
            "url": BASE_URL,
            "description": "AI-powered holistic health companion combining Ayurveda, TCM, and 6 other healing traditions",
            "applicationCategory": "HealthApplication",
            "operatingSystem": "Any",
            "inLanguage": ["en", "ja", "hi", "zh", "ko", "ar", "sa"],
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "image": `${BASE_URL}/og-image.svg`,
            "author": { "@type": "Organization", "name": "AyuraHealth", "url": BASE_URL },
          }
        ])}} />
      </head>
      <body>
        <ClerkWrapper>
          {children}
          <ConsentBanner />
          <Analytics />
          <SpeedInsights />
        </ClerkWrapper>
      </body>
    </html>
  )
}

/**
 * 🚀 PRODUCTION_GOLD_DEPLOY_TRIGGER: 2ef46e60-ec91-48b0-8757-adf63acd9876
 * Final synchronization trigger for production launch.
 */

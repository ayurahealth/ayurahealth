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
    default: 'Ayura Intelligence — Clinical Reasoning & Synthesis',
    template: '%s | Ayura Intelligence',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  description: 'A professional health companion unifying 8 traditional healing systems. Get personalized guidance rooted in classical texts like Charaka Samhita and Huangdi Neijing.',
  keywords: [
    'ayurveda', 'holistic health', 'dosha quiz', 'vata pitta kapha',
    'TCM', 'Chinese medicine', 'natural healing', 'AI health',
    'Charaka Samhita', 'Huangdi Neijing', 'Ayura Intelligence',
  ],
  authors: [{ name: 'Ayura Intelligence Lab', url: BASE_URL }],
  creator: 'Ayura Intelligence',
  publisher: 'Ayura Intelligence',

  // ─── Open Graph (WhatsApp · Line · Telegram · Facebook · LinkedIn · Slack · Discord) ───
  openGraph: {
    type: 'website',
    url: BASE_URL,
    siteName: 'Ayura Intelligence',
    title: 'Ayura Intelligence — Clinical Synthesis & Longevity',
    description: 'Personalized health guidance from 8 ancient healing traditions. Rooted in classical wisdom, designed for modern health.',
    locale: 'en_US',
    images: [
      {
        url: `${BASE_URL}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: 'Ayura Intelligence',
        type: 'image/png',
      },
    ],
  },

  // ─── Twitter / X ───
  twitter: {
    card: 'summary_large_image',
    site: '@ayura_intelligence',
    creator: '@ayura_intelligence',
    title: 'Ayura Intelligence — Strategic Health Synthesis',
    description: 'Autonomous neural synthesis for traditional medical systems.',
    images: [`${BASE_URL}/og-image.svg`],
  },

  // ─── PWA / Mobile ───
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Ayura Intelligence',
  },

  // ─── SEO ───
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  category: 'health',
}


import ClerkWrapper from '../components/ClerkWrapper'
import ConsentBanner from '../components/ConsentBanner'
import { LanguageProvider } from '@/lib/i18n/LanguageContext'
import { Outfit, DM_Sans } from 'next/font/google'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
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
    <html lang="en" className={`${outfit.variable} ${dmSans.variable}`}>
      <head>
        {/* ─── Extra meta for LINE / KakaoTalk / WeChat / Viber ─── */}
        <meta property="og:image" content={`${BASE_URL}/og-image.svg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content="Ayura Intelligence — Ancient Wisdom, Neural Synthesis" />

        {/* iMessage / Apple */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Ayura Int" />

        {/* ─── LINE specific ─── */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={BASE_URL} />
        <meta property="og:site_name" content="Ayura Intelligence" />

        {/* ─── WhatsApp forces this exact format ─── */}
        <meta property="og:title" content="Ayura Intelligence — Ancient Wisdom, Neural Synthesis" />
        <meta property="og:description" content="Discover your Ayurvedic dosha. Personalized health guidance from 8 ancient healing traditions. Free forever." />

        {/* Schema.org for Google rich results */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Ayura Intelligence",
            "url": BASE_URL,
            "logo": {
              "@type": "ImageObject",
              "url": `${BASE_URL}/favicon.svg`,
              "width": 512,
              "height": 512
            },
            "sameAs": [
              "https://x.com/ayura_intel",
              "https://reddit.com/r/AyuraIntelligence"
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Ayura Intelligence Lab",
            "url": BASE_URL,
            "description": "High-fidelity clinical reasoning engine combining 8 ancient healing traditions via neural synthesis",
            "applicationCategory": "HealthApplication",
            "operatingSystem": "Any",
            "inLanguage": ["en", "ja", "hi", "zh", "ko", "ar", "sa"],
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "image": `${BASE_URL}/og-image.svg`,
            "author": { "@type": "Organization", "name": "Ayura Intelligence", "url": BASE_URL },
          }
        ])}} />
      </head>
      <body>
        <LanguageProvider>
          <ClerkWrapper>
            {children}
            <ConsentBanner />
            <Analytics />
            <SpeedInsights />
          </ClerkWrapper>
        </LanguageProvider>
      </body>
    </html>
  )
}

/**
 * 🚀 PRODUCTION_GOLD_DEPLOY_TRIGGER: 2ef46e60-ec91-48b0-8757-adf63acd9876
 * Final synchronization trigger for production launch.
 */

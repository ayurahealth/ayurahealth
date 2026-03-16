import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

export const viewport: Viewport = {
  themeColor: '#2d5a1b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://ayurahealth.vercel.app'),
  title: {
    default: 'AyuraHealth — AI Holistic Health Companion',
    template: '%s | AyuraHealth',
  },
  description: 'Discover your Ayurvedic dosha and get personalized health guidance from 8 ancient healing traditions — Ayurveda, Chinese Medicine, Homeopathy, and more. Free AI health companion.',
  keywords: ['ayurveda', 'holistic health', 'dosha quiz', 'TCM', 'Chinese medicine', 'homeopathy', 'Charaka Samhita', 'natural health', 'AI doctor', 'vata pitta kapha', 'アーユルヴェーダ', 'आयुर्वेद'],
  authors: [{ name: 'AyuraHealth' }],
  creator: 'AyuraHealth',
  publisher: 'AyuraHealth',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AyuraHealth',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ja_JP', 'hi_IN'],
    url: 'https://ayurahealth.vercel.app',
    siteName: 'AyuraHealth',
    title: 'AyuraHealth — Ancient Wisdom, Modern AI',
    description: 'Discover your Ayurvedic dosha in 2 minutes. Get personalized health guidance from 8 healing traditions powered by AI.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AyuraHealth — AI Holistic Health Companion' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AyuraHealth — AI Holistic Health Companion',
    description: 'Discover your Ayurvedic dosha. Get personalized health guidance from 8 ancient healing traditions.',
    images: ['/og-image.png'],
    creator: '@ayurahealth',
  },
  alternates: {
    canonical: 'https://ayurahealth.vercel.app',
    languages: {
      'en': 'https://ayurahealth.vercel.app',
      'ja': 'https://ayurahealth.vercel.app',
      'hi': 'https://ayurahealth.vercel.app',
    },
  },

}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
        <meta name="google-site-verification" content="nJKShriBws7A7s1eIeWX_Bm1XzV4m2NZYACYKzmbryc" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
             <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "AyuraHealth",
              "description": "AI-powered holistic health companion combining Ayurveda, TCM, and 6 other healing traditions",
              "url": "https://ayurahealth.vercel.app",
              "applicationCategory": "HealthApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "operatingSystem": "Any",
              "genre": "Health & Wellness",
              "browserRequirements": "Requires JavaScript",
              "featureList": "AI Health Consultation, Dosha Analysis, Personalized Wellness Plans, Multi-tradition Knowledge Base"
            })
          }}
        />   
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

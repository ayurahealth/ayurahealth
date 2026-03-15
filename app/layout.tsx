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
  verification: {
    google: '5214a22359d3f521',
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
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

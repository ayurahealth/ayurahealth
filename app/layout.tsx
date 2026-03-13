import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

export const metadata: Metadata = {
  title: 'AyuraHealth — AI Holistic Health Companion',
  description: 'Personalized health guidance from Ayurveda, Chinese Medicine, Homeopathy and 5 more healing traditions. Discover your dosha and get expert AI health advice.',
  keywords: 'ayurveda, holistic health, dosha quiz, TCM, Chinese medicine, homeopathy, natural health',
  openGraph: {
    title: 'AyuraHealth — Ancient Wisdom, Modern AI',
    description: 'Discover your Ayurvedic dosha and get personalized health guidance from 8 healing traditions.',
    url: 'https://ayurahealth.vercel.app',
    siteName: 'AyuraHealth',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

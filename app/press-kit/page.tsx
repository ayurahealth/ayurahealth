'use client'

import Link from 'next/link'
import { ArrowLeft, Download, FileText, ImageIcon, Palette } from 'lucide-react'

export default function PressKitPage() {
  const assets = [
    {
      category: 'Logo & Branding',
      icon: <Palette className="w-6 h-6" />,
      items: [
        { name: 'Logo - Full Color (PNG)', size: '2.4 MB' },
        { name: 'Logo - White (PNG)', size: '1.8 MB' },
        { name: 'Logo - Dark (PNG)', size: '1.9 MB' },
        { name: 'Brand Guidelines (PDF)', size: '3.2 MB' },
      ],
    },
    {
      category: 'Media & Images',
      icon: <ImageIcon className="w-6 h-6" />,
      items: [
        { name: 'Hero Image - High Res (JPG)', size: '4.5 MB' },
        { name: 'Product Screenshots (ZIP)', size: '12.3 MB' },
        { name: 'Team Photos (ZIP)', size: '8.7 MB' },
        { name: 'Social Media Assets (ZIP)', size: '6.2 MB' },
      ],
    },
    {
      category: 'Documents',
      icon: <FileText className="w-6 h-6" />,
      items: [
        { name: 'Press Release - Launch (PDF)', size: '0.8 MB' },
        { name: 'Company Fact Sheet (PDF)', size: '1.2 MB' },
        { name: 'Product Overview (PDF)', size: '2.1 MB' },
        { name: 'Media Kit (PDF)', size: '3.5 MB' },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-sage-deep text-gold-pale" style={{ background: 'linear-gradient(to bottom, #0d2a1a, #1a4d2e)' }}>
      {/* Header */}
      <div className="border-b border-sage-accent/20 bg-sage-deep/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <ArrowLeft className="w-5 h-5 text-gold-accent" />
            <span className="text-sm">Back to Home</span>
          </Link>
          <h1 className="text-2xl font-serif text-gold-accent">Press Kit</h1>
          <div className="w-20" />
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at center, hsla(var(--gold-accent), 0.3) 0%, transparent 70%)' }} />
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <h2 className="text-5xl md:text-6xl font-serif text-gold-accent mb-6 leading-tight">Media & Press Resources</h2>
          <p className="text-xl text-gold-pale/70 font-sans">
            Download everything you need to communicate the vision of AyuraHealth.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 border-y border-sage-accent/10">
        <div className="max-w-4xl mx-auto">
          <div className="premium-glass p-8 md:p-12 rounded-[2rem]">
            <h3 className="text-2xl font-serif text-gold-accent mb-6">About AyuraHealth</h3>
            <div className="space-y-6 text-gold-pale/80 leading-relaxed font-sans">
              <p>
                AyuraHealth is a revolutionary AI-powered holistic health companion that combines the wisdom of Ayurveda, Chinese Medicine, Tibetan, Unani, Siddha, Homeopathy, Naturopathy, and Western Medicine. Our mission is to democratize access to personalized health guidance for everyone, everywhere.
              </p>
              <p>
                Powered by advanced AI reasoning and available in 50+ languages, AyuraHealth provides personalized health recommendations, blood report analysis, and customized diet charts—all guided by the principle that healing has always been natural.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Facts */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-serif text-gold-accent mb-12 text-center">Platform Fundamentals</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { label: 'MISSION', value: 'Democratize holistic health globally', color: 'hsla(var(--sage-accent), 0.2)' },
              { label: 'LANGUAGES', value: '50+ languages supported', color: 'hsla(var(--gold-accent), 0.1)' },
              { label: 'TRADITIONS', value: '8 healing traditions integrated', color: 'hsla(var(--sage-accent), 0.15)' },
              { label: 'PRICING', value: 'Premium access available globally', color: 'hsla(var(--gold-accent), 0.2)' },
            ].map((fact, i) => (
              <div key={i} className="premium-glass p-8 rounded-2xl border-none" style={{ backgroundColor: fact.color }}>
                <p className="text-[0.65rem] text-gold-accent font-bold tracking-[0.2em] mb-2">{fact.label}</p>
                <p className="text-xl font-serif">{fact.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Downloadable Assets */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-serif text-gold-accent mb-12">Downloadable Assets</h3>

          {assets.map((section, idx) => (
            <div key={idx} className="mb-20">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-sage-accent/20 text-gold-accent">{section.icon}</div>
                <h4 className="text-2xl font-serif text-gold-accent">{section.category}</h4>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                {section.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="premium-glass p-6 flex items-center justify-between hover:scale-[1.02] transition-transform cursor-pointer border-sage-accent/10"
                  >
                    <div>
                      <p className="font-serif text-lg text-gold-pale">{item.name}</p>
                      <p className="text-sm text-gold-pale/50">{item.size}</p>
                    </div>
                    <div className="p-2 rounded-full bg-sage-accent/20 text-gold-accent">
                      <Download className="w-5 h-5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-sage-accent/5" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h3 className="text-3xl font-serif text-gold-accent mb-6">Media Inquiries?</h3>
          <p className="text-xl text-gold-pale/60 mb-10 leading-relaxed font-sans">
            For press inquiries, interviews, or additional information, please contact our clinical media team.
          </p>
          <a 
            href="mailto:press@ayurahealth.com" 
            className="inline-block px-10 py-4 rounded-full font-bold bg-gold-accent text-sage-deep hover:bg-gold-pale transition-colors shadow-2xl"
          >
            Contact Press Team
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-sage-accent/10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-gold-pale/30 italic">© 2026 AyuraHealth · Healing has always been natural.</p>
        </div>
      </footer>
    </div>
  )
}

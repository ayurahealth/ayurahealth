'use client'
import React from 'react'
import Nav from '../../components/Nav'
import { motion } from 'framer-motion'
import { Download, FileText, ImageIcon, Globe, Server } from 'lucide-react'

export default function PressKitPage() {
  const assets = [
    { title: 'Brand Marks', icon: ImageIcon, desc: 'Institutional logo variants in SVG and Neural Emerald PNG.' },
    { title: 'Synthesis Guidelines', icon: FileText, desc: 'Typography and design system tokens (Outfit/Emerald).' },
    { title: 'Executive Overview', icon: Server, desc: 'Technical Whitepaper on Neural Synthesis protocols.' },
    { title: 'Imagery Assets', icon: Globe, desc: 'High-fidelity visualizations of the Neural Link interface.' },
  ]

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--bg-main)', color: 'var(--text-main)', position: 'relative' }}>
      <Nav showLangPicker={false} />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '10rem 1.5rem 6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
          <h1 style={{ fontSize: 'clamp(3rem, 7vw, 4.5rem)', fontWeight: 700, marginBottom: '2rem', letterSpacing: '-0.03em' }}>Press & Media Kit</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: 640, margin: '0 auto' }}>
            Official resources for communicating the vision of Ayura Intelligence Lab.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '8rem' }}>
          {assets.map((a, i) => (
            <div key={i} style={{ border: '1px solid var(--border-low)', borderRadius: '24px', padding: '2.5rem', background: 'var(--surface-low)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-main)', border: '1px solid var(--border-low)' }}>
                  <a.icon size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.25rem' }}>{a.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{a.desc}</p>
                </div>
              </div>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--accent-main)', cursor: 'pointer', padding: '0.5rem' }}>
                <Download size={20} />
              </button>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--surface-mid)', borderRadius: '32px', padding: '5rem 4rem', border: '1px solid var(--border-high)' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem' }}>Organization Overview</h2>
          <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
            <div>
              <p style={{ marginBottom: '1.5rem' }}>
                Ayura Intelligence Lab is a high-fidelity clinical synthesis organization dedicated to democratizing access to tradition-rooted medical logic through advanced neural networks.
              </p>
              <p>
                Founded in Tokyo, our mission is to build the "Neural Link" between ancient wisdom and modern clinical standards.
              </p>
            </div>
            <div style={{ borderLeft: '1px solid var(--border-low)', paddingLeft: '4rem' }}>
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--accent-main)', marginBottom: '0.5rem' }}>Contact Inquiries</div>
                <p>press@ayurahealth.com</p>
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--accent-main)', marginBottom: '0.5rem' }}>Social Graph</div>
                <p>@ayura_intelligence</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer style={{ padding: '5rem 2rem', textAlign: 'center', borderTop: '1px solid var(--border-low)' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>© 2026 Ayura Intelligence Lab · Tokyo, Japan</p>
      </footer>
    </main>
  )
}

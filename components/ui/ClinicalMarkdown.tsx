'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Activity, Beaker, BookOpen, BarChart2, Zap } from 'lucide-react'

interface ClinicalMarkdownProps {
  content: string
  doshaColor?: string
  className?: string
}

export default function ClinicalMarkdown({ 
  content, 
  doshaColor = 'var(--accent-main)',
  className = '' 
}: ClinicalMarkdownProps) {
  
  // Pre-process headers to add custom clinical styles
  const processedContent = content
    .replace(/\*\*✦ VAIDYA'S NEURAL SYNTHESIS\*\*/g, '### ✦ CLINICAL EVALUATION')
    .replace(/\*\*🧪 Mathematical Precision Log\*\*/g, '### 🧪 DATA CORRELATION LOG')
    .replace(/\*\*🌿 The Path of Multi-Tradition Balance\*\*/g, '### 🌿 INTEGRATED GUIDANCE')
    .replace(/\*\*📊 Clinical & Biomarker Correlation\*\*/g, '### 📊 BIOMARKER ANALYSIS')
    .replace(/\*\*⚡ Integrated Regimen \(Priority Actions\)\*\*/g, '### ⚡ PRIORITIZED REGIMEN')
    .replace(/\*\*📚 Verified Lineage\*\*/g, '### 📚 EVIDENCE & PROOF')

  return (
    <div className={`clinical-markdown clinical-report ${className}`} style={{ '--markdown-accent': doshaColor } as React.CSSProperties}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--markdown-accent)', marginBottom: '1.5rem', fontWeight: 500 }}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--markdown-accent)', marginTop: '2rem', marginBottom: '1rem', fontWeight: 500 }}>
              {children}
            </h2>
          ),
          h3: ({ children }) => {
            const text = String(children)
            let icon = null
            
            if (text.includes('CLINICAL EVALUATION')) icon = <Activity size={18} />
            if (text.includes('DATA CORRELATION')) icon = <Beaker size={18} />
            if (text.includes('GUIDANCE')) icon = <Zap size={18} />
            if (text.includes('BIOMARKER')) icon = <BarChart2 size={18} />
            if (text.includes('REGIMEN')) icon = <Zap size={18} />
            if (text.includes('EVIDENCE')) icon = <BookOpen size={18} />

            return (
              <h3 style={{ 
                color: 'var(--markdown-accent)', 
                fontSize: '1rem', 
                fontWeight: 700, 
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginTop: '1.5rem', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                borderBottom: '1px solid hsla(var(--accent-main-hsl), 0.1)',
                paddingBottom: '0.5rem'
              }}>
                {icon}
                {children}
              </h3>
            )
          },
          p: ({ children }) => (
            <p style={{ color: 'var(--text-main)', lineHeight: 1.7, marginBottom: '1.25rem', fontSize: '1rem' }}>
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong style={{ color: 'var(--markdown-accent)', fontWeight: 600 }}>
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
              {children}
            </em>
          ),
          ul: ({ children }) => (
            <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0' }}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol style={{ paddingLeft: '1.5rem', margin: '1rem 0', color: 'var(--text-main)' }}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => {
            // Check if it's an unordered list item
            const isBullet = (React.isValidElement(children) && (children.props as { ordered?: boolean }).ordered === false) || !props.index
            if (isBullet) {
              return (
                <li style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--markdown-accent)', opacity: 0.6, marginTop: '0.2rem' }}>•</span>
                  <span>{children}</span>
                </li>
              )
            }
            return <li style={{ marginBottom: '0.75rem' }}>{children}</li>
          },
          hr: () => <hr style={{ border: 'none', borderTop: '1px solid var(--border-low)', margin: '2rem 0' }} />,
          table: ({ children }) => (
            <div style={{ overflowX: 'auto', marginBottom: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-low)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead style={{ background: 'var(--surface-mid)', borderBottom: '1px solid var(--border-low)' }}>{children}</thead>,
          th: ({ children }) => <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700, color: 'var(--text-main)' }}>{children}</th>,
          td: ({ children }) => <td style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border-low)', color: 'var(--text-muted)' }}>{children}</td>,
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}

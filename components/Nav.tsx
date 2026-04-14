'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { SafeSignInButton, SafeUserButton, useSafeUser } from '../lib/clerk-client'
import Logo from './Logo'

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'zh', name: 'Chinese', native: '简体中文' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
]

interface NavProps {
  lang?: string
  onLangChange?: (code: string) => void
  showLangPicker?: boolean
  links?: Array<{ label: string; href: string }>
}

export default function Nav({ lang = 'en', onLangChange, showLangPicker = true, links }: NavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [search, setSearch] = useState('')
  const pickerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  
  const { isSignedIn, isLoaded } = useSafeUser()

  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]
  const filtered = LANGUAGES.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.native.toLowerCase().includes(search.toLowerCase())
  )

  const defaultLinks = links || [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Clinic Portal', href: '/clinic' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (showPicker) {
      setTimeout(() => searchRef.current?.focus(), 50)
    } else if (search !== '') {
      setSearch('') // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [showPicker, search])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) setShowPicker(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selectLang = (code: string) => {
    onLangChange?.(code)
    localStorage.setItem('ayura_lang', code)
    setShowPicker(false)
  }

  return (
    <>
      <style>{`
        .nav-root { 
          position: fixed; top: 0; left: 0; right: 0; z-index: 200; 
          height: 64px; display: flex; align-items: center; 
          justify-content: space-between; padding: 0 2rem; 
          border-bottom: 1px solid transparent;
          transition: background 0.2s;
        }
        .nav-root.scrolled { 
          background: var(--bg-main); 
          border-bottom: 1px solid var(--border-low); 
          height: 60px;
        }
        .nav-actions { display: flex; align-items: center; gap: 1rem; }
        
        .desktop-links { display: flex; gap: 1rem; align-items: center; }
        .nav-link { 
          color: var(--text-muted); 
          font-size: 0.88rem; 
          text-decoration: none; 
          transition: color 0.2s; 
          font-weight: 500;
        }
        .nav-link:hover { color: var(--text-main); }
        
        .lang-trigger { 
          background: var(--surface-low); 
          border: 1px solid var(--border-low); 
          color: var(--text-muted); 
          padding: 0.4rem 0.8rem; 
          border-radius: 8px; 
          font-size: 0.8rem; 
          cursor: pointer; 
          transition: all 0.2s; 
          display: flex; 
          align-items: center; 
          gap: 0.5rem; 
          font-family: inherit; 
        }
        .lang-trigger:hover { 
          border-color: var(--border-mid); 
          color: var(--text-main); 
        }
        
        /* Bottom Tab Bar for Mobile */
        .bottom-tab-bar { 
          display: none; position: fixed; bottom: 0; left: 0; right: 0; 
          z-index: 100; background: var(--bg-main); 
          border-top: 1px solid var(--border-low); 
          padding-bottom: env(safe-area-inset-bottom); 
          padding-top: 0.75rem; justify-content: space-around; align-items: center; 
        }
        .tab-item { 
          display: flex; flex-direction: column; align-items: center; 
          justify-content: center; color: var(--text-muted); 
          text-decoration: none; font-size: 0.7rem; gap: 0.3rem; 
          margin-bottom: 0.7rem; transition: color 0.2s; 
        }
        .tab-item:active { opacity: 0.8; }
        .tab-icon { font-size: 1.25rem; }
        .tab-label { font-weight: 500; }
        
        .picker-overlay { position: fixed; inset: 0; z-index: 9998; background: rgba(0,0,0,0.6); }
        .picker-box { 
          position: fixed; top: 72px; right: 1.5rem; 
          background: var(--surface-mid); 
          border: 1px solid var(--border-mid); 
          border-radius: 12px; width: 300px; overflow: hidden; 
          z-index: 9999; 
        }
        .picker-search { 
          width: 100%; background: var(--surface-low); 
          border: none; border-bottom: 1px solid var(--border-low); 
          color: var(--text-main); padding: 1rem; font-size: 0.9rem; 
          outline: none; font-family: inherit; 
        }
        .picker-search::placeholder { color: var(--text-muted); }
        .picker-list { max-height: 400px; overflow-y: auto; padding: 0.5rem; }
        .lang-item { 
          display: flex; align-items: center; justify-content: space-between; 
          padding: 0.75rem 1rem; cursor: pointer; transition: background 0.2s; 
          border-radius: 8px; margin-bottom: 0.1rem;
        }
        .lang-item:hover { background: var(--surface-low); }
        .lang-item.active { background: var(--surface-high); }
        @media(max-width:768px) { 
          .nav-root { padding: 0 1rem; } 
          .desktop-links { display: none; }
          .bottom-tab-bar { display: flex; }
        }
      `}</style>

      <nav className={`nav-root${scrolled ? ' scrolled' : ''}`}>
        <Logo size={36} showText={true} href="/" />

        <div className="nav-actions">
          {showLangPicker && (
            <button className="lang-trigger" onClick={() => setShowPicker(p => !p)}>
              <span style={{ fontSize: '0.8rem' }}>🌐</span>
              <span>{currentLang.native}</span>
              <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>▾</span>
            </button>
          )}
          
          <div className="desktop-links">
            {defaultLinks.map(link => (
              <Link key={link.href} href={link.href} className="nav-link">{link.label}</Link>
            ))}
          </div>
          
          <div style={{ marginLeft: '0.5rem', display: 'flex', alignItems: 'center', height: 32 }}>
            {isLoaded ? (
              isSignedIn ? (
                <SafeUserButton appearance={{ elements: { avatarBox: { width: 32, height: 32, borderRadius: '8px' } } }} />
              ) : (
                <SafeSignInButton mode="modal">
                  <button className="btn-primary" style={{ fontSize: '0.88rem', padding: '0.5rem 1rem' }}>Sign In</button>
                </SafeSignInButton>
              )
            ) : null}
          </div>
          </div>
      </nav>

      <nav className="bottom-tab-bar">
        {defaultLinks.map(link => {
          let icon = '❖'
          if (link.href.includes('dashboard') || link.label.includes('Pulse')) icon = '⚡'
          if (link.href.includes('pricing') || link.label.includes('Pricing')) icon = '💳'
          if (link.href.includes('clinic') || link.label.includes('Clinic')) icon = '🏥'
          if (link.href.includes('diet') || link.label.includes('Diet')) icon = '🌿'
          
          return (
            <Link key={link.href} href={link.href} className="tab-item" style={{ flexDirection: 'column' }}>
              <span className="tab-icon">{icon}</span>
              <span className="tab-label">{link.label.replace(' →', '')}</span>
            </Link>
          )
        })}
      </nav>

      {showPicker && (
        <>
          <div className="picker-overlay" onClick={() => setShowPicker(false)} />
          <div className="picker-box" ref={pickerRef}>
            <input
              ref={searchRef}
              className="picker-search"
              placeholder="Search language…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="picker-list">
              {filtered.length === 0 && (
                <div style={{ padding: '1rem', color: 'rgba(232,223,200,0.3)', fontSize: '0.8rem', textAlign: 'center' }}>
                  No languages found
                </div>
              )}
              {filtered.map(l => (
                <div
                  key={l.code}
                  className={`lang-item${l.code === lang ? ' active' : ''}`}
                  onClick={() => selectLang(l.code)}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--ios-text)' }}>{l.native}</span>
                    {l.native !== l.name && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--ios-muted)' }}>{l.name}</span>
                    )}
                  </div>
                  {l.code === lang && <span style={{ color: 'hsl(var(--sage-accent))', fontSize: '0.85rem' }}>✓</span>}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}

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
    { label: 'Vedic Pulse', href: '/dashboard' },
    { label: '💳 Pricing', href: '/pricing' },
    { label: 'For Clinics →', href: '/clinic' },
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
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-root.scrolled { 
          background: hsla(var(--sage-deep), 0.75); 
          backdrop-filter: blur(20px) saturate(180%); 
          -webkit-backdrop-filter: blur(20px) saturate(180%); 
          border-bottom: 1px solid hsla(var(--sage-accent), 0.08); 
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4); 
          height: 58px;
        }
        .nav-actions { display: flex; align-items: center; gap: 0.75rem; }
        
        .desktop-links { display: flex; gap: 0.5rem; align-items: center; }
        .nav-pill { 
          color: rgba(232, 223, 200, 0.75); 
          font-size: 0.82rem; 
          text-decoration: none; 
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); 
          border: 1px solid rgba(106, 191, 138, 0.1); 
          padding: 0.35rem 1rem; 
          border-radius: 980px; 
          white-space: nowrap; 
          background: rgba(106, 191, 138, 0.02); 
          font-weight: 500;
        }
        .nav-pill:hover { 
          color: var(--ios-text); 
          border-color: hsla(var(--sage-accent), 0.4); 
          background: hsla(var(--sage-accent), 0.08); 
          transform: translateY(-1px);
        }
        
        .lang-trigger { 
          background: rgba(106, 191, 138, 0.04); 
          border: 1px solid rgba(106, 191, 138, 0.15); 
          color: rgba(232, 223, 200, 0.8); 
          padding: 0.35rem 1rem; 
          border-radius: 980px; 
          font-size: 0.8rem; 
          cursor: pointer; 
          transition: all 0.25s; 
          display: flex; 
          align-items: center; 
          gap: 0.5rem; 
          white-space: nowrap; 
          font-family: inherit; 
        }
        .lang-trigger:hover { 
          border-color: hsla(var(--sage-accent), 0.4); 
          color: var(--ios-text); 
          background: hsla(var(--sage-accent), 0.08); 
        }
        
        /* Bottom Tab Bar for Mobile */
        .bottom-tab-bar { 
          display: none; position: fixed; bottom: 0; left: 0; right: 0; 
          z-index: 199; background: hsla(var(--sage-deep), 0.82); 
          backdrop-filter: blur(20px) saturate(180%); 
          -webkit-backdrop-filter: blur(20px) saturate(180%); 
          border-top: 1px solid hsla(var(--sage-accent), 0.1); 
          padding-bottom: env(safe-area-inset-bottom); 
          padding-top: 0.6rem; justify-content: space-around; align-items: center; 
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.4);
        }
        .tab-item { 
          display: flex; flexDirection: column; align-items: center; 
          justify-content: center; color: rgba(232, 223, 200, 0.45); 
          text-decoration: none; font-size: 0.68rem; gap: 0.25rem; 
          margin-bottom: 0.6rem; transition: all 0.2s; 
        }
        .tab-item:active { opacity: 0.7; transform: scale(0.95); }
        .tab-icon { font-size: 1.35rem; }
        .tab-label { font-weight: 500; }
        
        .picker-overlay { position: fixed; inset: 0; z-index: 9998; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); }
        .picker-box { 
          position: fixed; top: 72px; right: 1.5rem; 
          background: rgba(10, 26, 15, 0.98); 
          border: 1px solid rgba(106, 191, 138, 0.15); 
          border-radius: 20px; width: 300px; overflow: hidden; 
          box-shadow: 0 32px 80px rgba(0, 0, 0, 0.7); 
          backdrop-filter: blur(32px); z-index: 9999; 
          animation: pickerIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes pickerIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .picker-search { 
          width: 100%; background: rgba(255,255,255,0.03); 
          border: none; border-bottom: 1px solid rgba(106, 191, 138, 0.08); 
          color: #e8dfc8; padding: 1rem 1.25rem; font-size: 0.9rem; 
          outline: none; font-family: inherit; 
        }
        .picker-search::placeholder { color: rgba(232, 223, 200, 0.2); }
        .picker-list { max-height: 380px; overflow-y: auto; padding: 0.5rem; }
        .picker-list::-webkit-scrollbar { width: 4px; }
        .picker-list::-webkit-scrollbar-thumb { background: rgba(106, 191, 138, 0.15); border-radius: 2px; }
        .lang-item { 
          display: flex; align-items: center; justify-content: space-between; 
          padding: 0.75rem 1rem; cursor: pointer; transition: all 0.15s; 
          border-radius: 12px; margin-bottom: 0.2rem;
        }
        .lang-item:hover { background: rgba(106, 191, 138, 0.08); }
        .lang-item.active { background: rgba(106, 191, 138, 0.12); }
        @media(max-width:768px) { 
          .nav-root { padding: 0 1.25rem; height: 60px; } 
          .picker-box { right: 0.75rem; width: calc(100vw - 1.5rem); top: 64px; } 
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
              <Link key={link.href} href={link.href} className="nav-pill">{link.label}</Link>
            ))}
          </div>
          
          <div style={{ marginLeft: '0.5rem', display: 'flex', alignItems: 'center', height: 32 }}>
            {isLoaded ? (
              isSignedIn ? (
                <SafeUserButton appearance={{ elements: { avatarBox: { width: 32, height: 32 } } }} />
              ) : (
                <SafeSignInButton mode="modal">
                  <button className="nav-pill" style={{ background: 'hsl(var(--sage-accent))', color: 'hsl(var(--sage-deep))', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Sign In</button>
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

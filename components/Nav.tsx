'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
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
  
  const { isSignedIn, isLoaded } = useUser()

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
    if (showPicker) setTimeout(() => searchRef.current?.focus(), 50)
    else setSearch('')
  }, [showPicker])

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
        .nav-root { position: fixed; top: 0; left: 0; right: 0; z-index: 200; height: 60px; display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; transition: all 0.35s cubic-bezier(0.4,0,0.2,1); }
        .nav-root.scrolled { background: rgba(5,16,10,0.88); backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%); border-bottom: 1px solid rgba(106,191,138,0.1); box-shadow: 0 4px 32px rgba(0,0,0,0.5); }
        .nav-pill { color: rgba(232,223,200,0.7); font-size: 0.8rem; text-decoration: none; transition: all 0.2s; border: 1px solid rgba(106,191,138,0.15); padding: 0.3rem 0.85rem; border-radius: 980px; white-space: nowrap; background: rgba(106,191,138,0.03); }
        .nav-pill:hover { color: #e8dfc8; border-color: rgba(106,191,138,0.45); background: rgba(106,191,138,0.08); }
        .lang-trigger { background: rgba(106,191,138,0.05); border: 1px solid rgba(106,191,138,0.18); color: rgba(232,223,200,0.8); padding: 0.3rem 0.85rem; border-radius: 980px; font-size: 0.78rem; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.4rem; white-space: nowrap; font-family: inherit; }
        .lang-trigger:hover { border-color: rgba(106,191,138,0.45); color: #e8dfc8; background: rgba(106,191,138,0.1); }
        .picker-overlay { position: fixed; inset: 0; z-index: 300; }
        .picker-box { position: fixed; top: 68px; right: 1.5rem; background: rgba(6,18,10,0.98); border: 1px solid rgba(106,191,138,0.18); border-radius: 16px; width: 280px; overflow: hidden; box-shadow: 0 24px 64px rgba(0,0,0,0.8); backdrop-filter: blur(24px); }
        .picker-search { width: 100%; background: transparent; border: none; border-bottom: 1px solid rgba(106,191,138,0.08); color: #e8dfc8; padding: 0.75rem 1rem; font-size: 0.85rem; outline: none; font-family: inherit; }
        .picker-search::placeholder { color: rgba(232,223,200,0.25); }
        .picker-list { max-height: 300px; overflow-y: auto; }
        .picker-list::-webkit-scrollbar { width: 2px; }
        .picker-list::-webkit-scrollbar-thumb { background: rgba(106,191,138,0.2); }
        .lang-item { display: flex; align-items: center; justify-content: space-between; padding: 0.65rem 1rem; cursor: pointer; transition: background 0.12s; }
        .lang-item:hover { background: rgba(106,191,138,0.07); }
        .lang-item.active { background: rgba(106,191,138,0.1); }
        @media(max-width:600px) { .nav-root { padding: 0 1rem; } .picker-box { right: 0.5rem; width: calc(100vw - 1rem); } }
      `}</style>

      <nav className={`nav-root${scrolled ? ' scrolled' : ''}`}>
        <Logo size={36} showText={true} href="/" />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {showLangPicker && (
            <button className="lang-trigger" onClick={() => setShowPicker(p => !p)}>
              <span style={{ fontSize: '0.8rem' }}>🌐</span>
              <span>{currentLang.native}</span>
              <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>▾</span>
            </button>
          )}
          {defaultLinks.map(link => (
            <Link key={link.href} href={link.href} className="nav-pill">{link.label}</Link>
          ))}
          
          <div style={{ marginLeft: '0.5rem', display: 'flex', alignItems: 'center', height: 32 }}>
            {isLoaded ? (
              isSignedIn ? (
                <UserButton appearance={{ elements: { avatarBox: { width: 32, height: 32 } } }} />
              ) : (
                <SignInButton mode="modal">
                  <button className="nav-pill" style={{ background: '#6abf8a', color: '#05100a', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Sign In</button>
                </SignInButton>
              )
            ) : null}
          </div>
        </div>
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
                    <span style={{ fontSize: '0.85rem', color: '#e8dfc8' }}>{l.native}</span>
                    {l.native !== l.name && (
                      <span style={{ fontSize: '0.7rem', color: 'rgba(232,223,200,0.35)' }}>{l.name}</span>
                    )}
                  </div>
                  {l.code === lang && <span style={{ color: '#6abf8a', fontSize: '0.85rem' }}>✓</span>}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}

'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { SafeSignInButton, SafeUserButton, useSafeUser } from '../lib/clerk-client'
import { useTranslation } from '@/lib/i18n/LanguageContext'
import Logo from './Logo'
import { 
  LayoutDashboard, 
  CreditCard, 
  Hospital, 
  Leaf, 
  Globe, 
  Search, 
  Check,
  ChevronDown
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
  { code: 'pt', name: 'Portuguese', native: 'Portुपेश' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
]

interface NavProps {
  showLangPicker?: boolean
  links?: Array<{ label: string; href: string; icon?: React.ComponentType<{ size?: number; className?: string }> }>
}

export default function Nav({ showLangPicker = true, links }: NavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [search, setSearch] = useState('')
  const pickerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  
  const { language: lang, setLanguage, t } = useTranslation()
  const { isSignedIn, isLoaded } = useSafeUser()

  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]
  const filtered = LANGUAGES.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.native.toLowerCase().includes(search.toLowerCase())
  )

  const defaultLinks = links || [
    { label: t('nav_dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { label: t('nav_diet'), href: '/diet', icon: Leaf },
    { label: t('nav_clinic'), href: '/clinic', icon: Hospital },
    { label: t('nav_pricing'), href: '/pricing', icon: CreditCard },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (showPicker) {
      setTimeout(() => searchRef.current?.focus(), 50)
    } else if (search !== '') {
      setSearch('') 
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
    setLanguage(code as 'en' | 'es' | 'hi')
    setShowPicker(false)
  }

  return (
    <>
      <style>{`
        .nav-root { 
          position: fixed; top: 1rem; left: 1rem; right: 1rem; z-index: 200; 
          height: 64px; display: flex; align-items: center; 
          justify-content: space-between; padding: 0.6rem 1.25rem; 
          border: 1px solid var(--border-low);
          border-radius: 20px;
          background: hsla(154, 15%, 5%, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: all 0.3s var(--ease-out);
          max-width: 1200px;
          margin: 0 auto;
        }
        .nav-root.scrolled { 
          background: hsla(154, 15%, 5%, 0.9); 
          border-color: var(--border-mid);
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }
        .nav-actions { display: flex; align-items: center; gap: 1.25rem; }
        
        .desktop-links { display: flex; gap: 1.5rem; align-items: center; }
        .nav-link { 
          color: var(--text-muted); 
          font-size: 0.85rem; 
          text-decoration: none; 
          transition: color 0.2s; 
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .nav-link:hover { color: var(--text-main); }
        
        .lang-trigger { 
          background: var(--surface-low); 
          border: 1px solid var(--border-low); 
          color: var(--text-muted); 
          padding: 0.5rem 0.9rem; 
          border-radius: 9px; 
          font-size: 0.85rem; 
          cursor: pointer; 
          transition: all 0.2s; 
          display: flex; 
          align-items: center; 
          gap: 0.6rem; 
          font-family: inherit; 
        }
        .lang-trigger:hover { 
          border-color: var(--border-high); 
          color: var(--text-main); 
          background: var(--surface-mid);
        }
        
        .bottom-tab-bar { 
          display: none; position: fixed; bottom: 0; left: 0; right: 0; 
          z-index: 100; background: hsla(var(--bg-main-hsl), 0.9); 
          backdrop-filter: blur(16px);
          border-top: 1px solid var(--border-low); 
          padding-bottom: calc(env(safe-area-inset-bottom, 20px) + 0.5rem); 
          padding-top: 0.85rem; justify-content: space-around; align-items: center; 
        }
        .tab-item { 
          display: flex; flex-direction: column; align-items: center; 
          justify-content: center; color: var(--text-muted); 
          text-decoration: none; font-size: 0.75rem; gap: 0.4rem; 
          transition: all 0.2s; 
        }
        .tab-item:active { transform: scale(0.92); }
        .tab-icon { opacity: 0.7; }
        .tab-label { font-weight: 500; opacity: 0.8; }
        
        .picker-overlay { position: fixed; inset: 0; z-index: 9998; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); }
        .picker-box { 
          position: fixed; top: 72px; right: 2rem; 
          background: var(--surface-high); 
          border: 1px solid var(--border-high); 
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          border-radius: 14px; width: 320px; overflow: hidden; 
          z-index: 9999; 
        }
        .picker-search-container { position: relative; padding: 1rem; border-bottom: 1px solid var(--border-low); }
        .picker-search { 
          width: 100%; background: var(--surface-mid); 
          border: 1px solid var(--border-low); 
          border-radius: 8px;
          color: var(--text-main); padding: 0.6rem 1rem 0.6rem 2.5rem; font-size: 0.9rem; 
          outline: none; font-family: inherit; 
        }
        .search-icon-pos { position: absolute; left: 1.75rem; top: 50%; transform: translateY(-50%); opacity: 0.4; }
        .picker-list { max-height: 480px; overflow-y: auto; padding: 0.75rem; }
        .lang-item { 
          display: flex; align-items: center; justify-content: space-between; 
          padding: 0.8rem 1rem; cursor: pointer; transition: all 0.2s; 
          border-radius: 10px; margin-bottom: 0.25rem;
        }
        .lang-item:hover { background: hsla(0,0%,100%,0.04); }
        .lang-item.active { background: hsla(144, 18%, 60%, 0.1); border: 1px solid var(--border-mid); }
        
        @media(max-width:768px) { 
          .nav-root { padding: 0 1.25rem; } 
          .desktop-links { display: none; }
          .bottom-tab-bar { display: flex; }
        }
      `}</style>

      <nav className={`nav-root${scrolled ? ' scrolled' : ''}`}>
        <Logo size={36} showText={true} href="/" />

        <div className="nav-actions">
          {showLangPicker && (
            <button className="lang-trigger" onClick={() => setShowPicker(p => !p)}>
              <Globe size={16} />
              <span>{currentLang.native}</span>
              <ChevronDown size={14} style={{ opacity: 0.5 }} />
            </button>
          )}
          
          <div className="desktop-links">
            {defaultLinks.map(link => (
              <Link key={link.href} href={link.href} className="nav-link">
                {link.label}
              </Link>
            ))}
          </div>
          
          <div style={{ marginLeft: '0.5rem', display: 'flex', alignItems: 'center' }}>
            {isLoaded ? (
              isSignedIn ? (
                <SafeUserButton appearance={{ elements: { avatarBox: { width: 34, height: 34, borderRadius: '10px' } } }} />
              ) : (
                <SafeSignInButton mode="modal">
                  <button className="btn-primary" style={{ fontSize: '0.9rem', padding: '0.6rem 1.25rem' }}>{t('sign_in')}</button>
                </SafeSignInButton>
              )
            ) : null}
          </div>
        </div>
      </nav>

      <nav className="bottom-tab-bar">
        {defaultLinks.map(link => {
          const Icon = link.icon || Globe
          return (
            <Link key={link.href} href={link.href} className="tab-item">
              <Icon size={22} className="tab-icon" />
              <span className="tab-label">{link.label.split(' ')[0]}</span>
            </Link>
          )
        })}
      </nav>

      <AnimatePresence>
        {showPicker && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="picker-overlay" 
              onClick={() => setShowPicker(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="picker-box" 
              ref={pickerRef}
            >
              <div className="picker-search-container">
                <Search size={16} className="search-icon-pos" />
                <input
                  ref={searchRef}
                  className="picker-search"
                  placeholder="Search clinical language…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="picker-list">
                {filtered.length === 0 && (
                  <div style={{ padding: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
                    No languages found
                  </div>
                )}
                {filtered.map(l => (
                  <motion.div
                    key={l.code}
                    whileTap={{ scale: 0.98 }}
                    className={`lang-item${l.code === lang ? ' active' : ''}`}
                    onClick={() => selectLang(l.code)}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>{l.native}</span>
                      {l.native !== l.name && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{l.name}</span>
                      )}
                    </div>
                    {l.code === lang && <Check size={16} style={{ color: 'var(--accent-main)' }} />}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

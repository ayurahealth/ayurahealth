'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations, SupportedLang } from './translations'

interface LanguageContextType {
  language: SupportedLang
  setLanguage: (lang: SupportedLang) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLang>('en')

  useEffect(() => {
    const stored = localStorage.getItem('ayura-lang') as SupportedLang
    if (stored && translations[stored]) {
      setLanguageState(stored)
    } else {
      const browserLang = navigator.language.split('-')[0] as SupportedLang
      if (translations[browserLang]) {
        setLanguageState(browserLang)
      } else {
        setLanguageState('en')
      }
    }
  }, [])

  const setLanguage = (lang: SupportedLang) => {
    if (translations[lang]) {
      setLanguageState(lang)
      localStorage.setItem('ayura-lang', lang)
    }
  }

  const t = (key: string): string => {
    const langDict = translations[language] || translations['en']
    return langDict[key] || translations['en'][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider')
  }
  return context
}

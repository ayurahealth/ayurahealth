'use client'
import { useState, useEffect } from 'react'

interface VoiceOutputProps {
  text: string
  language: string
}

export default function VoiceOutput({ text, language }: VoiceOutputProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSupported] = useState(
    typeof window !== 'undefined' && 'speechSynthesis' in window
  )

  useEffect(() => {
    // Component mounted, voice support is set
  }, [])

  const speak = async () => {
    if (!text || !isSupported) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = mapLanguageToCode(language)
    utterance.rate = 0.95
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => setIsPlaying(true)
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)

    window.speechSynthesis.speak(utterance)
  }

  const stop = () => {
    if (isSupported) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
    }
  }

  if (!isSupported) return null

  return (
    <button
      onClick={isPlaying ? stop : speak}
      style={{
        background: isPlaying ? '#e8835a' : '#6abf8a',
        color: '#fff',
        border: 'none',
        borderRadius: '50%',
        width: 40,
        height: 40,
        cursor: 'pointer',
        fontSize: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s',
        boxShadow: isPlaying ? '0 0 10px rgba(232, 131, 90, 0.5)' : 'none',
      }}
      title={isPlaying ? 'Stop' : 'Listen'}
    >
      {isPlaying ? '⏹️' : '🔊'}
    </button>
  )
}

function mapLanguageToCode(lang: string): string {
  const map: Record<string, string> = {
    en: 'en-US',
    hi: 'hi-IN',
    ja: 'ja-JP',
    zh: 'zh-CN',
    ko: 'ko-KR',
    ar: 'ar-SA',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    pt: 'pt-BR',
    ru: 'ru-RU',
    ta: 'ta-IN',
    te: 'te-IN',
    bn: 'bn-IN',
    mr: 'mr-IN',
    gu: 'gu-IN',
    pa: 'pa-IN',
    ur: 'ur-PK',
    fa: 'fa-IR',
    tr: 'tr-TR',
    id: 'id-ID',
    ms: 'ms-MY',
    th: 'th-TH',
    vi: 'vi-VN',
    nl: 'nl-NL',
    it: 'it-IT',
    pl: 'pl-PL',
    sv: 'sv-SE',
    uk: 'uk-UA',
    he: 'he-IL',
    el: 'el-GR',
    ro: 'ro-RO',
    hu: 'hu-HU',
    cs: 'cs-CZ',
    sw: 'sw-KE',
    ne: 'ne-NP',
    si: 'si-LK',
    my: 'my-MM',
    km: 'km-KH',
    mn: 'mn-MN',
    ka: 'ka-GE',
    am: 'am-ET',
    af: 'af-ZA',
    da: 'da-DK',
  }
  return map[lang] || 'en-US'
}

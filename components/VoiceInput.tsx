'use client'
import { useState, useRef, useEffect } from 'react'

interface VoiceInputProps {
  onTranscript: (text: string, language: string) => void
  language: string
}

export default function VoiceInput({ onTranscript, language }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported] = useState(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as unknown as { SpeechRecognition?: typeof window.SpeechRecognition; webkitSpeechRecognition?: typeof window.SpeechRecognition }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition
      return !!SpeechRecognition
    }
    return false
  })
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && isSupported) {
      const SpeechRecognition = (window as unknown as { SpeechRecognition?: typeof window.SpeechRecognition; webkitSpeechRecognition?: typeof window.SpeechRecognition }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = mapLanguageToCode(language)

        recognitionRef.current.onstart = () => setIsRecording(true)
        recognitionRef.current.onend = () => {
          setIsRecording(false)
          setTranscript('')
        }
        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let interim = ''
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const text = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              onTranscript(text, language)
            } else {
              interim += text
            }
          }
          setTranscript(interim)
        }
        recognitionRef.current.onerror = () => {
          // Error silently handled
        }
      }
    }
  }, [language, onTranscript])

  const toggleRecording = () => {
    if (recognitionRef.current) {
      if (isRecording) {
        recognitionRef.current.stop()
      } else {
        recognitionRef.current.start()
      }
    }
  }

  if (!isSupported) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
      <button
        onClick={toggleRecording}
        style={{
          background: isRecording ? '#e8835a' : '#6abf8a',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: 48,
          height: 48,
          cursor: 'pointer',
          fontSize: '1.2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s',
          boxShadow: isRecording ? '0 0 12px rgba(232, 131, 90, 0.5)' : 'none',
        }}
        title={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording ? '🎙️' : '🎤'}
      </button>
      {transcript && (
        <div style={{
          fontSize: '0.75rem',
          color: '#aaa',
          maxWidth: '100px',
          textAlign: 'center',
          fontStyle: 'italic',
        }}>
          {transcript}
        </div>
      )}
    </div>
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

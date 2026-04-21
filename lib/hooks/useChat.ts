'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { getApiUrl } from '@/lib/constants'
import type { ChatAttachment, ChatMessage as Message, ChatOptions, ChatSource, AgentTrace } from '@/lib/chat/types'
import { log } from '@/lib/logger'
import { useAudioRecorder } from '@/lib/hooks/useAudioRecorder'

interface ChatModelTrace {
  modelUsed?: string
  providerUsed?: string
  quality?: Message['quality']
  policy?: Message['policy']
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const { isRecording, startRecording, stopRecording, audioBlob, analyser } = useAudioRecorder()
  const isListening = isRecording
  
  const setIsListening = useCallback((listening: boolean) => {
    if (listening) {
      startRecording().catch(err => {
        log.error('STT_START_FAILURE', { error: String(err) })
      })
    } else {
      stopRecording()
    }
  }, [startRecording, stopRecording])
  
  const inputRef = useRef(input)

  useEffect(() => {
    inputRef.current = input
  }, [input])

  // Whisper Transcription Bridge
  useEffect(() => {
    if (audioBlob) {
      const transcribe = async () => {
        setLoading(true)
        try {
          const formData = new FormData()
          formData.append('file', audioBlob, 'recording.webm')
          
          const res = await fetch(getApiUrl('/api/audio/transcribe'), {
            method: 'POST',
            body: formData
          })
          
          if (!res.ok) throw new Error('Transcription failed')
          
          const { text } = await res.json()
          if (text) {
            const sep = inputRef.current && !inputRef.current.endsWith(' ') ? ' ' : ''
            setInput(prev => prev + sep + text)
          }
        } catch (err) {
          log.error('WHISPER_TRANSCRIBE_FAILURE', { error: String(err) })
        } finally {
          setLoading(false)
        }
      }
      transcribe()
    }
  }, [audioBlob])

  const clearHistory = useCallback(() => {
    setMessages([])
    setStreaming('')
  }, [])

  const sendMessage = useCallback(async (options: ChatOptions, overrideText?: string) => {
    const content = overrideText || input.trim()
    if (!content || loading) return

    setInput('')
    const newMessages: Message[] = [...messages, { role: 'user', content }]
    setMessages(newMessages)
    setLoading(true)
    setStreaming('')

    try {
      const res = await fetch(getApiUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          systems: options.selectedSystems,
          incognito: options.incognito,
          dosha: options.dosha,
          modelPreference: options.modelPreference,
          deepThink: options.responseMode === 'deep' || options.responseMode === 'research',
          webSearch: options.responseMode === 'research' ? true : options.webSearchEnabled,
          lang: options.lang,
          attachments: options.attachments,
          vedicContext: options.vedicEnabled ? (options.vedicContext || undefined) : undefined,
          cavemanMode: options.cavemanMode,
        }),
      })

      if (!res.ok) {
        let apiError = 'API error'
        try {
          const errBody = await res.json()
          apiError = errBody?.error || errBody?.message || apiError
        } catch {}
        if (res.status === 402) {
          throw new Error('PAYWALL_LIMIT')
        }
        throw new Error(apiError)
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let full = ''
      let currentSources: ChatSource[] = []
      let currentAgentTrace: AgentTrace[] = []
      let currentModelTrace: ChatModelTrace = {}
      let buffer = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''
          
          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed || !trimmed.startsWith('data: ')) continue
            
            try { 
              const d = JSON.parse(trimmed.slice(6))
              if (d.sources) { 
                currentSources = d.sources 
              } else if (d.agentTrace) {
                currentAgentTrace = d.agentTrace
              } else if (d.modelUsed || d.providerUsed) {
                currentModelTrace = { modelUsed: d.modelUsed, providerUsed: d.providerUsed, quality: d.quality, policy: d.policy }
              } else if (d.content) { 
                full += d.content
                setStreaming(full) 
              } 
            } catch (err) {
              console.warn('SSE_PARSE_ERROR:', err)
            }
          }
        }
      }

      const finalAssistantMsg: Message = {
        role: 'assistant',
        content: full,
        sources: currentSources,
        agentTrace: currentAgentTrace,
        ...currentModelTrace,
      }

      setMessages(prev => [...prev, finalAssistantMsg])
      setStreaming('')
      
      // Save metrics
      if (currentModelTrace.quality) {
        fetch(getApiUrl('/api/quality-event'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ts: Date.now(),
            formatScore: currentModelTrace.quality.formatScore,
            completeness: currentModelTrace.quality.completeness,
            latencyMs: currentModelTrace.quality.latencyMs,
            repaired: currentModelTrace.quality.repaired,
            modelUsed: currentModelTrace.modelUsed || '',
            providerUsed: currentModelTrace.providerUsed || '',
            responseMode: options.responseMode,
            policyApplied: Boolean(currentModelTrace.policy?.applied),
          }),
        }).catch(() => {})
      }

      return finalAssistantMsg
    } catch (err: unknown) {
      log.error('CHAT_FETCH_FAILURE', { error: String(err) })
      
      if (err instanceof Error && err.message === 'PAYWALL_LIMIT') {
        throw err
      }

      const displayError = 'Connection interrupted. Please try again.'
      setMessages(prev => [...prev, { role: 'assistant', content: displayError }])
      setStreaming('')
      throw err
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages])

  return {
    messages,
    setMessages,
    input,
    setInput,
    loading,
    streaming,
    sendMessage,
    clearHistory,
    isSpeaking,
    setIsSpeaking,
    isListening,
    setIsListening,
    analyser
  }
}

export type { Message, ChatSource, AgentTrace, ChatOptions, ChatAttachment }

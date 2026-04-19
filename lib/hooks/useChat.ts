'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { getApiUrl } from '@/lib/constants'
import { log } from '@/lib/logger'

export interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: ChatSource[]
  agentTrace?: AgentTrace[]
  modelUsed?: string
  providerUsed?: string
  quality?: {
    formatScore: number
    completeness: number
    latencyMs: number
    repaired: boolean
  }
  policy?: {
    applied: boolean
    reasons: string[]
    webSearchSuppressed: boolean
    forceDeepThink: boolean
  }
}

export interface ChatSource {
  title: string
  content: string
  tradition: string
  source: string
}

export interface AgentTrace { 
  id: 'planner' | 'researcher' | 'synthesizer'
  label: string
  summary: string 
}

export interface ChatOptions {
  selectedSystems: string[]
  dosha: string | null
  modelPreference: string
  responseMode: 'fast' | 'deep' | 'research'
  webSearchEnabled: boolean
  lang: string
  attachments: any[]
  vedicEnabled: boolean
  vedicContext: string | null
  cavemanMode: boolean
  incognito: boolean
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  
  const recognitionRef = useRef<any>(null)

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
      let currentModelTrace: any = {}
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
            } catch (e) {
              console.warn('SSE_PARSE_ERROR:', e)
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
    } catch (err: any) {
      log.error('CHAT_FETCH_FAILURE', { error: String(err) })
      
      if (err.message === 'PAYWALL_LIMIT') {
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
    recognitionRef
  }
}

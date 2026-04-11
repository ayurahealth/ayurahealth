'use client'

import type { ChangeEvent, KeyboardEvent, RefObject } from 'react'
import Image from 'next/image'

interface Attachment {
  id: string
  type: 'image' | 'pdf' | 'link'
  name: string
  content: string
  preview?: string
  mimeType?: string
  url?: string
  size?: string
}

interface ChatComposerProps {
  attachments: Attachment[]
  attachLoading: boolean
  showLinkInput: boolean
  linkInput: string
  voiceSupported: boolean
  isListening: boolean
  input: string
  loading: boolean
  placeholder: string
  fileInputRef: RefObject<HTMLInputElement | null>
  linkInputRef: RefObject<HTMLInputElement | null>
  textareaRef: RefObject<HTMLTextAreaElement | null>
  onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void
  onRemoveAttachment: (id: string) => void
  onToggleLinkInput: () => void
  onLinkInputChange: (v: string) => void
  onAddLink: () => void
  onCancelLinkInput: () => void
  onStartListening: () => void
  onInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  onInputKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void
  onSendMessage: () => void
}

export default function ChatComposer({
  attachments,
  attachLoading,
  showLinkInput,
  linkInput,
  voiceSupported,
  isListening,
  input,
  loading,
  placeholder,
  fileInputRef,
  linkInputRef,
  textareaRef,
  onFileSelect,
  onRemoveAttachment,
  onToggleLinkInput,
  onLinkInputChange,
  onAddLink,
  onCancelLinkInput,
  onStartListening,
  onInputChange,
  onInputKeyDown,
  onSendMessage,
}: ChatComposerProps) {
  const attachmentIconMap = { image: '🖼️', pdf: '📄', link: '🔗' }
  const attachmentColorMap = { image: '#7aafd4', pdf: '#e8835a', link: '#c9a84c' }
  const isValidUrl = (str: string): boolean => {
    try {
      const u = new URL(str)
      return u.protocol === 'http:' || u.protocol === 'https:'
    } catch {
      return false
    }
  }

  return (
    <div className="premium-glass chat-input-shell" style={{ 
      margin: '0.75rem', 
      borderRadius: 'var(--ios-radius-xl)', 
      padding: '1.25rem', 
      paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))',
      boxShadow: '0 -8px 32px -12px rgba(0,0,0,0.4), var(--ios-shadow-xl)' 
    }}>
      {attachments.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.6rem', padding: '0.5rem 0' }}>
          {attachments.map((att) => (
            <div key={att.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.05)', border: `1px solid ${attachmentColorMap[att.type]}30`, borderRadius: 10, padding: '0.3rem 0.5rem', maxWidth: 200 }}>
              {att.type === 'image' && att.preview ? (
                <Image src={att.preview} alt="" width={28} height={28} style={{ borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} unoptimized />
              ) : (
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>{attachmentIconMap[att.type]}</span>
              )}
              <div style={{ minWidth: 0 }}>
                <div style={{ color: `${attachmentColorMap[att.type]}`, fontSize: '0.7rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>{att.name}</div>
                {att.size && <div style={{ color: 'rgba(200,200,200,0.35)', fontSize: '0.6rem' }}>{att.size}</div>}
              </div>
              <button onClick={() => onRemoveAttachment(att.id)} style={{ background: 'none', border: 'none', color: 'rgba(200,200,200,0.3)', fontSize: '0.9rem', cursor: 'pointer', flexShrink: 0, lineHeight: 1, padding: '0 2px' }}>×</button>
            </div>
          ))}
          {attachLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '0.3rem 0.75rem', color: 'rgba(200,200,200,0.4)', fontSize: '0.75rem' }}>
              ⏳ Processing...
            </div>
          )}
        </div>
      )}

      {showLinkInput && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
          <input
            ref={linkInputRef}
            type="url"
            value={linkInput}
            onChange={(e) => onLinkInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onAddLink()
              if (e.key === 'Escape') onCancelLinkInput()
            }}
            placeholder="Paste a health article URL..."
            style={{ flex: 1, padding: '0.6rem 0.9rem', borderRadius: 12, border: '1px solid rgba(201,168,76,0.3)', background: 'rgba(255,255,255,0.04)', color: '#e8dfc8', fontSize: '0.85rem', outline: 'none', fontFamily: '"DM Sans", system-ui, sans-serif' }}
            autoFocus
          />
          <button onClick={onAddLink} disabled={!isValidUrl(linkInput)} style={{ padding: '0.6rem 1rem', background: isValidUrl(linkInput) ? 'rgba(201,168,76,0.15)' : 'transparent', border: `1px solid ${isValidUrl(linkInput) ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, color: isValidUrl(linkInput) ? '#c9a84c' : 'rgba(200,200,200,0.3)', fontSize: '0.85rem', cursor: isValidUrl(linkInput) ? 'pointer' : 'not-allowed', fontWeight: 600, whiteSpace: 'nowrap' }}>Add →</button>
          <button onClick={onCancelLinkInput} style={{ padding: '0.6rem 0.75rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: 'rgba(200,200,200,0.35)', fontSize: '0.85rem', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-end', maxWidth: 920, margin: '0 auto' }}>
        <input ref={fileInputRef} type="file" accept="image/*,.pdf" multiple onChange={onFileSelect} style={{ display: 'none' }} />
        <button onClick={() => fileInputRef.current?.click()} disabled={attachments.length >= 4} title="Attach image or PDF" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: attachments.length > 0 ? 'rgba(122,175,212,0.12)' : 'rgba(106,191,138,0.06)', border: `1px solid ${attachments.length > 0 ? 'rgba(122,175,212,0.4)' : 'rgba(106,191,138,0.15)'}`, color: attachments.length > 0 ? '#7aafd4' : 'rgba(200,200,200,0.4)', cursor: attachments.length >= 4 ? 'not-allowed' : 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
          📎
        </button>
        <button onClick={onToggleLinkInput} title="Add a link" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: showLinkInput ? 'rgba(201,168,76,0.12)' : 'rgba(106,191,138,0.06)', border: `1px solid ${showLinkInput ? 'rgba(201,168,76,0.4)' : 'rgba(106,191,138,0.15)'}`, color: showLinkInput ? '#c9a84c' : 'rgba(200,200,200,0.4)', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
          🔗
        </button>
        {voiceSupported && (
          <button onClick={onStartListening} style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: isListening ? 'rgba(232,131,90,0.2)' : 'rgba(106,191,138,0.06)', border: `1px solid ${isListening ? 'rgba(232,131,90,0.5)' : 'rgba(106,191,138,0.15)'}`, color: isListening ? '#e8835a' : 'rgba(200,200,200,0.4)', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isListening ? '⏸' : '🎤'}
          </button>
        )}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={onInputChange}
          onKeyDown={onInputKeyDown}
          placeholder={placeholder}
          rows={1}
          style={{ 
            flex: 1, 
            padding: '0.85rem 1.15rem', 
            borderRadius: 24, 
            border: '1px solid hsla(var(--sage-accent), 0.2)', 
            background: 'hsla(0, 0%, 100%, 0.04)', 
            color: 'hsl(var(--gold-pale))', 
            fontSize: '0.92rem', 
            resize: 'none', 
            outline: 'none', 
            lineHeight: 1.5, 
            maxHeight: 160, 
            overflowY: 'auto', 
            fontFamily: 'var(--font-dm-sans), sans-serif',
            transition: 'border-color 0.3s var(--ios-ease-standard)'
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'hsla(var(--sage-accent), 0.5)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'hsla(var(--sage-accent), 0.2)')}
        />
        <button 
          onClick={onSendMessage} 
          disabled={loading || (!input.trim() && attachments.length === 0)} 
          className="send-button-premium"
          style={{ 
            width: 48, 
            height: 48, 
            borderRadius: '50%', 
            flexShrink: 0, 
            background: loading || (!input.trim() && attachments.length === 0) 
              ? 'hsla(0, 0%, 100%, 0.06)' 
              : 'linear-gradient(135deg, hsl(var(--sage-deep)), hsl(var(--sage-accent)))', 
            border: 'none', 
            color: '#fff', 
            cursor: loading || (!input.trim() && attachments.length === 0) ? 'not-allowed' : 'pointer', 
            fontSize: '1.25rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: loading || (!input.trim() && attachments.length === 0) ? 'none' : '0 8px 20px -6px hsla(var(--sage-accent), 0.4)',
            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
          onMouseEnter={(e) => { if(!loading) e.currentTarget.style.transform = 'scale(1.1) rotate(-5deg)' }}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {loading ? '⏳' : '↑'}
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.35rem' }}>
        <span style={{ color: 'rgba(200,200,200,0.18)', fontSize: '0.6rem' }}>📎 reports & photos</span>
        <span style={{ color: 'rgba(200,200,200,0.18)', fontSize: '0.6rem' }}>🔗 articles & links</span>
        <span style={{ color: 'rgba(200,200,200,0.18)', fontSize: '0.6rem' }}>🎤 voice</span>
      </div>
    </div>
  )
}

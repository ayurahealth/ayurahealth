'use client'

import type { ChangeEvent, KeyboardEvent, RefObject } from 'react'
import Image from 'next/image'
import { 
  Paperclip, 
  Link as LinkIcon, 
  Mic, 
  ArrowRight, 
  Square,
  FileText,
  Loader2,
  X,
  Zap
} from 'lucide-react'

/* ─── Attachment Interface ────────────────────────────────────────── */
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
  
  const attachmentColorMap = { 
    image: 'var(--accent-main)',
    pdf: 'var(--accent-secondary)',
    link: 'var(--text-main)' 
  }

  const isValidUrl = (str: string): boolean => {
    try {
      const u = new URL(str)
      return u.protocol === 'http:' || u.protocol === 'https:'
    } catch {
      return false
    }
  }

  return (
    <div 
      className="composer-root" 
      style={{ 
        margin: '0 1.5rem 1.5rem', 
        position: 'relative',
        zIndex: 50
      }}
    >
      <div 
        className="glass-surface" 
        style={{ 
          maxWidth: 840,
          margin: '0 auto',
          borderRadius: '26px', 
          padding: '1rem', 
          background: 'var(--surface-low)',
          border: '1px solid var(--border-high)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          transition: 'border-color 0.3s var(--ease-out)',
        }}
      >
        {/* ─── Active Attachments ─── */}
        {attachments.length > 0 && (
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.75rem', padding: '0 0.5rem' }}>
            {attachments.map((att) => (
              <div 
                key={att.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  background: 'var(--bg-main)', 
                  borderRadius: '12px', 
                  padding: '0.4rem 0.6rem', 
                  border: `1px solid var(--border-low)`
                }}
              >
                {att.type === 'image' && att.preview ? (
                  <Image src={att.preview} alt="" width={20} height={20} style={{ borderRadius: 4, objectFit: 'cover' }} unoptimized />
                ) : (
                  <span style={{ color: attachmentColorMap[att.type] }}>
                    {att.type === 'pdf' ? <FileText size={14} /> : <LinkIcon size={14} />}
                  </span>
                )}
                <div style={{ color: 'var(--text-main)', fontSize: '0.75rem', fontWeight: 500, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{att.name}</div>
                <button 
                  onClick={() => onRemoveAttachment(att.id)} 
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 2, display: 'flex' }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {attachLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)', background: 'var(--bg-main)', padding: '0.4rem 0.8rem', borderRadius: '12px' }}>
                <Loader2 size={12} className="animate-spin" />
                Processing...
              </div>
            )}
          </div>
        )}

        {/* ─── Link Input Layer ─── */}
        {showLinkInput && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', padding: '0 0.5rem' }}>
            <input
              ref={linkInputRef}
              type="url"
              value={linkInput}
              onChange={(e) => onLinkInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onAddLink()
                if (e.key === 'Escape') onCancelLinkInput()
              }}
              placeholder="Source URL..."
              style={{ 
                flex: 1, 
                padding: '0.6rem 1rem', 
                borderRadius: 12, 
                background: 'var(--bg-main)', 
                color: 'var(--text-main)', 
                fontSize: '0.85rem', 
                outline: 'none',
                border: '1px solid var(--accent-main)'
              }}
              autoFocus
            />
            <button 
              onClick={onAddLink} 
              disabled={!isValidUrl(linkInput)} 
              className="btn-primary"
              style={{ padding: '0 1rem', borderRadius: 10, fontSize: '0.8rem', height: 36, opacity: isValidUrl(linkInput) ? 1 : 0.5 }}
            >
              Trace
            </button>
          </div>
        )}

        {/* ─── Main Input Area ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={onInputChange}
            onKeyDown={onInputKeyDown}
            placeholder={placeholder}
            rows={1}
            style={{ 
              width: '100%', 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-main)', 
              padding: '0.5rem 0.75rem', 
              resize: 'none', 
              fontSize: '1.15rem', 
              outline: 'none', 
              lineHeight: 1.5, 
              maxHeight: 200, 
              overflowY: 'auto', 
              fontFamily: 'inherit'
            }}
          />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.25rem' }}>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <input ref={fileInputRef} type="file" accept="image/*,.pdf" multiple onChange={onFileSelect} style={{ display: 'none' }} />
              <button 
                onClick={() => fileInputRef.current?.click()} 
                style={{ 
                  width: 36, height: 36, borderRadius: '10px', 
                  background: 'transparent', color: 'var(--text-muted)', border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                }}
              >
                <Paperclip size={18} />
              </button>
              
              <button 
                onClick={onToggleLinkInput} 
                className={showLinkInput ? 'active' : ''}
                style={{ 
                  width: 36, height: 36, borderRadius: '10px', 
                  background: 'transparent', color: showLinkInput ? 'var(--accent-main)' : 'var(--text-muted)', border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                }}
              >
                <LinkIcon size={18} />
              </button>

              {voiceSupported && (
                <button 
                  onClick={onStartListening} 
                  style={{ 
                    width: 36, height: 36, borderRadius: '10px', 
                    background: 'transparent', color: isListening ? 'var(--accent-secondary)' : 'var(--text-muted)', border: 'none',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                  }}
                >
                  {isListening ? <Square size={16} fill="currentColor" /> : <Mic size={18} />}
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', fontWeight: 600, color: 'var(--accent-main)', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.6 }}>
                <Zap size={10} fill="currentColor" /> Intelligence Active
              </div>
              <button 
                onClick={onSendMessage} 
                disabled={loading || (!input.trim() && attachments.length === 0)} 
                className="btn-primary"
                style={{ 
                  width: 40, height: 40, borderRadius: '12px', padding: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: loading || (!input.trim() && attachments.length === 0) ? 0.3 : 1,
                  boxShadow: !input.trim() ? 'none' : '0 10px 20px hsla(144, 20%, 60%, 0.1)'
                }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={20} strokeWidth={2.5} />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '0.75rem', color: 'var(--text-muted)', fontSize: '0.7rem', opacity: 0.3, letterSpacing: '0.02em' }}>
        Ayura Intelligence Lab v1.1.0 · Neural Search Enabled
      </div>
    </div>
  )
}

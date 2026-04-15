'use client'

import type { ChangeEvent, KeyboardEvent, RefObject } from 'react'
import Image from 'next/image'
import { 
  Paperclip, 
  Link as LinkIcon, 
  Mic, 
  Send, 
  Square,
  FileText,
  Loader2,
  X
} from 'lucide-react'

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
      className="glass-surface" 
      style={{ 
        margin: '1.5rem', 
        borderRadius: '24px', 
        padding: '1.5rem', 
        paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
        background: 'var(--surface-low)',
        border: '1px solid var(--border-mid)'
      }}
    >
      {attachments.length > 0 && (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {attachments.map((att) => (
            <div 
              key={att.id} 
              className="flat-card"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                background: 'var(--bg-main)', 
                borderRadius: '10px', 
                padding: '0.4rem 0.6rem', 
                maxWidth: 220,
                border: `1px solid hsla(var(--accent-main-hsl), 0.15)`
              }}
            >
              {att.type === 'image' && att.preview ? (
                <Image src={att.preview} alt="" width={24} height={24} style={{ borderRadius: 4, objectFit: 'cover' }} unoptimized />
              ) : (
                <span style={{ color: attachmentColorMap[att.type] }}>
                  {att.type === 'pdf' ? <FileText size={16} /> : <LinkIcon size={16} />}
                </span>
              )}
              <div style={{ minWidth: 0 }}>
                <div style={{ color: 'var(--text-main)', fontSize: '0.75rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{att.name}</div>
              </div>
              <button 
                onClick={() => onRemoveAttachment(att.id)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 2 }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {attachLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <Loader2 size={14} className="animate-spin" />
              Processing...
            </div>
          )}
        </div>
      )}

      {showLinkInput && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            ref={linkInputRef}
            type="url"
            value={linkInput}
            onChange={(e) => onLinkInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onAddLink()
              if (e.key === 'Escape') onCancelLinkInput()
            }}
            placeholder="Paste health article URL..."
            className="flat-card"
            style={{ 
              flex: 1, 
              padding: '0.75rem 1rem', 
              borderRadius: 12, 
              background: 'var(--bg-main)', 
              color: 'var(--text-main)', 
              fontSize: '0.9rem', 
              outline: 'none',
              border: '1px solid var(--border-low)'
            }}
            autoFocus
          />
          <button 
            onClick={onAddLink} 
            disabled={!isValidUrl(linkInput)} 
            className="btn-primary"
            style={{ padding: '0 1.25rem', borderRadius: 12, fontSize: '0.85rem', height: 44, opacity: isValidUrl(linkInput) ? 1 : 0.5 }}
          >
            Add
          </button>
          <button 
            onClick={onCancelLinkInput} 
            style={{ padding: '0 0.75rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', maxWidth: 940, margin: '0 auto' }}>
        <input ref={fileInputRef} type="file" accept="image/*,.pdf" multiple onChange={onFileSelect} style={{ display: 'none' }} />
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={attachments.length >= 4} 
            style={{ 
              width: 44, 
              height: 44, 
              borderRadius: '12px', 
              background: 'var(--surface-mid)', 
              border: '1px solid var(--border-low)', 
              color: 'var(--text-muted)', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            <Paperclip size={20} />
          </button>
          
          <button 
            onClick={onToggleLinkInput} 
            style={{ 
              width: 44, 
              height: 44, 
              borderRadius: '12px', 
              background: showLinkInput ? 'hsla(var(--accent-main-hsl), 0.1)' : 'var(--surface-mid)', 
              border: `1px solid ${showLinkInput ? 'var(--accent-main)' : 'var(--border-low)'}`, 
              color: showLinkInput ? 'var(--accent-main)' : 'var(--text-muted)', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            <LinkIcon size={20} />
          </button>

          {voiceSupported && (
            <button 
              onClick={onStartListening} 
              style={{ 
                width: 44, 
                height: 44, 
                borderRadius: '12px', 
                background: isListening ? 'hsla(var(--accent-secondary-hsl), 0.15)' : 'var(--surface-mid)', 
                border: `1px solid ${isListening ? 'var(--accent-secondary)' : 'var(--border-low)'}`, 
                color: isListening ? 'var(--accent-secondary)' : 'var(--text-muted)', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              {isListening ? <Square size={18} fill="currentColor" /> : <Mic size={20} />}
            </button>
          )}
        </div>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={onInputChange}
          onKeyDown={onInputKeyDown}
          placeholder={placeholder}
          rows={1}
          style={{ 
            flex: 1, 
            padding: '1rem 1.25rem', 
            borderRadius: 16, 
            background: 'var(--bg-main)', 
            border: '1px solid var(--border-low)', 
            color: 'var(--text-main)', 
            fontSize: '1rem', 
            resize: 'none', 
            outline: 'none', 
            lineHeight: 1.5, 
            maxHeight: 160, 
            overflowY: 'auto', 
            fontFamily: 'inherit',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-main)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-low)'}
        />
        
        <button 
          onClick={onSendMessage} 
          disabled={loading || (!input.trim() && attachments.length === 0)} 
          className="btn-primary"
          style={{ 
            width: 52, 
            height: 52, 
            borderRadius: '14px', 
            padding: 0,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            opacity: loading || (!input.trim() && attachments.length === 0) ? 0.4 : 1,
            cursor: loading || (!input.trim() && attachments.length === 0) ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? <Loader2 size={24} className="animate-spin" /> : <Send size={22} strokeWidth={2.5} />}
        </button>
      </div>
    </div>
  )
}

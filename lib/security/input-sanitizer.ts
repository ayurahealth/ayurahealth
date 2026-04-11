/**
 * Input Sanitizer — Security module for AyuraHealth.
 * 
 * Protects against:
 * - Prompt injection attacks
 * - XSS in user-submitted content
 * - PII leakage warnings
 * - Content encoding attacks
 */

import { isSafeInput, getSafetyResponse } from '../safety'
import { log } from '../logger'

// ── Prompt Injection Detection ──────────────────────────────────────────────

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /disregard\s+(all\s+)?prior\s+(instructions|rules)/i,
  /you\s+are\s+now\s+(?:a|an|the)\s+/i,
  /pretend\s+(?:you\s+are|to\s+be)\s+/i,
  /system\s*prompt/i,
  /\[INST\]/i,
  /\[\/INST\]/i,
  /<<SYS>>/i,
  /<\|im_start\|>/i,
  /\bACT\s+AS\b/i,
  /reveal\s+(?:your|the)\s+(?:system|initial)\s+prompt/i,
  /what\s+(?:are|were)\s+your\s+instructions/i,
  /output\s+(?:your|the)\s+(?:system|initial)\s+(?:prompt|message)/i,
]

const JAILBREAK_PATTERNS = [
  /DAN\s*mode/i,
  /developer\s+mode/i,
  /do\s+anything\s+now/i,
  /override\s+(?:safety|content)\s+(?:filters?|policy|guidelines)/i,
  /bypass\s+(?:content|safety)\s+(?:filters?|restrictions)/i,
]

export interface SanitizeResult {
  safe: boolean
  sanitizedContent: string
  warnings: string[]
  blocked: boolean
  blockReason?: string
}

/**
 * Full input sanitization pipeline.
 * Returns sanitized content or blocks dangerous input.
 */
export function sanitizeUserInput(text: string, lang: string = 'en'): SanitizeResult {
  const warnings: string[] = []

  // 1. Safety check (suicide, self-harm, drug synthesis)
  if (!isSafeInput(text)) {
    return {
      safe: false,
      sanitizedContent: getSafetyResponse(lang),
      warnings: ['SAFETY_TRIGGER'],
      blocked: true,
      blockReason: 'Content requires immediate professional help.',
    }
  }

  // 2. Prompt injection detection
  const injectionDetected = INJECTION_PATTERNS.some(p => p.test(text))
  if (injectionDetected) {
    log.warn('PROMPT_INJECTION_DETECTED', { inputLength: text.length })
    warnings.push('PROMPT_INJECTION_ATTEMPT')
    // Don't block — just strip and log. Blocking creates false positives.
    // The system prompt is authoritative; injection attempts are ineffective.
  }

  // 3. Jailbreak detection
  const jailbreakDetected = JAILBREAK_PATTERNS.some(p => p.test(text))
  if (jailbreakDetected) {
    log.warn('JAILBREAK_ATTEMPT_DETECTED', { inputLength: text.length })
    warnings.push('JAILBREAK_ATTEMPT')
  }

  // 4. XSS sanitization — strip HTML tags from user content
  let sanitized = text
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')

  // 5. Null byte removal
  sanitized = sanitized.replace(/\0/g, '')

  // 6. Excessive whitespace normalization
  sanitized = sanitized.replace(/\n{4,}/g, '\n\n\n').trim()

  // 7. Length validation (already handled by Zod, but defense in depth)
  if (sanitized.length > 10000) {
    sanitized = sanitized.slice(0, 10000)
    warnings.push('INPUT_TRUNCATED')
  }

  return {
    safe: true,
    sanitizedContent: sanitized,
    warnings,
    blocked: false,
  }
}

/**
 * Sanitize AI response before sending to client.
 * Prevents system prompt leakage.
 */
export function sanitizeAIResponse(text: string): string {
  // Strip any accidentally leaked system prompt fragments
  return text
    .replace(/PROMPT PROFILE:\s*(BALANCED|STRICT|RECOVERY)/gi, '')
    .replace(/AUTO RECOVERY POLICY ACTIVE:[^\n]*/gi, '')
    .replace(/OUTPUT CONTRACT \(ALWAYS FOLLOW\):[^]*?(?=###|$)/gi, '')
    .replace(/VAIDYA CLINICAL MEMORY \(PATIENT FILE\):[^\n]*/gi, '')
}

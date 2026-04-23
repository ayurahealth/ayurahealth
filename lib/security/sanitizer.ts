/**
 * Clinical Sanitizer — Protecting patient data and preventing prompt injection.
 * Based on ACE 5.2 Framework guidelines.
 */

export function sanitizeInput(input: string): string {
  if (!input) return ''

  // 1. Remove control characters and normalize whitespace
  let sanitized = input.replace(/[\x00-\x1F\x7F]/g, '').trim()

  // 2. Prevent common Prompt Injection patterns (e.g. "Ignore all previous instructions")
  const injectionPatterns = [
    /ignore all previous/i,
    /system prompt/i,
    /you are now/i,
    /override/i,
    /forget everything/i
  ]

  injectionPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[REDACTED_INSTRUCTION]')
  })

  // 3. Basic XSS prevention for safety in logs/UI
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')

  return sanitized
}

export function sanitizePatientData<T = unknown>(data: T): T {
  // Deep clone and sanitize strings
  return JSON.parse(JSON.stringify(data, (key, value) => {
    if (typeof value === 'string') {
      return sanitizeInput(value)
    }
    return value
  }))
}

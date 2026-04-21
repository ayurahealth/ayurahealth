import { Capacitor } from '@capacitor/core'

const DEFAULT_APP_URL = 'https://ayurahealth.com'
const PRODUCTION_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || DEFAULT_APP_URL

function shouldUseAbsoluteApiUrl(): boolean {
  if (typeof window === 'undefined') return false

  if (Capacitor.isNativePlatform()) return true

  return ['capacitor:', 'file:'].includes(window.location.protocol)
}

export const API_BASE_URL = shouldUseAbsoluteApiUrl() ? PRODUCTION_URL : ''

export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${cleanPath}`
}

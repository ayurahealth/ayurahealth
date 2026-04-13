/**
 * API Constants
 * 
 * In native environments (Capacitor/iOS), relative paths like '/api/chat' fail.
 * This helper ensures we use the absolute production URL when running as an app.
 */

const PRODUCTION_URL = 'https://ayurahealth.com';

// Check if running in a native Capacitor environment
const isNative = typeof window !== 'undefined' && (window as any).Capacitor?.isNative;

export const API_BASE_URL = isNative ? PRODUCTION_URL : '';

/**
 * Helper to build API URLs
 */
export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}

import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.ayuraintelligence.app',
  appName: 'Ayura Intelligence',
  webDir: 'out',
  server: {
    url: 'https://ayurahealth.com',
    cleartext: false,
  },
  ios: {
    contentInset: 'always',
    scrollEnabled: true,
    backgroundColor: '#010101',
    limitsNavigationsToAppBoundDomains: true,
  },
}

export default config

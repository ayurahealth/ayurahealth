import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.ayurahealth.app',
  appName: 'AyuraHealth',
  webDir: 'out',
  server: {
    url: 'https://ayurahealth.com',
    cleartext: false,
  },
  ios: {
    contentInset: 'always',
    scrollEnabled: true,
    backgroundColor: '#05100a',
    limitsNavigationsToAppBoundDomains: true,
  },
}

export default config

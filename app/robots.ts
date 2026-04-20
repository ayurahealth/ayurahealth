import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/design-system',
          '/onboarding',
          '/dashboard',
          '/wp-admin/',
        ],
      },
    ],
    sitemap: 'https://ayurahealth.com/sitemap.xml',
  }
}

import { MetadataRoute } from 'next'

const BASE_URL = 'https://ayurahealth.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()

  return [
    // ── Core Pages ──
    { url: `${BASE_URL}/`,            lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/chat`,        lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/pricing`,     lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/clinic`,      lastModified: now, changeFrequency: 'monthly', priority: 0.8 },

    // ── Feature Pages ──
    { url: `${BASE_URL}/diet`,        lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/cycle`,       lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/translator`,  lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/testimonials`,lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/press-kit`,   lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${BASE_URL}/contact`,     lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },

    // ── Legal / Compliance ──
    { url: `${BASE_URL}/privacy`,     lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${BASE_URL}/terms`,       lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${BASE_URL}/safety`,      lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
  ]
}

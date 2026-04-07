import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const fail = []

function read(relPath) {
  return readFileSync(resolve(root, relPath), 'utf8')
}

function mustContain(content, needle, message) {
  if (!content.includes(needle)) fail.push(message)
}

function mustNotContain(content, needle, message) {
  if (content.includes(needle)) fail.push(message)
}

const layout = read('app/layout.tsx')
const robotsRoute = read('app/robots.txt/route.ts')
const sitemapRoute = read('app/sitemap.xml/route.ts')

mustContain(layout, 'robots:', 'Missing metadata robots config in app/layout.tsx')
mustContain(layout, 'index: true', 'Root metadata robots must keep index: true')
mustContain(layout, 'follow: true', 'Root metadata robots must keep follow: true')
mustNotContain(layout, 'canonical: BASE_URL', 'Do not set a global canonical in app/layout.tsx')
mustNotContain(layout, 'index: false', 'Found index:false in root metadata; this can deindex the site')

mustContain(robotsRoute, 'User-agent: *', 'robots.txt route missing User-agent rule')
mustContain(robotsRoute, 'Allow: /', 'robots.txt route missing Allow: /')
mustContain(robotsRoute, 'Sitemap:', 'robots.txt route missing Sitemap declaration')

for (const page of ['/chat', '/pricing', '/clinic', '/diet', '/privacy', '/terms']) {
  mustContain(sitemapRoute, `'${page}'`, `sitemap.xml route missing ${page}`)
}

if (fail.length) {
  console.error('SEO guard failed:')
  for (const item of fail) console.error(`- ${item}`)
  process.exit(1)
}

console.log('SEO guard passed.')

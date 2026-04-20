#!/usr/bin/env node
/**
 * Pre-launch smoke checks against a running deployment.
 *
 * Usage:
 *   LAUNCH_BASE_URL=https://ayura.ai npm run launch:check
 *   LAUNCH_BASE_URL=http://127.0.0.1:3000 npm run launch:check
 *
 * Optional deep health (requires HEALTH_CHECK_SECRET in env matching server):
 *   LAUNCH_BASE_URL=... HEALTH_CHECK_SECRET=... npm run launch:check
 */

const baseRaw =
  process.env.LAUNCH_BASE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://ayura.ai')

const base = baseRaw.replace(/\/$/, '')

const paths = [
  { path: '/', name: 'home' },
  { path: '/chat', name: 'chat' },
  { path: '/robots.txt', name: 'robots' },
  { path: '/manifest.json', name: 'pwa-manifest' },
  { path: '/api/health', name: 'health' },
]

async function fetchStatus(url) {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: { Accept: 'text/html,application/json,*/*' },
  })
  return res
}

async function main() {
  let failed = false
  console.log(`Institutional Launch check against ${base}\n`)

  for (const { path, name } of paths) {
    const url = `${base}${path}`
    try {
      const res = await fetchStatus(url)
      const ok = res.ok
      if (!ok) {
        console.log(`  FAIL  ${name}  ${res.status}  ${url}`)
        failed = true
        continue
      }
      if (path === '/api/health') {
        const body = await res.json().catch(() => ({}))
        const v = body.checks?.vaidya
        const sum = body.checks?.summary
        if (v && !v.ready) {
          console.log(
            `  WARN  ${name}  200  VAIDYA Intelligence not ready (verify Environment Variables on Vercel)`
          )
          failed = true
        } else {
          console.log(`  OK    ${name}  ${res.status}  summary=${sum ?? 'n/a'}`)
        }
      } else {
        console.log(`  OK    ${name}  ${res.status}`)
      }
    } catch (e) {
      console.log(`  FAIL  ${name}  ${e instanceof Error ? e.message : String(e)}`)
      failed = true
    }
  }

  const secret = process.env.HEALTH_CHECK_SECRET
  if (secret) {
    const deepUrl = `${base}/api/health?deep=1`
    try {
      const res = await fetch(deepUrl, {
        headers: { Authorization: `Bearer ${secret}`, Accept: 'application/json' },
      })
      if (!res.ok) {
        console.log(`\n  FAIL  deep-health  ${res.status}`)
        failed = true
      } else {
        const body = await res.json()
        console.log(`\n  OK    deep-health  summary=${body.checks?.summary}`)
        const c = body.checks
        if (c?.database === 'error') {
          console.log('  WARN  database check failed — verify Supabase connectivity')
          failed = true
        }
      }
    } catch (e) {
      console.log(`\n  FAIL  deep-health  ${e instanceof Error ? e.message : e}`)
      failed = true
    }
  } else {
    console.log('\n  SKIP  deep-health  (set HEALTH_CHECK_SECRET to verify DB + Clerk env flags)')
  }

  if (failed) {
    console.log('\nInstitutional launch check finished with warnings or failures.')
    process.exit(1)
  }
  console.log('\nInstitutional launch check passed.')
  process.exit(0)
}

main()

function fail(message) {
  console.error(`AUTH GUARD FAILED: ${message}`)
  process.exit(1)
}

function getEnv(name) {
  return (process.env[name] || '').trim()
}

const isProductionDeploy =
  getEnv('VERCEL_ENV') === 'production' ||
  (getEnv('NODE_ENV') === 'production' && !!getEnv('VERCEL_URL'))

if (!isProductionDeploy) {
  console.log('Auth guard skipped (not a production deploy).')
  process.exit(0)
}

const publishable = getEnv('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY')
const secret = getEnv('CLERK_SECRET_KEY')
const frontendApi = getEnv('NEXT_PUBLIC_CLERK_FRONTEND_API')

if (!publishable || !secret) {
  fail('Missing Clerk keys in production deploy environment.')
}

if (publishable.startsWith('pk_test_')) {
  fail('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is a test key in production.')
}

if (secret.startsWith('sk_test_')) {
  fail('CLERK_SECRET_KEY is a test key in production.')
}

if (frontendApi.includes('.clerk.accounts.dev')) {
  fail('NEXT_PUBLIC_CLERK_FRONTEND_API points to a .clerk.accounts.dev domain in production.')
}

console.log('Auth guard passed.')

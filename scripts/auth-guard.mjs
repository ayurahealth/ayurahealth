function warn(message) {
  console.warn(`\x1b[33mAUTH GUARD WARNING: ${message}\x1b[0m`)
  console.warn(`\x1b[33mThe build will continue, but the app may not function correctly in production.\x1b[0m`)
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

let hasError = false;

if (!publishable) {
  warn('Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.')
  hasError = true;
}
if (!secret) {
  warn('Missing CLERK_SECRET_KEY.')
  hasError = true;
}

if (publishable && publishable.startsWith('pk_test_')) {
  warn('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is a test key in production.')
  hasError = true;
}

if (secret && secret.startsWith('sk_test_')) {
  warn('CLERK_SECRET_KEY is a test key in production.')
  hasError = true;
}

if (frontendApi && frontendApi.includes('.clerk.accounts.dev')) {
  warn('NEXT_PUBLIC_CLERK_FRONTEND_API points to a .clerk.accounts.dev domain in production.')
  hasError = true;
}

if (hasError) {
  console.log('\x1b[36mProceeding with build despite Auth Guard concerns...\x1b[0m')
} else {
  console.log('Auth guard passed.')
}

process.exit(0)

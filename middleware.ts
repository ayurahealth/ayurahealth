import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define protected routes that REQUIRE authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)',
  '/settings(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // ── CEO Bypass: Frictionless access for the owner ──────────────────────────
  const ceoToken = req.cookies.get('ayura_ceo_token')?.value
  const CEO_BYPASS_KEY = process.env.CEO_BYPASS_KEY
  const isCeo = CEO_BYPASS_KEY && ceoToken === CEO_BYPASS_KEY

  // Only protect specific authenticated routes if NOT in CEO Mode
  if (isProtectedRoute(req) && !isCeo) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

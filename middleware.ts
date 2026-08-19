import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse, type NextRequest, type NextFetchEvent } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)',
  '/settings(.*)',
])

let clerkHandler: ReturnType<typeof clerkMiddleware> | null = null

try {
  clerkHandler = clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
      try {
        const session = await auth()
        if (!session?.userId) {
          return NextResponse.redirect(new URL('/', req.url))
        }
      } catch {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }
    return NextResponse.next()
  })
} catch (err) {
  console.warn('Failed to initialize clerkMiddleware handler:', err)
}

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  try {
    if (clerkHandler) {
      return await clerkHandler(req, event)
    }
  } catch (err) {
    console.error('MIDDLEWARE_INVOCATION_RECOVERED:', err)
    if (isProtectedRoute(req)) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}

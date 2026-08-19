import { NextResponse, type NextRequest, type NextFetchEvent } from 'next/server'

const isProtectedPath = (pathname: string) =>
  pathname.startsWith('/dashboard') ||
  pathname.startsWith('/profile') ||
  pathname.startsWith('/settings')

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  // If Clerk key is missing, pass public routes through and redirect protected ones.
  if (!publishableKey) {
    if (isProtectedPath(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/', req.url))
    }
    return NextResponse.next()
  }

  // Dynamically import clerkMiddleware only when the key is present.
  try {
    const { clerkMiddleware, createRouteMatcher } = await import('@clerk/nextjs/server')
    const isProtected = createRouteMatcher(['/dashboard(.*)', '/profile(.*)', '/settings(.*)'])

    const handler = clerkMiddleware(async (auth, request) => {
      if (isProtected(request)) {
        try {
          const session = await auth()
          if (!session?.userId) {
            return NextResponse.redirect(new URL('/', request.url))
          }
        } catch {
          return NextResponse.redirect(new URL('/', request.url))
        }
      }
      return NextResponse.next()
    })

    return await handler(req, event)
  } catch (err) {
    console.error('MIDDLEWARE_CLERK_ERROR:', err)
    if (isProtectedPath(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/', req.url))
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}


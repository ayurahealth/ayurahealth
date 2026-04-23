'use client'

import React from 'react'
import {
  ClerkProvider as ReactClerkProvider,
  SignInButton as ReactSignInButton,
  UserButton as ReactUserButton,
  useClerk as useReactClerk,
  useUser as useReactUser,
} from '@clerk/nextjs'

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

const fallbackUser = {
  isLoaded: true,
  isSignedIn: false,
  user: null,
}

const fallbackClerk = {
  openSignIn: () => {},
}

export const hasClerkClientConfig = Boolean(publishableKey)

export const useSafeUser: typeof useReactUser = hasClerkClientConfig
  ? useReactUser
  : (() => fallbackUser) as typeof useReactUser

export const useSafeClerk: typeof useReactClerk = hasClerkClientConfig
  ? useReactClerk
  : (() => fallbackClerk) as typeof useReactClerk

export function SafeClerkProvider({ children }: { children: React.ReactNode }) {
  if (!hasClerkClientConfig) {
    return <>{children}</>
  }

  return (
    <ReactClerkProvider publishableKey={publishableKey!}>
      {children}
    </ReactClerkProvider>
  )
}

export function SafeSignInButton({
  children,
  ...props
}: React.ComponentProps<typeof ReactSignInButton>) {
  if (!hasClerkClientConfig) {
    return <>{children}</>
  }

  return <ReactSignInButton {...props}>{children}</ReactSignInButton>
}

export function SafeUserButton(props: React.ComponentProps<typeof ReactUserButton>) {
  if (!hasClerkClientConfig) {
    return null
  }

  return <ReactUserButton {...props} />
}

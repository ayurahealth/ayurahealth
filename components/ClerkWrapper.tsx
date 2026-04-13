'use client'

import React from 'react'
import { ClerkProvider } from '@clerk/react'

export default function ClerkWrapper({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!publishableKey) {
    throw new Error('Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in environment variables')
  }

  // In static export mode, Clerk needs to know it should only use client-side logic
  // We wrap it in a client component to isolate it from the server-side layout logic
  return (
    <ClerkProvider publishableKey={publishableKey}>
      {children}
    </ClerkProvider>
  )
}

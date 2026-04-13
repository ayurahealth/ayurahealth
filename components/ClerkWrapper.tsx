'use client'

import React from 'react'
import { SafeClerkProvider } from '../lib/clerk-client'

export default function ClerkWrapper({ children }: { children: React.ReactNode }) {
  // In static export mode, Clerk needs to know it should only use client-side logic
  // We wrap it in a client component to isolate it from the server-side layout logic
  return (
    <SafeClerkProvider>
      {children}
    </SafeClerkProvider>
  )
}

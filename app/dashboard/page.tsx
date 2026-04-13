'use client'

import { useSafeUser as useUser } from '../../lib/clerk-client'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { DashboardContent } from './dashboard-content'
import { getApiUrl } from '../../lib/constants'

type DBProfile = {
  vataScore?: number;
  pittaScore?: number;
  kaphaScore?: number;
  primaryDosha?: string;
  healthGoal?: string;
  conditions?: string[];
  chatSessions?: { id: string; topic: string; createdAt: string; summary?: string }[];
}

export default function DashboardPage() {
  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [dbProfile, setDbProfile] = useState<DBProfile | null>(null)
  const fetchingRef = useRef(false)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/')
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (isSignedIn && !dbProfile && !fetchingRef.current) {
      fetchingRef.current = true
      fetch(getApiUrl('/api/user-profile'))
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setDbProfile(data.profile)
          } else {
            console.error(data.error || 'Failed to load profile')
          }
        })
        .catch(err => {
          console.error('Error fetching profile:', err)
        })
        .finally(() => {
          fetchingRef.current = false
        })
    }
  }, [isSignedIn, dbProfile])

  if (!isLoaded || !isSignedIn) {
    return (
      <main style={{ background: '#05100a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e8dfc8' }}>
        <p>Checking authentication...</p>
      </main>
    )
  }

  return (
    <DashboardContent
      user={user}
      dbProfile={dbProfile}
    />
  )
}

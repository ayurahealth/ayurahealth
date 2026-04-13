'use client'

import { useSafeUser as useUser } from '../../lib/clerk-client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DashboardContent } from './dashboard-content'
import { getApiUrl } from '../../lib/constants'

export default function DashboardPage() {
  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [dbProfile, setDbProfile] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/')
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (isSignedIn && !dbProfile && !isFetching) {
      setIsFetching(true)
      fetch(getApiUrl('/api/user-profile'))
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setDbProfile(data.profile)
          } else {
            setError(data.error || 'Failed to load profile')
          }
        })
        .catch(err => {
          console.error('Error fetching profile:', err)
          setError('Network error')
        })
        .finally(() => {
          setIsFetching(false)
        })
    }
  }, [isSignedIn, dbProfile, isFetching])

  if (!isLoaded || !isSignedIn) {
    return (
      <main style={{ background: '#05100a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e8dfc8' }}>
        <p>Checking authentication...</p>
      </main>
    )
  }

  if (error) {
    return (
       <main style={{ background: '#05100a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e8dfc8', padding: '2rem', textAlign: 'center' }}>
        <div>
          <h1 style={{ color: '#c9a84c', marginBottom: '1rem' }}>Profile Error</h1>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#1a4d2e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Retry</button>
        </div>
      </main>
    )
  }

  if (!dbProfile) {
    return (
      <main style={{ background: '#05100a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e8dfc8' }}>
        <div style={{ textAlign: 'center' }}>
           <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
           <p>Syncing your Vedic Pulse...</p>
        </div>
      </main>
    )
  }

  return <DashboardContent user={user} dbProfile={dbProfile} />
}

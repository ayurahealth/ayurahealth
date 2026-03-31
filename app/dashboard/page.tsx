import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { DashboardContent } from './dashboard-content'
import { prisma } from '../../lib/prisma'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  // Try to grab the Clerk user
  let user = null
  try {
    user = await currentUser()
  } catch (err) {
    console.warn("Clerk Error on Dashboard", err)
  }
  
  // Provide mock local user if they aren't signed in so they can see the design
  if (!user) {
    user = {
      id: 'mock-local-123',
      firstName: 'Guest',
      emailAddresses: [{ emailAddress: 'guest@ayurahealth.com' }],
    } as any
  }
  
  const userEmail = user.emailAddresses?.[0]?.emailAddress || 'guest@ayurahealth.com'
  
  // Database Fusion: Fetch or securely create the user's Health Profile in Prisma SQLite
  let dbProfile = null
  try {
    dbProfile = await prisma.userProfile.findUnique({
      where: { id: user.id }
    })
    
    if (!dbProfile) {
      dbProfile = await prisma.userProfile.create({
        data: {
          id: user.id,
          email: userEmail,
          primaryDosha: 'Vata-Pitta',
          vataScore: 45,
          pittaScore: 35,
          kaphaScore: 20
        }
      })
    }
  } catch (e) {
    console.error("Database unavailable during build/scaffold:", e)
    // Fallback if sqlite is locked
    dbProfile = {
      primaryDosha: 'Vata-Pitta',
      vataScore: 45,
      pittaScore: 35,
      kaphaScore: 20
    }
  }
  
  return <DashboardContent 
           user={JSON.parse(JSON.stringify(user))} 
           dbProfile={JSON.parse(JSON.stringify(dbProfile))} 
         />
}

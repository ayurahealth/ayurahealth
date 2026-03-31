import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { currentUser } from '@clerk/nextjs/server'

// Update the user's Health Profile (e.g. after a Quiz or AI Chat)
export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { primaryDosha, vataScore, pittaScore, kaphaScore } = body

    const updatedProfile = await prisma.userProfile.upsert({
      where: { id: user.id },
      update: {
        primaryDosha,
        vataScore,
        pittaScore,
        kaphaScore,
      },
      create: {
        id: user.id,
        email: user.emailAddresses?.[0]?.emailAddress || 'unknown@example.com',
        primaryDosha,
        vataScore,
        pittaScore,
        kaphaScore,
      }
    })

    return NextResponse.json({ success: true, profile: updatedProfile })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

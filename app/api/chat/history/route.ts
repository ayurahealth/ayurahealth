import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const requestedUserId = searchParams.get('userId')

  if (!requestedUserId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    // SECURITY FIX: Prevent IDOR by ensuring the user is authenticated and can only access their own data
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.id !== requestedUserId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const sessions = await prisma.chatSession.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        topic: true,
        summary: true,
        createdAt: true,
      }
    })

    return NextResponse.json({ sessions })
  } catch (err) {
    console.error('FETCH_HISTORY_ERROR:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

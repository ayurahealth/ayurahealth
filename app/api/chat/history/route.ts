import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { log } from '@/lib/logger'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    const sessionAuth = await auth()

    // Check if user is authenticated and is requesting their own data
    if (!sessionAuth.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (sessionAuth.userId !== userId) {
      log.warn('IDOR_ATTEMPT_BLOCKED', { requestedUserId: userId, authenticatedUserId: sessionAuth.userId })
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const sessions = await prisma.chatSession.findMany({
      where: { userId },
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
    log.error('FETCH_HISTORY_ERROR', { error: String(err) })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

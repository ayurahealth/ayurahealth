import { NextRequest, NextResponse } from 'next/server'
import { runVedicOracle } from '@/lib/vedic/vedic-oracle'
import type { BirthData, Dosha } from '@/lib/vedic/types'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get('origin')
    const allowed = ['https://ayurahealth.com', 'http://localhost:3000']
    if (origin && !allowed.includes(origin) && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const {
      birthData,
      dosha = 'Vata',
      symptoms = [],
      age = 30,
      biomarkers
    } = body as {
      birthData: BirthData
      dosha: Dosha
      symptoms: string[]
      age: number
      biomarkers?: Array<{ name: string; value: number; unit: string; normalMin: number; normalMax: number }>
    }

    if (!birthData?.dateOfBirth) {
      return NextResponse.json({ error: 'Birth data required' }, { status: 400 })
    }

    // Validate date
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(birthData.dateOfBirth)) {
      return NextResponse.json({ error: 'Invalid date format. Use YYYY-MM-DD' }, { status: 400 })
    }

    const result = await runVedicOracle(birthData, dosha, symptoms, age, biomarkers)

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Vedic Oracle calculation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'AyuraHealth Vedic Oracle',
    version: '1.0.0',
    capabilities: ['Jyotish', 'Vedic Mathematics', 'Pancha Bhuta', 'Prana Analysis'],
    status: 'operational'
  })
}


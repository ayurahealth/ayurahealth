'use client'

import { useState, useCallback } from 'react'

export type Dosha = 'Vata' | 'Pitta' | 'Kapha'

export function useDoshaQuiz() {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [dosha, setDosha] = useState<Dosha | null>(null)

  const calculateDosha = useCallback((ans: string[]): Dosha => {
    const counts: Record<string, number> = { Vata: 0, Pitta: 0, Kapha: 0 }
    ans.forEach(a => { counts[a] = (counts[a] || 0) + 1 })
    // Sort by count descending and take the first one
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as Dosha
  }, [])

  const resetQuiz = useCallback(() => {
    setCurrentQ(0)
    setAnswers([])
    setDosha(null)
  }, [])

  return {
    currentQ,
    setCurrentQ,
    answers,
    setAnswers,
    dosha,
    setDosha,
    calculateDosha,
    resetQuiz
  }
}

// ============================================================
// VEDIC ORACLE — Master Orchestrator
// Combines Jyotish + Vedic Math + Pancha Bhuta into unified response
// ============================================================

import type {
  BirthData, VedicOracleResponse, VedicHealthScore,
  VedicRemedy, Dosha
} from './types'
import {
  calculateJanmaKundali, getCurrentPlanetaryInfluences,
  generateDailyGuidance, GRAHA_HEALTH_PROFILES
} from './jyotish-engine'
import { performCompleteVedicMathAnalysis } from './vedic-math-engine'
import {
  calculatePanchaBhutaFromDosha, analyzePranaVayus
} from './pancha-bhuta-engine'

// ─── MAIN ORACLE FUNCTION ─────────────────────────────────────

export async function runVedicOracle(
  birthData: BirthData,
  userDosha: Dosha = 'Vata',
  symptoms: string[] = [],
  age: number = 30,
  biomarkers?: Array<{ name: string; value: number; unit: string; normalMin: number; normalMax: number }>
): Promise<VedicOracleResponse> {

  // 1. Calculate birth chart
  const birthChart = calculateJanmaKundali(birthData)

  // 2. Current planetary influences
  const currentPlanetaryInfluences = getCurrentPlanetaryInfluences(birthChart)

  // 3. Pancha Bhuta from dosha + symptoms
  const panchaBhuta = calculatePanchaBhutaFromDosha(userDosha, symptoms, age)

  // 4. Prana analysis
  const pranaProfile = analyzePranaVayus(userDosha, symptoms)

  // 5. Vedic Math analysis
  const vedicMathInsights = performCompleteVedicMathAnalysis(birthData.dateOfBirth, biomarkers)

  // 6. Calculate Vedic health score
  const vedicHealthScore = calculateVedicHealthScore(
    birthChart, panchaBhuta, pranaProfile, vedicMathInsights
  )

  // 7. Daily guidance
  const dailyVedicGuidance = generateDailyGuidance(birthChart)

  // 8. Generate remedies
  const remedies = generateVedicRemedies(birthChart, panchaBhuta, vedicHealthScore)

  // 9. Build VAIDYA context prompt
  const vaidyaContext = buildVaidyaPromptContext(
    birthChart, panchaBhuta, pranaProfile, vedicMathInsights,
    currentPlanetaryInfluences, vedicHealthScore, dailyVedicGuidance
  )

  return {
    birthChart,
    currentPlanetaryInfluences,
    panchaBhuta,
    pranaProfile,
    vedicMathInsights,
    vedicHealthScore,
    dailyVedicGuidance,
    remedies,
    vaidyaContext
  }
}

// ─── VEDIC HEALTH SCORE ───────────────────────────────────────

function calculateVedicHealthScore(
  birthChart: ReturnType<typeof calculateJanmaKundali>,
  panchaBhuta: ReturnType<typeof calculatePanchaBhutaFromDosha>,
  pranaProfile: ReturnType<typeof analyzePranaVayus>,
  vedicMath: ReturnType<typeof performCompleteVedicMathAnalysis>
): VedicHealthScore {

  // Planetary health score — based on benefic/malefic planet positions
  const beneficGrahas = ['Guru', 'Shukra', 'Budha', 'Chandra']
  let planetaryScore = 50
  birthChart.grahaPositions.forEach(gp => {
    if (gp.isExalted) planetaryScore += 8
    if (gp.isDebilitated) planetaryScore -= 8
    if (beneficGrahas.includes(gp.graha) && [1, 4, 5, 7, 9, 10, 11].includes(gp.house)) planetaryScore += 5
    if (['Shani', 'Rahu', 'Ketu'].includes(gp.graha) && [1, 4, 7, 10].includes(gp.house)) planetaryScore -= 5
  })
  planetaryScore = Math.max(20, Math.min(95, planetaryScore))

  // Dasha health score
  const dashaHealthMap: Record<string, number> = {
    Guru: 85, Shukra: 78, Chandra: 70, Budha: 72, Surya: 75,
    Mangal: 62, Ketu: 60, Shani: 55, Rahu: 50
  }
  const dashaScore = dashaHealthMap[birthChart.currentDasha.lord] || 65

  // Elemental balance score
  const balanceScores = {
    Balanced: 90, 'Slightly Imbalanced': 72, 'Moderately Imbalanced': 55, 'Severely Imbalanced': 35
  }
  const elementalScore = balanceScores[panchaBhuta.overallBalance]

  // Prana score
  const avgPranaStrength = pranaProfile.reduce((sum, p) => sum + p.strength, 0) / pranaProfile.length
  const pranaScore = Math.round((avgPranaStrength / 10) * 100)

  // Yoga bonus
  const yogaBonus = birthChart.yogas.filter(y => y.isActive && y.type === 'longevity').length * 5

  // Biorhythm score
  const biorhythmScores = {
    Peak: 90, Rising: 75, Declining: 55, Critical: 35
  }
  const bioScore = biorhythmScores[vedicMath.biorhythmPhase] || 65

  const physical = Math.round((planetaryScore * 0.3 + elementalScore * 0.3 + pranaScore * 0.4))
  const mental = Math.round((dashaScore * 0.4 + pranaScore * 0.3 + bioScore * 0.3))
  const spiritual = Math.round((dashaScore * 0.3 + elementalScore * 0.2 + yogaBonus + 50))
  const longevity = Math.round((planetaryScore * 0.4 + dashaScore * 0.3 + elementalScore * 0.3) + yogaBonus)

  const overall = Math.round((physical * 0.35 + mental * 0.25 + spiritual * 0.2 + longevity * 0.2))

  return {
    overall: Math.min(98, overall),
    physical: Math.min(98, physical),
    mental: Math.min(98, mental),
    spiritual: Math.min(98, spiritual),
    longevity: Math.min(98, longevity),
    components: [
      { name: 'Planetary Strength', score: planetaryScore, weight: 0.25, description: 'Graha positions and dignities in your birth chart' },
      { name: 'Dasha Period', score: dashaScore, weight: 0.20, description: `Current ${birthChart.currentDasha.lord} Mahadasha influence` },
      { name: 'Elemental Balance', score: elementalScore, weight: 0.20, description: `Pancha Bhuta harmony — ${panchaBhuta.overallBalance}` },
      { name: 'Prana Vitality', score: pranaScore, weight: 0.20, description: 'Five Prana Vayu strength and flow' },
      { name: 'Biorhythm', score: bioScore, weight: 0.15, description: `Current cycle: ${vedicMath.biorhythmPhase}` }
    ]
  }
}

// ─── REMEDY GENERATION ────────────────────────────────────────

function generateVedicRemedies(
  birthChart: ReturnType<typeof calculateJanmaKundali>,
  panchaBhuta: ReturnType<typeof calculatePanchaBhutaFromDosha>,
  healthScore: VedicHealthScore
): VedicRemedy[] {
  const remedies: VedicRemedy[] = []

  // Dasha remedy
  const dashaProfile = GRAHA_HEALTH_PROFILES[birthChart.currentDasha.lord]
  remedies.push({
    type: 'Mantra',
    title: `${birthChart.currentDasha.lord} Dasha Mantra`,
    description: `Recite ${dashaProfile.mantra} 108 times daily during ${dashaProfile.day}`,
    duration: 'Daily throughout current Mahadasha',
    targetGraha: birthChart.currentDasha.lord,
    urgency: 'Immediate'
  })

  // Gemstone remedy for weakest planet
  const weakestPlanet = birthChart.grahaPositions
    .filter(p => p.isDebilitated)
    .sort((a, b) => GRAHA_HEALTH_PROFILES[a.graha].healthScore - GRAHA_HEALTH_PROFILES[b.graha].healthScore)[0]

  if (weakestPlanet) {
    const profile = GRAHA_HEALTH_PROFILES[weakestPlanet.graha]
    remedies.push({
      type: 'Gemstone',
      title: `${profile.gemstone} for ${weakestPlanet.graha}`,
      description: `Wear ${profile.gemstone} in ${profile.metal} on ${profile.day}. ${weakestPlanet.graha} is debilitated — gemstone strengthens planetary influence.`,
      duration: 'Minimum 1 year, consult Jyotishi',
      targetGraha: weakestPlanet.graha,
      urgency: 'Soon'
    })
  }

  // Elemental remedy
  if (panchaBhuta.overallBalance !== 'Balanced') {
    const deficientBhuta = panchaBhuta.deficient
    const bhutaRemedyMap: Record<string, { herb: string; practice: string }> = {
      Akasha: { herb: 'Brahmi + Ashwagandha', practice: 'Sound healing and silent meditation' },
      Vayu: { herb: 'Vata-calming Ashwagandha + Shatavari', practice: 'Warm sesame oil abhyanga' },
      Agni: { herb: 'Trikatu (Ginger + Black Pepper + Long Pepper)', practice: 'Agni Sara and Kapalabhati' },
      Jal: { herb: 'Shatavari + Amalaki', practice: 'Moon meditation and hydration protocol' },
      Prithvi: { herb: 'Bala + Vidari', practice: 'Grounding yoga and earthing barefoot practice' }
    }
    const remedy = bhutaRemedyMap[deficientBhuta]
    remedies.push({
      type: 'Herb',
      title: `${deficientBhuta} Element Restoration`,
      description: `${remedy.herb} — 1 tsp in warm milk or water, twice daily. ${remedy.practice}.`,
      duration: '90 days minimum',
      targetBhuta: deficientBhuta,
      urgency: panchaBhuta.overallBalance === 'Severely Imbalanced' ? 'Immediate' : 'Soon'
    })
  }

  // Yoga remedy based on current antardasha
  const antarProfile = GRAHA_HEALTH_PROFILES[birthChart.currentAntardasha.lord]
  remedies.push({
    type: 'Yoga',
    title: `${birthChart.currentAntardasha.lord} Antardasha Yoga Practice`,
    description: `Target: ${antarProfile.organ.join(', ')}. Recommended asanas for ${antarProfile.dominantDosha} balancing.`,
    duration: 'Daily for duration of antardasha',
    targetGraha: birthChart.currentAntardasha.lord,
    urgency: 'Ongoing'
  })

  // Health score based diet remedy
  if (healthScore.physical < 60) {
    remedies.push({
      type: 'Diet',
      title: 'Sapta Dhatu Nourishment Protocol',
      description: 'Chyawanprash daily, warm cooked meals only, avoid raw/cold food for 40 days. Follow Dinacharya (daily routine).',
      duration: '40 days (one mandala)',
      urgency: 'Immediate'
    })
  }

  // Fasting remedy based on weakest planetary day
  const lowestScoreGraha = Object.entries(GRAHA_HEALTH_PROFILES)
    .sort(([, a], [, b]) => a.healthScore - b.healthScore)[0]
  remedies.push({
    type: 'Fasting',
    title: `${lowestScoreGraha[1].graha} Day Fast`,
    description: `Fast on ${lowestScoreGraha[1].day}s. Eat one simple sattvic meal. Recite ${lowestScoreGraha[1].mantra}.`,
    duration: 'Every ${lowestScoreGraha[1].day} for 11 weeks',
    targetGraha: lowestScoreGraha[0] as import('./types').Graha,
    urgency: 'Soon'
  })

  return remedies
}

// ─── VAIDYA PROMPT BUILDER ────────────────────────────────────

function buildVaidyaPromptContext(
  birthChart: ReturnType<typeof calculateJanmaKundali>,
  panchaBhuta: ReturnType<typeof calculatePanchaBhutaFromDosha>,
  pranaProfile: ReturnType<typeof analyzePranaVayus>,
  vedicMath: ReturnType<typeof performCompleteVedicMathAnalysis>,
  influences: ReturnType<typeof getCurrentPlanetaryInfluences>,
  healthScore: VedicHealthScore,
  dailyGuidance: ReturnType<typeof generateDailyGuidance>
): string {
  const weakPranas = pranaProfile.filter(p => p.strength < 6).map(p => p.prana.name)
  const challengingPlanets = influences.filter(i => i.transitEffect === 'Challenging')
  const activeYogas = birthChart.yogas.filter(y => y.isActive)

  return `
=== VEDIC ORACLE CONTEXT FOR VAIDYA ===

JYOTISH PROFILE:
- Lagna (Ascendant): ${birthChart.lagna} (lord: ${birthChart.lagnaLord})
- Moon Sign: ${birthChart.moonSign}
- Sun Sign: ${birthChart.sunSign}
- Birth Nakshatra: ${birthChart.birthNakshatra} (lord: ${birthChart.birthNakshatraLord})
- Current Mahadasha: ${birthChart.currentDasha.lord} Dasha (${birthChart.currentDasha.startDate.getFullYear()} - ${birthChart.currentDasha.endDate.getFullYear()})
- Current Antardasha: ${birthChart.currentAntardasha.lord}
- Mahadasha Health: ${birthChart.currentDasha.healthImplication}
- Dominant Dosha this period: ${birthChart.currentDasha.dominantDosha}
- Health Vulnerabilities: ${birthChart.currentDasha.vulnerability.join(', ')}
- Health Strengths: ${birthChart.currentDasha.strength.join(', ')}
- Active Yogas: ${activeYogas.length > 0 ? activeYogas.map(y => y.name).join(', ') : 'None detected'}
${challengingPlanets.length > 0 ? `- Planetary Challenges: ${challengingPlanets.map(p => `${p.graha} in house ${p.currentTransitHouse} — ${p.healthArea}`).join('; ')}` : ''}

PANCHA BHUTA (FIVE ELEMENTS):
- Dominant Element: ${panchaBhuta.dominant} (${panchaBhuta[panchaBhuta.dominant.toLowerCase() + 'Percentage' as keyof typeof panchaBhuta]}%)
- Deficient Element: ${panchaBhuta.deficient}
- Balance: ${panchaBhuta.overallBalance}
- Elemental Distribution: Akasha ${panchaBhuta.akashaPercentage}% | Vayu ${panchaBhuta.vayuPercentage}% | Agni ${panchaBhuta.agniPercentage}% | Jal ${panchaBhuta.jalPercentage}% | Prithvi ${panchaBhuta.prithviPercentage}%

PRANA VITALITY:
${pranaProfile.map(p => `- ${p.prana.name} Vayu: Strength ${p.strength}/10 — ${p.imbalance}`).join('\n')}
${weakPranas.length > 0 ? `- Weak Pranas requiring attention: ${weakPranas.join(', ')}` : '- All Prana Vayus adequately functioning'}

VEDIC MATHEMATICS INSIGHTS:
- Health Pattern: ${vedicMath.patternType} (${vedicMath.biorhythmPhase} phase)
- Numerological Signature Today: ${vedicMath.numerologicalSignature}
- Digital Root: ${vedicMath.digitalRoot}
${vedicMath.ratioAnalysis.length > 0 ? `- Biomarker Pattern: ${vedicMath.ratioAnalysis[0].vedicPattern}` : ''}
${vedicMath.optimalWindows.length > 0 ? `- Optimal treatment window today: ${vedicMath.optimalWindows[0].type} ${vedicMath.optimalWindows[0].startHour}:00-${vedicMath.optimalWindows[0].endHour}:00 (${vedicMath.optimalWindows[0].quality})` : ''}

VEDIC HEALTH SCORE:
- Overall: ${healthScore.overall}/100
- Physical: ${healthScore.physical}/100 | Mental: ${healthScore.mental}/100 | Spiritual: ${healthScore.spiritual}/100 | Longevity: ${healthScore.longevity}/100

TODAY'S VEDIC GUIDANCE:
- Tithi: ${dailyGuidance.tithi} | Nakshatra: ${dailyGuidance.nakshatra}
- Color: ${dailyGuidance.colorToWear}
- Herbs: ${dailyGuidance.herbsToday.join(', ')}
- Mantra: ${dailyGuidance.mantraForToday}
- Health advice: ${dailyGuidance.healthAdvice}

INSTRUCTION FOR VAIDYA: Incorporate this Vedic Intelligence context into your health response. Reference the user's current dasha, their elemental profile, and today's auspicious guidance when providing Ayurvedic recommendations. This is the deepest layer of personalisation — use it to elevate the quality and specificity of your response beyond what any other health AI can provide.
=== END VEDIC CONTEXT ===
`.trim()
}


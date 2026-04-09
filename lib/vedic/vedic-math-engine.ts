// ============================================================
// VEDIC MATHEMATICS ENGINE
// 16 Sutras applied to health pattern analysis
// ============================================================

import type { VedicMathAnalysis, SutraApplication, RatioAnalysis, TimeWindow } from './types'

// ─── THE 16 VEDIC MATH SUTRAS ─────────────────────────────────

const SUTRAS = [
  { name: 'Ekadhikena Purvena', text: 'By one more than the previous one', context: 'Progressive growth patterns' },
  { name: 'Nikhilam Navatashcaramam Dashatah', text: 'All from 9 and the last from 10', context: 'Deficiency analysis' },
  { name: 'Urdhva-Tiryagbyham', text: 'Vertically and crosswise', context: 'Cross-system correlation' },
  { name: 'Paraavartya Yojayet', text: 'Transpose and apply', context: 'Reverse pattern recognition' },
  { name: 'Shunyam Saamyasamuccaye', text: 'When the sum is the same that sum is zero', context: 'Balance detection' },
  { name: 'Anurupyena', text: 'Proportionality', context: 'Ratio analysis in biomarkers' },
  { name: 'Sankalana-Vyavakalanabhyam', text: 'By addition and subtraction', context: 'Composite health scores' },
  { name: 'Puranapuranabhyam', text: 'By the completion or non-completion', context: 'Health completeness analysis' },
  { name: 'Chalana-Kalanabhyam', text: 'Differences and similarities', context: 'Trend detection over time' },
  { name: 'Yaavadunam', text: 'Whatever the extent of deficiency', context: 'Deficiency quantification' },
  { name: 'Vyashtisamanstih', text: 'Part and whole', context: 'System vs individual organ analysis' },
  { name: 'Shesanyankena Charamena', text: 'The remainders by the last digit', context: 'Cyclical health patterns' },
  { name: 'Sopaantyadvayamantyam', text: 'The ultimate and twice the penultimate', context: 'Peak pattern detection' },
  { name: 'Ekanyunena Purvena', text: 'By one less than the previous one', context: 'Declining pattern detection' },
  { name: 'Gunitasamuchyah', text: 'The product of the sum is equal to the sum of the products', context: 'Multiplicative health factors' },
  { name: 'Gunakasamuchyah', text: 'The factors of the sum is equal to the sum of the factors', context: 'Factorial health analysis' }
]

// ─── DIGITAL ROOT CALCULATION ─────────────────────────────────

export function digitalRoot(n: number): number {
  if (n < 0) n = Math.abs(n)
  if (n === 0) return 0
  const root = n % 9
  return root === 0 ? 9 : root
}

export function reduceToSingleDigit(n: number): number {
  let num = Math.abs(Math.round(n))
  while (num > 9) {
    num = String(num).split('').reduce((sum, d) => sum + parseInt(d), 0)
  }
  return num
}

// ─── VEDIC NUMEROLOGY FOR BIRTH DATE ─────────────────────────

export function calculateLifePathNumber(dateStr: string): number {
  const digits = dateStr.replace(/-/g, '').split('').map(Number)
  let sum = digits.reduce((a, b) => a + b, 0)
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum).split('').reduce((acc, d) => acc + parseInt(d), 0)
  }
  return sum
}

export function calculateHealthNumber(birthDate: string): {
  healthNumber: number
  meaning: string
  numerologicalDosha: string
  vedicPattern: string
} {
  const dateDigits = birthDate.replace(/-/g, '')
  const sum = dateDigits.split('').reduce((acc, d) => acc + parseInt(d), 0)
  const healthNum = digitalRoot(sum)

  const healthMeanings: Record<number, { meaning: string; dosha: string; pattern: string }> = {
    1: { meaning: 'Solar constitution — strong vital force, leadership energy', dosha: 'Pitta', pattern: 'Ascending' },
    2: { meaning: 'Lunar constitution — sensitive, intuitive, fluid balance important', dosha: 'Kapha', pattern: 'Fluctuating' },
    3: { meaning: 'Jupiterian constitution — expansive, liver and growth oriented', dosha: 'Kapha-Pitta', pattern: 'Expanding' },
    4: { meaning: 'Earthly constitution — stable, strong bones, prone to stagnation', dosha: 'Kapha', pattern: 'Stable' },
    5: { meaning: 'Mercurial constitution — quick, nervous system sensitive, adaptable', dosha: 'Vata', pattern: 'Variable' },
    6: { meaning: 'Venusian constitution — sensory health, reproductive vitality', dosha: 'Kapha-Vata', pattern: 'Cyclical' },
    7: { meaning: 'Ketu-Neptunian constitution — spiritual health, mysterious symptoms', dosha: 'Vata-Pitta', pattern: 'Irregular' },
    8: { meaning: 'Saturnine constitution — endurance, chronic conditions, structural', dosha: 'Vata', pattern: 'Restrictive' },
    9: { meaning: 'Martian constitution — high energy, inflammatory, transformative', dosha: 'Pitta', pattern: 'Intense' },
  }

  const data = healthMeanings[healthNum] || healthMeanings[1]
  return {
    healthNumber: healthNum,
    meaning: data.meaning,
    numerologicalDosha: data.dosha,
    vedicPattern: data.pattern
  }
}

// ─── BIOMARKER PATTERN ANALYSIS ──────────────────────────────

interface Biomarker {
  name: string
  value: number
  unit: string
  normalMin: number
  normalMax: number
}

export function analyzeBiomarkerPatterns(biomarkers: Biomarker[]): {
  ratioAnalysis: RatioAnalysis[]
  sutrasApplied: SutraApplication[]
  overallPattern: string
  vedicInterpretation: string
} {
  const ratioAnalysis: RatioAnalysis[] = []
  const sutrasApplied: SutraApplication[] = []

  // Apply Anurupyena (Proportionality Sutra) to biomarker ratios
  const pairs = [
    ['HDL', 'LDL'],
    ['T3', 'T4'],
    ['Sodium', 'Potassium'],
    ['Calcium', 'Phosphorus'],
    ['ALT', 'AST'],
    ['Creatinine', 'BUN'],
  ]

  pairs.forEach(([marker1, marker2]) => {
    const b1 = biomarkers.find(b => b.name.toLowerCase().includes(marker1.toLowerCase()))
    const b2 = biomarkers.find(b => b.name.toLowerCase().includes(marker2.toLowerCase()))

    if (b1 && b2 && b2.value > 0) {
      const ratio = b1.value / b2.value
      const dr = digitalRoot(Math.round(ratio * 10))

      ratioAnalysis.push({
        markers: [marker1, marker2],
        ratio: parseFloat(ratio.toFixed(3)),
        vedicPattern: getVedicRatioPattern(ratio, dr),
        healthSignificance: getHealthSignificance(marker1, marker2, ratio),
        tradition: 'Vedic Mathematics + Ayurvedic Dhatu Analysis'
      })

      sutrasApplied.push({
        sutraName: SUTRAS[5].name,
        sutraText: SUTRAS[5].text,
        applicationContext: `${marker1}:${marker2} ratio analysis`,
        result: `Ratio ${ratio.toFixed(2)} — Digital root ${dr} — ${getDigitalRootHealth(dr)}`
      })
    }
  })

  // Apply Nikhilam (complement) sutra to deficiency analysis
  const deficientMarkers = biomarkers.filter(b => b.value < b.normalMin)
  if (deficientMarkers.length > 0) {
    sutrasApplied.push({
      sutraName: SUTRAS[1].name,
      sutraText: SUTRAS[1].text,
      applicationContext: 'Deficiency pattern analysis',
      result: `${deficientMarkers.length} markers below optimal. Complement values needed: ${
        deficientMarkers.map(m => `${m.name} needs +${(m.normalMin - m.value).toFixed(1)} ${m.unit}`).join(', ')
      }`
    })
  }

  // Apply Urdhva-Tiryagbyham (vertical-crosswise) for multi-system patterns
  const systemGroups = groupByBodySystem(biomarkers)
  Object.entries(systemGroups).forEach(([system, markers]) => {
    if (markers.length >= 2) {
      const avgDeviation = markers.reduce((sum, m) => {
        const midpoint = (m.normalMin + m.normalMax) / 2
        return sum + Math.abs(m.value - midpoint) / midpoint
      }, 0) / markers.length

      sutrasApplied.push({
        sutraName: SUTRAS[2].name,
        sutraText: SUTRAS[2].text,
        applicationContext: `${system} system cross-analysis`,
        result: `Average deviation from optimal: ${(avgDeviation * 100).toFixed(1)}%. ${avgDeviation > 0.15 ? `${system} system needs attention.` : `${system} system balanced.`}`
      })
    }
  })

  const totalDeviation = biomarkers.reduce((sum, b) => {
    const midpoint = (b.normalMin + b.normalMax) / 2
    return sum + Math.abs(b.value - midpoint) / midpoint
  }, 0) / Math.max(biomarkers.length, 1)

  return {
    ratioAnalysis,
    sutrasApplied,
    overallPattern: totalDeviation < 0.1 ? 'Harmonious' : totalDeviation < 0.2 ? 'Mildly Discordant' : 'Discordant',
    vedicInterpretation: getOverallVedicInterpretation(totalDeviation, biomarkers)
  }
}

function getVedicRatioPattern(ratio: number, digitalRoot: number): string {
  const patterns: Record<number, string> = {
    1: 'Unity principle — complete integration',
    2: 'Duality pattern — balance needed between systems',
    3: 'Trinity pattern — three doshas in interplay',
    4: 'Four-fold earth pattern — stability indicator',
    5: 'Pancha-bhuta pattern — five element imbalance',
    6: 'Six-fold pattern — six rasa (tastes) imbalance',
    7: 'Sapta-dhatu pattern — seven tissue layer issue',
    8: 'Ashtanga pattern — eight limbs of health',
    9: 'Nava-graha pattern — planetary health influence'
  }
  return patterns[digitalRoot] || 'Complex pattern requiring deeper analysis'
}

function getHealthSignificance(m1: string, m2: string, ratio: number): string {
  const contexts: Record<string, { low: string; normal: string; high: string }> = {
    'HDL-LDL': {
      low: 'Kapha dominance — arterial accumulation risk. Agni (digestive fire) depleted.',
      normal: 'Balanced Rasa (plasma) circulation. Healthy Rakta (blood) formation.',
      high: 'Pitta dominance — strong digestive fire. Monitor for inflammatory tendency.'
    },
    'T3-T4': {
      low: 'Kapha thyroid pattern — sluggish metabolism, weight gain tendency.',
      normal: 'Balanced Agni (metabolic fire). Proper Dhatu (tissue) formation.',
      high: 'Pitta-Vata thyroid pattern — hypermetabolic state, nervous system stress.'
    },
    'Sodium-Potassium': {
      low: 'Vata-Pitta imbalance — electrolyte disruption, adrenal stress.',
      normal: 'Balanced Jal (water element). Proper cellular hydration.',
      high: 'Pitta dominance — excess heat. Kidney Yang pattern in TCM.'
    },
    'ALT-AST': {
      low: 'Assess liver function further. Possible Kapha liver stagnation.',
      normal: 'Liver (Yakrit) functioning well. Ranjaka Pitta balanced.',
      high: 'Liver stress — Pitta aggravation. Ranjaka Pitta inflamed. Detox needed.'
    }
  }

  const key = `${m1}-${m2}`
  const ctx = contexts[key] || contexts[`${m2}-${m1}`]
  if (!ctx) return `Ratio ${ratio.toFixed(2)} — Apply Vedic mathematical proportionality analysis`

  if (ratio < 0.7) return ctx.low
  if (ratio > 1.5) return ctx.high
  return ctx.normal
}

function getDigitalRootHealth(root: number): string {
  const health: Record<number, string> = {
    1: 'Solar energy — Pitta, Agni. Individual system strength.',
    2: 'Lunar energy — Kapha, Soma. Paired organ balance.',
    3: 'Tridosha marker — all three humors in play.',
    4: 'Structural integrity — Asthi (bone) and Mamsa (muscle).',
    5: 'Five element harmony — Pancha Bhuta alignment.',
    6: 'Sensory balance — six rasa (taste) equilibrium.',
    7: 'Sapta Dhatu — seven tissue layer health signal.',
    8: 'Karmic health pattern — requires Shani (Saturn) remedy.',
    9: 'Completion — Nava Graha health cycle completing.'
  }
  return health[root] || 'Complex Vedic pattern'
}

function groupByBodySystem(biomarkers: Biomarker[]): Record<string, Biomarker[]> {
  const groups: Record<string, Biomarker[]> = {
    Cardiac: [], Liver: [], Kidney: [], Thyroid: [], Metabolic: [], Blood: []
  }

  biomarkers.forEach(b => {
    const name = b.name.toLowerCase()
    if (['hdl', 'ldl', 'cholesterol', 'triglyceride'].some(k => name.includes(k))) groups.Cardiac.push(b)
    else if (['alt', 'ast', 'bilirubin', 'albumin'].some(k => name.includes(k))) groups.Liver.push(b)
    else if (['creatinine', 'bun', 'uric', 'gfr'].some(k => name.includes(k))) groups.Kidney.push(b)
    else if (['t3', 't4', 'tsh', 'thyroid'].some(k => name.includes(k))) groups.Thyroid.push(b)
    else if (['glucose', 'hba1c', 'insulin', 'sugar'].some(k => name.includes(k))) groups.Metabolic.push(b)
    else if (['hemoglobin', 'rbc', 'wbc', 'platelet', 'hematocrit'].some(k => name.includes(k))) groups.Blood.push(b)
  })

  return Object.fromEntries(Object.entries(groups).filter(([, v]) => v.length > 0))
}

function getOverallVedicInterpretation(deviation: number, biomarkers: Biomarker[]): string {
  const elevatedCount = biomarkers.filter(b => b.value > b.normalMax).length
  const depletedCount = biomarkers.filter(b => b.value < b.normalMin).length

  if (deviation < 0.1) {
    return 'Vedic math patterns show Sama (balanced) state. Digital root analysis confirms Sapta Dhatu harmony. Maintain current Dinacharya (daily routine).'
  } else if (elevatedCount > depletedCount) {
    return `Excesssive pattern (Vriddhi) — ${elevatedCount} markers elevated. Urdhva (ascending) Vedic pattern. Pitta and Kapha excess indicated. Apply Langhan (reduction) therapy.`
  } else if (depletedCount > elevatedCount) {
    return `Deficiency pattern (Kshaya) — ${depletedCount} markers depleted. Adhara (falling) Vedic pattern. Vata and tissue depletion indicated. Apply Brinhana (nourishment) therapy.`
  } else {
    return `Mixed Vikrita (distorted) pattern — ${elevatedCount} elevated and ${depletedCount} depleted. Vishama (irregular) Vata pattern. Apply Sama (balancing) therapy with emphasis on Agni rekindling.`
  }
}

// ─── BIORHYTHM CALCULATION ───────────────────────────────────

export function calculateVedicBiorhythm(birthDate: string): {
  physicalPhase: string
  mentalPhase: string
  spiritualPhase: string
  optimalWindows: TimeWindow[]
  digitalRootToday: number
} {
  const birth = new Date(birthDate)
  const today = new Date()
  const daysSinceBirth = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))

  // Vedic biorhythm cycles based on planetary periods
  const physicalCycle = 23  // Mangal cycle
  const mentalCycle = 28    // Chandra cycle
  const spiritualCycle = 33 // Guru cycle

  const physicalPhase = Math.sin(2 * Math.PI * daysSinceBirth / physicalCycle)
  const mentalPhase = Math.sin(2 * Math.PI * daysSinceBirth / mentalCycle)
  const spiritualPhase = Math.sin(2 * Math.PI * daysSinceBirth / spiritualCycle)

  const getPhaseLabel = (value: number): string => {
    if (value > 0.6) return 'Peak'
    if (value > 0.2) return 'Rising'
    if (value > -0.2) return 'Transition'
    if (value > -0.6) return 'Declining'
    return 'Critical'
  }

  const drToday = digitalRoot(daysSinceBirth)

  const optimalWindows: TimeWindow[] = []

  if (physicalPhase > 0.3) {
    optimalWindows.push({
      type: 'Exercise',
      startHour: 6, endHour: 8,
      quality: physicalPhase > 0.7 ? 'Excellent' : 'Good',
      reason: `Mangal cycle at ${(physicalPhase * 100).toFixed(0)}% — physical strength elevated`
    })
  }

  if (mentalPhase > 0.3) {
    optimalWindows.push({
      type: 'Meditation',
      startHour: 4, endHour: 6,
      quality: mentalPhase > 0.7 ? 'Excellent' : 'Good',
      reason: `Chandra cycle at ${(mentalPhase * 100).toFixed(0)}% — mental clarity high`
    })
  }

  if (spiritualPhase > 0.3) {
    optimalWindows.push({
      type: 'Meditation',
      startHour: 5, endHour: 7,
      quality: spiritualPhase > 0.7 ? 'Excellent' : 'Good',
      reason: `Guru cycle at ${(spiritualPhase * 100).toFixed(0)}% — spiritual receptivity elevated`
    })
  }

  return {
    physicalPhase: getPhaseLabel(physicalPhase),
    mentalPhase: getPhaseLabel(mentalPhase),
    spiritualPhase: getPhaseLabel(spiritualPhase),
    optimalWindows,
    digitalRootToday: drToday
  }
}

export function performCompleteVedicMathAnalysis(
  birthDate: string,
  biomarkers?: Biomarker[]
): VedicMathAnalysis {
  const { healthNumber, vedicPattern } = calculateHealthNumber(birthDate)
  const biorhythm = calculateVedicBiorhythm(birthDate)
  const today = new Date()
  const todayDigitSum = digitalRoot(
    today.getFullYear() + today.getMonth() + 1 + today.getDate()
  )

  let ratioAnalysis: RatioAnalysis[] = []
  let sutrasApplied: SutraApplication[] = []

  if (biomarkers && biomarkers.length > 0) {
    const analysis = analyzeBiomarkerPatterns(biomarkers)
    ratioAnalysis = analysis.ratioAnalysis
    sutrasApplied = analysis.sutrasApplied
  }

  // Always add base sutras
  sutrasApplied.push({
    sutraName: SUTRAS[0].name,
    sutraText: SUTRAS[0].text,
    applicationContext: 'Health progression analysis',
    result: `Life path number ${healthNumber} — ${vedicPattern} pattern in health trajectory`
  })

  sutrasApplied.push({
    sutraName: SUTRAS[11].name,
    sutraText: SUTRAS[11].text,
    applicationContext: 'Cyclical health pattern detection',
    result: `Digital root today: ${biorhythm.digitalRootToday} — ${getDigitalRootHealth(biorhythm.digitalRootToday)}`
  })

  const biorhythmPhaseMap: Record<string, 'Peak' | 'Rising' | 'Declining' | 'Critical'> = {
    Peak: 'Peak', Rising: 'Rising', Declining: 'Declining',
    Critical: 'Critical', Transition: 'Declining'
  }

  return {
    digitalRoot: healthNumber,
    numerologicalSignature: todayDigitSum,
    patternType: vedicPattern,
    healthPattern: biorhythm.physicalPhase,
    biorhythmPhase: biorhythmPhaseMap[biorhythm.physicalPhase] || 'Rising',
    optimalWindows: biorhythm.optimalWindows,
    sutrasApplied,
    ratioAnalysis
  }
}


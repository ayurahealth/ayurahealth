// ============================================================
// JYOTISH ENGINE — Vedic Astrology Calculations
// Full Vimshottari Dasha + Birth Chart + Health Mapping
// ============================================================

import type {
  BirthData, JanmaKundali, GrahaPosition, DashaPeriod,
  VedicYoga, GrahaHealthProfile, Graha, Rashi, Dosha,
  PlanetaryInfluence, DailyGuidance
} from './types'

// ─── CONSTANTS ───────────────────────────────────────────────

export const RASHI_LIST: Rashi[] = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Karka',
  'Simha', 'Kanya', 'Tula', 'Vrishchika',
  'Dhanu', 'Makara', 'Kumbha', 'Meena'
]

export const NAKSHATRA_LIST = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
]

export const NAKSHATRA_LORDS: Record<string, Graha> = {
  Ashwini: 'Ketu', Bharani: 'Shukra', Krittika: 'Surya',
  Rohini: 'Chandra', Mrigashira: 'Mangal', Ardra: 'Rahu',
  Punarvasu: 'Guru', Pushya: 'Shani', Ashlesha: 'Budha',
  Magha: 'Ketu', 'Purva Phalguni': 'Shukra', 'Uttara Phalguni': 'Surya',
  Hasta: 'Chandra', Chitra: 'Mangal', Swati: 'Rahu',
  Vishakha: 'Guru', Anuradha: 'Shani', Jyeshtha: 'Budha',
  Mula: 'Ketu', 'Purva Ashadha': 'Shukra', 'Uttara Ashadha': 'Surya',
  Shravana: 'Chandra', Dhanishtha: 'Mangal', Shatabhisha: 'Rahu',
  'Purva Bhadrapada': 'Guru', 'Uttara Bhadrapada': 'Shani', Revati: 'Budha'
}

// Vimshottari Dasha periods in years
export const DASHA_YEARS: Record<Graha, number> = {
  Ketu: 7, Shukra: 20, Surya: 6, Chandra: 10, Mangal: 7,
  Rahu: 18, Guru: 16, Shani: 19, Budha: 17
}

// Dasha sequence starting from Ketu
export const DASHA_SEQUENCE: Graha[] = [
  'Ketu', 'Shukra', 'Surya', 'Chandra', 'Mangal',
  'Rahu', 'Guru', 'Shani', 'Budha'
]

// Rashi lords
export const RASHI_LORDS: Record<Rashi, Graha> = {
  Mesha: 'Mangal', Vrishabha: 'Shukra', Mithuna: 'Budha',
  Karka: 'Chandra', Simha: 'Surya', Kanya: 'Budha',
  Tula: 'Shukra', Vrishchika: 'Mangal', Dhanu: 'Guru',
  Makara: 'Shani', Kumbha: 'Shani', Meena: 'Guru'
}

// Exaltation signs
export const EXALTATION: Record<Graha, Rashi | null> = {
  Surya: 'Mesha', Chandra: 'Vrishabha', Mangal: 'Makara',
  Budha: 'Kanya', Guru: 'Karka', Shukra: 'Meena',
  Shani: 'Tula', Rahu: 'Vrishabha', Ketu: 'Vrishchika'
}

// Debilitation signs
export const DEBILITATION: Record<Graha, Rashi | null> = {
  Surya: 'Tula', Chandra: 'Vrishchika', Mangal: 'Karka',
  Budha: 'Meena', Guru: 'Makara', Shukra: 'Kanya',
  Shani: 'Mesha', Rahu: 'Vrishchika', Ketu: 'Vrishabha'
}

// ─── GRAHA HEALTH PROFILES ────────────────────────────────────

export const GRAHA_HEALTH_PROFILES: Record<Graha, GrahaHealthProfile> = {
  Surya: {
    graha: 'Surya', bodySystem: ['Cardiovascular', 'Skeletal', 'Immune'],
    organ: ['Heart', 'Right eye', 'Spine', 'Bones'],
    tissue: 'Asthi (Bone tissue)',
    dominantDosha: 'Pitta', dominantBhuta: 'Agni',
    disease: ['Heart disease', 'Hypertension', 'Bone disorders', 'Eye problems', 'Fever'],
    remedy: ['Surya Namaskara', 'Ruby gemstone', 'Copper vessel water', 'Wheat diet', 'Sunday fast'],
    gemstone: 'Ruby', mantra: 'Om Hreem Suraya Namaha', color: 'Orange/Red',
    day: 'Sunday', metal: 'Gold', healthScore: 7
  },
  Chandra: {
    graha: 'Chandra', bodySystem: ['Lymphatic', 'Reproductive', 'Neurological'],
    organ: ['Mind', 'Left eye', 'Lungs', 'Breasts', 'Stomach'],
    tissue: 'Rasa (Plasma/Lymph)',
    dominantDosha: 'Kapha', dominantBhuta: 'Jal',
    disease: ['Mental disorders', 'Anxiety', 'Respiratory issues', 'Hormonal imbalance', 'Fluid retention'],
    remedy: ['Moon meditation', 'Pearl gemstone', 'Silver vessel water', 'Rice diet', 'Monday fast'],
    gemstone: 'Pearl', mantra: 'Om Shreem Chandraya Namaha', color: 'White/Silver',
    day: 'Monday', metal: 'Silver', healthScore: 7
  },
  Mangal: {
    graha: 'Mangal', bodySystem: ['Muscular', 'Circulatory', 'Surgical'],
    organ: ['Blood', 'Muscles', 'Bone marrow', 'Gallbladder'],
    tissue: 'Rakta (Blood tissue)',
    dominantDosha: 'Pitta', dominantBhuta: 'Agni',
    disease: ['Inflammation', 'Blood disorders', 'Accidents', 'Surgery', 'Hypertension', 'Skin eruptions'],
    remedy: ['Mars Mantra', 'Red Coral', 'Copper utensils', 'Red lentils', 'Tuesday fast'],
    gemstone: 'Red Coral', mantra: 'Om Kraam Kreem Kraum Sah Bhaumaya Namaha', color: 'Red',
    day: 'Tuesday', metal: 'Copper', healthScore: 6
  },
  Budha: {
    graha: 'Budha', bodySystem: ['Nervous', 'Digestive', 'Skin'],
    organ: ['Brain', 'Nervous system', 'Skin', 'Tongue', 'Lungs'],
    tissue: 'Majja (Nervous tissue)',
    dominantDosha: 'Vata', dominantBhuta: 'Prithvi',
    disease: ['Neurological issues', 'Skin diseases', 'Respiratory', 'Digestive disorders', 'Speech problems'],
    remedy: ['Mercury Mantra', 'Emerald', 'Green vegetables', 'Meditation', 'Wednesday fast'],
    gemstone: 'Emerald', mantra: 'Om Braam Breem Braum Sah Budhaya Namaha', color: 'Green',
    day: 'Wednesday', metal: 'Bronze', healthScore: 7
  },
  Guru: {
    graha: 'Guru', bodySystem: ['Liver', 'Endocrine', 'Adipose'],
    organ: ['Liver', 'Gall bladder', 'Hips', 'Thighs', 'Pancreas'],
    tissue: 'Meda (Fat tissue)',
    dominantDosha: 'Kapha', dominantBhuta: 'Akasha',
    disease: ['Liver disorders', 'Diabetes', 'Obesity', 'Hip problems', 'Jaundice'],
    remedy: ['Jupiter Mantra', 'Yellow Sapphire', 'Turmeric milk', 'Banana', 'Thursday fast'],
    gemstone: 'Yellow Sapphire', mantra: 'Om Graam Greem Graum Sah Gurave Namaha', color: 'Yellow',
    day: 'Thursday', metal: 'Gold', healthScore: 9
  },
  Shukra: {
    graha: 'Shukra', bodySystem: ['Reproductive', 'Renal', 'Sensory'],
    organ: ['Kidneys', 'Reproductive organs', 'Eyes', 'Throat', 'Skin'],
    tissue: 'Shukra (Reproductive tissue)',
    dominantDosha: 'Kapha', dominantBhuta: 'Jal',
    disease: ['Kidney disease', 'Reproductive disorders', 'Diabetes', 'Skin diseases', 'Venereal disease'],
    remedy: ['Venus Mantra', 'Diamond/White Sapphire', 'Rice with ghee', 'White flowers', 'Friday fast'],
    gemstone: 'Diamond', mantra: 'Om Draam Dreem Draum Sah Shukraya Namaha', color: 'White/Pink',
    day: 'Friday', metal: 'Silver', healthScore: 8
  },
  Shani: {
    graha: 'Shani', bodySystem: ['Skeletal', 'Immune', 'Chronic disease'],
    organ: ['Bones', 'Teeth', 'Hair', 'Spleen', 'Knees'],
    tissue: 'Asthi & Snayu (Bone & Tendons)',
    dominantDosha: 'Vata', dominantBhuta: 'Vayu',
    disease: ['Arthritis', 'Dental problems', 'Chronic illness', 'Paralysis', 'Depression', 'Nerve pain'],
    remedy: ['Saturn Mantra', 'Blue Sapphire', 'Sesame oil massage', 'Iron utensils', 'Saturday fast'],
    gemstone: 'Blue Sapphire', mantra: 'Om Praam Preem Praum Sah Shanaischaraya Namaha', color: 'Blue/Black',
    day: 'Saturday', metal: 'Iron', healthScore: 5
  },
  Rahu: {
    graha: 'Rahu', bodySystem: ['Toxin', 'Neurological', 'Unusual illness'],
    organ: ['Unknown/unusual', 'Subconsciousness', 'Toxin accumulation'],
    tissue: 'All tissues (imbalance)',
    dominantDosha: 'Vata', dominantBhuta: 'Vayu',
    disease: ['Mysterious illness', 'Addiction', 'Phobias', 'Skin diseases', 'Viral infections', 'Poisoning'],
    remedy: ['Rahu Mantra', 'Hessonite Garnet', 'Coconut donation', 'Detox practices', 'Rahu transit watch'],
    gemstone: 'Hessonite', mantra: 'Om Bhram Bhreem Bhraum Sah Rahave Namaha', color: 'Dark Blue/Grey',
    day: 'Saturday', metal: 'Lead', healthScore: 4
  },
  Ketu: {
    graha: 'Ketu', bodySystem: ['Spiritual', 'Immunity', 'Liberation'],
    organ: ['Spine', 'Abdomen', 'Immune system', 'Spiritual centers'],
    tissue: 'Ojas (Vital essence)',
    dominantDosha: 'Pitta', dominantBhuta: 'Agni',
    disease: ['Unexplained fever', 'Wounds', 'Spiritual crisis', 'Intestinal issues', 'Skin markings'],
    remedy: ['Ketu Mantra', 'Cats Eye', 'Spiritual practice', 'Animal service', 'Ketu fast'],
    gemstone: 'Cats Eye', mantra: 'Om Sraam Sreem Sraum Sah Ketave Namaha', color: 'Smoke/Multi',
    day: 'Tuesday', metal: 'Mixed metals', healthScore: 6
  }
}

// Dasha health implications
export const DASHA_HEALTH: Record<Graha, {
  health: string, vulnerability: string[], strength: string[], dominantDosha: Dosha
}> = {
  Surya: {
    health: 'Period of vitality and strength. Heart and bone health prominent. Leadership energy high.',
    vulnerability: ['Heart strain', 'Eye problems', 'Ego-related stress', 'Bone density changes'],
    strength: ['Strong immunity', 'Leadership vitality', 'Bone strength', 'Mental clarity'],
    dominantDosha: 'Pitta'
  },
  Chandra: {
    health: 'Emotional and mental health period. Hormonal fluctuations. Fluid balance important.',
    vulnerability: ['Anxiety', 'Hormonal imbalance', 'Respiratory sensitivity', 'Emotional eating'],
    strength: ['Emotional intelligence', 'Intuition', 'Fluid balance', 'Nurturing capacity'],
    dominantDosha: 'Kapha'
  },
  Mangal: {
    health: 'High energy, possible inflammation. Blood health important. Avoid aggression and recklessness.',
    vulnerability: ['Inflammation', 'Accidents', 'Blood pressure', 'Skin eruptions', 'Anger-related illness'],
    strength: ['Physical stamina', 'Courage', 'Muscular strength', 'Surgical recovery'],
    dominantDosha: 'Pitta'
  },
  Rahu: {
    health: 'Unconventional health issues. Toxin accumulation risk. Mental health needs attention.',
    vulnerability: ['Mysterious illness', 'Addiction risk', 'Anxiety', 'Toxin buildup', 'Respiratory'],
    strength: ['Unconventional healing', 'Research instinct', 'Transformation capacity'],
    dominantDosha: 'Vata'
  },
  Guru: {
    health: 'Generally auspicious. Liver and metabolic health. Wisdom guides health decisions.',
    vulnerability: ['Liver strain', 'Weight gain', 'Overindulgence', 'Hip and knee issues'],
    strength: ['Healing wisdom', 'Liver function', 'Optimism', 'Spiritual health', 'Longevity'],
    dominantDosha: 'Kapha'
  },
  Shani: {
    health: 'Slowest period requiring patience. Chronic conditions may surface. Deep purification.',
    vulnerability: ['Arthritis', 'Depression', 'Chronic fatigue', 'Bone issues', 'Delayed recovery'],
    strength: ['Endurance', 'Discipline', 'Detoxification', 'Long-term health building'],
    dominantDosha: 'Vata'
  },
  Budha: {
    health: 'Mental agility and nervous system health. Communication of health needs important.',
    vulnerability: ['Nervous system', 'Skin sensitivity', 'Anxiety', 'Respiratory', 'Digestive'],
    strength: ['Mental clarity', 'Analytical healing', 'Adaptability', 'Communication'],
    dominantDosha: 'Vata'
  },
  Ketu: {
    health: 'Spiritual health period. Detachment from physical. May reveal past health karma.',
    vulnerability: ['Mysterious wounds', 'Spiritual crisis', 'Isolation-related health', 'Fever'],
    strength: ['Spiritual immunity', 'Deep healing', 'Liberation from chronic patterns'],
    dominantDosha: 'Pitta'
  },
  Shukra: {
    health: 'Sensory pleasure period. Kidney and reproductive health. Beauty and longevity focus.',
    vulnerability: ['Kidney strain', 'Reproductive issues', 'Overindulgence', 'Diabetes risk'],
    strength: ['Reproductive vitality', 'Kidney health', 'Sensory joy', 'Artistic healing'],
    dominantDosha: 'Kapha'
  }
}

// ─── CALCULATION FUNCTIONS ────────────────────────────────────

function julianDay(year: number, month: number, day: number): number {
  if (month <= 2) { year--; month += 12 }
  const A = Math.floor(year / 100)
  const B = 2 - A + Math.floor(A / 4)
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5
}

function solarLongitude(jd: number): number {
  const n = jd - 2451545.0
  const L = (280.460 + 0.9856474 * n) % 360
  const g = ((357.528 + 0.9856003 * n) % 360) * Math.PI / 180
  const lambda = L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)
  return ((lambda % 360) + 360) % 360
}

function lunarLongitude(jd: number): number {
  const n = jd - 2451545.0
  const L = (218.316 + 13.176396 * n) % 360
  const M = (134.963 + 13.064993 * n) % 360
  const F = (93.272 + 13.229350 * n) % 360
  const Mrad = M * Math.PI / 180
  const Frad = F * Math.PI / 180
  const lambda = L + 6.289 * Math.sin(Mrad) - 1.274 * Math.sin(2 * Frad - Mrad)
               + 0.658 * Math.sin(2 * Frad) - 0.186 * Math.sin(Mrad * 2)
  return ((lambda % 360) + 360) % 360
}

function getAyanamsha(jd: number): number {
  // Lahiri ayanamsha approximation
  const T = (jd - 2415020.0) / 36524.22
  return 22.4606 + 1.3960 * T + 0.000303 * T * T
}

function tropicalToSidereal(tropicalLong: number, jd: number): number {
  const ayanamsha = getAyanamsha(jd)
  return ((tropicalLong - ayanamsha) % 360 + 360) % 360
}

function longitudeToRashi(longitude: number): { rashi: Rashi; degree: number } {
  const rashiIndex = Math.floor(longitude / 30)
  const degree = longitude % 30
  return { rashi: RASHI_LIST[rashiIndex] || RASHI_LIST[0], degree }
}

function longitudeToNakshatra(longitude: number): { nakshatra: string; pada: number } {
  const nakshatraIndex = Math.floor(longitude / (360 / 27))
  const nakshatra = NAKSHATRA_LIST[nakshatraIndex % 27]
  const posInNakshatra = longitude % (360 / 27)
  const pada = Math.floor(posInNakshatra / (360 / 27 / 4)) + 1
  return { nakshatra, pada: Math.min(pada, 4) }
}

function getPlanetLongitude(graha: Graha, jd: number): number {
  const n = jd - 2451545.0
  // Simplified mean longitudes for each planet (tropical)
  const meanLongitudes: Partial<Record<Graha, number>> = {
    Surya: (280.460 + 0.9856474 * n) % 360,
    Chandra: (218.316 + 13.176396 * n) % 360,
    Mangal: (355.433 + 0.5240208 * n) % 360,
    Budha: (252.251 + 4.0923345 * n) % 360,
    Guru: (34.351 + 0.0830853 * n) % 360,
    Shukra: (181.979 + 1.6021302 * n) % 360,
    Shani: (50.077 + 0.0334442 * n) % 360,
  }
  if (graha === 'Rahu') {
    return ((125.045 - 0.0529538 * n) % 360 + 360) % 360
  }
  if (graha === 'Ketu') {
    return ((305.045 - 0.0529538 * n) % 360 + 360) % 360
  }
  const raw = meanLongitudes[graha] ?? 0
  return ((raw % 360) + 360) % 360
}

function getHouseNumber(planetRashi: Rashi, lagnaRashi: Rashi): number {
  const lagnaIndex = RASHI_LIST.indexOf(lagnaRashi)
  const planetIndex = RASHI_LIST.indexOf(planetRashi)
  return ((planetIndex - lagnaIndex + 12) % 12) + 1
}

function calculateLagna(
  jd: number, timeOfBirth: string, latitude: number, longitude: number, timezone: number
): Rashi {
  const [hours] = timeOfBirth.split(':').map(Number)
  const lstHours = (hours - timezone + longitude / 15 + 24) % 24
  const lstDegrees = lstHours * 15
  const sunLong = tropicalToSidereal(solarLongitude(jd), jd)
  const ramc = (lstDegrees + sunLong) % 360
  const lagnaApprox = (ramc + 90) % 360
  const { rashi } = longitudeToRashi(lagnaApprox)
  return rashi
}

function calculateDashaFromNakshatra(
  nakshatra: string, birthDate: Date, elapsedFraction: number
): DashaPeriod[] {
  const nakshatraLord = NAKSHATRA_LORDS[nakshatra] || 'Ketu'
  const startIndex = DASHA_SEQUENCE.indexOf(nakshatraLord)

  const periods: DashaPeriod[] = []
  let currentDate = new Date(birthDate)

  // First dasha has remaining portion based on nakshatra position
  for (let i = 0; i < 9; i++) {
    const grahaIndex = (startIndex + i) % 9
    const graha = DASHA_SEQUENCE[grahaIndex]
    const totalYears = DASHA_YEARS[graha]
    const yearsRemaining = i === 0 ? totalYears * (1 - elapsedFraction) : totalYears

    const startDate = new Date(currentDate)
    const endDate = new Date(currentDate)
    endDate.setFullYear(endDate.getFullYear() + Math.floor(yearsRemaining))
    endDate.setMonth(endDate.getMonth() + Math.round((yearsRemaining % 1) * 12))

    const healthData = DASHA_HEALTH[graha]
    periods.push({
      lord: graha,
      startDate,
      endDate,
      durationYears: yearsRemaining,
      healthImplication: healthData.health,
      dominantDosha: healthData.dominantDosha,
      vulnerability: healthData.vulnerability,
      strength: healthData.strength
    })

    currentDate = new Date(endDate)
  }

  return periods
}

function detectYogas(grahaPositions: GrahaPosition[]): VedicYoga[] {
  const yogas: VedicYoga[] = []

  const guruPos = grahaPositions.find(g => g.graha === 'Guru')
  const chandraPos = grahaPositions.find(g => g.graha === 'Chandra')
  const suryaPos = grahaPositions.find(g => g.graha === 'Surya')

  // Gaja Kesari Yoga — Jupiter in kendra from Moon
  if (guruPos && chandraPos) {
    const moonIndex = RASHI_LIST.indexOf(chandraPos.rashi)
    const guruIndex = RASHI_LIST.indexOf(guruPos.rashi)
    const diff = Math.abs(guruIndex - moonIndex)
    if ([0, 3, 6, 9].includes(diff) || [0, 3, 6, 9].includes(12 - diff)) {
      yogas.push({
        name: 'Gaja Kesari Yoga',
        type: 'longevity',
        description: 'Jupiter in angular position from Moon — elephant-lion combination',
        healthImpact: 'Exceptional longevity, strong immune system, natural healing capacity. Jupiter\'s wisdom guides health decisions.',
        isActive: true
      })
    }
  }

  // Budhaditya Yoga — Mercury and Sun together
  const budhaPos = grahaPositions.find(g => g.graha === 'Budha')
  if (suryaPos && budhaPos && suryaPos.rashi === budhaPos.rashi) {
    yogas.push({
      name: 'Budhaditya Yoga',
      type: 'wisdom',
      description: 'Mercury conjunct Sun — intelligence and vitality combined',
      healthImpact: 'Sharp analytical mind for health. Strong nervous system. Good diagnostic intuition.',
      isActive: true
    })
  }

  // Chandra-Mangal Yoga
  const mangalPos = grahaPositions.find(g => g.graha === 'Mangal')
  if (chandraPos && mangalPos && chandraPos.rashi === mangalPos.rashi) {
    yogas.push({
      name: 'Chandra-Mangal Yoga',
      type: 'health',
      description: 'Moon conjunct Mars — emotional fire combination',
      healthImpact: 'High physical energy but emotional turbulence. Blood and immune strength. Watch inflammatory conditions.',
      isActive: true
    })
  }

  // Saraswati Yoga — Venus, Mercury, Jupiter strong
  const shukraPos = grahaPositions.find(g => g.graha === 'Shukra')
  if (guruPos && budhaPos && shukraPos) {
    if (!guruPos.isDebilitated && !budhaPos.isDebilitated && !shukraPos.isDebilitated) {
      yogas.push({
        name: 'Saraswati Yoga',
        type: 'wisdom',
        description: 'Venus, Mercury, Jupiter all dignified — wisdom goddess blessing',
        healthImpact: 'Creative healing intelligence. Strong sensory health. Balanced hormones and reproductive vitality.',
        isActive: true
      })
    }
  }

  return yogas
}

// ─── MAIN CALCULATION FUNCTION ────────────────────────────────

export function calculateJanmaKundali(birthData: BirthData): JanmaKundali {
  const [year, month, day] = birthData.dateOfBirth.split('-').map(Number)
  const jd = julianDay(year, month, day)

  const sunTropical = solarLongitude(jd)
  const moonTropical = lunarLongitude(jd)
  const sunSidereal = tropicalToSidereal(sunTropical, jd)
  const moonSidereal = tropicalToSidereal(moonTropical, jd)

  const { rashi: sunSign } = longitudeToRashi(sunSidereal)
  const { rashi: moonSign } = longitudeToRashi(moonSidereal)
  const { nakshatra: birthNakshatra } = longitudeToNakshatra(moonSidereal)
  const birthNakshatraLord = NAKSHATRA_LORDS[birthNakshatra] || 'Ketu'

  const lagna = calculateLagna(jd, birthData.timeOfBirth, birthData.latitude, birthData.longitude, birthData.timezone)
  const lagnaLord = RASHI_LORDS[lagna]

  // Calculate all graha positions
  const grahas: Graha[] = ['Surya', 'Chandra', 'Mangal', 'Budha', 'Guru', 'Shukra', 'Shani', 'Rahu', 'Ketu']
  const grahaPositions: GrahaPosition[] = grahas.map(graha => {
    const tropLong = getPlanetLongitude(graha, jd)
    const sidLong = tropicalToSidereal(tropLong, jd)
    const { rashi, degree } = longitudeToRashi(sidLong)
    const { nakshatra, pada } = longitudeToNakshatra(sidLong)
    const house = getHouseNumber(rashi, lagna)

    return {
      graha,
      rashi,
      degree: parseFloat(degree.toFixed(2)),
      house,
      isRetrograde: ['Shani', 'Guru', 'Mangal', 'Budha', 'Shukra'].includes(graha) &&
                    (jd % 365 > 180 ? Math.random() > 0.7 : Math.random() > 0.8),
      isExalted: EXALTATION[graha] === rashi,
      isDebilitated: DEBILITATION[graha] === rashi,
      nakshatra,
      nakshatraPada: pada
    }
  })

  // Calculate elapsed fraction in birth nakshatra for dasha start
  const nakshatraSpan = 360 / 27
  const posInNakshatra = moonSidereal % nakshatraSpan
  const elapsedFraction = posInNakshatra / nakshatraSpan

  const birthDate = new Date(birthData.dateOfBirth)
  const dashaSequence = calculateDashaFromNakshatra(birthNakshatra, birthDate, elapsedFraction)

  const today = new Date()
  const currentDasha = dashaSequence.find(d => d.startDate <= today && d.endDate > today) || dashaSequence[0]

  // Calculate current antardasha
  const antardasha = calculateAntardasha(currentDasha, today)

  const yogas = detectYogas(grahaPositions)

  return {
    lagna,
    lagnaLord,
    moonSign,
    sunSign,
    grahaPositions,
    dashaSequence,
    currentDasha,
    currentAntardasha: antardasha,
    yogas,
    birthNakshatra,
    birthNakshatraLord
  }
}

function calculateAntardasha(mahadasha: DashaPeriod, today: Date): DashaPeriod {
  const totalDays = (mahadasha.endDate.getTime() - mahadasha.startDate.getTime()) / (1000 * 60 * 60 * 24)
  const elapsedDays = (today.getTime() - mahadasha.startDate.getTime()) / (1000 * 60 * 60 * 24)
  const elapsedFraction = elapsedDays / totalDays

  const startIndex = DASHA_SEQUENCE.indexOf(mahadasha.lord)
  const antardashaIndex = Math.floor(elapsedFraction * 9) % 9
  const antarLord = DASHA_SEQUENCE[(startIndex + antardashaIndex) % 9]
  const healthData = DASHA_HEALTH[antarLord]

  const antarStart = new Date(mahadasha.startDate)
  antarStart.setDate(antarStart.getDate() + Math.floor((antardashaIndex / 9) * totalDays))
  const antarEnd = new Date(mahadasha.startDate)
  antarEnd.setDate(antarEnd.getDate() + Math.floor(((antardashaIndex + 1) / 9) * totalDays))

  return {
    lord: antarLord,
    startDate: antarStart,
    endDate: antarEnd,
    durationYears: DASHA_YEARS[antarLord] / 9,
    healthImplication: `Antardasha of ${antarLord} in ${mahadasha.lord} Mahadasha. ${healthData.health}`,
    dominantDosha: healthData.dominantDosha,
    vulnerability: healthData.vulnerability,
    strength: healthData.strength
  }
}

export function getCurrentPlanetaryInfluences(kundali: JanmaKundali): PlanetaryInfluence[] {
  const today = new Date()
  const jdToday = julianDay(today.getFullYear(), today.getMonth() + 1, today.getDate())

  return (['Guru', 'Shani', 'Mangal'] as Graha[]).map(graha => {
    const tropLong = getPlanetLongitude(graha, jdToday)
    const sidLong = tropicalToSidereal(tropLong, jdToday)
    const { rashi } = longitudeToRashi(sidLong)
    const transitHouse = getHouseNumber(rashi, kundali.lagna)
    const profile = GRAHA_HEALTH_PROFILES[graha]

    const beneficHouses = [1, 4, 5, 7, 9, 10, 11]
    const effect = beneficHouses.includes(transitHouse) ? 'Beneficial' : 
                   [6, 8, 12].includes(transitHouse) ? 'Challenging' : 'Neutral'

    return {
      graha,
      currentTransitHouse: transitHouse,
      transitEffect: effect,
      healthArea: profile.bodySystem[0],
      duration: `${graha} transiting ${rashi} (~${graha === 'Guru' ? '1 year' : graha === 'Shani' ? '2.5 years' : '45 days'})`,
      advice: effect === 'Beneficial'
        ? `${graha} supports ${profile.bodySystem.join(', ')}. Good time for ${profile.remedy[0]}.`
        : effect === 'Challenging'
        ? `Watch for ${profile.disease.slice(0, 2).join(', ')}. Practice ${profile.remedy[1]} regularly.`
        : `${graha} is neutral. Maintain regular ${profile.remedy[0]} practice.`
    }
  })
}

export function generateDailyGuidance(kundali: JanmaKundali): DailyGuidance {
  const today = new Date()
  const jd = julianDay(today.getFullYear(), today.getMonth() + 1, today.getDate())
  const moonLong = tropicalToSidereal(lunarLongitude(jd), jd)
  const { nakshatra } = longitudeToNakshatra(moonLong)
  const { rashi: moonRashi } = longitudeToRashi(moonLong)
  const nakshatraLord = NAKSHATRA_LORDS[nakshatra]
  const nakshatraProfile = GRAHA_HEALTH_PROFILES[nakshatraLord]

  const tithiNumber = Math.floor((moonLong - tropicalToSidereal(solarLongitude(jd), jd) + 360) % 360 / 12) + 1
  const tithiNames = ['Pratipada','Dvitiya','Tritiya','Chaturthi','Panchami','Shashthi','Saptami','Ashtami','Navami','Dashami','Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Purnima/Amavasya']
  const tithi = tithiNames[Math.min(tithiNumber - 1, 14)]

  const dayOfWeek = today.getDay()
  const dayGraha: Graha[] = ['Surya', 'Chandra', 'Mangal', 'Budha', 'Guru', 'Shukra', 'Shani']
  const todayGraha = dayGraha[dayOfWeek]
  const todayProfile = GRAHA_HEALTH_PROFILES[todayGraha]
  const currentDashaProfile = GRAHA_HEALTH_PROFILES[kundali.currentDasha.lord]

  return {
    date: today.toISOString().split('T')[0],
    tithi,
    nakshatra,
    yoga: `Vedic Yoga: Auspicious for ${nakshatraProfile.bodySystem[0]} healing`,
    karana: tithiNumber % 2 === 0 ? 'Bava' : 'Balava',
    rashifal: `Moon in ${moonRashi} — ${nakshatraProfile.bodySystem[0]} and ${nakshatraProfile.organ[0]} health highlighted`,
    healthAdvice: `${kundali.currentDasha.lord} Mahadasha + ${nakshatra} Nakshatra: Focus on ${currentDashaProfile.organ.join(', ')}. ${nakshatraProfile.remedy[0]} recommended today.`,
    auspiciousTimes: ['6:00-7:30 AM (Brahma Muhurta)', '12:00-1:00 PM (Abhijit Muhurta)'],
    avoidTimes: ['12:00-1:00 PM (Rahu Kaal varies by weekday)', 'Sunset period for medicine'],
    recommendedPractices: [
      `${todayGraha} day practices: ${todayProfile.remedy.slice(0, 2).join(', ')}`,
      `Nakshatra practice: ${nakshatra} — ${nakshatraProfile.remedy[0]}`,
      `Dasha support: ${currentDashaProfile.mantra}`
    ],
    herbsToday: nakshatraProfile.remedy.filter(r => !r.includes('fast') && !r.includes('day')),
    colorToWear: todayProfile.color,
    mantraForToday: todayProfile.mantra
  }
}


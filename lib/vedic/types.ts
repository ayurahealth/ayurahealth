// ============================================================
// AYURA INTELLIGENCE — VEDIC INTELLIGENCE TYPES
// Complete type system for Jyotish, Vedic Math & Vedic Science
// ============================================================

export type Rashi =
  | 'Mesha' | 'Vrishabha' | 'Mithuna' | 'Karka'
  | 'Simha' | 'Kanya' | 'Tula' | 'Vrishchika'
  | 'Dhanu' | 'Makara' | 'Kumbha' | 'Meena'

export type Graha =
  | 'Surya' | 'Chandra' | 'Mangal' | 'Budha'
  | 'Guru' | 'Shukra' | 'Shani' | 'Rahu' | 'Ketu'

export type Dosha = 'Vata' | 'Pitta' | 'Kapha' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Vata-Kapha' | 'Tridoshic'

export type Bhuta = 'Akasha' | 'Vayu' | 'Agni' | 'Jal' | 'Prithvi'

export type Guna = 'Sattva' | 'Rajas' | 'Tamas'

export type DashaLord = Graha

export interface BirthData {
  dateOfBirth: string    // ISO date: YYYY-MM-DD
  timeOfBirth: string    // HH:MM (24h)
  placeOfBirth: string   // City, Country
  latitude: number
  longitude: number
  timezone: number       // UTC offset in hours
}

export interface GrahaPosition {
  graha: Graha
  rashi: Rashi
  degree: number
  house: number
  isRetrograde: boolean
  isExalted: boolean
  isDebilitated: boolean
  nakshatra: string
  nakshatraPada: number
}

export interface JanmaKundali {
  lagna: Rashi
  lagnaLord: Graha
  moonSign: Rashi
  sunSign: Rashi
  grahaPositions: GrahaPosition[]
  dashaSequence: DashaPeriod[]
  currentDasha: DashaPeriod
  currentAntardasha: DashaPeriod
  yogas: VedicYoga[]
  birthNakshatra: string
  birthNakshatraLord: Graha
}

export interface DashaPeriod {
  lord: DashaLord
  startDate: Date
  endDate: Date
  durationYears: number
  healthImplication: string
  dominantDosha: Dosha
  vulnerability: string[]
  strength: string[]
}

export interface VedicYoga {
  name: string
  type: 'health' | 'wealth' | 'wisdom' | 'longevity' | 'challenge'
  description: string
  healthImpact: string
  isActive: boolean
}

export interface GrahaHealthProfile {
  graha: Graha
  bodySystem: string[]
  organ: string[]
  tissue: string
  dominantDosha: Dosha
  dominantBhuta: Bhuta
  disease: string[]
  remedy: string[]
  gemstone: string
  mantra: string
  color: string
  day: string
  metal: string
  healthScore: number  // 0-10 based on position strength
}

export interface PanchaBhutaProfile {
  dominant: Bhuta
  secondary: Bhuta
  deficient: Bhuta
  akashaPercentage: number
  vayuPercentage: number
  agniPercentage: number
  jalPercentage: number
  prithviPercentage: number
  overallBalance: 'Balanced' | 'Slightly Imbalanced' | 'Moderately Imbalanced' | 'Severely Imbalanced'
  recommendations: BhutaRecommendation[]
}

export interface BhutaRecommendation {
  bhuta: Bhuta
  action: 'Increase' | 'Decrease' | 'Maintain'
  practices: string[]
  foods: string[]
  colors: string[]
  sounds: string[]
}

export interface VedicMathAnalysis {
  digitalRoot: number
  numerologicalSignature: number
  patternType: string
  healthPattern: string
  biorhythmPhase: 'Peak' | 'Rising' | 'Declining' | 'Critical'
  optimalWindows: TimeWindow[]
  sutrasApplied: SutraApplication[]
  ratioAnalysis: RatioAnalysis[]
}

export interface TimeWindow {
  type: 'Exercise' | 'Medication' | 'Fasting' | 'Rest' | 'Meditation' | 'Treatment'
  startHour: number
  endHour: number
  quality: 'Excellent' | 'Good' | 'Moderate' | 'Avoid'
  reason: string
}

export interface SutraApplication {
  sutraName: string
  sutraText: string
  applicationContext: string
  result: string
}

export interface RatioAnalysis {
  markers: string[]
  ratio: number
  vedicPattern: string
  healthSignificance: string
  tradition: string
}

export interface PranaAnalysis {
  prana: PranaVayu
  strength: number  // 0-10
  imbalance: string
  practices: string[]
}

export interface PranaVayu {
  name: 'Prana' | 'Apana' | 'Samana' | 'Udana' | 'Vyana'
  location: string
  function: string
  governedOrgan: string[]
  imbalanceSymptoms: string[]
}

export interface VedicOracleResponse {
  birthChart: JanmaKundali
  currentPlanetaryInfluences: PlanetaryInfluence[]
  panchaBhuta: PanchaBhutaProfile
  pranaProfile: PranaAnalysis[]
  vedicMathInsights: VedicMathAnalysis
  vedicHealthScore: VedicHealthScore
  dailyVedicGuidance: DailyGuidance
  remedies: VedicRemedy[]
  vaidyaContext: string  // Injected into VAIDYA AI prompt
}

export interface PlanetaryInfluence {
  graha: Graha
  currentTransitHouse: number
  transitEffect: 'Beneficial' | 'Challenging' | 'Neutral'
  healthArea: string
  duration: string
  advice: string
}

export interface VedicHealthScore {
  overall: number        // 0-100
  physical: number
  mental: number
  spiritual: number
  longevity: number
  components: ScoreComponent[]
}

export interface ScoreComponent {
  name: string
  score: number
  weight: number
  description: string
}

export interface DailyGuidance {
  date: string
  tithi: string
  nakshatra: string
  yoga: string
  karana: string
  rashifal: string
  healthAdvice: string
  auspiciousTimes: string[]
  avoidTimes: string[]
  recommendedPractices: string[]
  herbsToday: string[]
  colorToWear: string
  mantraForToday: string
}

export interface VedicRemedy {
  type: 'Mantra' | 'Gemstone' | 'Herb' | 'Yoga' | 'Diet' | 'Ritual' | 'Color' | 'Fasting'
  title: string
  description: string
  duration: string
  targetGraha?: Graha
  targetDosha?: Dosha
  targetBhuta?: Bhuta
  urgency: 'Immediate' | 'Soon' | 'Ongoing'
}


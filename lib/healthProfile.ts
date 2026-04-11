// VAIDYA Health Profile — grows with every conversation

export interface HealthProfile {
  conditions: string[]       // "anxiety", "IBS", "insomnia" etc
  medications: string[]      // current meds/supplements
  goals: string[]            // "lose weight", "better sleep"
  allergies: string[]        // known allergies
  lifestyle: {
    diet?: string            // "vegetarian", "keto" etc
    sleep?: string           // "6hrs", "poor quality"
    stress?: string          // "high", "work related"
    exercise?: string        // "daily yoga", "sedentary"
  }
  symptoms: string[]         // recurring symptoms mentioned
  whatWorked: string[]       // things that helped them
  season?: string            // current season context
  lastUpdated: number
}

const PROFILE_KEY = 'ayurahealth_profile_v1'

export function loadProfile(): HealthProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return emptyProfile()
    return JSON.parse(raw) as HealthProfile
  } catch { return emptyProfile() }
}

export function saveProfile(profile: HealthProfile) {
  try {
    profile.lastUpdated = Date.now()
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  } catch {}
}

export function clearProfile() {
  try { localStorage.removeItem(PROFILE_KEY) } catch {}
}

export function emptyProfile(): HealthProfile {
  return {
    conditions: [], medications: [], goals: [],
    allergies: [], symptoms: [], whatWorked: [],
    lifestyle: {}, lastUpdated: 0
  }
}

// Extract health clues from a conversation message
export function extractHealthClues(text: string, profile: HealthProfile): HealthProfile {
  const lower = text.toLowerCase()
  const updated = { ...profile }

  // Conditions
  const conditionKeywords = ['anxiety', 'depression', 'insomnia', 'diabetes', 'hypertension',
    'ibs', 'pcos', 'thyroid', 'arthritis', 'migraine', 'asthma', 'eczema', 'acne',
    'fatigue', 'bloating', 'constipation', 'stress', 'back pain', 'joint pain']
  conditionKeywords.forEach(c => {
    if (lower.includes(c) && !updated.conditions.includes(c)) {
      updated.conditions.push(c)
    }
  })

  // Diet
  if (lower.includes('vegetarian') || lower.includes('vegan')) updated.lifestyle.diet = 'vegetarian'
  if (lower.includes('keto') || lower.includes('carnivore')) updated.lifestyle.diet = 'keto'
  if (lower.includes('gluten free')) updated.lifestyle.diet = 'gluten-free'

  // Lifestyle
  if (lower.includes('yoga') || lower.includes('meditation')) updated.lifestyle.exercise = 'yoga/meditation'
  if (lower.includes('gym') || lower.includes('workout')) updated.lifestyle.exercise = 'gym'
  if (lower.includes('sedentary') || lower.includes("don't exercise")) updated.lifestyle.exercise = 'sedentary'

  // Keep profile bounded — max 10 items per array
  updated.conditions = [...new Set(updated.conditions)].slice(0, 10)
  updated.symptoms = [...new Set(updated.symptoms)].slice(0, 10)

  return updated
}

/**
 * Syncs the local health profile to the server-side Clinical Memory.
 */
export async function syncProfileToCloud(profile: HealthProfile) {
  try {
    const res = await fetch('/api/profile/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to sync profile to clinical memory:', err);
    return false;
  }
}

export interface HealthScores {
  healthScore: number        // Overall 0-100
  doshaBalance: number       // Physical balance 0-100
  dashaInfluence: number     // Temporal/stress factor 0-100
  sentimentScore: number     // Emotional state 0-100
}

/**
 * Calculates health scores from conversation messages.
 * Analyzes conditions, symptoms, sentiment, and lifestyle factors.
 */
export function calculateHealthScores(messages: Array<{ role: string; content: string }>, profile?: HealthProfile): HealthScores {
  if (!messages || messages.length === 0) {
    return { healthScore: 72, doshaBalance: 80, dashaInfluence: 65, sentimentScore: 70 }
  }

  // Build profile from messages if not provided
  const currentProfile = profile || messages.reduce((acc, msg) => {
    if (msg.role === 'user') {
      return extractHealthClues(msg.content, acc)
    }
    return acc
  }, emptyProfile())

  // 1. Calculate Dosha Balance (Physical) - based on conditions vs wellness indicators
  const wellnessIndicators = ['good', 'great', 'excellent', 'healthy', 'balanced', 'working', 'improved', 'better']
  const imbalanceIndicators = ['pain', 'suffering', 'worse', 'terrible', 'awful', 'struggling', 'difficult', 'severe', 'chronic', 'acute']

  let wellnessCount = 0
  let imbalanceCount = 0

  messages.forEach(msg => {
    const lower = msg.content.toLowerCase()
    wellnessIndicators.forEach(w => { if (lower.includes(w)) wellnessCount++ })
    imbalanceIndicators.forEach(i => { if (lower.includes(i)) imbalanceCount++ })
  })

  // Base dosha balance on condition count and sentiment
  const conditionPenalty = Math.min(currentProfile.conditions.length * 3, 25)
  const symptomPenalty = Math.min(currentProfile.symptoms.length * 2, 15)
  const sentimentAdjustment = (wellnessCount - imbalanceCount) * 2
  const doshaBalance = Math.max(20, Math.min(100, 85 - conditionPenalty - symptomPenalty + sentimentAdjustment))

  // 2. Calculate Dasha Influence (Temporal/Stress) - based on stress mentions and lifestyle
  const stressKeywords = ['stress', 'anxious', 'overwhelmed', 'pressure', 'deadline', 'busy', 'tired', 'exhausted', 'insomnia', 'sleep']
  const lifestyleKeywords = ['yoga', 'meditation', 'exercise', 'walk', 'gym', 'routine', 'discipline', 'dinacharya']

  let stressCount = 0
  let lifestyleCount = 0

  messages.forEach(msg => {
    const lower = msg.content.toLowerCase()
    stressKeywords.forEach(s => { if (lower.includes(s)) stressCount++ })
    lifestyleKeywords.forEach(l => { if (lower.includes(l)) lifestyleCount++ })
  })

  const stressPenalty = Math.min(stressCount * 4, 30)
  const lifestyleBonus = Math.min(lifestyleCount * 3, 20)
  const sleepPenalty = currentProfile.lifestyle.sleep?.toLowerCase().includes('poor') ||
                       currentProfile.lifestyle.sleep?.toLowerCase().includes('less') ? 10 : 0
  const dashaInfluence = Math.max(20, Math.min(100, 75 - stressPenalty + lifestyleBonus - sleepPenalty))

  // 3. Calculate Sentiment Score (Emotional) - based on language patterns
  const positiveWords = ['happy', 'grateful', 'hopeful', 'positive', 'optimistic', 'peaceful', 'calm', 'joy', 'love', 'thank']
  const negativeWords = ['sad', 'depressed', 'hopeless', 'negative', 'pessimistic', 'angry', 'frustrated', 'worried', 'fear', 'hate']

  let positiveCount = 0
  let negativeCount = 0

  messages.forEach(msg => {
    const lower = msg.content.toLowerCase()
    positiveWords.forEach(p => { if (lower.includes(p)) positiveCount++ })
    negativeWords.forEach(n => { if (lower.includes(n)) negativeCount++ })
  })

  const baseSentiment = 70
  const positiveBonus = Math.min(positiveCount * 3, 20)
  const negativePenalty = Math.min(negativeCount * 3, 25)
  const sentimentScore = Math.max(15, Math.min(100, baseSentiment + positiveBonus - negativePenalty))

  // 4. Calculate Overall Health Score - weighted average
  const healthScore = Math.round(
    (doshaBalance * 0.4) +     // 40% physical
    (dashaInfluence * 0.35) +  // 35% temporal/stress
    (sentimentScore * 0.25)    // 25% emotional
  )

  return {
    healthScore: Math.max(10, Math.min(100, healthScore)),
    doshaBalance: Math.max(10, Math.min(100, doshaBalance)),
    dashaInfluence: Math.max(10, Math.min(100, dashaInfluence)),
    sentimentScore: Math.max(10, Math.min(100, sentimentScore))
  }
}

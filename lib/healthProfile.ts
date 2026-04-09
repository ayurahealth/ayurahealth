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

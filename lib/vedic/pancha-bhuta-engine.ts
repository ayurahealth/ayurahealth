// ============================================================
// PANCHA BHUTA ENGINE — Five Great Elements
// Vedic Science: Elements → Doshas → Health
// ============================================================

import type { PanchaBhutaProfile, BhutaRecommendation, PranaAnalysis, Bhuta, Dosha } from './types'

// ─── ELEMENT-DOSHA RELATIONSHIPS ─────────────────────────────

export const BHUTA_DOSHA_MAP: Record<Bhuta, Dosha[]> = {
  Akasha: ['Vata'],
  Vayu: ['Vata'],
  Agni: ['Pitta'],
  Jal: ['Kapha'],
  Prithvi: ['Kapha']
}

export const BHUTA_QUALITIES: Record<Bhuta, {
  quality: string[]
  organ: string[]
  sense: string
  senseOrgan: string
  actionOrgan: string
  season: string
  symptoms: { excess: string[]; deficiency: string[] }
}> = {
  Akasha: {
    quality: ['Expansive', 'Infinite', 'Light', 'Subtle', 'Soft', 'Smooth'],
    organ: ['Ears', 'All hollow spaces', 'Heart cavities', 'Joints'],
    sense: 'Sound (Shabda)',
    senseOrgan: 'Ears',
    actionOrgan: 'Mouth (speech)',
    season: 'None — transcendent',
    symptoms: {
      excess: ['Disconnection', 'Dissociation', 'Hearing hypersensitivity', 'Feeling lost'],
      deficiency: ['Constriction', 'Congestion', 'Trapped feeling', 'Joint rigidity']
    }
  },
  Vayu: {
    quality: ['Mobile', 'Dry', 'Light', 'Cold', 'Rough', 'Clear', 'Subtle'],
    organ: ['Skin', 'Lungs', 'Nervous system', 'Colon', 'Bones'],
    sense: 'Touch (Sparsha)',
    senseOrgan: 'Skin',
    actionOrgan: 'Hands (grasping)',
    season: 'Late autumn / early winter',
    symptoms: {
      excess: ['Dryness', 'Anxiety', 'Constipation', 'Pain', 'Tremors', 'Insomnia'],
      deficiency: ['Stagnation', 'Slow movement', 'Heavy feeling', 'Sluggish digestion']
    }
  },
  Agni: {
    quality: ['Hot', 'Sharp', 'Light', 'Penetrating', 'Oily', 'Fluid'],
    organ: ['Eyes', 'Liver', 'Blood', 'Small intestine', 'Skin (complexion)'],
    sense: 'Sight (Rupa)',
    senseOrgan: 'Eyes',
    actionOrgan: 'Feet (locomotion)',
    season: 'Summer',
    symptoms: {
      excess: ['Inflammation', 'Fever', 'Acidity', 'Anger', 'Rashes', 'Burning sensation'],
      deficiency: ['Low metabolism', 'Poor digestion', 'Cold', 'Depression', 'Pale complexion']
    }
  },
  Jal: {
    quality: ['Cold', 'Wet', 'Heavy', 'Slow', 'Dull', 'Soft', 'Smooth', 'Oily'],
    organ: ['Tongue', 'Kidneys', 'Reproductive organs', 'Lymph', 'Plasma'],
    sense: 'Taste (Rasa)',
    senseOrgan: 'Tongue',
    actionOrgan: 'Genitals (reproduction)',
    season: 'Winter',
    symptoms: {
      excess: ['Edema', 'Mucus excess', 'Lethargy', 'Overweight', 'Congestion'],
      deficiency: ['Dehydration', 'Dry mouth', 'Scanty urine', 'Sexual debility']
    }
  },
  Prithvi: {
    quality: ['Heavy', 'Slow', 'Dull', 'Dense', 'Stable', 'Gross', 'Hard', 'Compact'],
    organ: ['Nose', 'Bones', 'Muscles', 'Hair', 'Nails', 'Teeth', 'Flesh'],
    sense: 'Smell (Gandha)',
    senseOrgan: 'Nose',
    actionOrgan: 'Anus (elimination)',
    season: 'Spring',
    symptoms: {
      excess: ['Heaviness', 'Obstruction', 'Excessive weight', 'Attachment', 'Greed'],
      deficiency: ['Weakness', 'Fragile bones', 'Poor muscle tone', 'Malnutrition']
    }
  }
}

// ─── SEASON-ELEMENT MAPPING ───────────────────────────────────

export function getCurrentElementalSeason(): Bhuta {
  const month = new Date().getMonth() + 1
  if (month >= 3 && month <= 4) return 'Prithvi'  // Spring — earth
  if (month >= 5 && month <= 8) return 'Agni'      // Summer — fire
  if (month >= 9 && month <= 10) return 'Vayu'     // Autumn — air
  if (month >= 11 || month <= 2) return 'Jal'      // Winter — water
  return 'Akasha'
}

// ─── CALCULATE PANCHA BHUTA FROM DOSHA ───────────────────────

export function calculatePanchaBhutaFromDosha(
  primaryDosha: Dosha,
  symptoms: string[] = [],
  age: number = 30,
  season?: Bhuta
): PanchaBhutaProfile {

  // Base percentages from dosha
  const baseBhuta: Record<Bhuta, number> = {
    Akasha: 20, Vayu: 20, Agni: 20, Jal: 20, Prithvi: 20
  }

  // Adjust based on primary dosha
  if (primaryDosha === 'Vata' || primaryDosha === 'Vata-Pitta' || primaryDosha === 'Vata-Kapha') {
    baseBhuta.Akasha += 12
    baseBhuta.Vayu += 15
    baseBhuta.Agni -= 8
    baseBhuta.Jal -= 10
    baseBhuta.Prithvi -= 9
  }
  if (primaryDosha === 'Pitta' || primaryDosha === 'Vata-Pitta' || primaryDosha === 'Pitta-Kapha') {
    baseBhuta.Agni += 20
    baseBhuta.Jal -= 5
    baseBhuta.Akasha -= 8
    baseBhuta.Vayu -= 5
    baseBhuta.Prithvi -= 2
  }
  if (primaryDosha === 'Kapha' || primaryDosha === 'Pitta-Kapha' || primaryDosha === 'Vata-Kapha') {
    baseBhuta.Jal += 18
    baseBhuta.Prithvi += 15
    baseBhuta.Agni -= 12
    baseBhuta.Vayu -= 12
    baseBhuta.Akasha -= 9
  }

  // Age adjustments (Vata increases with age)
  if (age > 50) {
    baseBhuta.Vayu += 8
    baseBhuta.Akasha += 5
    baseBhuta.Prithvi -= 8
    baseBhuta.Jal -= 5
  } else if (age < 20) {
    baseBhuta.Jal += 8
    baseBhuta.Prithvi += 5
    baseBhuta.Vayu -= 8
    baseBhuta.Akasha -= 5
  }

  // Season adjustment
  const currentSeason = season || getCurrentElementalSeason()
  baseBhuta[currentSeason] += 8

  // Symptom analysis
  const vataSymptoms = ['anxiety', 'constipation', 'dryness', 'pain', 'tremor', 'insomnia', 'fear']
  const pittaSymptoms = ['inflammation', 'fever', 'acidity', 'anger', 'rash', 'burning', 'irritability']
  const kaphaSymptoms = ['congestion', 'mucus', 'weight', 'lethargy', 'edema', 'slow', 'attachment']

  const symptomStr = symptoms.join(' ').toLowerCase()
  const vataCount = vataSymptoms.filter(s => symptomStr.includes(s)).length
  const pittaCount = pittaSymptoms.filter(s => symptomStr.includes(s)).length
  const kaphaCount = kaphaSymptoms.filter(s => symptomStr.includes(s)).length

  baseBhuta.Vayu += vataCount * 3
  baseBhuta.Akasha += vataCount * 2
  baseBhuta.Agni += pittaCount * 4
  baseBhuta.Jal += kaphaCount * 3
  baseBhuta.Prithvi += kaphaCount * 2

  // Normalize to 100
  const total = Object.values(baseBhuta).reduce((a, b) => a + b, 0)
  const normalized: Record<Bhuta, number> = {
    Akasha: Math.round((baseBhuta.Akasha / total) * 100),
    Vayu: Math.round((baseBhuta.Vayu / total) * 100),
    Agni: Math.round((baseBhuta.Agni / total) * 100),
    Jal: Math.round((baseBhuta.Jal / total) * 100),
    Prithvi: Math.round((baseBhuta.Prithvi / total) * 100),
  }

  // Find dominant and deficient
  const entries = Object.entries(normalized) as [Bhuta, number][]
  entries.sort((a, b) => b[1] - a[1])
  const dominant = entries[0][0]
  const secondary = entries[1][0]
  const deficient = entries[entries.length - 1][0]

  const maxDeviation = Math.max(...entries.map(([, v]) => Math.abs(v - 20)))
  const overallBalance = maxDeviation < 5 ? 'Balanced' :
                         maxDeviation < 10 ? 'Slightly Imbalanced' :
                         maxDeviation < 18 ? 'Moderately Imbalanced' : 'Severely Imbalanced'

  const recommendations = generateBhutaRecommendations(dominant, deficient, normalized)

  return {
    dominant,
    secondary,
    deficient,
    akashaPercentage: normalized.Akasha,
    vayuPercentage: normalized.Vayu,
    agniPercentage: normalized.Agni,
    jalPercentage: normalized.Jal,
    prithviPercentage: normalized.Prithvi,
    overallBalance,
    recommendations
  }
}

function generateBhutaRecommendations(
  dominant: Bhuta, deficient: Bhuta, normalized: Record<Bhuta, number>
): BhutaRecommendation[] {
  const recommendations: BhutaRecommendation[] = []

  const bhutaPractices: Record<Bhuta, {
    increase: { practices: string[]; foods: string[]; colors: string[]; sounds: string[] }
    decrease: { practices: string[]; foods: string[]; colors: string[]; sounds: string[] }
  }> = {
    Akasha: {
      increase: {
        practices: ['Silent meditation', 'Yoga Nidra', 'Sky gazing', 'Mantra recitation', 'Sound healing'],
        foods: ['Fasting (partial)', 'Light foods', 'Spiritual fasting', 'Clear broths'],
        colors: ['White', 'Sky blue', 'Violet'],
        sounds: ['AUM chanting', 'Bell sounds', 'Silence', 'Ha sound']
      },
      decrease: {
        practices: ['Grounding practices', 'Heavy yoga', 'Earth contact', 'Rhythmic movement'],
        foods: ['Root vegetables', 'Grains', 'Nuts', 'Heavy proteins'],
        colors: ['Brown', 'Red', 'Orange'],
        sounds: ['Drumming', 'Bass sounds', 'LAM mantra']
      }
    },
    Vayu: {
      increase: {
        practices: ['Pranayama', 'Outdoor walking', 'Dancing', 'Breathwork', 'Vata-increasing yoga'],
        foods: ['Raw foods', 'Dry foods', 'Light meals', 'Sprouts', 'Popcorn'],
        colors: ['Grey', 'Purple', 'Light blue'],
        sounds: ['YAM mantra', 'Wind instruments', 'Nature sounds']
      },
      decrease: {
        practices: ['Warm oil massage (Abhyanga)', 'Grounding meditation', 'Slow yin yoga', 'Warm baths'],
        foods: ['Warm cooked meals', 'Ghee', 'Root vegetables', 'Sesame', 'Warm milk with spices'],
        colors: ['Warm earth tones', 'Yellow', 'Orange'],
        sounds: ['LAM mantra', 'Steady rhythm', 'Deep humming']
      }
    },
    Agni: {
      increase: {
        practices: ['Sun salutation', 'Agni Sara breathing', 'Power yoga', 'Fasting', 'Sauna'],
        foods: ['Pungent spices', 'Ginger', 'Black pepper', 'Warm foods', 'Light proteins'],
        colors: ['Red', 'Orange', 'Gold'],
        sounds: ['RAM mantra', 'Fire crackling', 'Energizing music']
      },
      decrease: {
        practices: ['Moon meditation', 'Cooling pranayama (Sheetali)', 'Gentle yoga', 'Swimming'],
        foods: ['Cooling foods', 'Coconut', 'Pomegranate', 'Cucumber', 'Coriander', 'Fennel'],
        colors: ['Blue', 'White', 'Green'],
        sounds: ['VAM mantra', 'Water sounds', 'Gentle music']
      }
    },
    Jal: {
      increase: {
        practices: ['Swimming', 'Moon bath', 'Restorative yoga', 'Deep breathing', 'Emotional healing'],
        foods: ['Juicy fruits', 'Soups', 'Coconut water', 'Dairy', 'Watery vegetables'],
        colors: ['Silver', 'White', 'Blue'],
        sounds: ['VAM mantra', 'Water sounds', 'Flowing music']
      },
      decrease: {
        practices: ['Vigorous exercise', 'Dry sauna', 'Fasting', 'Dynamic pranayama', 'Sun exposure'],
        foods: ['Dry grains', 'Light legumes', 'Astringent foods', 'Reduce dairy and sweets'],
        colors: ['Orange', 'Red', 'Warm earth'],
        sounds: ['RAM mantra', 'Energizing beats']
      }
    },
    Prithvi: {
      increase: {
        practices: ['Walking barefoot on earth', 'Weight training', 'Gardening', 'Eating heavier meals', 'Rest'],
        foods: ['Root vegetables', 'Grains', 'Proteins', 'Dairy', 'Nuts', 'Heavier foods'],
        colors: ['Brown', 'Green', 'Yellow'],
        sounds: ['LAM mantra', 'Deep drumming', 'Earth sounds']
      },
      decrease: {
        practices: ['Vigorous cardio', 'Fasting', 'Dynamic yoga', 'Reducing sedentary time'],
        foods: ['Spicy foods', 'Light meals', 'Raw vegetables', 'Reduce grains and dairy'],
        colors: ['Purple', 'Sky blue', 'Violet'],
        sounds: ['HAM mantra', 'Light music', 'High frequency sounds']
      }
    }
  }

  if (normalized[dominant] > 30) {
    const data = bhutaPractices[dominant].decrease
    recommendations.push({
      bhuta: dominant,
      action: 'Decrease',
      practices: data.practices.slice(0, 3),
      foods: data.foods.slice(0, 4),
      colors: data.colors,
      sounds: data.sounds
    })
  }

  if (normalized[deficient] < 15) {
    const data = bhutaPractices[deficient].increase
    recommendations.push({
      bhuta: deficient,
      action: 'Increase',
      practices: data.practices.slice(0, 3),
      foods: data.foods.slice(0, 4),
      colors: data.colors,
      sounds: data.sounds
    })
  }

  // Add maintain recommendations for balanced elements
  const balanced = (Object.entries(normalized) as [Bhuta, number][])
    .filter(([, v]) => v >= 18 && v <= 24)
    .map(([b]) => b)

  balanced.slice(0, 1).forEach(bhuta => {
    recommendations.push({
      bhuta,
      action: 'Maintain',
      practices: ['Continue current practices', 'Regular monitoring'],
      foods: ['Balanced diet maintaining current proportions'],
      colors: ['Neutral, balanced colors'],
      sounds: ['Harmonious, balanced sounds']
    })
  })

  return recommendations
}

// ─── PRANA VAYU ANALYSIS ──────────────────────────────────────

export function analyzePranaVayus(
  dosha: Dosha,
  symptoms: string[] = []
): PranaAnalysis[] {
  const symptomStr = symptoms.join(' ').toLowerCase()

  const pranaData: PranaAnalysis[] = [
    {
      prana: {
        name: 'Prana',
        location: 'Head and chest',
        function: 'Inhalation, swallowing, sensory perception, mental functioning',
        governedOrgan: ['Heart', 'Lungs', 'Brain'],
        imbalanceSymptoms: ['Breathlessness', 'Anxiety', 'Poor concentration', 'Hiccups', 'Heart palpitations']
      },
      strength: calculatePranaStrength('Prana', dosha, symptomStr),
      imbalance: detectPranaImbalance('Prana', symptomStr),
      practices: ['Nadi Shodhana pranayama', 'Bhramari breathing', 'Heart meditation', 'Avoiding cold drinks']
    },
    {
      prana: {
        name: 'Apana',
        location: 'Lower abdomen and pelvis',
        function: 'Elimination, reproduction, birth, immune defense downward',
        governedOrgan: ['Colon', 'Kidneys', 'Bladder', 'Reproductive organs'],
        imbalanceSymptoms: ['Constipation', 'Bloating', 'Irregular menstruation', 'Lower back pain', 'Urinary issues']
      },
      strength: calculatePranaStrength('Apana', dosha, symptomStr),
      imbalance: detectPranaImbalance('Apana', symptomStr),
      practices: ['Apana strengthening yoga (Malasana)', 'Castor oil massage', 'Root lock (Mula Bandha)', 'Colon cleansing herbs']
    },
    {
      prana: {
        name: 'Samana',
        location: 'Solar plexus and navel',
        function: 'Digestion, metabolism, nutrient absorption, Agni regulation',
        governedOrgan: ['Stomach', 'Small intestine', 'Liver', 'Pancreas'],
        imbalanceSymptoms: ['Poor digestion', 'Malabsorption', 'Bloating', 'Weak metabolism', 'Blood sugar issues']
      },
      strength: calculatePranaStrength('Samana', dosha, symptomStr),
      imbalance: detectPranaImbalance('Samana', symptomStr),
      practices: ['Fire breathing (Kapalabhati)', 'Agni yoga poses', 'Ginger tea', 'Naval massage', 'Trikatu herb formula']
    },
    {
      prana: {
        name: 'Udana',
        location: 'Throat, diaphragm, upward',
        function: 'Speech, effort, enthusiasm, upward movements, memory, liberation',
        governedOrgan: ['Throat', 'Diaphragm', 'Memory centers', 'Voice'],
        imbalanceSymptoms: ['Throat problems', 'Speech difficulties', 'Low enthusiasm', 'Poor memory', 'Neck stiffness']
      },
      strength: calculatePranaStrength('Udana', dosha, symptomStr),
      imbalance: detectPranaImbalance('Udana', symptomStr),
      practices: ['Singing/chanting', 'Neck yoga', 'Ujjayi breathing', 'Brahmi herb', 'Throat opening yoga']
    },
    {
      prana: {
        name: 'Vyana',
        location: 'Whole body — circulatory',
        function: 'Circulation, distribution of nutrients, sweating, nerve impulse',
        governedOrgan: ['Heart', 'Blood vessels', 'Lymphatic system', 'Nerves', 'Skin'],
        imbalanceSymptoms: ['Poor circulation', 'Numbness', 'Dry skin', 'Cold extremities', 'Lymph stagnation']
      },
      strength: calculatePranaStrength('Vyana', dosha, symptomStr),
      imbalance: detectPranaImbalance('Vyana', symptomStr),
      practices: ['Full body massage (Abhyanga)', 'Dynamic yoga', 'Circulation herbs (Arjuna)', 'Dry brushing', 'Walking']
    }
  ]

  return pranaData
}

function calculatePranaStrength(
  pranaName: string, dosha: Dosha, symptomStr: string
): number {
  let strength = 7 // base

  // Dosha effects on prana
  if (dosha.includes('Vata')) {
    if (pranaName === 'Prana' || pranaName === 'Apana') strength -= 2
    if (pranaName === 'Vyana') strength -= 1
  }
  if (dosha.includes('Pitta')) {
    if (pranaName === 'Samana') strength -= 2
    if (pranaName === 'Udana') strength += 1
  }
  if (dosha.includes('Kapha')) {
    if (pranaName === 'Udana') strength -= 2
    if (pranaName === 'Vyana') strength -= 1
  }

  // Symptom deductions
  const pranaSymptoms: Record<string, string[]> = {
    Prana: ['breathless', 'anxiety', 'palpitat', 'hiccup'],
    Apana: ['constipat', 'bloat', 'menstruat', 'lower back', 'urinary'],
    Samana: ['digest', 'malabsorpt', 'metabol', 'blood sugar'],
    Udana: ['throat', 'speech', 'memory', 'enthusiasm'],
    Vyana: ['circulation', 'numb', 'cold extremit', 'dry skin']
  }

  const symptoms = pranaSymptoms[pranaName] || []
  symptoms.forEach(s => {
    if (symptomStr.includes(s)) strength -= 1.5
  })

  return Math.max(1, Math.min(10, strength))
}

function detectPranaImbalance(pranaName: string, symptomStr: string): string {
  const imbalances: Record<string, string> = {
    Prana: symptomStr.includes('anxiety') ? 'Vata disturbance — anxious Prana Vayu' :
           symptomStr.includes('breath') ? 'Restricted Prana flow — possible Kapha obstruction' :
           'Prana Vayu requires monitoring',
    Apana: symptomStr.includes('constipat') ? 'Downward Apana blocked — Vata accumulation in colon' :
           symptomStr.includes('bloat') ? 'Reversed Apana — gas moving upward (Pratiloma)' :
           'Apana Vayu functioning adequately',
    Samana: symptomStr.includes('digest') ? 'Samana disturbed — Agni (digestive fire) imbalanced' :
            symptomStr.includes('bloat') ? 'Samana Vayu irregular — food not properly samahara (integrated)' :
            'Samana Vayu stable',
    Udana: symptomStr.includes('throat') ? 'Udana blocked — expression and upward movement restricted' :
           'Udana Vayu clear — expression pathways open',
    Vyana: symptomStr.includes('cold') ? 'Vyana depleted — peripheral circulation reduced (Vata cold)' :
           'Vyana Vayu distributing well through body'
  }

  return imbalances[pranaName] || `${pranaName} Vayu status normal`
}


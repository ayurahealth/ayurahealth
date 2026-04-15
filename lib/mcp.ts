import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

/**
 * Ayura Intelligence MCP Server Instance
 * Exposes 5,000 years of Ayurveda and TCM wisdom to external AI researchers.
 */
export const mcpServer = new McpServer({
  name: 'Ayura Intelligence',
  version: '1.0.0',
})

// ── Resource: System Prompts ────────────────────────────────────────────────
mcpServer.resource(
  'system-prompt',
  new ResourceTemplate('prompt://{tradition}', { list: undefined }),
  async (uri, { tradition }) => {
    const content = tradition === 'ayurveda'
      ? 'Ayurveda System Prompt: Focus on Doshas (Vata/Pitta/Kapha), Charaka Samhita texts.'
      : tradition === 'tcm'
        ? 'TCM System Prompt: Focus on Qi, Meridians, Yin Yang balance, Huangdi Neijing.'
        : 'General Holistic System Prompt: Integrate ancient healing with modern science.'

    return {
      contents: [{ uri: uri.href, text: content }],
    }
  }
)

// ── Tool 1: Calculate Dosha ─────────────────────────────────────────────────
mcpServer.tool(
  'calculate_dosha',
  'Analyzes patient symptoms to determine the primary Ayurvedic Dosha imbalance (Vata, Pitta, or Kapha)',
  {
    symptoms: z.array(z.string()).describe('List of patient symptoms (e.g., ["dry skin", "anxiety", "cold hands"])'),
    bodyType: z.enum(['thin', 'medium', 'heavy']).describe('Patient body frame'),
    digestion: z.enum(['irregular', 'sharp', 'sluggish']).describe('Digestive pattern'),
  },
  async ({ symptoms, bodyType, digestion }) => {
    let vata = 0, pitta = 0, kapha = 0

    // Frame
    if (bodyType === 'thin') vata += 3
    else if (bodyType === 'medium') pitta += 3
    else kapha += 3

    // Digestion
    if (digestion === 'irregular') vata += 3
    else if (digestion === 'sharp') pitta += 3
    else kapha += 3

    // Symptom heuristics
    const vataKeywords = ['dry', 'anxiety', 'cold', 'insomnia', 'constipation', 'racing mind', 'cracking joints']
    const pittaKeywords = ['acid', 'heartburn', 'anger', 'inflammation', 'heat', 'sweat', 'rash', 'sharp']
    const kaphaKeywords = ['sluggish', 'mucus', 'weight gain', 'lethargy', 'depression', 'congestion', 'dull']

    for (const symptom of symptoms) {
      const s = symptom.toLowerCase()
      if (vataKeywords.some(k => s.includes(k))) vata += 2
      if (pittaKeywords.some(k => s.includes(k))) pitta += 2
      if (kaphaKeywords.some(k => s.includes(k))) kapha += 2
    }

    const total = vata + pitta + kapha || 1
    const scores = {
      Vata: { score: vata, percentage: Math.round((vata / total) * 100) },
      Pitta: { score: pitta, percentage: Math.round((pitta / total) * 100) },
      Kapha: { score: kapha, percentage: Math.round((kapha / total) * 100) }
    }

    const primary = Object.entries(scores).sort((a, b) => b[1].score - a[1].score)[0][0]

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            primary_imbalance: primary,
            scores,
            ayurvedic_recommendation: primary === 'Vata'
              ? 'Focus on grounding, warming, and nourishing. Warm sesame oil massage. Ashwagandha.'
              : primary === 'Pitta'
                ? 'Focus on cooling, calming, and soothing. Coconut oil, aloe vera. Brahmi.'
                : 'Focus on stimulating, activating, and lightening. Dry brushing, ginger tea. Tulsi.'
          }, null, 2)
        }
      ]
    }
  }
)

// ── Tool 2: Consult Classical Text ──────────────────────────────────────────
mcpServer.tool(
  'consult_classical_text',
  'Consult 5,000-year old medical texts for a specific health condition',
  {
    condition: z.string().describe('The health condition (e.g., "insomnia", "acid reflux")'),
    tradition: z.enum(['ayurveda', 'tcm', 'siddha']).describe('The healing tradition to consult'),
  },
  async ({ condition, tradition }) => {
    // In production, this would query a RAG vector database of classical texts
    // For this prototype, we simulate the database mapping
    const c = condition.toLowerCase()

    let response = ''
    if (tradition === 'ayurveda') {
      if (c.includes('sleep') || c.includes('insomnia')) {
        response = '[Charaka Samhita, Sutrasthana Ch 21]: Sleep (Nidra) is one of the three pillars of life. Vata-induced insomnia requires heavy, sweet, snigdha (unctuous) therapies like warm milk with nutmeg and ghee, and head massage (Shiro Abhyanga) with sesame oil.'
      } else if (c.includes('acid') || c.includes('digestion')) {
        response = '[Ashtanga Hridayam, Nidanasthana Ch 7]: Amlapitta (Acid Dyspepsia) is caused by aggravated Pitta. Treat with cooling, sweet, and bitter herbs. Aamla (Indian Gooseberry) and Shatavari are highly effective.'
      } else {
        response = `Classical Ayurvedic texts recommend balancing the aggravated dosha for '${condition}' using Panchakarma pathways and specific dravyas (substances) matching opposites (e.g., treating heat with cold).`
      }
    } else if (tradition === 'tcm') {
      if (c.includes('sleep') || c.includes('insomnia')) {
        response = '[Huangdi Neijing, Suwen Ch 46]: Insomnia is often caused by Disharmony between the Heart and Kidneys, or Heart Blood deficiency. Acupuncture points Anmian, Shenmen (HT7), and Sanyinjiao (SP6) are indicated. Jujube Seed Decoction is the classical formula.'
      } else {
        response = `TCM views '${condition}' as a pattern of disharmony (e.g., Qi stagnation, Blood deficiency). Treatment involves restoring Yin-Yang balance through acupuncture, moxibustion, and herbal formulas like Xiao Yao San.`
      }
    } else {
      response = `Siddha medicine texts (like Thirumanthiram) approach '${condition}' through the alchemy of the body, emphasizing 96 tattvas (principles) and heavy metal/mineral preparations (bhasmas) purified extensively.`
    }

    return {
      content: [{ type: 'text', text: response }]
    }
  }
)

// ── Tool 3: Ayurvedic Biomarker Analysis ────────────────────────────────────
mcpServer.tool(
  'analyze_biomarker_ayurveda',
  'Interprets a single modern medical biomarker through the lens of Ayurveda',
  {
    biomarker: z.string().describe('The name of the lab test (e.g., "LDL Cholesterol", "TSH")'),
    value: z.number().describe('The value of the biomarker'),
    status: z.enum(['low', 'normal', 'high']).describe('Whether the value is considered out of modern range'),
  },
  async ({ biomarker, value, status }) => {
    const b = biomarker.toLowerCase()
    let dosha = 'Unknown'
    let dhatu = 'Rasa (Plasma)'

    if (b.includes('cholesterol') || b.includes('ldl') || b.includes('triglyceride')) {
      dosha = 'Kapha'
      dhatu = 'Meda (Fat tissue)'
    } else if (b.includes('tsh') || b.includes('thyroid')) {
      dosha = status === 'high' ? 'Kapha (Hypo)' : 'Vata/Pitta (Hyper)'
      dhatu = 'Mamsa (Muscle)'
    } else if (b.includes('glucose') || b.includes('a1c') || b.includes('sugar')) {
      dosha = 'Kapha'
      dhatu = 'Rasa (Plasma) and Meda (Fat)'
    } else if (b.includes('iron') || b.includes('hemoglobin') || b.includes('ferritin')) {
      dosha = 'Pitta'
      dhatu = 'Rakta (Blood)'
    }

    return {
      content: [
        {
          type: 'text',
          text: `**Ayurvedic Biomarker Analysis:**
- **Biomarker:** ${biomarker}
- **Value Details:** ${value} (${status})
- **Affected Dosha:** ${dosha} aggravation
- **Affected Dhatu (Tissue):** ${dhatu}
- **Interpretation:** In Ayurveda, a ${status} reading for ${biomarker} indicates an impairment in the Agni (digestive fire) related to the ${dhatu}. 
- **Recommendation:** Herbs and therapies should focus on clearing 'Ama' (toxins) from the ${dhatu} channel and pacifying the ${dosha} dosha.`
        }
      ]
    }
  }
)

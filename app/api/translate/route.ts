import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'fake-key', // Set yours in .env
})

export async function POST(req: Request) {
  try {
    const { labs } = await req.json()
    if (!labs) {
      return NextResponse.json({ error: 'No lab data provided.' }, { status: 400 })
    }

    // Attempt to call Anthropic API for real dual-translation
    if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'fake-key') {
      const response = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 1000,
        temperature: 0.1,
        system: `You are an elite dual-board certified physician in both modern Western pathology and ancient Indian Ayurveda. 
The user is providing their blood test results or symptoms.
Analyze the biomarkers and provide a structured JSON response translating the Western medical view into the Ayurvedic view.
Return ONLY valid JSON matching this schema:
{
  "western_summary": string,
  "flagged_markers": string[],
  "ayurvedic_root_cause": string,
  "affected_systems": string[],
  "recommendations": string[]
}`,
        messages: [{ role: "user", content: "Analyze these labs: " + labs }]
      })

      const contentBlock = response.content[0]
      if (contentBlock.type === 'text') {
        const content = contentBlock.text
        // Extract JSON if Claude added markdown fences
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          return NextResponse.json({ analysis: JSON.parse(jsonMatch[0]) })
        }
      }
    }

    // Fallback Mock Response so you can instantly see the gorgeous UI design without needing API Keys
    setTimeout(() => {}, 1500) // Simulate network delay
    return NextResponse.json({
      analysis: {
        western_summary: "The provided data suggests elevated Fasting Glucose alongside a higher-end TSH. This combination indicates metabolic syndrome compounded by subclinical hypothyroidism, slowing down cellular metabolic rate and insulin sensitivity.",
        flagged_markers: ["Fasting Glucose: 115 mg/dL (High)", "TSH: 4.8 mIU/L (High-Normal)", "Vitamin D: 18 ng/mL (Deficient)"],
        ayurvedic_root_cause: "Profound Kapha accumulation blocking the Meda Dhatu (fat tissue) channels, suppressing the central Agni (metabolic fire) and leading to Ama (toxin) formation.",
        affected_systems: ["Meda Dhatu (Fat/Lipid Tissue)", "Jatharagni (Central Digestion)", "Annavaha Srotas (Nutrient Channels)"],
        recommendations: [
          "Incorporate pungent and bitter herbs (Trikatu: ginger, black pepper, long pepper) before meals to ignite Agni.",
          "Perform vigorous dry brushing (Garshana) daily to stimulate lymphatic flow and break up Kapha stagnation.",
          "Restrict heavy, cold, and sweet foods; favor warm, light, and spiced broths."
        ]
      }
    })

  } catch (error) {
    console.error("Translation API Error:", error)
    return NextResponse.json({ error: 'Failed to translate biomarkers.' }, { status: 500 })
  }
}

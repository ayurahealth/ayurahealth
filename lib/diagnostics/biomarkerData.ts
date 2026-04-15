/**
 * AYURA INTELLIGENCE BIOMARKER SYNTHESIS
 * Maps modern lab markers to Vedic Elemental (Pancha Bhuta) and Tissue (Dhatu) systems.
 */

export interface Biomarker {
  id: string
  name: string
  modernRange: string
  vedicSignificance: string
  element: 'Akasha' | 'Vayu' | 'Agni' | 'Jal' | 'Prithvi'
  position: [number, number, number] // 3D coordinates in the map
}

export const BIOMARKER_MAP: Biomarker[] = [
  {
    id: 'glu',
    name: 'Blood Glucose',
    modernRange: '70-99 mg/dL',
    vedicSignificance: 'Ojas & Agni (Metabolic continuity)',
    element: 'Agni',
    position: [0.5, 0.8, 0.2]
  },
  {
    id: 'cho',
    name: 'Cholesterol',
    modernRange: '< 200 mg/dL',
    vedicSignificance: 'Medas Dhatu (Fat tissue balance)',
    element: 'Jal',
    position: [-0.6, -0.4, 0.5]
  },
  {
    id: 'vitd',
    name: 'Vitamin D',
    modernRange: '30-100 ng/mL',
    vedicSignificance: 'Asthi Dhatu (Bone & Structural integrity)',
    element: 'Prithvi',
    position: [0.8, -0.7, -0.3]
  },
  {
    id: 'hem',
    name: 'Hemoglobin',
    modernRange: '13.5-17.5 g/dL',
    vedicSignificance: 'Rakta Dhatu (Blood vitalization)',
    element: 'Agni',
    position: [0, 0, 0.9]
  },
  {
    id: 'thy',
    name: 'TSH (Thyroid)',
    modernRange: '0.4-4.0 mIU/L',
    vedicSignificance: 'Udana Vayu (Upward metabolic energy)',
    element: 'Vayu',
    position: [-0.9, 0.3, -0.4]
  }
]

export function getElementColor(element: string): string {
  switch (element) {
    case 'Akasha': return '#9b7fd4'
    case 'Vayu': return '#5bc0eb'
    case 'Agni': return '#ff9f43'
    case 'Jal': return '#54a0ff'
    case 'Prithvi': return '#6abf8a'
    default: return '#c9a84c'
  }
}

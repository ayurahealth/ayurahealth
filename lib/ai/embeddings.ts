import { pipeline } from '@xenova/transformers';

let extractor: Awaited<ReturnType<typeof pipeline>> | null = null;

async function getExtractor() {
  if (!extractor) {
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return extractor;
}

/**
 * Generates a vector embedding for a given text.
 * Prioritizes HuggingFace Inference API in production for high speed and stability.
 */
export async function getEmbedding(text: string): Promise<number[]> {
  // ── High Speed Mode: HuggingFace Inference (Recommended for Production) ───
  const hfKey = process.env.HUGGINGFACE_API_KEY
  if (hfKey || process.env.NODE_ENV === 'production') {
    try {
      const response = await fetch(
        'https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2',
        {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${hfKey || ''}`,
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({ inputs: text })
        }
      )
      if (response.ok) {
        const result = await response.json()
        if (Array.isArray(result)) return result
      }
    } catch (err) {
      console.warn('HF_INFERENCE_FAILED, falling back to local:', err)
    }
  }

  // ── Legacy Mode: Local Transformers.js ─────────────────────────────────────
  try {
    const extract = await getExtractor();
    const output = await extract(text, { pooling: 'mean', normalize: true });
    
    // The extractor returns a Tensor which has a 'data' property of type Float32Array (or similar)
    return Array.from((output as { data: Float32Array }).data);
  } catch (error) {
    console.error('EMBEDDING_ENGINE_CRASH:', error);
    throw new Error('Consultation engine (RAG) is currently unavailable. Please check your API keys.');
  }
}

/**
 * Format a number array as a PostgreSQL-compatible vector string.
 * @param embedding Array of numbers.
 * @returns String in the format "[0.1, 0.2, ...]"
 */
export function formatVector(embedding: number[]): string {
  return `[${embedding.join(',')}]`;
}

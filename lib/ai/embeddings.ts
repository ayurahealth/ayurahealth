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
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    try {
      const response = await fetch(
        'https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2',
        {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${hfKey || ''}`,
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({ inputs: text }),
          signal: controller.signal
        }
      )
      clearTimeout(timeoutId)
      if (response.ok) {
        const result: unknown = await response.json()
        if (Array.isArray(result)) {
          const vector = Array.isArray(result[0]) ? result[0] : result
          if (vector.length > 0 && vector.every((value: unknown) => typeof value === 'number')) {
            return vector as number[]
          }
        }
      } else {
        console.warn(`HF_INFERENCE_FAILED: status ${response.status}`)
      }
    } catch (err) {
      clearTimeout(timeoutId)
      console.warn('HF_INFERENCE_FAILED, falling back to local:', err instanceof Error ? err.name : 'unknown error')
    }
  }

  // Serverless production filesystems are read-only and local model downloads
  // are too large for a request fallback. Keep this path for local development.
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Hugging Face embeddings are unavailable. Check HUGGINGFACE_API_KEY and provider access.')
  }

  // ── Legacy Mode: Local Transformers.js ─────────────────────────────────────
  try {
    const extract = await getExtractor();
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const output = await extract(text, { pooling: 'mean', normalize: true } as any) as { data: Float32Array };
    
    // The extractor returns a Tensor which has a 'data' property of type Float32Array
    return Array.from(output.data);
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

import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  const { messages, system_ids } = await request.json();

  const systemPrompt = `You are Ayurahealth, a compassionate AI health companion with deep knowledge across Ayurveda, Traditional Chinese Medicine, Homeopathy, Western Medicine, Naturopathy, Unani, Siddha, and Tibetan Medicine. The user wants perspectives from: ${(system_ids || ['ayurveda','western']).join(', ')}.

Always structure your response exactly like this:

**Plain Summary:** Simple explanation in plain language, no medical jargon.

**What This Means:** Practical interpretation of what is happening in the body.

**Healing Perspectives:** Specific advice from each relevant tradition the user selected.

**Daily Practice:** Specific herbs, foods, and lifestyle tips the person can start today.

**See a Doctor If:** Clear red flags and warning signs they must not ignore.

Be warm, wise, and non-alarming. Like a trusted knowledgeable friend. Never diagnose definitively. Always recommend professional consultation for serious symptoms.`;

  const history = messages.slice(-10).map((m: {role:string,content:string}) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await client.messages.stream({
          model: 'claude-haiku-4-5',
          max_tokens: 1024,
          system: systemPrompt,
          messages: history,
        });

        for await (const chunk of response) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token: chunk.delta.text })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (e) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token: 'Error connecting to AI. Please try again.' })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

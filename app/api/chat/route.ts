import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const { messages, system_ids } = await request.json();
  const userQuery = messages[messages.length - 1]?.content || '';

  const systemPrompt = `You are Ayurahealth, a compassionate AI health companion with deep knowledge across Ayurveda, Traditional Chinese Medicine, Homeopathy, Western Medicine, and Naturopathy. The user wants perspectives from: ${system_ids.join(', ')}.

Always structure your response exactly like this:

Plain Summary: Simple explanation in plain language.

What This Means: Practical interpretation.

Healing Perspectives: Specific advice from each relevant tradition.

Daily Practice: Specific herbs, foods, and lifestyle tips.

See a Doctor If: Clear red flags to watch for.

Be warm, clear, and always recommend professional consultation for serious symptoms.`;

  const history = messages.slice(-10).map((m: {role:string,content:string}) => ({
    role: m.role,
    content: m.content,
  }));

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await fetch('http://localhost:11434/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'ayurahealth',
            messages: [{ role: 'system', content: systemPrompt }, ...history],
            stream: true,
            options: { temperature: 0.7, num_ctx: 4096 },
          }),
        });

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value);
          const lines = text.split('\n').filter(l => l.trim());
          for (const line of lines) {
            try {
              const data = JSON.parse(line);
              const token = data?.message?.content || '';
              if (token) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`));
              }
              if (data.done) {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              }
            } catch {}
          }
        }
        controller.close();
      } catch (e) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token: 'Error: Make sure Ollama is running with: ollama serve' })}\n\n`));
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

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 });
    }

    // Prepare FormData for Groq API
    const groqFormData = new FormData();
    groqFormData.append('file', file);
    groqFormData.append('model', 'whisper-large-v3');
    groqFormData.append('response_format', 'json');

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: groqFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq Transcription Error:', errorData);
      return NextResponse.json(
        { error: 'Failed to transcribe audio', details: errorData },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json({ text: result.text });
  } catch (err) {
    console.error('Transcription Route Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

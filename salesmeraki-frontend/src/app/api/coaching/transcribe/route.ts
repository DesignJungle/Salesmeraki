import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const audioBlob = formData.get('audio') as Blob;

    if (!audioBlob) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Send to transcription service
    const transcriptionResponse = await fetch(`${process.env.TRANSCRIPTION_SERVICE_URL}/transcribe`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TRANSCRIPTION_API_KEY}`,
      },
      body: formData,
    });

    const transcriptionResult = await transcriptionResponse.json();

    return NextResponse.json({
      text: transcriptionResult.text,
      confidence: transcriptionResult.confidence,
      segments: transcriptionResult.segments,
    });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Transcription service error' },
      { status: 500 }
    );
  }
}
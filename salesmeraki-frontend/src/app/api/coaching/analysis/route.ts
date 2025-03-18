import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export interface CoachingAnalysisRequest {
  sessionId: string;
  content: {
    type: 'speech' | 'text' | 'video';
    data: string;
  };
  context?: {
    customerType?: string;
    dealStage?: string;
    productCategory?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CoachingAnalysisRequest = await request.json();
    
    const analysis = await fetch(`${process.env.AI_SERVICE_URL}/coaching/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        ...body,
        userId: session.user?.id,
        timestamp: new Date().toISOString(),
      }),
    });

    const data = await analysis.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Coaching analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis service error' },
      { status: 500 }
    );
  }
}
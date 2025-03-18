import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, email } = body;

    if (!token || !email) {
      console.error('Missing token or email in request');
      return NextResponse.json(
        { error: 'Missing token or email' },
        { status: 400 }
      );
    }

    console.log(`Forwarding Google auth request for ${email}`);
    
    // Forward the Google token to your backend
    const response = await fetch(`${process.env.API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, email }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Backend auth failed:', data);
      return NextResponse.json(
        { error: data.message || 'Authentication failed' },
        { status: response.status }
      );
    }

    console.log('Google auth successful');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Google auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
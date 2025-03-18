import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      nextAuthUrl: process.env.NEXTAUTH_URL,
      nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      googleClientId: !!process.env.GOOGLE_CLIENT_ID,
      googleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      apiBaseUrl: process.env.API_BASE_URL,
    };

    // Check API connectivity
    let apiStatus = 'unknown';
    let apiError = null;
    
    if (process.env.API_BASE_URL) {
      try {
        const response = await fetch(`${process.env.API_BASE_URL}/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        apiStatus = response.ok ? 'connected' : 'error';
        if (!response.ok) {
          apiError = `Status: ${response.status}`;
        }
      } catch (err: any) {
        apiStatus = 'error';
        apiError = err.message;
      }
    }

    return NextResponse.json({
      environment: envCheck,
      api: {
        status: apiStatus,
        error: apiError,
        url: process.env.API_BASE_URL
      },
      nextjs: {
        version: process.env.NEXT_PUBLIC_VERSION || 'unknown',
        environment: process.env.NODE_ENV
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}
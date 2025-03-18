import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiUrl = process.env.API_BASE_URL;
    
    if (!apiUrl) {
      return NextResponse.json({
        status: 'error',
        message: 'API_BASE_URL is not defined in environment variables'
      }, { status: 500 });
    }
    
    // Try to connect to the API
    let response;
    try {
      response = await fetch(`${apiUrl}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err: any) {
      return NextResponse.json({
        status: 'error',
        message: 'Could not connect to API',
        details: err.message || 'Unknown error',
        apiUrl: apiUrl
      }, { status: 500 });
    }
    
    // Check if Google auth endpoint exists
    let googleAuthResponse;
    try {
      googleAuthResponse = await fetch(`${apiUrl}/auth/google`, {
        method: 'OPTIONS',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err: any) {
      // This is expected to fail with CORS or method not allowed, but should tell us if endpoint exists
      googleAuthResponse = { status: err.message };
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'API connection successful',
      apiUrl: apiUrl,
      healthEndpoint: {
        status: response.status,
        ok: response.ok
      },
      googleAuthEndpoint: {
        status: googleAuthResponse.status
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error',
      details: error.message
    }, { status: 500 });
  }
}
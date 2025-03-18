import { NextResponse } from 'next/server';

interface EndpointResult {
  status?: number;
  ok?: boolean;
  data?: any;
  error?: string;
}

export async function GET() {
  try {
    const apiUrl = process.env.API_BASE_URL;
    
    if (!apiUrl) {
      return NextResponse.json({
        status: 'error',
        message: 'API_BASE_URL is not defined'
      }, { status: 500 });
    }
    
    // Test endpoints
    const endpoints = [
      '/health',
      '/auth/test'
    ];
    
    const results: Record<string, EndpointResult> = {};
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${apiUrl}${endpoint}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        results[endpoint] = {
          status: response.status,
          ok: response.ok,
          data: response.ok ? await response.json() : null
        };
      } catch (error: any) {
        results[endpoint] = {
          error: error.message
        };
      }
    }
    
    return NextResponse.json({
      apiUrl,
      results
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
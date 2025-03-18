import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token || !token.accessToken) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }
    
    // Optionally verify with backend
    try {
      const response = await fetch(`${process.env.API_BASE_URL}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`
        }
      });
      
      if (!response.ok) {
        return NextResponse.json({ valid: false }, { status: 401 });
      }
    } catch (error) {
      console.error('Backend verification error:', error);
      // Continue anyway, as we at least have a token
    }
    
    return NextResponse.json({ valid: true });
  } catch (error: any) {
    console.error('Token verification error:', error);
    return NextResponse.json({ valid: false, error: error.message }, { status: 500 });
  }
}
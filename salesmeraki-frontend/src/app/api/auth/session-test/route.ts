import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      session,
      authOptions: {
        providers: authOptions.providers.map(p => p.id),
        hasCallbacks: !!authOptions.callbacks,
        hasJwtCallback: !!authOptions.callbacks?.jwt,
        hasSessionCallback: !!authOptions.callbacks?.session,
      },
      env: {
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        nextAuthUrl: process.env.NEXTAUTH_URL,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasApiBaseUrl: !!process.env.API_BASE_URL,
        apiBaseUrl: process.env.API_BASE_URL,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      providers: Object.keys(authOptions.providers),
      session: session ? {
        hasUser: !!session.user,
        hasToken: !!session.accessToken,
        email: session.user?.email ? `${session.user.email.substring(0, 3)}...` : null,
      } : null,
      env: {
        hasGoogleId: !!process.env.GOOGLE_CLIENT_ID,
        hasGoogleSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      },
      callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
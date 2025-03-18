import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      authenticated: !!session,
      hasAccessToken: !!session?.accessToken,
      user: session?.user ? {
        id: session.user.id,
        email: session.user.email ? `${session.user.email.substring(0, 3)}...` : null,
        name: session.user.name ? `${session.user.name.substring(0, 3)}...` : null,
      } : null,
      tokenPreview: session?.accessToken ? 
        `${session.accessToken.substring(0, 10)}...` : null,
    });
  } catch (error: any) {
    console.error('Error retrieving session:', error);
    return NextResponse.json(
      { error: `Debug error: ${error.message}` },
      { status: 500 }
    );
  }
}
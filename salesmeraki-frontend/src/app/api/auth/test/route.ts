import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ status: 'unauthenticated' }, { status: 401 });
    }
    
    return NextResponse.json({
      status: 'authenticated',
      session: {
        hasUser: !!session.user,
        hasToken: !!session.accessToken,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
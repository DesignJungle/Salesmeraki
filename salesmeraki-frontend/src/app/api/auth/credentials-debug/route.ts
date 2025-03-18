import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    googleClientIdExists: !!process.env.GOOGLE_CLIENT_ID,
    googleClientIdLength: process.env.GOOGLE_CLIENT_ID?.length || 0,
    googleClientSecretExists: !!process.env.GOOGLE_CLIENT_SECRET,
    googleClientSecretLength: process.env.GOOGLE_CLIENT_SECRET?.length || 0,
    nextAuthUrlExists: !!process.env.NEXTAUTH_URL,
    nextAuthUrl: process.env.NEXTAUTH_URL,
  });
}
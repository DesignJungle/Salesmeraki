import { NextResponse } from 'next/server';

export async function GET() {
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:5000/api';
  const fullUrl = `${apiBaseUrl}/auth/login`;
  
  return NextResponse.json({
    apiBaseUrl,
    fullUrl,
    env: process.env.NODE_ENV
  });
}
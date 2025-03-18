import { getSession } from 'next-auth/react';

export async function validateSession() {
  try {
    const session = await getSession();
    
    if (!session || !session.accessToken) {
      console.log('No valid session found');
      return false;
    }
    
    // Optional: Verify token with backend
    const response = await fetch('/api/auth/verify', {
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
}

export async function refreshToken() {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST'
    });
    
    return response.ok;
  } catch (error) {
    console.error('Token refresh error:', error);
    return false;
  }
}
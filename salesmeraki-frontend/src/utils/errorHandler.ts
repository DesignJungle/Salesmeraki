import { signOut } from 'next-auth/react';

// Define the ApiError class properly
export class ApiError extends Error {
  isAuthError: boolean;
  isNetworkError: boolean;
  statusCode?: number;

  constructor(message: string, options: { 
    isAuthError?: boolean; 
    isNetworkError?: boolean;
    statusCode?: number;
  } = {}) {
    super(message);
    this.name = 'ApiError';
    this.isAuthError = options.isAuthError || false;
    this.isNetworkError = options.isNetworkError || false;
    this.statusCode = options.statusCode;
  }
}

/**
 * Enhanced fetch function with authentication and error handling
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  try {
    // Add credentials to include cookies
    const fetchOptions: RequestInit = {
      ...options,
      credentials: 'include',
      headers: {
        ...options.headers,
        'Content-Type': options.headers?.['Content-Type'] || 'application/json',
      },
    };

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    fetchOptions.signal = controller.signal;

    const response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);

    // Handle authentication errors
    if (response.status === 401 || response.status === 403) {
      console.error('Authentication error:', response.status);
      // Redirect to login page
      signOut({ callbackUrl: '/auth/signin' });
      throw new Error('Your session has expired. Please log in again.');
    }

    // Handle other error responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API error response:', response.status, errorData);
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    // Parse JSON response
    const data = await response.json().catch(() => ({}));
    return data;
  } catch (error) {
    // Handle network errors and timeouts
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('Request timeout:', url);
        throw new Error('Request timed out. Please try again.');
      }
      
      if (error.message.includes('fetch failed')) {
        console.error('Network error:', error);
        throw new Error('Network connection error. Please check your internet connection.');
      }
      
      console.error('Fetch error:', error);
      throw error;
    }
    
    throw new Error('Unknown error occurred');
  }
}

/**
 * Log errors to console and optionally to a monitoring service
 */
export function logError(error: Error, context?: string) {
  console.error(`Error${context ? ` in ${context}` : ''}:`, error);
  
  // Here you could add error reporting to a service like Sentry
  // if (typeof window !== 'undefined' && window.Sentry) {
  //   window.Sentry.captureException(error, { extra: { context } });
  // }
}

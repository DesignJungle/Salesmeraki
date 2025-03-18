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

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

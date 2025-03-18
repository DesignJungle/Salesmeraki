'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/utils/errorHandler';
import { signOut } from 'next-auth/react';

interface ErrorHandlerProps {
  error: Error | ApiError;
  reset: () => void;
}

export default function ErrorHandler({ error, reset }: ErrorHandlerProps) {
  const router = useRouter();

  useEffect(() => {
    // Check if error is an ApiError and has isAuthError property
    const isAuthError = error instanceof ApiError && error.isAuthError;
    
    if (isAuthError) {
      console.log('Auth error detected, signing out...');
      signOut({ redirect: true, callbackUrl: '/auth/signin' });
    }
  }, [error]);

  const handleReset = () => {
    // Check if error is an ApiError and has isNetworkError property
    const isNetworkError = error instanceof ApiError && error.isNetworkError;
    
    if (isNetworkError) {
      window.location.reload();
    } else {
      reset();
    }
  };

  // Determine error message and title
  const isNetworkError = error instanceof ApiError && error.isNetworkError;
  const errorTitle = isNetworkError ? 'Connection Error' : 'Something went wrong';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {errorTitle}
          </h2>
          <p className="mt-2 text-sm text-gray-600">{error.message}</p>
          <div className="mt-4 space-x-4">
            <button
              onClick={handleReset}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Try again
            </button>
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Go home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
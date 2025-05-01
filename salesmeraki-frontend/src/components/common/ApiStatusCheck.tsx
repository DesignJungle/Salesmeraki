'use client';

import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/utils/errorHandler';

export default function ApiStatusCheck() {
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        setApiStatus('checking');
        // Try to fetch a lightweight endpoint
        await fetchWithAuth('/api/health');
        setApiStatus('online');
      } catch (error) {
        console.error('API health check failed:', error);
        setApiStatus('offline');
        
        // Schedule a retry if we haven't tried too many times
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 5000); // Retry after 5 seconds
        }
      }
    };

    checkApiStatus();
  }, [retryCount]);

  if (apiStatus === 'online' || apiStatus === 'checking') {
    return null; // Don't show anything when API is online or still checking
  }

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">
            API connection error. Some features may not work correctly.
            <button 
              onClick={() => setRetryCount(prev => prev + 1)}
              className="ml-2 font-medium underline hover:text-red-800"
            >
              Retry
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
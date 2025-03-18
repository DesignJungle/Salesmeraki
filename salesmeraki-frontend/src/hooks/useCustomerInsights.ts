import { useState, useEffect } from 'react';

export function useCustomerInsights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const response = await fetch('/api/customers/insights');
        if (!response.ok) {
          throw new Error('Failed to fetch customer insights');
        }
        const data = await response.json();
        setInsights(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, []);

  return { insights, loading, error };
}
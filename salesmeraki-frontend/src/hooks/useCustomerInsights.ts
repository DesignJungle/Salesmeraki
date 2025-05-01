import { useState, useEffect } from 'react';

interface CustomerInsights {
  customerSegments: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
    }[];
  };
  keyFindings: string[];
}

export function useCustomerInsights(timeRange: string = '6m') {
  const [insights, setInsights] = useState<CustomerInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInsights() {
      try {
        setLoading(true);
        const response = await fetch(`/api/customers/insights?timeRange=${timeRange}`);
        if (!response.ok) {
          throw new Error('Failed to fetch customer insights');
        }
        const data = await response.json();
        setInsights(data);
      } catch (err) {
        console.error('Error fetching customer insights:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Use mock data if API fails
        setInsights(getMockCustomerInsights());
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, [timeRange]);

  return { insights, loading, error };
}

function getMockCustomerInsights(): CustomerInsights {
  return {
    customerSegments: {
      labels: ['Enterprise', 'Mid-Market', 'SMB', 'Startup'],
      datasets: [
        {
          data: [35, 40, 15, 10],
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',  // Blue
            'rgba(16, 185, 129, 0.7)',  // Green
            'rgba(245, 158, 11, 0.7)',  // Yellow
            'rgba(239, 68, 68, 0.7)'    // Red
          ]
        }
      ]
    },
    keyFindings: [
      'Mid-Market segment shows the highest growth potential with 40% of revenue',
      'Enterprise customers have the highest retention rate at 85%',
      'SMB segment has the shortest sales cycle averaging 15 days',
      'Startup segment shows the highest churn rate at 12%',
      'Cross-selling opportunities identified in 65% of Mid-Market accounts'
    ]
  };
}
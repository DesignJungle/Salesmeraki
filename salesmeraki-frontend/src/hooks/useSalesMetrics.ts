import { useState, useEffect } from 'react';

interface SalesMetrics {
  salesTrend: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
  topProducts: {
    name: string;
    revenue: number;
    growth: number;
  }[];
}

export function useSalesMetrics(timeRange: string = '6m') {
  const [metrics, setMetrics] = useState<SalesMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setLoading(true);
        const response = await fetch(`/api/sales/metrics?timeRange=${timeRange}`);
        if (!response.ok) {
          throw new Error('Failed to fetch sales metrics');
        }
        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        console.error('Error fetching sales metrics:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Use mock data if API fails
        setMetrics(getMockSalesMetrics());
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, [timeRange]);

  return { metrics, loading, error };
}

function getMockSalesMetrics(): SalesMetrics {
  return {
    salesTrend: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Revenue',
          data: [12000, 19000, 15000, 22000, 18000, 24000],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)'
        },
        {
          label: 'Target',
          data: [15000, 15000, 18000, 18000, 21000, 21000],
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)'
        }
      ]
    },
    topProducts: [
      { name: 'Enterprise Solution', revenue: 125000, growth: 12.5 },
      { name: 'CRM Integration', revenue: 85000, growth: 8.3 },
      { name: 'Analytics Platform', revenue: 65000, growth: 15.2 },
      { name: 'Mobile App', revenue: 45000, growth: -2.1 },
      { name: 'Support Package', revenue: 35000, growth: 5.7 }
    ]
  };
}
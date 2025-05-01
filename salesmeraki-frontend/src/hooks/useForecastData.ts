import { useState, useEffect } from 'react';

interface ForecastData {
  growthRate: number;
  revenueProjection: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  };
}

export function useForecastData(timeRange: string = '6m') {
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchForecast() {
      try {
        setLoading(true);
        const response = await fetch(`/api/sales/forecast?timeRange=${timeRange}`);
        if (!response.ok) {
          throw new Error('Failed to fetch forecast data');
        }
        const data = await response.json();
        setForecast(data);
      } catch (err) {
        console.error('Error fetching forecast data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Use mock data if API fails
        setForecast(getMockForecastData());
      } finally {
        setLoading(false);
      }
    }

    fetchForecast();
  }, [timeRange]);

  return { forecast, loading, error };
}

function getMockForecastData(): ForecastData {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  return {
    growthRate: 18.5,
    revenueProjection: {
      labels: [
        `Q1 ${currentYear}`,
        `Q2 ${currentYear}`,
        `Q3 ${currentYear}`,
        `Q4 ${currentYear}`,
        `Q1 ${nextYear}`,
        `Q2 ${nextYear}`
      ],
      datasets: [
        {
          label: 'Projected Revenue',
          data: [120000, 135000, 150000, 175000, 195000, 220000],
          backgroundColor: 'rgba(16, 185, 129, 0.7)' // Green
        }
      ]
    }
  };
}
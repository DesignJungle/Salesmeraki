'use client';

import { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { AnalyticsData } from '@/types/analytics';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useCurrency } from '@/contexts/CurrencyContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardProps {
  timeRange: string;
}

export default function Dashboard({ timeRange }: DashboardProps) {
  const { formatAmount, convertAmount } = useCurrency();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/analytics?timeRange=${timeRange}`);

        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        console.error('Error fetching analytics data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Failed to load analytics data</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Sales Performance</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Total Sales</h3>
          {data?.salesOverview && (
            <p className="text-2xl font-bold">{formatAmount(data.salesOverview.totalSales, true)}</p>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Average Order Value</h3>
          {data?.salesOverview && (
            <p className="text-2xl font-bold">{formatAmount(data.salesOverview.averageOrderValue, true)}</p>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Conversion Rate</h3>
          {data?.salesOverview && (
            <p className="text-2xl font-bold">{data.salesOverview.conversionRate}%</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Sales Trend</h3>
        <div className="h-64">
          <Line
            data={{
              labels: data.timeSeriesData.labels,
              datasets: data.timeSeriesData.datasets
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>
    </div>
  );
}


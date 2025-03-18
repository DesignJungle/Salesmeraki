'use client';

import { useState, useEffect } from 'react';

interface DashboardProps {
  timeRange: string;
}

const Dashboard = ({ timeRange }: DashboardProps) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/analytics?timeRange=${timeRange}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Failed to load analytics data</div>;

  return (
    <div>
      <h2>Sales Performance</h2>
      <div>
        <h3>Sales Overview</h3>
        {/* Add your dashboard content here */}
      </div>
    </div>
  );
};

export default Dashboard;
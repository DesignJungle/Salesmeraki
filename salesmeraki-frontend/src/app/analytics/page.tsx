'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Dashboard from '@/components/analytics/Dashboard';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Sales Analytics</h1>
            <p className="mt-2 text-sm text-gray-600">
              AI-powered insights and predictions for your sales performance
            </p>
          </div>
          <div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>
      </div>

      <Dashboard timeRange={timeRange} />
    </DashboardLayout>
  );
}
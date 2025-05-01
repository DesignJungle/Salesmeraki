'use client';

import { useState } from 'react';
import { LineChart, BarChart, PieChart } from '@/components/charts';
import { Card } from '@/components/common/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/Tabs';
import { DateRangePicker } from '@/components/common/DateRangePicker';
import { useCurrency } from '@/contexts/CurrencyContext';

export default function AnalyticsPage() {
  const { formatAmount, convertAmount } = useCurrency();
  const [dateRange, setDateRange] = useState<{from: Date, to: Date}>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });

  // Mock data - would be fetched from API in production
  const salesDataRaw = [
    { date: '2023-01', value: 4000 },
    { date: '2023-02', value: 3000 },
    { date: '2023-03', value: 5000 },
    { date: '2023-04', value: 7000 },
    { date: '2023-05', value: 6000 },
    { date: '2023-06', value: 8000 },
  ];

  const conversionDataRaw = [
    { name: 'Lead', value: 400 },
    { name: 'MQL', value: 300 },
    { name: 'SQL', value: 200 },
    { name: 'Opportunity', value: 100 },
    { name: 'Deal', value: 50 },
  ];

  const performanceDataRaw = [
    { name: 'Team A', value: 85 },
    { name: 'Team B', value: 65 },
    { name: 'Team C', value: 92 },
    { name: 'Team D', value: 78 },
  ];

  // Transform data for charts
  const salesData = {
    labels: salesDataRaw.map(item => item.date),
    datasets: [{
      label: 'Revenue',
      data: salesDataRaw.map(item => item.value),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    }]
  };

  const conversionData = {
    labels: conversionDataRaw.map(item => item.name),
    datasets: [{
      label: 'Conversion',
      data: conversionDataRaw.map(item => item.value),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }]
  };

  const performanceData = {
    labels: performanceDataRaw.map(item => item.name),
    datasets: [{
      label: 'Performance',
      data: performanceDataRaw.map(item => item.value),
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
    }]
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Track your sales performance and team metrics
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Tabs defaultValue="sales">
          <TabsList>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="conversion">Conversion</TabsTrigger>
          </TabsList>
        </Tabs>

        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <h3 className="text-lg font-medium mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold">{formatAmount(245000, true)}</p>
          <p className="text-sm text-green-600">↑ 12% from last period</p>
        </Card>

        <Card>
          <h3 className="text-lg font-medium mb-2">Conversion Rate</h3>
          <p className="text-3xl font-bold">24.8%</p>
          <p className="text-sm text-red-600">↓ 3% from last period</p>
        </Card>

        <Card>
          <h3 className="text-lg font-medium mb-2">Avg. Deal Size</h3>
          <p className="text-3xl font-bold">{formatAmount(28500, true)}</p>
          <p className="text-sm text-green-600">↑ 5% from last period</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <h3 className="text-lg font-medium mb-4">Revenue Trend</h3>
          <LineChart data={salesData} height={300} />
        </Card>

        <Card>
          <h3 className="text-lg font-medium mb-4">Sales Funnel</h3>
          <BarChart data={conversionData} height={300} />
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-medium mb-4">Team Performance</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BarChart data={performanceData} height={300} />
          <div>
            <h4 className="text-md font-medium mb-2">Key Insights</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                Team C is outperforming all other teams by 7%
              </li>
              <li className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                Team B needs coaching on closing techniques
              </li>
              <li className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                Team A shows consistent performance month over month
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

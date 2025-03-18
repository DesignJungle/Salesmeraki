import React, { useState } from 'react';
import { LineChart, BarChart, PieChart } from '@/components/charts';
import { useSalesMetrics } from '@/hooks/useSalesMetrics';
import { useCustomerInsights } from '@/hooks/useCustomerInsights';
import { useForecastData } from '@/hooks/useForecastData';
import { ArrowUpIcon, ArrowDownIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

export function SalesIntelligenceDashboard() {
  const { metrics = { salesTrend: [], topProducts: [] }, loading: metricsLoading, error: metricsError } = useSalesMetrics();
  const { insights = { customerSegments: [], keyFindings: [] }, loading: insightsLoading, error: insightsError } = useCustomerInsights();
  const { forecast = { growthRate: 0, revenueProjection: [] }, loading: forecastLoading, error: forecastError } = useForecastData();
  const [timeRange, setTimeRange] = useState('6m');

  const isLoading = metricsLoading || insightsLoading || forecastLoading;
  const hasError = metricsError || insightsError || forecastError;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading dashboard data...</span>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-red-700">
        <h3 className="text-lg font-medium mb-2">Error Loading Data</h3>
        <p>{metricsError || insightsError || forecastError}</p>
      </div>
    );
  }

  if (!metrics || !insights || !forecast) {
    return <div>No data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">Sales Intelligence</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
        >
          <option value="3m">Last 3 months</option>
          <option value="6m">Last 6 months</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Sales Performance</h3>
            <LineChart data={metrics.salesTrend} height={300} />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Customer Segments</h3>
            <PieChart data={insights.customerSegments} height={300} />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Revenue Forecast</h3>
            <div className="mb-4">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Growth Rate:</span>
                <span className="font-medium flex items-center">
                  {forecast.growthRate}%
                  <ArrowUpIcon className="h-4 w-4 text-green-500 ml-1" />
                </span>
              </div>
            </div>
            <BarChart data={forecast.revenueProjection} height={250} />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
            <ul className="space-y-4">
              {insights.keyFindings.map((finding, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">{index + 1}</span>
                  </span>
                  <span className="text-gray-700">{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-span-12">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Top Performing Products</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Growth
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {metrics.topProducts.map((product, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${product.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className={`flex items-center ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.growth >= 0 ? (
                            <ArrowUpIcon className="h-4 w-4 mr-1" />
                          ) : (
                            <ArrowDownIcon className="h-4 w-4 mr-1" />
                          )}
                          {Math.abs(product.growth)}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">AI Recommendation</h3>
        <p className="text-blue-700 mb-4">
          Based on your sales data, focusing on the Mid-Market segment could yield the highest ROI. 
          Consider allocating more resources to this segment in the next quarter.
        </p>
        <button className="flex items-center text-blue-600 font-medium hover:text-blue-800">
          View detailed analysis
          <ArrowRightIcon className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
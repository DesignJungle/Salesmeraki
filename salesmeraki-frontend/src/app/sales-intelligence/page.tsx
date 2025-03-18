'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function SalesIntelligencePage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Sales Intelligence Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* KPI Cards */}
          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Total Revenue</h2>
            <p className="text-3xl font-bold text-primary">$124,500</p>
            <p className="text-sm text-green-600 mt-2">↑ 12% from last month</p>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">New Customers</h2>
            <p className="text-3xl font-bold text-primary">48</p>
            <p className="text-sm text-green-600 mt-2">↑ 8% from last month</p>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Conversion Rate</h2>
            <p className="text-3xl font-bold text-primary">3.2%</p>
            <p className="text-sm text-red-600 mt-2">↓ 0.5% from last month</p>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Charts */}
          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Sales Trend</h2>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              Sales Chart Placeholder
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Customer Segments</h2>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              Segments Chart Placeholder
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Recent Opportunities</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Probability</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Acme Corp</td>
                    <td className="px-6 py-4 whitespace-nowrap">$25,000</td>
                    <td className="px-6 py-4 whitespace-nowrap">Proposal</td>
                    <td className="px-6 py-4 whitespace-nowrap">70%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Globex Inc</td>
                    <td className="px-6 py-4 whitespace-nowrap">$42,000</td>
                    <td className="px-6 py-4 whitespace-nowrap">Negotiation</td>
                    <td className="px-6 py-4 whitespace-nowrap">85%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Stark Industries</td>
                    <td className="px-6 py-4 whitespace-nowrap">$78,500</td>
                    <td className="px-6 py-4 whitespace-nowrap">Discovery</td>
                    <td className="px-6 py-4 whitespace-nowrap">30%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
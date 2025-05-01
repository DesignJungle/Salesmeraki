'use client';

import { useState } from 'react';
// We don't need to import DashboardLayout as we're using the app router layout
import { SalesIntelligenceDashboard } from '@/components/dashboard/SalesIntelligence';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/Tabs';

export default function SalesIntelligencePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  const handleGenerateInsights = async () => {
    setIsGeneratingInsights(true);
    // Simulate API call
    setTimeout(() => {
      setIsGeneratingInsights(false);
    }, 2000);
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Sales Intelligence</h1>
            <p className="mt-2 text-sm text-gray-600">
              AI-powered insights to optimize your sales strategy
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleGenerateInsights}
            isLoading={isGeneratingInsights}
          >
            Generate New Insights
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customer">Customer Analysis</TabsTrigger>
          <TabsTrigger value="market">Market Trends</TabsTrigger>
          <TabsTrigger value="forecast">Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <SalesIntelligenceDashboard />
        </TabsContent>

        <TabsContent value="customer" className="mt-6">
          <Card>
            <h3 className="text-lg font-medium mb-4">Customer Segmentation Analysis</h3>
            <p className="text-gray-600 mb-4">
              AI-powered analysis of your customer base to identify key segments and opportunities.
            </p>
            {/* Customer segmentation visualization would go here */}
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              Customer Segmentation Chart Placeholder
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="market" className="mt-6">
          <Card>
            <h3 className="text-lg font-medium mb-4">Market Trend Analysis</h3>
            <p className="text-gray-600 mb-4">
              Insights into market trends affecting your industry and customer base.
            </p>
            {/* Market trends visualization would go here */}
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              Market Trends Chart Placeholder
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="forecast" className="mt-6">
          <Card>
            <h3 className="text-lg font-medium mb-4">Sales Forecasting</h3>
            <p className="text-gray-600 mb-4">
              AI-powered sales forecasting based on historical data and market trends.
            </p>
            {/* Forecasting visualization would go here */}
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              Forecasting Chart Placeholder
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

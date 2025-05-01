import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/utils/errorHandler';

interface WorkflowAnalyticsProps {
  workflowId?: string;  // Optional to support both global and workflow-specific analytics
}

export default function WorkflowAnalytics({ workflowId }: WorkflowAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Determine endpoint based on whether workflowId is provided
        const endpoint = workflowId 
          ? `/api/workflows/${workflowId}/analytics?timeRange=${timeRange}`
          : `/api/workflows/analytics?timeRange=${timeRange}`;
        
        const data = await fetchWithAuth(endpoint);
        if (!data) {
          throw new Error('No data returned from analytics API');
        }
        setAnalyticsData(data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(err instanceof Error ? err.message : 'Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [workflowId, timeRange]);

  // Render appropriate UI based on whether this is global or workflow-specific analytics
  const title = workflowId ? 'Workflow Performance Analytics' : 'Global Workflow Analytics';

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
      </div>
      
      {/* Time range selector */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex space-x-4">
          {['7d', '30d', '90d', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === range
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {range === '7d' ? '7 Days' : 
               range === '30d' ? '30 Days' : 
               range === '90d' ? '90 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>
      
      {/* Content area */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : !analyticsData ? (
          <div className="text-center py-8 text-gray-500">
            No analytics data available
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Analytics content would go here */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700">Total Executions</h4>
              <p className="text-2xl font-bold mt-2">
                {analyticsData.totalExecutions || 0}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700">Success Rate</h4>
              <p className="text-2xl font-bold mt-2">
                {analyticsData.successRate ? `${analyticsData.successRate}%` : 'N/A'}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700">Avg. Execution Time</h4>
              <p className="text-2xl font-bold mt-2">
                {analyticsData.avgExecutionTime ? `${analyticsData.avgExecutionTime}ms` : 'N/A'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

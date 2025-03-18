import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/utils/errorHandler';
import { WorkflowMetrics } from '@/types/workflows';

interface WorkflowAnalyticsProps {
  workflowId: string;
  timeRange?: string;
}

export default function WorkflowAnalytics({ workflowId, timeRange = '30d' }: WorkflowAnalyticsProps) {
  const [metrics, setMetrics] = useState<WorkflowMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workflowId) {
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await fetchWithAuth(`/api/workflows/${workflowId}/analytics?timeRange=${timeRange}`);
        setMetrics(data);
        setError(null);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [workflowId, timeRange]);

  if (!workflowId) {
    return <div>No workflow selected</div>;
  }

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!metrics) {
    return <div>No analytics data available</div>;
  }

  return (
    <div className="workflow-analytics">
      <h2>Workflow Performance</h2>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Completion Rate</h3>
          <p>{metrics.completionRate}%</p>
        </div>
        
        <div className="metric-card">
          <h3>Average Duration</h3>
          <p>{metrics.averageDuration} hours</p>
        </div>
        
        <div className="metric-card">
          <h3>Conversion Rate</h3>
          <p>{metrics.conversionRate}%</p>
        </div>
        
        <div className="metric-card">
          <h3>Active Instances</h3>
          <p>{metrics.activeInstances}</p>
        </div>
      </div>
      
      <h3>Step Performance</h3>
      <div className="step-performance">
        {metrics.stepPerformance.map(step => (
          <div key={step.stepId} className="step-metric">
            <p>Step: {step.stepId}</p>
            <p>Completion: {step.completionRate}%</p>
            <p>Duration: {step.averageDuration} hours</p>
          </div>
        ))}
      </div>
    </div>
  );
}

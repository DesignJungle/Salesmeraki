'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import WorkflowAnalyticsDashboard from '@/components/workflows/WorkflowAnalytics';
import WorkflowABTesting from '@/components/workflows/WorkflowABTest';
import WorkflowLogs from '@/components/workflows/WorkflowLogs';
import { useWorkflow } from '@/hooks/useWorkflow';
import { Spinner } from '@/components/ui/Spinner';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function WorkflowPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'analytics' | 'testing' | 'logs'>('analytics');
  const { workflow, loading, error, fetchWorkflow } = useWorkflow(params.id as string);

  useEffect(() => {
    fetchWorkflow();
  }, [fetchWorkflow]);

  const tabs = [
    { id: 'analytics', label: 'Analytics' },
    { id: 'testing', label: 'A/B Testing' },
    { id: 'logs', label: 'Execution Logs' },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Spinner className="h-8 w-8" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="m-4 text-red-500 p-4 bg-red-50 border border-red-200 rounded">
          {error || 'An error occurred loading the workflow'}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/workflows')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Workflows
          </button>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{workflow?.name}</h1>
            {workflow?.description && (
              <p className="mt-1 text-gray-500">{workflow.description}</p>
            )}
          </div>
          <div className="flex items-center">
            <span className={`
              inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${workflow?.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : workflow?.status === 'draft' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-gray-100 text-gray-800'}
            `}>
              {workflow?.status ? workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1) : 'Unknown'}
            </span>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-6">
          {activeTab === 'analytics' && workflow && (
            <WorkflowAnalyticsDashboard workflowId={workflow.id} />
          )}
          {activeTab === 'testing' && workflow && (
            <WorkflowABTesting workflowId={workflow.id} />
          )}
          {activeTab === 'logs' && workflow && (
            <WorkflowLogs workflowId={workflow.id} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
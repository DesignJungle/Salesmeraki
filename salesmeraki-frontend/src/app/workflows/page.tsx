'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { fetchWithAuth } from '@/utils/errorHandler';
import { Workflow } from '@/types/workflows';
import DashboardLayout from '@/components/layout/DashboardLayout';
import WorkflowBuilder from '@/components/workflows/WorkflowBuilder';
import WorkflowAnalytics from '@/components/workflows/WorkflowAnalytics';
import WorkflowCollaboration from '@/components/workflows/WorkflowCollaboration';
import { WorkflowErrorBoundary } from '@/components/error/WorkflowErrorBoundary';
import { PlusIcon, RocketLaunchIcon, HomeIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function WorkflowsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'builder' | 'analytics' | 'collaboration'>('list');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handle auth errors
  const handleAuthError = () => {
    router.push('/auth/signin?callbackUrl=/workflows');
  };

  useEffect(() => {
    if (session) {
      fetchWorkflows();
    }
  }, [session]);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchWithAuth('/api/workflows');
      if (!data) {
        throw new Error('Failed to fetch workflows');
      }
      
      setWorkflows(data);
    } catch (err) {
      console.error('Error fetching workflows:', err);
      
      if (err instanceof Error && err.message.includes('Unauthorized')) {
        router.refresh();
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load workflows');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedWorkflow(null);
    setIsCreating(true);
    setActiveTab('builder');
  };

  const handleSaveWorkflow = async (savedWorkflow: Workflow) => {
    try {
      console.log("Handling saved workflow in parent component:", savedWorkflow);
      
      // Update local state with the saved workflow
      setWorkflows(prevWorkflows => {
        // Check if this workflow already exists in our list
        const existingIndex = prevWorkflows.findIndex(w => w.id === savedWorkflow.id);
        
        if (existingIndex >= 0) {
          // Update existing workflow
          const updatedWorkflows = [...prevWorkflows];
          updatedWorkflows[existingIndex] = savedWorkflow;
          return updatedWorkflows;
        } else {
          // Add as new workflow
          return [...prevWorkflows, savedWorkflow];
        }
      });
      
      // Reset creation state and update selected workflow
      setIsCreating(false);
      setSelectedWorkflow(savedWorkflow);
      
      // Force a refresh of the workflow list to ensure it's up to date
      await fetchWorkflows();
      
    } catch (error) {
      console.error('Error updating workflows:', error);
      // Handle error appropriately
    }
  };

  // Ensure template selection works correctly
  const handleTemplateSelect = (template: any) => {
    if (!template || !template.workflow) {
      console.error('Invalid template selected');
      return;
    }
    
    setSelectedWorkflow({
      ...template.workflow,
      id: '', // Clear ID to create a new workflow based on template
      name: `${template.name} (Copy)`,
    });
    setIsCreating(true);
    setActiveTab('builder');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            {/* Breadcrumb Navigation */}
            <nav className="flex mb-4" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <a href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary">
                    <HomeIcon className="w-4 h-4 mr-2" />
                    Home
                  </a>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                    <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Workflows</span>
                  </div>
                </li>
              </ol>
            </nav>
            
            {/* Title and CTA */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Sales Workflow Automation</h1>
                <p className="mt-1 text-lg text-gray-600">
                  Create, manage, and optimize your sales workflows with AI-powered insights.
                </p>
              </div>
              <button
                onClick={handleCreateNew}
                className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create New Workflow
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Tabs Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px" aria-label="Tabs">
                {[
                  { id: 'list', name: 'Workflow List' },
                  { id: 'builder', name: 'Workflow Builder' },
                  { id: 'analytics', name: 'Analytics' },
                  { id: 'collaboration', name: 'Team Collaboration' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm
                      ${activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                    `}
                    aria-current={activeTab === tab.id ? 'page' : undefined}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <WorkflowErrorBoundary>
                {activeTab === 'list' && (
                  <div>
                    {loading ? (
                      <div className="text-center py-12">
                        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    ) : error ? (
                      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                          </div>
                        </div>
                      </div>
                    ) : workflows.length === 0 ? (
                      <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No workflows</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new workflow.</p>
                        <div className="mt-6">
                          <button
                            onClick={handleCreateNew}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                          >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                            New Workflow
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {workflows.map((workflow) => (
                          <div
                            key={workflow.id}
                            className="relative rounded-lg border border-gray-200 bg-white px-6 py-5 shadow-sm flex flex-col space-y-3 hover:border-primary focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                          >
                            <div className="flex-1">
                              <span className="absolute inset-0" aria-hidden="true" />
                              <p className="text-sm font-medium text-gray-900">{workflow.name}</p>
                              <p className="text-sm text-gray-500 line-clamp-2">{workflow.description}</p>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className={`
                                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${workflow.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : workflow.status === 'draft' 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : 'bg-gray-100 text-gray-800'}
                              `}>
                                {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                              </span>
                              <button
                                onClick={() => {
                                  setSelectedWorkflow(workflow);
                                  setActiveTab('builder');
                                }}
                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'builder' && (
                  <WorkflowBuilder
                    workflow={isCreating ? null : selectedWorkflow}
                    onSave={handleSaveWorkflow}
                    onAuthError={handleAuthError}
                  />
                )}

                {activeTab === 'analytics' && (
                  <WorkflowAnalytics />
                )}

                {activeTab === 'collaboration' && (
                  <WorkflowCollaboration />
                )}
              </WorkflowErrorBoundary>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </DndProvider>
  );
}

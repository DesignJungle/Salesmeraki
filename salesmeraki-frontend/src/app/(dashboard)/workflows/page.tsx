'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { fetchWithAuth } from '@/utils/errorHandler';
import { Workflow } from '@/types/workflows';
import WorkflowBuilder from '@/components/workflows/WorkflowBuilder';
import WorkflowAnalytics from '@/components/workflows/WorkflowAnalytics';
import WorkflowCollaboration from '@/components/workflows/WorkflowCollaboration';
import { WorkflowErrorBoundary } from '@/components/error/WorkflowErrorBoundary';
import { PlusIcon } from '@heroicons/react/24/outline';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ApiStatusCheck from '@/components/common/ApiStatusCheck';

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

  // Improved workflow fetching with localStorage prioritization
  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      setError(null);

      // First, always load from localStorage to ensure we have the latest data
      let workflowsData: Workflow[] = [];
      const localData = localStorage.getItem('workflowsCache');

      if (localData) {
        try {
          const parsedLocalData = JSON.parse(localData);
          console.log('Loaded workflows from localStorage:', parsedLocalData);
          workflowsData = parsedLocalData;
        } catch (localErr) {
          console.error('Error parsing localStorage data:', localErr);
        }
      }

      // Set workflows from localStorage immediately
      setWorkflows(workflowsData);

      // Then try to fetch from API in the background
      try {
        const apiData = await fetchWithAuth('/api/workflows');
        if (apiData && Array.isArray(apiData)) {
          // Create a map of local workflows by ID for quick lookup
          const localWorkflowsMap = new Map(workflowsData.map(w => [w.id, w]));

          // Merge API data with local data, prioritizing local data for any conflicts
          const mergedData = [...apiData];

          // Add any local workflows that don't exist in the API data
          for (const localWorkflow of workflowsData) {
            // Skip workflows that start with 'local-' as they only exist locally
            if (localWorkflow.id.startsWith('local-')) {
              if (!mergedData.some(w => w.id === localWorkflow.id)) {
                mergedData.push(localWorkflow);
              }
              continue;
            }

            // For other workflows, check if they exist in the API data
            const apiWorkflow = mergedData.find(w => w.id === localWorkflow.id);
            if (!apiWorkflow) {
              // If not in API data, add the local workflow
              mergedData.push(localWorkflow);
            } else {
              // If in API data, use the more recently updated version
              const apiUpdatedAt = new Date(apiWorkflow.updatedAt || 0).getTime();
              const localUpdatedAt = new Date(localWorkflow.updatedAt || 0).getTime();

              if (localUpdatedAt > apiUpdatedAt) {
                // Replace the API workflow with the local one
                const index = mergedData.findIndex(w => w.id === localWorkflow.id);
                if (index !== -1) {
                  mergedData[index] = localWorkflow;
                }
              }
            }
          }

          // Update the workflows state with the merged data
          setWorkflows(mergedData);
          console.log('Updated workflows with merged data:', mergedData);
        }
      } catch (apiErr) {
        console.error('Error fetching workflows from API:', apiErr);
        // We already have the localStorage data, so just show a warning
        setError('Using cached data (API error occurred)');
      }
    } catch (err) {
      console.error('Error in fetchWorkflows:', err);
      setError('Failed to load workflows');
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

      // First, update the workflows cache in localStorage
      const workflowsCache = localStorage.getItem('workflowsCache');
      let cachedWorkflows = workflowsCache ? JSON.parse(workflowsCache) : [];

      // Check if this workflow already exists in the cache
      const existingCacheIndex = cachedWorkflows.findIndex((w: any) => w.id === savedWorkflow.id);

      if (existingCacheIndex >= 0) {
        // Update existing workflow
        cachedWorkflows[existingCacheIndex] = savedWorkflow;
      } else {
        // Add as new workflow
        cachedWorkflows.push(savedWorkflow);
      }

      // Save updated cache to localStorage
      localStorage.setItem('workflowsCache', JSON.stringify(cachedWorkflows));
      console.log('Updated workflows cache in localStorage:', cachedWorkflows);

      // Directly set the workflows state with the updated list
      // This ensures the UI is immediately updated
      setWorkflows(cachedWorkflows);
      console.log('Updated workflows state with:', cachedWorkflows);

      // Reset creation state and update selected workflow
      setIsCreating(false);
      setSelectedWorkflow(savedWorkflow);

      // Switch to the list tab to show the updated list
      setActiveTab('list');

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
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <ApiStatusCheck />

          {/* Header Section */}
          <div className="mb-8">

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
                  <div className="h-full flex flex-col">
                    <div className="bg-white p-4 border-b flex justify-between items-center">
                      <h2 className="text-lg font-semibold">
                        {isCreating ? 'Create New Workflow' : `Edit: ${selectedWorkflow?.name}`}
                      </h2>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedWorkflow(null);
                            setIsCreating(false);
                            setActiveTab('list');
                          }}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          id="workflow-save-trigger"
                          onClick={() => {
                            // Find the save button in the WorkflowBuilder component
                            const saveButton = document.querySelector('.workflow-save-button');
                            if (saveButton) {
                              saveButton.click();
                            } else {
                              console.error('Save button not found in WorkflowBuilder');
                            }
                          }}
                          className="px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-primary-dark"
                        >
                          Save Workflow
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-auto">
                      <WorkflowBuilder
                        workflow={isCreating ? null : selectedWorkflow}
                        onSave={handleSaveWorkflow}
                        onAuthError={handleAuthError}
                      />
                    </div>

                    <div className="bg-white p-4 border-t">
                      <h3 className="text-md font-medium mb-2">Workflow Analytics</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="text-sm text-gray-500">Conversion Rate</div>
                          <div className="text-lg font-semibold">24.5%</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="text-sm text-gray-500">Completion Rate</div>
                          <div className="text-lg font-semibold">78.3%</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="text-sm text-gray-500">Active Users</div>
                          <div className="text-lg font-semibold">156</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'analytics' && (
                  <WorkflowAnalytics />
                )}

                {activeTab === 'collaboration' && selectedWorkflow && (
                  <WorkflowCollaboration workflowId={selectedWorkflow.id} />
                )}

                {activeTab === 'collaboration' && !selectedWorkflow && (
                  <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-gray-500">Please select a workflow to view collaboration features.</p>
                  </div>
                )}
              </WorkflowErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

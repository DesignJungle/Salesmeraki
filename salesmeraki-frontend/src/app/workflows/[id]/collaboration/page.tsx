'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import WorkflowCollaboration from '@/components/workflows/WorkflowCollaboration';
import { useWorkflow } from '@/hooks/useWorkflow';
import { Spinner } from '@/components/ui/Spinner';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function WorkflowCollaborationPage() {
  const params = useParams();
  const router = useRouter();
  const { workflow, loading, error } = useWorkflow(params.id as string);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Spinner className="h-8 w-8" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !workflow) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-red-700">Error loading workflow: {error || 'Workflow not found'}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center mb-4">
          <button
            onClick={() => router.back()}
            className="mr-2 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {workflow.name} - Team Collaboration
          </h1>
        </div>
        
        <WorkflowCollaboration workflowId={workflow.id} />
      </div>
    </DashboardLayout>
  );
}

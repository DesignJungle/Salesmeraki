import { useState, useCallback } from 'react';
import { Workflow, WorkflowExecution } from '@/types/workflows';
import { WorkflowService } from '@/services/workflows/workflowService';

const workflowService = new WorkflowService();

export function useWorkflow(id: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workflow, setWorkflow] = useState<Workflow | null>(null);

  const fetchWorkflow = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await workflowService.getWorkflow(id);
      setWorkflow(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workflow');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const updateWorkflow = useCallback(async (updates: Partial<Workflow>) => {
    try {
      setLoading(true);
      setError(null);
      const updated = await workflowService.updateWorkflow(id, updates);
      setWorkflow(updated);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update workflow');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [id]);

  const executeWorkflow = useCallback(async (context?: Record<string, any>) => {
    try {
      setLoading(true);
      setError(null);
      return await workflowService.executeWorkflow(id, context);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute workflow');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [id]);

  return {
    workflow,
    loading,
    error,
    fetchWorkflow,
    updateWorkflow,
    executeWorkflow,
  };
}
import { useState, useCallback } from 'react';
import { Workflow, WorkflowExecution } from '@/types/workflows';
import { WorkflowService } from '@/services/workflows/workflowService';

const workflowService = new WorkflowService();

export function useWorkflow(id: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workflow, setWorkflow] = useState<Workflow | null>(null);

  const fetchWorkflow = useCallback(async () => {
    if (!id) {
      setWorkflow(null);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // First try to get from localStorage as fallback
      const localData = localStorage.getItem(`workflow_${id}`);
      let localWorkflow = null;
      
      if (localData) {
        try {
          localWorkflow = JSON.parse(localData);
        } catch (e) {
          console.error('Error parsing local workflow data:', e);
        }
      }
      
      // Try to fetch from API
      try {
        const data = await workflowService.getWorkflow(id);
        setWorkflow(data);
        
        // Update local storage with latest data
        localStorage.setItem(`workflow_${id}`, JSON.stringify(data));
      } catch (apiError) {
        console.error('API error fetching workflow:', apiError);
        
        // If we have local data, use it as fallback
        if (localWorkflow) {
          console.log('Using local workflow data as fallback');
          setWorkflow(localWorkflow);
          setError('Using locally cached data (API error occurred)');
        } else {
          throw apiError; // Re-throw if no fallback
        }
      }
    } catch (err) {
      console.error('Error in fetchWorkflow:', err);
      setError(err instanceof Error ? err.message : 'Failed to load workflow');
      setWorkflow(null);
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

import { Workflow, WorkflowExecution } from '@/types/workflows';
import { fetchWithAuth } from '@/utils/errorHandler';

export class WorkflowService {
  private baseUrl = '/api/workflows';

  async getWorkflows(): Promise<Workflow[]> {
    const response = await fetchWithAuth(this.baseUrl);
    return response;
  }

  async getWorkflow(id: string): Promise<Workflow> {
    const response = await fetchWithAuth(`${this.baseUrl}/${id}`);
    return response;
  }

  async createWorkflow(workflow: Partial<Workflow>): Promise<Workflow> {
    const response = await fetchWithAuth(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify(workflow),
    });
    return response;
  }

  async updateWorkflow(id: string, updates: Partial<Workflow>): Promise<Workflow> {
    const response = await fetchWithAuth(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response;
  }

  async deleteWorkflow(id: string): Promise<void> {
    await fetchWithAuth(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
  }

  async executeWorkflow(id: string, context?: Record<string, any>): Promise<WorkflowExecution> {
    const response = await fetchWithAuth(`${this.baseUrl}/${id}/execute`, {
      method: 'POST',
      body: JSON.stringify({ context }),
    });
    return response;
  }

  async getWorkflowExecutions(workflowId: string): Promise<WorkflowExecution[]> {
    const response = await fetchWithAuth(`${this.baseUrl}/${workflowId}/executions`);
    return response;
  }
}

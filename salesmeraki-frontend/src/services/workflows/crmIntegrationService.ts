import { CRMIntegration } from '@/types/workflows';

export class WorkflowCRMIntegrationService {
  async getIntegrationStatus(workflowId: string): Promise<CRMIntegration> {
    const response = await fetch(`/api/workflows/${workflowId}/crm/status`);
    if (!response.ok) {
      throw new Error('Failed to fetch CRM integration status');
    }
    return response.json();
  }

  async updateIntegrationMapping(
    workflowId: string,
    mappings: CRMIntegration['mappings']
  ): Promise<CRMIntegration> {
    const response = await fetch(`/api/workflows/${workflowId}/crm/mappings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mappings),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update CRM mappings');
    }
    return response.json();
  }

  async syncCRMData(workflowId: string): Promise<void> {
    const response = await fetch(`/api/workflows/${workflowId}/crm/sync`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to sync CRM data');
    }
  }
}
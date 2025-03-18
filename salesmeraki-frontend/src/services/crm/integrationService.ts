import { CRMProvider, CRMConfig, SyncStatus } from '@/types/crm';

export class CRMIntegrationService {
  async connectCRM(provider: CRMProvider, credentials: any): Promise<boolean> {
    const response = await fetch('/api/integrations/crm/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, credentials }),
    });
    return response.ok;
  }

  async syncData(config: CRMConfig): Promise<SyncStatus> {
    const response = await fetch('/api/integrations/crm/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    return response.json();
  }

  async mapFields(mapping: Record<string, string>): Promise<boolean> {
    const response = await fetch('/api/integrations/crm/field-mapping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mapping }),
    });
    return response.ok;
  }
}
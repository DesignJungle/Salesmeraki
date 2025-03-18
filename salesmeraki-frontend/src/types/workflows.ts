export type WorkflowStepType = 'email' | 'sms' | 'call' | 'task' | 'delay' | 'condition' | 'ai_analysis' | 'crm_update';

export interface WorkflowStep {
  id: string;
  type: string;
  position: number;
  config: Record<string, any>;
  name?: string;
  description?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'archived';
  steps: WorkflowStep[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  teamId?: string;
}

export interface WorkflowAnalytics {
  executionCount: number;
  successRate: number;
  averageCompletionTime: number;
  conversionRate: number;
  revenueImpact: number;
  activeUsers: number;
  metrics: {
    daily: MetricPoint[];
    weekly: MetricPoint[];
    monthly: MetricPoint[];
  };
}

export interface WorkflowABTest {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'draft';
  variants: {
    id: string;
    name: string;
    workflow: Workflow;
    metrics: {
      conversions: number;
      completionRate: number;
      averageTime: number;
    };
  }[];
  startDate: string;
  endDate?: string;
  winner?: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  workflow: Workflow;
  popularity: number;
  averageRating: number;
  thumbnailUrl?: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  results?: Record<string, any>;
}

export interface CRMIntegration {
  provider: 'salesforce' | 'hubspot' | 'zoho';
  status: 'connected' | 'disconnected';
  lastSync: string;
  mappings: {
    fields: Record<string, string>;
    triggers: Record<string, string>;
    actions: Record<string, string>;
  };
}

export interface WorkflowMetrics {
  completionRate: number;
  averageDuration: number;
  conversionRate: number;
  activeInstances: number;
  stepPerformance: {
    stepId: string;
    completionRate: number;
    averageDuration: number;
  }[];
  timeSeriesData: {
    date: string;
    completions: number;
    starts: number;
  }[];
}

export interface WorkflowCollaborationComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  stepId?: string;
}

export interface WorkflowBuilderProps {
  workflow: Workflow | null;
  onSave: (workflow: Workflow) => Promise<Workflow>;
  onAuthError?: () => void;
}

export interface WorkflowAnalyticsProps {
  workflowId: string;
}

export interface WorkflowCollaborationProps {
  workflowId: string;
}

export interface WorkflowTemplatesProps {
  onSelectTemplate: (template: WorkflowTemplate) => void;
}

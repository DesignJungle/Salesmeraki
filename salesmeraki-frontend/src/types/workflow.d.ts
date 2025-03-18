type WorkflowStepType = 'email' | 'sms' | 'call' | 'task' | 'delay' | 'condition';

interface WorkflowStep {
  id: string;
  type: WorkflowStepType;
  title: string;
  config: Record<string, any>;
  conditions: any[];
}

interface WorkflowStepProps {
  step: WorkflowStep;
  index: number;
  onUpdate: (id: string, updates: Partial<WorkflowStep>) => void;
  onDelete: (id: string) => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
}

interface Workflow {
  id: string;
  name: string;
  status: string;
  updatedAt?: string;
  steps: WorkflowStep[];
}
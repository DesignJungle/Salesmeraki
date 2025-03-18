'use client';

import { useState } from 'react';
import { WorkflowStep, WorkflowStepType } from '@/types/workflows';

interface Props {
  step: WorkflowStep;
  onSave: (config: Record<string, any>) => void;
}

const stepConfigs: Record<string, Array<{
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  options?: string[];
}>> = {
  email: [
    { key: 'template', label: 'Email Template', type: 'select', options: ['welcome', 'follow_up', 'proposal'] },
    { key: 'subject', label: 'Subject', type: 'text' },
    { key: 'delay', label: 'Delay (hours)', type: 'number' },
  ],
  sms: [
    { key: 'message', label: 'Message', type: 'textarea' },
    { key: 'delay', label: 'Delay (hours)', type: 'number' },
  ],
  call: [
    { key: 'script', label: 'Call Script', type: 'textarea' },
    { key: 'duration', label: 'Expected Duration (min)', type: 'number' },
  ],
  task: [
    { key: 'title', label: 'Task Title', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'assignee', label: 'Assignee', type: 'text' },
  ],
  ai_analysis: [
    { key: 'type', label: 'Analysis Type', type: 'select', options: ['sentiment', 'intent', 'qualification'] },
    { key: 'threshold', label: 'Confidence Threshold', type: 'number' },
  ],
  crm_update: [
    { key: 'fields', label: 'Fields to Update', type: 'textarea' },
  ],
  delay: [
    { key: 'duration', label: 'Delay Duration (hours)', type: 'number' },
  ],
  condition: [
    { key: 'field', label: 'Field to Check', type: 'text' },
    { key: 'operator', label: 'Operator', type: 'select', options: ['equals', 'not_equals', 'contains', 'greater_than', 'less_than'] },
    { key: 'value', label: 'Value', type: 'text' },
  ],
};

export function StepConfigForm({ step, onSave }: Props) {
  const [config, setConfig] = useState<Record<string, any>>(step.config || {});
  const fields = stepConfigs[step.type] || [];

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        onSave(config);
      }}
      className="space-y-4"
    >
      {fields.map((field) => (
        <div key={field.key}>
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
          </label>
          {field.type === 'select' ? (
            <select
              value={config[field.key] || ''}
              onChange={(e) => setConfig({ ...config, [field.key]: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select...</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option.replace('_', ' ')}
                </option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              value={config[field.key] || ''}
              onChange={(e) => setConfig({ ...config, [field.key]: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          ) : (
            <input
              type={field.type}
              value={config[field.key] || ''}
              onChange={(e) => setConfig({ ...config, [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          )}
        </div>
      ))}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save Configuration
        </button>
      </div>
    </form>
  );
}
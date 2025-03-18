'use client';

import { useDrag } from 'react-dnd';

interface ToolboxItemProps {
  type: string;
  title: string;
  description: string;
}

function ToolboxItem({ type, title, description }: ToolboxItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'workflowStep',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-4 border rounded-lg cursor-move hover:bg-gray-50 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <h3 className="text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-xs text-gray-500">{description}</p>
    </div>
  );
}

export default function WorkflowToolbox({ onAddStep }: { onAddStep: (type: string) => void }) {
  const availableSteps = [
    {
      type: 'email',
      title: 'Send Email',
      description: 'Send an email to specified recipients'
    },
    {
      type: 'delay',
      title: 'Add Delay',
      description: 'Wait for a specified duration'
    },
    {
      type: 'condition',
      title: 'Add Condition',
      description: 'Branch workflow based on conditions'
    },
    {
      type: 'task',
      title: 'Create Task',
      description: 'Create a task for follow-up'
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium text-gray-900">Available Steps</h2>
        <p className="mt-1 text-sm text-gray-500">
          Drag and drop steps to build your workflow
        </p>
      </div>
      <div className="p-4 space-y-4">
        {availableSteps.map((step) => (
          <ToolboxItem
            key={step.type}
            type={step.type}
            title={step.title}
            description={step.description}
          />
        ))}
      </div>
    </div>
  );
}
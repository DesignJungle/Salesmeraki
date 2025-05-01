'use client';

import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { WorkflowStep as WorkflowStepType } from '@/types/workflows';
import {
  EnvelopeIcon,
  ClockIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

interface WorkflowStepProps {
  step: WorkflowStepType;
  index: number;
  onUpdate: (id: string, updates: Partial<WorkflowStepType>) => void;
  onDelete: (id: string) => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
}

export default function WorkflowStep({ step, index, onUpdate, onDelete, onMove }: WorkflowStepProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'WORKFLOW_STEP',
    item: { id: step.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'WORKFLOW_STEP',
    hover(item: { id: string; index: number }, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      // Call onMove only if it's a function
      if (typeof onMove === 'function') {
        onMove(dragIndex, hoverIndex);
        item.index = hoverIndex;
      }
    },
  });

  drag(drop(ref));

  // Prevent default on all mouse events to avoid navigation
  const preventDefaultAndPropagation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const getStepIcon = () => {
    switch (step.type) {
      case 'email':
        return <EnvelopeIcon className="h-5 w-5 text-blue-500" />;
      case 'delay':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'condition':
        return <ArrowPathIcon className="h-5 w-5 text-purple-500" />;
      case 'task':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'sms':
        return <ChatBubbleLeftRightIcon className="h-5 w-5 text-green-500" />;
      case 'call':
        return <PhoneIcon className="h-5 w-5 text-red-500" />;
      default:
        return <CheckCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStepTitle = () => {
    switch (step.type) {
      case 'email':
        return 'Send Email';
      case 'delay':
        return 'Wait';
      case 'condition':
        return 'Condition';
      case 'task':
        return 'Create Task';
      case 'sms':
        return 'Send SMS';
      case 'call':
        return 'Make Call';
      case 'ai_analysis':
        return 'AI Analysis';
      case 'crm_update':
        return 'Update CRM';
      default:
        return 'Step';
    }
  };

  return (
    <div
      ref={ref}
      className={`p-4 border rounded-lg mb-4 cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
      onMouseDown={preventDefaultAndPropagation}
      onMouseUp={preventDefaultAndPropagation}
      onClick={preventDefaultAndPropagation}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {getStepIcon()}
          <h3 className="ml-2 text-sm font-medium text-gray-900">
            {getStepTitle()}
          </h3>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(step.id);
          }}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        {getStepDescription(step.type)}
      </p>
    </div>
  );
}

function getStepDescription(type: string): string {
  switch (type) {
    case 'email':
      return 'Send an automated email to the prospect';
    case 'delay':
      return 'Wait for a specified time period';
    case 'condition':
      return 'Branch workflow based on conditions';
    case 'task':
      return 'Create a task for follow-up';
    case 'sms':
      return 'Send an SMS message to the prospect';
    case 'call':
      return 'Schedule a call with the prospect';
    case 'ai_analysis':
      return 'Analyze data using AI';
    case 'crm_update':
      return 'Update CRM records';
    default:
      return 'Workflow step';
  }
}

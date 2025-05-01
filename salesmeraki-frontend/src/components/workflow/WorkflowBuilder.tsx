'use client';

import { useState } from 'react';
import { 
  PlusIcon, 
  TrashIcon, 
  ArrowPathIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  DocumentTextIcon,
  UserPlusIcon,
  TagIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Types
type TriggerType = 'new_lead' | 'deal_stage_change' | 'form_submission' | 'scheduled' | 'manual';
type ActionType = 'send_email' | 'send_sms' | 'create_task' | 'update_deal' | 'add_contact' | 'add_tag' | 'delay';

interface Trigger {
  id: string;
  type: TriggerType;
  name: string;
  description: string;
  icon: React.ReactNode;
  config?: Record<string, any>;
}

interface Action {
  id: string;
  type: ActionType;
  name: string;
  description: string;
  icon: React.ReactNode;
  config?: Record<string, any>;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: Trigger;
  actions: Action[];
  isActive: boolean;
}

// Available triggers and actions
const availableTriggers: Trigger[] = [
  {
    id: 'trigger_new_lead',
    type: 'new_lead',
    name: 'New Lead',
    description: 'Trigger when a new lead is created',
    icon: <UserPlusIcon className="h-5 w-5" />,
  },
  {
    id: 'trigger_deal_stage',
    type: 'deal_stage_change',
    name: 'Deal Stage Change',
    description: 'Trigger when a deal changes stage',
    icon: <ArrowPathIcon className="h-5 w-5" />,
  },
  {
    id: 'trigger_form',
    type: 'form_submission',
    name: 'Form Submission',
    description: 'Trigger when a form is submitted',
    icon: <DocumentTextIcon className="h-5 w-5" />,
  },
  {
    id: 'trigger_scheduled',
    type: 'scheduled',
    name: 'Scheduled',
    description: 'Trigger at a scheduled time',
    icon: <CalendarIcon className="h-5 w-5" />,
  },
  {
    id: 'trigger_manual',
    type: 'manual',
    name: 'Manual Trigger',
    description: 'Trigger manually',
    icon: <TagIcon className="h-5 w-5" />,
  },
];

const availableActions: Action[] = [
  {
    id: 'action_email',
    type: 'send_email',
    name: 'Send Email',
    description: 'Send an email to the contact',
    icon: <EnvelopeIcon className="h-5 w-5" />,
  },
  {
    id: 'action_sms',
    type: 'send_sms',
    name: 'Send SMS',
    description: 'Send an SMS to the contact',
    icon: <PhoneIcon className="h-5 w-5" />,
  },
  {
    id: 'action_task',
    type: 'create_task',
    name: 'Create Task',
    description: 'Create a task for a team member',
    icon: <DocumentTextIcon className="h-5 w-5" />,
  },
  {
    id: 'action_deal',
    type: 'update_deal',
    name: 'Update Deal',
    description: 'Update deal properties',
    icon: <ArrowPathIcon className="h-5 w-5" />,
  },
  {
    id: 'action_contact',
    type: 'add_contact',
    name: 'Add Contact',
    description: 'Add a contact to the CRM',
    icon: <UserPlusIcon className="h-5 w-5" />,
  },
  {
    id: 'action_tag',
    type: 'add_tag',
    name: 'Add Tag',
    description: 'Add a tag to the contact',
    icon: <TagIcon className="h-5 w-5" />,
  },
  {
    id: 'action_delay',
    type: 'delay',
    name: 'Delay',
    description: 'Wait for a specified time',
    icon: <ClockIcon className="h-5 w-5" />,
  },
];

// Drag and Drop Components
const DraggableItem = ({ item, type }: { item: Trigger | Action; type: 'trigger' | 'action' }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { ...item },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-3 mb-2 bg-white border rounded-lg cursor-move flex items-center ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="mr-3 text-primary">{item.icon}</div>
      <div>
        <h4 className="font-medium text-gray-900">{item.name}</h4>
        <p className="text-xs text-gray-500">{item.description}</p>
      </div>
    </div>
  );
};

const DroppableArea = ({ 
  onDrop, 
  children, 
  acceptType,
  className = ''
}: { 
  onDrop: (item: any) => void; 
  children: React.ReactNode; 
  acceptType: string | string[];
  className?: string;
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: acceptType,
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`${className} ${
        isOver ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'
      }`}
    >
      {children}
    </div>
  );
};

// Main Component
export function WorkflowBuilder() {
  const [workflow, setWorkflow] = useState<Workflow>({
    id: `workflow_${Date.now()}`,
    name: 'New Workflow',
    description: 'Describe your workflow',
    trigger: {
      id: '',
      type: 'manual',
      name: '',
      description: '',
      icon: <></>,
    },
    actions: [],
    isActive: false,
  });

  const [showTriggerPanel, setShowTriggerPanel] = useState(false);
  const [showActionPanel, setShowActionPanel] = useState(false);

  const handleTriggerDrop = (item: Trigger) => {
    setWorkflow({
      ...workflow,
      trigger: item,
    });
    setShowTriggerPanel(false);
  };

  const handleActionDrop = (item: Action) => {
    setWorkflow({
      ...workflow,
      actions: [...workflow.actions, { ...item, id: `${item.id}_${Date.now()}` }],
    });
    setShowActionPanel(false);
  };

  const removeAction = (actionId: string) => {
    setWorkflow({
      ...workflow,
      actions: workflow.actions.filter((action) => action.id !== actionId),
    });
  };

  const saveWorkflow = async () => {
    try {
      // In a real app, this would save to the backend
      console.log('Saving workflow:', workflow);
      alert('Workflow saved successfully!');
    } catch (error) {
      console.error('Error saving workflow:', error);
      alert('Failed to save workflow');
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Workflow Builder</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Workflow Name</label>
              <input
                type="text"
                value={workflow.name}
                onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter workflow name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={workflow.description}
                onChange={(e) => setWorkflow({ ...workflow, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter description"
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Trigger</h3>
            <button
              onClick={() => setShowTriggerPanel(!showTriggerPanel)}
              className="text-primary hover:text-primary-dark flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              {workflow.trigger.name ? 'Change Trigger' : 'Add Trigger'}
            </button>
          </div>

          {showTriggerPanel && (
            <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h4 className="font-medium mb-2">Available Triggers</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {availableTriggers.map((trigger) => (
                  <DraggableItem key={trigger.id} item={trigger} type="trigger" />
                ))}
              </div>
            </div>
          )}

          <DroppableArea
            onDrop={handleTriggerDrop}
            acceptType="trigger"
            className="p-4 border rounded-lg min-h-[100px] flex items-center justify-center"
          >
            {workflow.trigger.name ? (
              <div className="w-full p-3 bg-white border rounded-lg flex items-center">
                <div className="mr-3 text-primary">{workflow.trigger.icon}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{workflow.trigger.name}</h4>
                  <p className="text-xs text-gray-500">{workflow.trigger.description}</p>
                </div>
                <button
                  onClick={() => setWorkflow({ ...workflow, trigger: { id: '', type: 'manual', name: '', description: '', icon: <></> } })}
                  className="text-gray-400 hover:text-red-500"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <p>Drag and drop a trigger here</p>
                <p className="text-xs">or click Add Trigger</p>
              </div>
            )}
          </DroppableArea>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Actions</h3>
            <button
              onClick={() => setShowActionPanel(!showActionPanel)}
              className="text-primary hover:text-primary-dark flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              Add Action
            </button>
          </div>

          {showActionPanel && (
            <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h4 className="font-medium mb-2">Available Actions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {availableActions.map((action) => (
                  <DraggableItem key={action.id} item={action} type="action" />
                ))}
              </div>
            </div>
          )}

          <DroppableArea
            onDrop={handleActionDrop}
            acceptType="action"
            className="p-4 border rounded-lg min-h-[200px]"
          >
            {workflow.actions.length > 0 ? (
              <div className="space-y-3">
                {workflow.actions.map((action, index) => (
                  <div key={action.id} className="p-3 bg-white border rounded-lg flex items-center">
                    <div className="mr-3 text-primary">{action.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full mr-2">
                          Step {index + 1}
                        </span>
                        <h4 className="font-medium text-gray-900">{action.name}</h4>
                      </div>
                      <p className="text-xs text-gray-500">{action.description}</p>
                    </div>
                    <button
                      onClick={() => removeAction(action.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Drag and drop actions here</p>
                <p className="text-xs">or click Add Action</p>
              </div>
            )}
          </DroppableArea>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="mr-2 text-sm font-medium text-gray-700">Workflow Status:</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={workflow.isActive}
                onChange={() => setWorkflow({ ...workflow, isActive: !workflow.isActive })}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              <span className="ms-3 text-sm font-medium text-gray-700">
                {workflow.isActive ? 'Active' : 'Inactive'}
              </span>
            </label>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => {
                setWorkflow({
                  id: `workflow_${Date.now()}`,
                  name: 'New Workflow',
                  description: 'Describe your workflow',
                  trigger: { id: '', type: 'manual', name: '', description: '', icon: <></> },
                  actions: [],
                  isActive: false,
                });
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              onClick={saveWorkflow}
              disabled={!workflow.trigger.name || workflow.actions.length === 0}
              className={`px-4 py-2 rounded-md text-white ${
                !workflow.trigger.name || workflow.actions.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark'
              }`}
            >
              Save Workflow
            </button>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

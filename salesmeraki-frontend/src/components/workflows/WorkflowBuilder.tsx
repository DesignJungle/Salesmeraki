import { useState, useEffect, useRef } from 'react';
import { Workflow, WorkflowStep } from '@/types/workflows';
import { v4 as uuidv4 } from 'uuid';
import { useDrag, useDrop } from 'react-dnd';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/utils/errorHandler';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/common/Button';
import { 
  EnvelopeIcon, 
  ClockIcon, 
  ArrowPathIcon, 
  CheckCircleIcon,
  PlusIcon,
  TrashIcon,
  PhoneIcon,
  BoltIcon,
  LightBulbIcon,
  ArrowsRightLeftIcon,
  UserIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import { performanceMonitor } from '@/utils/performance';
import { logger } from '@/utils/logger';

// Define the interface locally
interface WorkflowBuilderProps {
  workflow: Workflow | null;
  onSave: (workflow: Workflow) => Promise<void>;
  onAuthError?: () => void;
}

// Step categories for the builder
const stepCategories = [
  {
    name: 'Triggers',
    items: [
      { type: 'trigger_new_lead', title: 'New Lead Captured', icon: <BoltIcon className="h-5 w-5" /> },
      { type: 'trigger_deal_stage', title: 'Deal Stage Changed', icon: <ArrowsRightLeftIcon className="h-5 w-5" /> },
      { type: 'trigger_form_submit', title: 'Form Submission', icon: <CheckCircleIcon className="h-5 w-5" /> }
    ]
  },
  {
    name: 'Actions',
    items: [
      { type: 'email', title: 'Send Email', icon: <EnvelopeIcon className="h-5 w-5" /> },
      { type: 'sms', title: 'Send SMS', icon: <PhoneIcon className="h-5 w-5" /> },
      { type: 'task', title: 'Create Task', icon: <CheckCircleIcon className="h-5 w-5" /> },
      { type: 'crm_update', title: 'Update CRM', icon: <ArrowPathIcon className="h-5 w-5" /> }
    ]
  },
  {
    name: 'Logic',
    items: [
      { type: 'delay', title: 'Add Delay', icon: <ClockIcon className="h-5 w-5" /> },
      { type: 'condition', title: 'Add Condition', icon: <ArrowsRightLeftIcon className="h-5 w-5" /> },
      { type: 'ai_analysis', title: 'AI Analysis', icon: <LightBulbIcon className="h-5 w-5" /> }
    ]
  }
];

export default function WorkflowBuilder({ workflow, onSave, onAuthError }: WorkflowBuilderProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [name, setName] = useState(workflow?.name || '');
  const [description, setDescription] = useState(workflow?.description || '');
  const [status, setStatus] = useState<'draft' | 'active' | 'archived'>(workflow?.status || 'draft');
  const [steps, setSteps] = useState<WorkflowStep[]>(workflow?.steps || []);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Add this function to fetch AI recommendations
  const fetchAIRecommendations = async () => {
    if (!showAIRecommendations) {
      setShowAIRecommendations(true);
      setIsLoadingRecommendations(true);
      
      try {
        const response = await fetchWithAuth('/api/ai', {
          method: 'POST',
          body: JSON.stringify({
            prompt: "Recommend workflow steps based on current configuration",
            context: {
              workflowName: name,
              workflowDescription: description,
              currentSteps: steps,
            },
            type: 'sales_analysis'
          }),
        });
        
        if (response && response.recommendations) {
          setAiRecommendations(response.recommendations);
        } else {
          setAiRecommendations([
            {
              title: "Add Email Follow-up",
              description: "Send an automated email 3 days after initial contact",
              type: "email"
            },
            {
              title: "Add Task Reminder",
              description: "Create a task for sales rep to follow up by phone",
              type: "task"
            },
            {
              title: "Add Lead Scoring",
              description: "Use AI to analyze prospect engagement and score leads",
              type: "ai_analysis"
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching AI recommendations:', error);
        // Fallback recommendations if API fails
        setAiRecommendations([
          {
            title: "Add Email Follow-up",
            description: "Send an automated email 3 days after initial contact",
            type: "email"
          },
          {
            title: "Add Task Reminder",
            description: "Create a task for sales rep to follow up by phone",
            type: "task"
          }
        ]);
      } finally {
        setIsLoadingRecommendations(false);
      }
    } else {
      setShowAIRecommendations(false);
    }
  };

  // Validation function
  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'name':
        return !value.trim() ? 'Workflow name is required' : '';
      case 'description':
        return value.length > 500 ? 'Description must be less than 500 characters' : '';
      default:
        return '';
    }
  };

  // Handle field change with validation
  const handleFieldChange = (field: string, value: string) => {
    switch (field) {
      case 'name':
        setName(value);
        break;
      case 'description':
        setDescription(value);
        break;
    }

    // Mark field as touched
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate field
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {
      name: validateField('name', name),
      description: validateField('description', description),
    };
    
    // Check if steps array is empty
    if (steps.length === 0) {
      newErrors.steps = 'At least one step is required';
    }
    
    setErrors(newErrors);
    setTouched({
      name: true,
      description: true,
      steps: true,
    });
    
    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    return !hasErrors;
  };

  // Modify the handleSave function to ensure workflow list updates
  const handleSave = async () => {
    logger.debug("Save button clicked");
    
    // Start performance measurement
    const endMeasure = performanceMonitor.startMeasure('WorkflowBuilder', 'save');
    
    // Validate all fields before submission
    const isValid = validateForm();
    logger.debug("Form validation result:", isValid);
    
    if (!isValid) {
      logger.debug("Form validation failed with errors:", errors);
      endMeasure(); // End measurement on early return
      return;
    }

    if (!session || !session.user) {
      logger.debug("No valid session found");
      setErrors(prev => ({ ...prev, auth: 'Your session has expired. Please log in again.' }));
      
      if (router) {
        router.push('/auth/signin?callbackUrl=/workflows');
      } else if (onAuthError) {
        onAuthError();
      }
      return;
    }

    try {
      logger.debug("Starting save process");
      setIsSaving(true);
      setErrors({});
      
      const workflowData = {
        id: workflow?.id || '',
        name,
        description,
        status,
        steps: steps.map((step, index) => ({
          ...step,
          position: index
        })),
      };

      logger.debug('Saving workflow data:', workflowData);

      // Also save to localStorage as a backup
      localStorage.setItem("workflowSteps", JSON.stringify(steps));
      localStorage.setItem("workflowData", JSON.stringify(workflowData));

      // Determine if this is a new workflow or an update
      const isNewWorkflow = !workflow?.id;
      const endpoint = isNewWorkflow 
        ? '/api/workflows' 
        : `/api/workflows/${workflow.id}`;
      const method = isNewWorkflow ? 'POST' : 'PUT';
      
      logger.debug(`Making ${method} request to ${endpoint}`);
      
      let savedWorkflow; // Define variable here
      
      try {
        const response = await fetch(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(workflowData),
          credentials: 'include', // Include cookies for authentication
        });
        
        logger.debug("Response status:", response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          logger.error("API error response:", errorData);
          throw new Error(errorData.error || `Request failed with status ${response.status}`);
        }
        
        savedWorkflow = await response.json();
        logger.debug("Successfully saved workflow:", savedWorkflow);
        
        // Show success message
        setSuccessMessage('Workflow saved successfully');
        
        // If API call succeeded, make sure to call onSave with the saved workflow
        if (onSave) {
          logger.debug("Calling onSave callback with saved workflow:", savedWorkflow);
          await onSave(savedWorkflow);
        }
      } catch (apiError) {
        logger.error('API error:', apiError);
        
        // If API call fails, use the local data as fallback
        logger.debug("API call failed, using local data as fallback");
        savedWorkflow = {
          ...workflowData,
          id: workflowData.id || `local-${Date.now()}`,
          updatedAt: new Date().toISOString()
        };
        
        // Still call onSave with the local data to update the UI
        if (onSave) {
          logger.debug("Calling onSave callback with local workflow data:", savedWorkflow);
          await onSave(savedWorkflow);
        }
        
        setSuccessMessage('Saved locally (API error occurred)');
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
      // Make sure to call onSave with the saved workflow to update the parent component's state
      if (onSave) {
        logger.debug("Calling onSave callback with saved workflow:", savedWorkflow);
        await onSave(savedWorkflow);
        logger.debug("onSave callback completed");
      }
      
    } catch (err) {
      logger.error('Error saving workflow:', err);
      setErrors(prev => ({ 
        ...prev, 
        submit: err instanceof Error ? err.message : 'Failed to save workflow' 
      }));
    } finally {
      setIsSaving(false);
      logger.debug("Save process completed");
      endMeasure(); // End measurement when function completes
    }
  };

  // Add this function for localStorage-only saving
  const saveWorkflowLocally = () => {
    const workflowData = {
      id: workflow?.id || `local-${Date.now()}`,
      name,
      description,
      status,
      steps: steps.map((step, index) => ({
        ...step,
        position: index
      })),
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem("workflowSteps", JSON.stringify(steps));
    localStorage.setItem("workflowData", JSON.stringify(workflowData));
    
    setSuccessMessage('Workflow saved locally');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
    
    return workflowData;
  };

  // Add a function to load from localStorage
  const loadWorkflowFromLocalStorage = () => {
    try {
      const savedWorkflowData = localStorage.getItem("workflowData");
      const savedWorkflowSteps = localStorage.getItem("workflowSteps");
      
      if (savedWorkflowData) {
        const parsedData = JSON.parse(savedWorkflowData);
        setName(parsedData.name || '');
        setDescription(parsedData.description || '');
        setStatus(parsedData.status || 'draft');
      }
      
      if (savedWorkflowSteps) {
        setSteps(JSON.parse(savedWorkflowSteps));
      }
      
      return true;
    } catch (error) {
      logger.error("Error loading workflow from localStorage:", error);
      return false;
    }
  };

  const addStep = (type: string) => {
    const newStep: WorkflowStep = {
      id: uuidv4(),
      type,
      config: {},
      position: steps.length
    };
    
    setSteps([...steps, newStep]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const moveStep = (dragIndex: number, hoverIndex: number) => {
    const dragStep = steps[dragIndex];
    const newSteps = [...steps];
    newSteps.splice(dragIndex, 1);
    newSteps.splice(hoverIndex, 0, dragStep);
    setSteps(newSteps);
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <EnvelopeIcon className="h-5 w-5 text-blue-500" />;
      case 'sms':
        return <PhoneIcon className="h-5 w-5 text-green-500" />;
      case 'delay':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'condition':
        return <ArrowsRightLeftIcon className="h-5 w-5 text-purple-500" />;
      case 'task':
        return <CheckCircleIcon className="h-5 w-5 text-red-500" />;
      case 'ai_analysis':
        return <LightBulbIcon className="h-5 w-5 text-indigo-500" />;
      case 'crm_update':
        return <ArrowPathIcon className="h-5 w-5 text-gray-500" />;
      case 'trigger_new_lead':
      case 'trigger_deal_stage':
      case 'trigger_form_submit':
        return <BoltIcon className="h-5 w-5 text-orange-500" />;
      default:
        return <CheckCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStepTitle = (type: string) => {
    // Find the step in our categories
    for (const category of stepCategories) {
      const item = category.items.find(item => item.type === type);
      if (item) return item.title;
    }
    
    // Fallback titles for unknown types
    switch (type) {
      case 'email': return 'Send Email';
      case 'sms': return 'Send SMS';
      case 'delay': return 'Wait';
      case 'condition': return 'If/Else Condition';
      case 'task': return 'Create Task';
      case 'ai_analysis': return 'AI Analysis';
      case 'crm_update': return 'Update CRM';
      case 'trigger_new_lead': return 'New Lead Captured';
      case 'trigger_deal_stage': return 'Deal Stage Changed';
      case 'trigger_form_submit': return 'Form Submission';
      default: return 'Step';
    }
  };

  // Add loading state when fetching workflow data
  useEffect(() => {
    if (workflow?.id) {
      setIsLoading(true);
      // Set form fields from workflow data
      setName(workflow.name || '');
      setDescription(workflow.description || '');
      setStatus(workflow.status || 'draft');
      setSteps(workflow.steps || []);
      setIsLoading(false);
    }
  }, [workflow]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Panel - Step Categories */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Workflow Steps</h3>
            <p className="mt-1 text-sm text-gray-500">Drag and drop to build your workflow</p>
          </div>
          
          <div className="p-4 space-y-6">
            {stepCategories.map((category) => (
              <div key={category.name} className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{category.name}</h4>
                <div className="space-y-2">
                  {category.items.map((item) => (
                    <div
                      key={item.type}
                      className="flex items-center p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => addStep(item.type)}
                    >
                      <div className="flex-shrink-0">
                        {item.icon}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={fetchAIRecommendations}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <LightBulbIcon className="h-5 w-5 mr-2" />
              {showAIRecommendations ? 'Hide AI Recommendations' : 'Show AI Recommendations'}
            </button>
          </div>

          {showAIRecommendations && (
            <div className="p-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">AI Recommendations</h3>
              {isLoadingRecommendations ? (
                <div className="flex justify-center py-4">
                  <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : (
                <div className="space-y-2">
                  {aiRecommendations.map((recommendation, index) => (
                    <div 
                      key={index} 
                      className="p-3 bg-indigo-50 rounded-md cursor-pointer hover:bg-indigo-100"
                      onClick={() => addStep(recommendation.type)}
                    >
                      <div className="font-medium text-indigo-700">{recommendation.title}</div>
                      <div className="text-xs text-indigo-600">{recommendation.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Team Collaboration Panel */}
        <div className="mt-6 bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Team Collaboration</h3>
          </div>
          <div className="p-4">
            <button 
              className="w-full flex items-center justify-center p-2 border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => workflow?.id && router.push(`/workflows/${workflow.id}/collaboration`)}
            >
              <UserIcon className="h-5 w-5 mr-2 text-blue-500" />
              <span>View Team Activity</span>
            </button>
            <button 
              className="w-full mt-2 flex items-center justify-center p-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <ChatBubbleLeftIcon className="h-5 w-5 mr-2 text-green-500" />
              <span>Add Comment</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Middle Panel - Workflow Builder */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Workflow Builder</h3>
            <p className="mt-1 text-sm text-gray-500">Drag and drop to build your workflow</p>
          </div>
          
          <div className="p-4 space-y-6">
            {steps.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-500">No steps added yet. Add your first step below.</p>
              </div>
            ) : (
              <div className="space-y-4 mb-4">
                {steps.map((step, index) => (
                  <WorkflowStepItem 
                    key={step.id} 
                    step={step} 
                    index={index}
                    onRemove={removeStep}
                    moveStep={moveStep}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200">
            {successMessage && (
              <div className="mt-2 p-2 bg-green-100 text-green-800 rounded-md text-sm">
                {successMessage}
              </div>
            )}

            {errors.submit && (
              <div className="mt-2 p-2 bg-red-100 text-red-800 rounded-md text-sm">
                {errors.submit}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              {errors.auth && (
                <div className="mr-4 p-2 bg-red-100 text-red-800 rounded-md text-sm">
                  {errors.auth}
                </div>
              )}
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Workflow'
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={saveWorkflowLocally}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Locally
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
interface WorkflowStepItemProps {
  step: WorkflowStep;
  index: number;
  onRemove: (id: string) => void;
  moveStep: (dragIndex: number, hoverIndex: number) => void;
}

function WorkflowStepItem({ step, index, onRemove, moveStep }: WorkflowStepItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: 'WORKFLOW_STEP',
    item: { id: step.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'WORKFLOW_STEP',
    hover(item: { id: string; index: number }, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      
      if (dragIndex === hoverIndex) return;
      
      moveStep(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  // Add the missing getStepIcon function
  const getStepIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <EnvelopeIcon className="h-5 w-5 text-blue-500" />;
      case 'sms':
        return <PhoneIcon className="h-5 w-5 text-green-500" />;
      case 'delay':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'condition':
        return <ArrowsRightLeftIcon className="h-5 w-5 text-purple-500" />;
      case 'task':
        return <CheckCircleIcon className="h-5 w-5 text-red-500" />;
      case 'ai_analysis':
        return <LightBulbIcon className="h-5 w-5 text-indigo-500" />;
      case 'crm_update':
        return <ArrowPathIcon className="h-5 w-5 text-gray-500" />;
      case 'trigger_new_lead':
      case 'trigger_deal_stage':
      case 'trigger_form_submit':
        return <BoltIcon className="h-5 w-5 text-orange-500" />;
      default:
        return <CheckCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Add the missing getStepTitle function
  const getStepTitle = (type: string) => {
    // Find the step in our categories
    for (const category of stepCategories) {
      const item = category.items.find(item => item.type === type);
      if (item) return item.title;
    }
    
    // Fallback titles for unknown types
    switch (type) {
      case 'email': return 'Send Email';
      case 'sms': return 'Send SMS';
      case 'delay': return 'Wait';
      case 'condition': return 'If/Else Condition';
      case 'task': return 'Create Task';
      case 'ai_analysis': return 'AI Analysis';
      case 'crm_update': return 'Update CRM';
      case 'trigger_new_lead': return 'New Lead Captured';
      case 'trigger_deal_stage': return 'Deal Stage Changed';
      case 'trigger_form_submit': return 'Form Submission';
      default: return 'Step';
    }
  };

  return (
    <div
      ref={ref}
      className={`
        flex items-center justify-between p-4 bg-white border rounded-md shadow-sm
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${isOver ? 'border-blue-500' : ''}
        cursor-move transition-all duration-200 hover:shadow-md
      `}
    >
      <div className="flex items-center">
        {getStepIcon(step.type)}
        <div className="ml-3">
          <span className="font-medium">{getStepTitle(step.type)}</span>
          <p className="text-xs text-gray-500 mt-1">{getStepDescription(step.type)}</p>
        </div>
      </div>
      <div className="flex items-center">
        <span className="text-xs text-gray-500 mr-3">#{index + 1}</span>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(step.id);
          }}
          className="text-gray-400 hover:text-red-500 transition-colors duration-200"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

// Helper function to get step description
function getStepDescription(type: string): string {
  switch (type) {
    case 'email':
      return 'Send an automated email to the prospect';
    case 'sms':
      return 'Send an SMS message to the prospect';
    case 'delay':
      return 'Wait for a specified time period';
    case 'condition':
      return 'Branch workflow based on conditions';
    case 'task':
      return 'Create a task for follow-up';
    case 'ai_analysis':
      return 'Analyze data using AI';
    case 'crm_update':
      return 'Update CRM records';
    default:
      return 'Workflow step';
  }
}

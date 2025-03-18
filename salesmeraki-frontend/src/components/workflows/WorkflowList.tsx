import { Workflow } from '@/types/workflows';
import { useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { TrashIcon, PencilIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface WorkflowListProps {
  workflows: Workflow[];
  isLoading: boolean;
  selectedId?: string;
  onSelect: (workflow: Workflow) => void;
  onRefresh: () => void;
}

export default function WorkflowList({ 
  workflows, 
  isLoading, 
  selectedId, 
  onSelect,
  onRefresh
}: WorkflowListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredWorkflows = workflows.filter(workflow => 
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this workflow?')) {
      try {
        const response = await fetch(`/api/workflows/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Failed to delete workflow');
        
        onRefresh();
      } catch (error) {
        console.error('Error deleting workflow:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Your Workflows</h2>
        <button 
          onClick={onRefresh}
          className="text-gray-500 hover:text-gray-700"
          title="Refresh workflows"
        >
          <ArrowPathIcon className="h-5 w-5" />
        </button>
      </div>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search workflows..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner className="h-5 w-5" />
        </div>
      ) : filteredWorkflows.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? 'No workflows match your search' : 'No workflows found'}
        </div>
      ) : (
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {filteredWorkflows.map((workflow) => (
            <div
              key={workflow.id}
              onClick={() => onSelect(workflow)}
              className={`
                p-3 rounded-md cursor-pointer flex justify-between items-center
                ${selectedId === workflow.id 
                  ? 'bg-primary/10 border border-primary/30' 
                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'}
              `}
            >
              <div>
                <h3 className="font-medium">{workflow.name}</h3>
                <div className="flex items-center mt-1">
                  <span className={`
                    inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                    ${workflow.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : workflow.status === 'draft' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-gray-100 text-gray-800'}
                  `}>
                    {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {workflow.updatedAt ? new Date(workflow.updatedAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
              <div className="flex space-x-1">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(workflow);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button 
                  onClick={(e) => handleDelete(workflow.id, e)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
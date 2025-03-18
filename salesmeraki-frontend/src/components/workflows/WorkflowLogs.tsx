'use client';

import { useState, useEffect } from 'react';
import { useWorkflow } from '@/hooks/useWorkflow';
import { WorkflowExecution } from '@/types/workflows';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';

export default function WorkflowLogs({ workflowId }: { workflowId: string }) {
  const [logs, setLogs] = useState<WorkflowExecution[]>([]);
  const { workflow, loading, error, executeWorkflow } = useWorkflow(workflowId);

  const handleExecute = async () => {
    try {
      const execution = await executeWorkflow({ timestamp: new Date().toISOString() });
      setLogs(prevLogs => [execution, ...prevLogs]);
    } catch (err) {
      console.error('Execution failed:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [workflowId]);

  const fetchLogs = async () => {
    try {
      const response = await fetch(`/api/workflows/${workflowId}/logs`);
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Execution Logs</h2>
        <button
          onClick={handleExecute}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Execute Now
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Execution ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {log.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    log.status === 'completed' ? 'bg-green-100 text-green-800' :
                    log.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {log.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(log.startTime).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.endTime ? 
                    `${Math.round((new Date(log.endTime).getTime() - new Date(log.startTime).getTime()) / 1000)}s` : 
                    'In Progress'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
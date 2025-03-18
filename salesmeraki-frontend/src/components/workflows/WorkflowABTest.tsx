'use client';

import { useState, useEffect } from 'react';
import { WorkflowABTest } from '@/types/workflows';

export default function WorkflowABTesting({ workflowId }: { workflowId: string }) {
  const [tests, setTests] = useState<WorkflowABTest[]>([]);
  const [activeTest, setActiveTest] = useState<WorkflowABTest | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch existing tests
    const fetchTests = async () => {
      try {
        const response = await fetch(`/api/workflows/${workflowId}/tests`);
        if (response.ok) {
          const data = await response.json();
          setTests(data);
        }
      } catch (error) {
        console.error('Failed to fetch tests:', error);
      }
    };
    
    fetchTests();
  }, [workflowId]);

  const createTest = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/workflows/${workflowId}/tests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workflowId }),
      });
      
      if (response.ok) {
        const newTest = await response.json();
        setTests(prev => [...prev, newTest]);
      }
    } catch (error) {
      console.error('Failed to create test:', error);
    } finally {
      setLoading(false);
    }
  };

  const stopTest = async (testId: string) => {
    try {
      const response = await fetch(`/api/workflows/${workflowId}/tests/${testId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'completed' }),
      });
      
      if (response.ok) {
        setTests(prev => 
          prev.map(test => test.id === testId ? { ...test, status: 'completed' } : test)
        );
      }
    } catch (error) {
      console.error('Failed to stop test:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">A/B Testing</h2>
        <button
          onClick={createTest}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create New Test'}
        </button>
      </div>

      <div className="grid gap-4">
        {tests.length === 0 ? (
          <p className="text-gray-500">No tests created yet.</p>
        ) : (
          tests.map(test => (
            <div key={test.id} className="border p-4 rounded-md">
              <div className="flex justify-between">
                <h3>{test.name || `Test ${test.id}`}</h3>
                {test.status !== 'completed' && (
                  <button 
                    onClick={() => stopTest(test.id)}
                    className="text-red-600 text-sm"
                  >
                    Stop Test
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
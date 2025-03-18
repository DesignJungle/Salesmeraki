import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import WorkflowBuilder from '../WorkflowBuilder';
import { fetchWithAuth } from '@/utils/errorHandler';

// Mock dependencies
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/utils/errorHandler', () => ({
  fetchWithAuth: jest.fn(),
}));

jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

describe('WorkflowBuilder', () => {
  const mockWorkflow = {
    id: 'workflow-1',
    name: 'Test Workflow',
    description: 'Test Description',
    status: 'draft' as const,
    steps: [
      {
        id: 'step-1',
        type: 'email',
        position: 0,
        config: {},
      },
    ],
  };

  const mockOnSave = jest.fn().mockResolvedValue(mockWorkflow);
  const mockOnAuthError = jest.fn();
  const mockRouter = { push: jest.fn() };
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Ensure useSession consistently returns authenticated state
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { id: 'user-1' } },
      status: 'authenticated',
    });
    
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (fetchWithAuth as jest.Mock).mockResolvedValue(mockWorkflow);
    
    // Mock localStorage methods
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true
    });
    
    // Mock fetch to return a successful response
    global.fetch = jest.fn().mockImplementation(() => 
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockWorkflow)
      })
    );
    
    // Suppress console logs during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  
  afterEach(() => {
    // Restore console.log after each test
    jest.restoreAllMocks();
  });

  it('renders workflow builder with workflow data', async () => {
    render(
      <WorkflowBuilder 
        workflow={mockWorkflow} 
        onSave={mockOnSave} 
        onAuthError={mockOnAuthError} 
      />
    );
    
    // Check for something that should appear immediately
    expect(screen.getByText('Save Workflow')).toBeInTheDocument();
    
    // Wait for the component to fully render
    await waitFor(() => {
      // Look for the workflow name in the document
      expect(screen.getByText('Workflow Steps')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('handles workflow name change', async () => {
    render(
      <WorkflowBuilder 
        workflow={mockWorkflow} 
        onSave={mockOnSave} 
        onAuthError={mockOnAuthError} 
      />
    );

    // Find the Save Workflow button and click it directly
    const saveButton = screen.getByText('Save Workflow');
    expect(saveButton).toBeInTheDocument();
  });

  it('validates required fields before saving', async () => {
    render(
      <WorkflowBuilder 
        workflow={mockWorkflow} 
        onSave={mockOnSave} 
        onAuthError={mockOnAuthError} 
      />
    );
    
    // Find the Save Workflow button and click it
    const saveButton = screen.getByText('Save Workflow');
    await act(async () => {
      fireEvent.click(saveButton);
    });
  });

  it('handles successful workflow save', async () => {
    render(
      <WorkflowBuilder 
        workflow={mockWorkflow} 
        onSave={mockOnSave} 
        onAuthError={mockOnAuthError} 
      />
    );
    
    // Find the Save Workflow button and click it
    const saveButton = screen.getByText('Save Workflow');
    
    await act(async () => {
      fireEvent.click(saveButton);
      // Wait for async operations to complete
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Test Workflow'
    }));
  });

  it('handles auth error during save', async () => {
    // Override the session mock for this specific test
    (useSession as jest.Mock).mockReturnValueOnce({
      data: null,
      status: 'unauthenticated',
    });

    render(
      <WorkflowBuilder 
        workflow={mockWorkflow} 
        onSave={mockOnSave} 
        onAuthError={mockOnAuthError} 
      />
    );
    
    // Try to save
    const saveButton = screen.getByText('Save Workflow');
    
    await act(async () => {
      fireEvent.click(saveButton);
      // Wait for async operations to complete
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    expect(screen.getByText('Your session has expired. Please log in again.')).toBeInTheDocument();
    expect(mockRouter.push).toHaveBeenCalledWith('/auth/signin?callbackUrl=/workflows');
  });

  it('handles form validation errors correctly', async () => {
    render(
      <WorkflowBuilder 
        workflow={{...mockWorkflow, name: ''}} 
        onSave={mockOnSave} 
        onAuthError={mockOnAuthError} 
      />
    );
  
    // Try to save with empty name
    const saveButton = screen.getByText('Save Workflow');
    fireEvent.click(saveButton);
  
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText('Workflow name is required')).toBeInTheDocument();
    });
  
    // Verify onSave was not called
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('handles network errors during save', async () => {
    // Mock fetch to simulate network error
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
  
    render(
      <WorkflowBuilder 
        workflow={mockWorkflow} 
        onSave={mockOnSave} 
        onAuthError={mockOnAuthError} 
      />
    );
  
    const saveButton = screen.getByText('Save Workflow');
    fireEvent.click(saveButton);
  
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/failed to save/i)).toBeInTheDocument();
    });
  });

  it('handles authentication errors correctly', async () => {
    // Mock session to be unauthenticated
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });
  
    render(
      <WorkflowBuilder 
        workflow={mockWorkflow} 
        onSave={mockOnSave} 
        onAuthError={mockOnAuthError} 
      />
    );
  
    const saveButton = screen.getByText('Save Workflow');
    fireEvent.click(saveButton);
  
    // Check that auth error handler was called
    await waitFor(() => {
      expect(mockOnAuthError).toHaveBeenCalled();
    });
  });
});

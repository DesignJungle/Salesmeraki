import { render, screen, waitFor } from '@testing-library/react';
import WorkflowAnalytics from '../WorkflowAnalytics';
import { fetchWithAuth } from '@/utils/errorHandler';

jest.mock('@/utils/errorHandler', () => ({
  fetchWithAuth: jest.fn(),
}));

describe('WorkflowAnalytics', () => {
  const mockMetrics = {
    completionRate: 75,
    averageDuration: 48,
    conversionRate: 25,
    activeInstances: 10,
    stepPerformance: [
      { stepId: 'step-1', completionRate: 80, averageDuration: 24 },
    ],
    timeSeriesData: [
      { date: '2023-01-01', completions: 5, starts: 10 },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (fetchWithAuth as jest.Mock).mockResolvedValue(mockMetrics);
  });

  it('renders loading state initially', () => {
    render(<WorkflowAnalytics workflowId="workflow-1" />);
    expect(screen.getByText(/loading analytics/i)).toBeInTheDocument();
  });

  it('renders analytics data when loaded', async () => {
    render(<WorkflowAnalytics workflowId="workflow-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Workflow Performance')).toBeInTheDocument();
    });
    
    expect(screen.getByText('75%')).toBeInTheDocument(); // Completion Rate
    expect(screen.getByText('48 hours')).toBeInTheDocument(); // Average Duration
    expect(screen.getByText('25%')).toBeInTheDocument(); // Conversion Rate
    expect(screen.getByText('10')).toBeInTheDocument(); // Active Instances
    expect(screen.getByText('Step: step-1')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    // Temporarily suppress console.error for this test
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    (fetchWithAuth as jest.Mock).mockRejectedValue(new Error('Failed to load analytics data'));
    
    render(<WorkflowAnalytics workflowId="workflow-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load analytics data')).toBeInTheDocument();
    });
    
    // Restore console.error
    console.error = originalConsoleError;
  });

  it('shows message when no workflow is selected', () => {
    render(<WorkflowAnalytics workflowId="" />);
    expect(screen.getByText('No workflow selected')).toBeInTheDocument();
  });
});

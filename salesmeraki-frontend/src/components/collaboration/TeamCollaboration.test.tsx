import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TeamCollaboration } from './TeamCollaboration';

// Mock setTimeout to execute immediately
jest.useFakeTimers();

describe('TeamCollaboration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    render(<TeamCollaboration />);
    
    // Check if loading spinner is displayed
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
  
  it('renders team chat after loading', async () => {
    render(<TeamCollaboration />);
    
    // Fast-forward timers to complete loading
    jest.advanceTimersByTime(1000);
    
    // Check if the component title is displayed
    await waitFor(() => {
      expect(screen.getByText('Team Collaboration')).toBeInTheDocument();
    });
    
    // Check if chat messages are loaded
    expect(screen.getByText(/Hey team, I just finished the client presentation/i)).toBeInTheDocument();
  });
  
  it('allows sending a message', async () => {
    render(<TeamCollaboration />);
    
    // Fast-forward timers to complete loading
    jest.advanceTimersByTime(1000);
    
    // Type a message
    const inputField = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(inputField, { target: { value: 'This is a test message' } });
    
    // Send the message
    const sendButton = screen.getByRole('button', { name: '' }); // The send button has no text, just an icon
    fireEvent.click(sendButton);
    
    // Check if the user message appears
    expect(screen.getByText('This is a test message')).toBeInTheDocument();
    
    // Fast-forward timers to trigger the response
    jest.advanceTimersByTime(2000);
    
    // Check if a response is received
    await waitFor(() => {
      expect(screen.getAllByText(/Alex Johnson/i).length).toBeGreaterThan(1);
    });
  });
  
  it('switches to documents tab when clicked', async () => {
    render(<TeamCollaboration />);
    
    // Fast-forward timers to complete loading
    jest.advanceTimersByTime(1000);
    
    // Initially, the chat tab should be active
    expect(screen.getByText('Chat')).toHaveClass('bg-white');
    
    // Click on the Documents tab
    fireEvent.click(screen.getByText('Documents'));
    
    // Check if the Documents tab is now active
    expect(screen.getByText('Documents')).toHaveClass('bg-white');
    
    // Check if the documents content is displayed
    expect(screen.getByText('Shared Documents')).toBeInTheDocument();
    expect(screen.getByText('TechCorp Proposal')).toBeInTheDocument();
    expect(screen.getByText('GlobalTech Contract')).toBeInTheDocument();
  });
  
  it('switches to tasks tab when clicked', async () => {
    render(<TeamCollaboration />);
    
    // Fast-forward timers to complete loading
    jest.advanceTimersByTime(1000);
    
    // Click on the Tasks tab
    fireEvent.click(screen.getByText('Tasks'));
    
    // Check if the Tasks tab is now active
    expect(screen.getByText('Tasks')).toHaveClass('bg-white');
    
    // Check if the tasks content is displayed
    expect(screen.getByText('Team Tasks')).toBeInTheDocument();
    expect(screen.getByText('Follow up with TechCorp')).toBeInTheDocument();
    expect(screen.getByText('Prepare quarterly review presentation')).toBeInTheDocument();
  });
  
  it('displays team members in the sidebar', async () => {
    render(<TeamCollaboration />);
    
    // Fast-forward timers to complete loading
    jest.advanceTimersByTime(1000);
    
    // Check if team members are displayed
    expect(screen.getByText('Team Members')).toBeInTheDocument();
    expect(screen.getByText('Alex Johnson')).toBeInTheDocument();
    expect(screen.getByText('Maria Smith')).toBeInTheDocument();
    expect(screen.getByText('John Davis')).toBeInTheDocument();
  });
});

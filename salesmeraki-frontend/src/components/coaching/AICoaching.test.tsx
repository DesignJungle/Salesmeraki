import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AICoaching } from './AICoaching';

// Mock setTimeout to execute immediately
jest.useFakeTimers();

describe('AICoaching', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the initial welcome message', () => {
    render(<AICoaching />);
    
    // Check if the welcome message is displayed
    expect(screen.getByText(/Welcome to AI Sales Coach/i)).toBeInTheDocument();
    
    // Check if the input field is present
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
  });
  
  it('allows sending a message and receives a response', async () => {
    render(<AICoaching />);
    
    // Type a message
    const inputField = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(inputField, { target: { value: 'Help me practice a sales pitch' } });
    
    // Send the message
    const sendButton = screen.getByRole('button', { name: '' }); // The send button has no text, just an icon
    fireEvent.click(sendButton);
    
    // Check if the user message appears
    expect(screen.getByText('Help me practice a sales pitch')).toBeInTheDocument();
    
    // Fast-forward timers to trigger the response
    jest.advanceTimersByTime(2000);
    
    // Check if a response is received
    await waitFor(() => {
      expect(screen.getAllByRole('listitem').length).toBeGreaterThan(1);
    });
  });
  
  it('displays scenario buttons', () => {
    render(<AICoaching />);
    
    // Check if scenario buttons are displayed
    expect(screen.getByText('Enterprise SaaS Demo')).toBeInTheDocument();
    expect(screen.getByText('Cold Call to C-Level Executive')).toBeInTheDocument();
    expect(screen.getByText('Product Demo for SMB')).toBeInTheDocument();
    expect(screen.getByText('Handling Price Objections')).toBeInTheDocument();
    expect(screen.getByText('Closing Techniques Practice')).toBeInTheDocument();
  });
  
  it('selects a scenario when clicked', () => {
    render(<AICoaching />);
    
    // Click on a scenario button
    fireEvent.click(screen.getByText('Cold Call to C-Level Executive'));
    
    // Fast-forward timers
    jest.advanceTimersByTime(500);
    
    // Check if the scenario is selected and a system message is displayed
    expect(screen.getByText(/Let's practice the "Cold Call to C-Level Executive" scenario/i)).toBeInTheDocument();
  });
  
  it('switches to analysis tab when clicked', () => {
    render(<AICoaching />);
    
    // Initially, the chat tab should be active
    expect(screen.getByText('Practice')).toHaveClass('bg-white');
    
    // Click on the Analysis tab
    fireEvent.click(screen.getByText('Analysis'));
    
    // Check if the Analysis tab is now active
    expect(screen.getByText('Analysis')).toHaveClass('bg-white');
    
    // Check if the analysis content is displayed
    expect(screen.getByText('No Analysis Available')).toBeInTheDocument();
  });
  
  it('simulates voice recording', () => {
    render(<AICoaching />);
    
    // Click on the microphone button
    const micButton = screen.getByTitle('Start voice input');
    fireEvent.click(micButton);
    
    // Check if recording state is active
    expect(micButton).toHaveClass('bg-red-100');
    
    // Fast-forward timers to complete recording
    jest.advanceTimersByTime(3000);
    
    // Check if input field has the transcribed text
    const inputField = screen.getByPlaceholderText('Type your message...');
    expect(inputField).toHaveValue(expect.stringContaining('I think your product could help us'));
  });
});

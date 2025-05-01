import { render, screen, fireEvent } from '@testing-library/react';
import { WorkflowBuilder } from './WorkflowBuilder';

// Mock react-dnd
jest.mock('react-dnd', () => ({
  useDrag: () => [{ isDragging: false }, jest.fn()],
  useDrop: () => [{ isOver: false }, jest.fn()],
}));

jest.mock('react-dnd-html5-backend', () => ({
  HTML5Backend: jest.fn(),
}));

// Mock DndProvider to render children directly
jest.mock('react-dnd', () => ({
  ...jest.requireActual('react-dnd'),
  DndProvider: ({ children }) => children,
}));

describe('WorkflowBuilder', () => {
  it('renders the workflow builder with initial state', () => {
    render(<WorkflowBuilder />);
    
    // Check if the component renders the main title
    expect(screen.getByText('Workflow Builder')).toBeInTheDocument();
    
    // Check if it has input fields for name and description
    expect(screen.getByPlaceholderText('Enter workflow name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
    
    // Check if it has trigger and action sections
    expect(screen.getByText('Trigger')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    
    // Check if it has the add trigger and add action buttons
    expect(screen.getByText('Add Trigger')).toBeInTheDocument();
    expect(screen.getByText('Add Action')).toBeInTheDocument();
  });
  
  it('shows available triggers when Add Trigger is clicked', () => {
    render(<WorkflowBuilder />);
    
    // Click on Add Trigger button
    fireEvent.click(screen.getByText('Add Trigger'));
    
    // Check if available triggers are displayed
    expect(screen.getByText('Available Triggers')).toBeInTheDocument();
    expect(screen.getByText('New Lead')).toBeInTheDocument();
    expect(screen.getByText('Deal Stage Change')).toBeInTheDocument();
  });
  
  it('shows available actions when Add Action is clicked', () => {
    render(<WorkflowBuilder />);
    
    // Click on Add Action button
    fireEvent.click(screen.getByText('Add Action'));
    
    // Check if available actions are displayed
    expect(screen.getByText('Available Actions')).toBeInTheDocument();
    expect(screen.getByText('Send Email')).toBeInTheDocument();
    expect(screen.getByText('Create Task')).toBeInTheDocument();
  });
  
  it('allows editing workflow name and description', () => {
    render(<WorkflowBuilder />);
    
    // Get input fields
    const nameInput = screen.getByPlaceholderText('Enter workflow name');
    const descriptionInput = screen.getByPlaceholderText('Enter description');
    
    // Change input values
    fireEvent.change(nameInput, { target: { value: 'My Test Workflow' } });
    fireEvent.change(descriptionInput, { target: { value: 'This is a test workflow' } });
    
    // Check if values were updated
    expect(nameInput).toHaveValue('My Test Workflow');
    expect(descriptionInput).toHaveValue('This is a test workflow');
  });
  
  it('has a disabled save button when no trigger or actions are added', () => {
    render(<WorkflowBuilder />);
    
    // Get the save button
    const saveButton = screen.getByText('Save Workflow');
    
    // Check if it's disabled
    expect(saveButton).toBeDisabled();
    expect(saveButton).toHaveClass('bg-gray-400');
  });
});

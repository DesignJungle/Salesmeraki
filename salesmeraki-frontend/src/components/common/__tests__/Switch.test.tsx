import { render, screen, fireEvent } from '@testing-library/react';
import { Switch } from '../Switch';

describe('Switch', () => {
  const mockOnChange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when unchecked', () => {
    render(<Switch checked={false} onCheckedChange={mockOnChange} />);
    
    // Check if the switch is rendered
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeInTheDocument();
    
    // Check aria-checked attribute
    expect(switchElement).toHaveAttribute('aria-checked', 'false');
    
    // Check if the switch has the correct background color class
    expect(switchElement).toHaveClass('bg-gray-200');
    expect(switchElement).not.toHaveClass('bg-blue-600');
    
    // Check if the toggle is in the correct position
    const toggle = switchElement.querySelector('span:not(.sr-only)');
    expect(toggle).toHaveClass('translate-x-0');
    expect(toggle).not.toHaveClass('translate-x-5');
  });

  it('renders correctly when checked', () => {
    render(<Switch checked={true} onCheckedChange={mockOnChange} />);
    
    // Check if the switch is rendered
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeInTheDocument();
    
    // Check aria-checked attribute
    expect(switchElement).toHaveAttribute('aria-checked', 'true');
    
    // Check if the switch has the correct background color class
    expect(switchElement).toHaveClass('bg-blue-600');
    expect(switchElement).not.toHaveClass('bg-gray-200');
    
    // Check if the toggle is in the correct position
    const toggle = switchElement.querySelector('span:not(.sr-only)');
    expect(toggle).toHaveClass('translate-x-5');
    expect(toggle).not.toHaveClass('translate-x-0');
  });

  it('calls onCheckedChange when clicked', () => {
    render(<Switch checked={false} onCheckedChange={mockOnChange} />);
    
    // Find and click the switch
    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);
    
    // Check if onCheckedChange was called with the correct value
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(true);
    
    // Render again with checked=true
    mockOnChange.mockClear();
    render(<Switch checked={true} onCheckedChange={mockOnChange} />);
    
    // Find and click the switch
    const checkedSwitch = screen.getByRole('switch');
    fireEvent.click(checkedSwitch);
    
    // Check if onCheckedChange was called with the correct value
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(false);
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-switch';
    render(<Switch checked={false} onCheckedChange={mockOnChange} className={customClass} />);
    
    // Check if the custom class is applied
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveClass(customClass);
  });

  it('has accessible label', () => {
    render(<Switch checked={false} onCheckedChange={mockOnChange} />);
    
    // Check if there's a screen reader only label
    const srLabel = screen.getByText('Toggle');
    expect(srLabel).toBeInTheDocument();
    expect(srLabel).toHaveClass('sr-only');
  });
});

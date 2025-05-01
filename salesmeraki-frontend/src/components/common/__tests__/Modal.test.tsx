import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../Modal';

// Mock headlessui Dialog component
jest.mock('@headlessui/react', () => ({
  Dialog: ({ children, open, onClose, ...props }) => (
    open ? (
      <div data-testid="dialog" {...props}>
        {typeof children === 'function' ? children({ open, close: onClose }) : children}
      </div>
    ) : null
  ),
  Transition: {
    Child: ({ children }) => children,
    Root: ({ show, children }) => (show ? children : null),
  },
}));

describe('Modal', () => {
  const mockOnClose = jest.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    title: 'Test Modal',
    children: <div>Modal content</div>
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when isOpen is true', () => {
    render(<Modal {...defaultProps} />);
    
    // Check if the modal title is rendered
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    
    // Check if the modal content is rendered
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    
    // Check that the modal is not rendered
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<Modal {...defaultProps} />);
    
    // Find and click the close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('applies different size classes', () => {
    // Test with small size
    const { rerender } = render(<Modal {...defaultProps} size="sm" />);
    expect(screen.getByTestId('dialog')).toHaveClass('max-w-md');
    
    // Test with medium size (default)
    rerender(<Modal {...defaultProps} size="md" />);
    expect(screen.getByTestId('dialog')).toHaveClass('max-w-lg');
    
    // Test with large size
    rerender(<Modal {...defaultProps} size="lg" />);
    expect(screen.getByTestId('dialog')).toHaveClass('max-w-2xl');
    
    // Test with extra large size
    rerender(<Modal {...defaultProps} size="xl" />);
    expect(screen.getByTestId('dialog')).toHaveClass('max-w-4xl');
  });

  it('renders with custom children', () => {
    const customContent = (
      <div>
        <button>Custom Button</button>
        <p>Custom paragraph</p>
      </div>
    );
    
    render(<Modal {...defaultProps} children={customContent} />);
    
    // Check if custom content is rendered
    expect(screen.getByText('Custom paragraph')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Custom Button' })).toBeInTheDocument();
  });
});

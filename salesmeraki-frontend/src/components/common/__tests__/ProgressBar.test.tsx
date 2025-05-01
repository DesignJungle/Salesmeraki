import { render, screen } from '@testing-library/react';
import { ProgressBar } from '../ProgressBar';

describe('ProgressBar', () => {
  it('renders correctly with default props', () => {
    render(<ProgressBar value={50} max={100} />);
    
    // Check if the progress bar is rendered
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    
    // Check aria attributes
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('calculates percentage correctly', () => {
    render(<ProgressBar value={25} max={100} />);
    
    // The inner div should have a width of 25%
    const innerBar = screen.getByRole('progressbar').firstChild;
    expect(innerBar).toHaveStyle('width: 25%');
  });

  it('handles values greater than max', () => {
    render(<ProgressBar value={150} max={100} />);
    
    // The percentage should be capped at 100%
    const innerBar = screen.getByRole('progressbar').firstChild;
    expect(innerBar).toHaveStyle('width: 100%');
  });

  it('handles zero and negative values', () => {
    render(<ProgressBar value={0} max={100} />);
    
    // The inner bar should have 0% width
    const innerBar = screen.getByRole('progressbar').firstChild;
    expect(innerBar).toHaveStyle('width: 0%');
    
    // Rerender with negative value
    const { rerender } = render(<ProgressBar value={-10} max={100} />);
    
    // The percentage should be capped at 0%
    const updatedInnerBar = screen.getByRole('progressbar').firstChild;
    expect(updatedInnerBar).toHaveStyle('width: 0%');
  });

  it('applies different sizes correctly', () => {
    // Test small size
    const { rerender } = render(<ProgressBar value={50} max={100} size="sm" />);
    let progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveClass('h-1.5');
    
    // Test medium size (default)
    rerender(<ProgressBar value={50} max={100} size="md" />);
    progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveClass('h-2');
    
    // Test large size
    rerender(<ProgressBar value={50} max={100} size="lg" />);
    progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveClass('h-3');
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-progress-bar';
    render(<ProgressBar value={50} max={100} className={customClass} />);
    
    // Check if the custom class is applied
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveClass(customClass);
  });

  it('applies custom barClassName to the inner bar', () => {
    const customBarClass = 'custom-inner-bar';
    render(<ProgressBar value={50} max={100} barClassName={customBarClass} />);
    
    // Check if the custom class is applied to the inner bar
    const innerBar = screen.getByRole('progressbar').firstChild;
    expect(innerBar).toHaveClass(customBarClass);
  });

  it('changes color based on percentage', () => {
    // Test different percentage ranges
    const { rerender } = render(<ProgressBar value={10} max={100} />);
    let innerBar = screen.getByRole('progressbar').firstChild;
    expect(innerBar).toHaveClass('bg-red-500');
    
    rerender(<ProgressBar value={30} max={100} />);
    innerBar = screen.getByRole('progressbar').firstChild;
    expect(innerBar).toHaveClass('bg-orange-500');
    
    rerender(<ProgressBar value={50} max={100} />);
    innerBar = screen.getByRole('progressbar').firstChild;
    expect(innerBar).toHaveClass('bg-yellow-500');
    
    rerender(<ProgressBar value={70} max={100} />);
    innerBar = screen.getByRole('progressbar').firstChild;
    expect(innerBar).toHaveClass('bg-blue-500');
    
    rerender(<ProgressBar value={90} max={100} />);
    innerBar = screen.getByRole('progressbar').firstChild;
    expect(innerBar).toHaveClass('bg-green-500');
  });
});

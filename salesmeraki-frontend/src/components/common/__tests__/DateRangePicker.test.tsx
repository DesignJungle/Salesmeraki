import { render, screen, fireEvent } from '@testing-library/react';
import { DateRangePicker } from '../DateRangePicker';
import { format } from 'date-fns';

describe('DateRangePicker', () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    value: {
      from: new Date('2023-01-01'),
      to: new Date('2023-01-31')
    },
    onChange: mockOnChange
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with provided date range', () => {
    render(<DateRangePicker {...defaultProps} />);
    
    // Check if the formatted dates are displayed
    const fromDate = format(defaultProps.value.from, 'MMM d, yyyy');
    const toDate = format(defaultProps.value.to, 'MMM d, yyyy');
    
    expect(screen.getByText(`${fromDate} - ${toDate}`)).toBeInTheDocument();
  });

  it('handles previous month navigation', () => {
    render(<DateRangePicker {...defaultProps} />);
    
    // Find and click the previous month button
    const prevButton = screen.getByText('←');
    fireEvent.click(prevButton);
    
    // Check if onChange was called with the correct dates
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    
    // Get the first argument of the first call
    const newDateRange = mockOnChange.mock.calls[0][0];
    
    // The new from date should be one month before the original
    const expectedFromDate = new Date('2022-12-01');
    const expectedToDate = new Date('2022-12-31');
    
    // Compare month and year (day might vary slightly due to month lengths)
    expect(newDateRange.from.getMonth()).toBe(expectedFromDate.getMonth());
    expect(newDateRange.from.getFullYear()).toBe(expectedFromDate.getFullYear());
    expect(newDateRange.to.getMonth()).toBe(expectedToDate.getMonth());
    expect(newDateRange.to.getFullYear()).toBe(expectedToDate.getFullYear());
  });

  it('handles next month navigation', () => {
    render(<DateRangePicker {...defaultProps} />);
    
    // Find and click the next month button
    const nextButton = screen.getByText('→');
    fireEvent.click(nextButton);
    
    // Check if onChange was called with the correct dates
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    
    // Get the first argument of the first call
    const newDateRange = mockOnChange.mock.calls[0][0];
    
    // The new from date should be one month after the original
    const expectedFromDate = new Date('2023-02-01');
    const expectedToDate = new Date('2023-02-28'); // February has 28 days in 2023
    
    // Compare month and year (day might vary slightly due to month lengths)
    expect(newDateRange.from.getMonth()).toBe(expectedFromDate.getMonth());
    expect(newDateRange.from.getFullYear()).toBe(expectedFromDate.getFullYear());
    expect(newDateRange.to.getMonth()).toBe(expectedToDate.getMonth());
    expect(newDateRange.to.getFullYear()).toBe(expectedToDate.getFullYear());
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-date-picker';
    render(<DateRangePicker {...defaultProps} className={customClass} />);
    
    // Check if the custom class is applied to the root element
    const rootElement = screen.getByText(/Jan 1, 2023 - Jan 31, 2023/).closest('div');
    expect(rootElement).toHaveClass(customClass);
  });
});

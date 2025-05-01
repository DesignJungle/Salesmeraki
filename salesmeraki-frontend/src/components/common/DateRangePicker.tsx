'use client';

import * as React from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { Button } from './Button';

interface DateRangePickerProps {
  value: { from: Date; to: Date };
  onChange: (value: { from: Date; to: Date }) => void;
  className?: string;
}

export function DateRangePicker({
  value,
  onChange,
  className,
}: DateRangePickerProps) {
  // Simple implementation that just shows the current range
  // In a real app, this would open a calendar for date selection
  
  const handlePreviousMonth = () => {
    const from = new Date(value.from);
    const to = new Date(value.to);
    from.setMonth(from.getMonth() - 1);
    to.setMonth(to.getMonth() - 1);
    onChange({ from, to });
  };
  
  const handleNextMonth = () => {
    const from = new Date(value.from);
    const to = new Date(value.to);
    from.setMonth(from.getMonth() + 1);
    to.setMonth(to.getMonth() + 1);
    onChange({ from, to });
  };
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Button 
        variant="outline" 
        size="sm"
        onClick={handlePreviousMonth}
        className="px-2"
      >
        ←
      </Button>
      
      <div className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-1.5">
        <CalendarIcon className="h-4 w-4 text-gray-500 mr-2" />
        <span className="text-sm">
          {format(value.from, 'MMM d, yyyy')} - {format(value.to, 'MMM d, yyyy')}
        </span>
      </div>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleNextMonth}
        className="px-2"
      >
        →
      </Button>
    </div>
  );
}

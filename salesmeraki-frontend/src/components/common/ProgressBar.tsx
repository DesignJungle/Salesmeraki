'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  barClassName?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
  value,
  max,
  className,
  barClassName,
  size = 'md',
}: ProgressBarProps) {
  // Calculate percentage
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  // Determine color based on percentage
  const getColorClass = () => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    if (percentage >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  // Determine height based on size
  const getHeightClass = () => {
    switch (size) {
      case 'sm': return 'h-1.5';
      case 'lg': return 'h-3';
      default: return 'h-2';
    }
  };
  
  return (
    <div 
      className={cn(
        'w-full bg-gray-200 rounded-full overflow-hidden',
        getHeightClass(),
        className
      )}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className={cn(
          'h-full rounded-full transition-all duration-300 ease-in-out',
          getColorClass(),
          barClassName
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

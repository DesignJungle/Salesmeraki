import React from 'react';

interface TabsProps {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function Tabs({ children, value, onValueChange, className = '' }: TabsProps) {
  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            activeValue: value,
            onValueChange,
          });
        }
        return child;
      })}
    </div>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
  activeValue?: string;
  onValueChange?: (value: string) => void;
}

export function TabsList({ children, className = '', activeValue, onValueChange }: TabsListProps) {
  return (
    <div className={`flex space-x-1 rounded-lg bg-gray-100 p-1 ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            activeValue,
            onValueChange,
          });
        }
        return child;
      })}
    </div>
  );
}

interface TabsTriggerProps {
  children: React.ReactNode;
  value: string;
  activeValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function TabsTrigger({ children, value, activeValue, onValueChange, className = '' }: TabsTriggerProps) {
  const handleClick = () => {
    if (onValueChange) {
      onValueChange(value);
    }
  };

  const isActive = activeValue === value;

  return (
    <button
      onClick={handleClick}
      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all
        ${isActive ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}
        ${className}`}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  children: React.ReactNode;
  value: string;
  activeValue?: string;
  className?: string;
}

export function TabsContent({ children, value, activeValue, className = '' }: TabsContentProps) {
  const isActive = activeValue === value;

  if (!isActive) return null;

  return (
    <div className={className}>
      {children}
    </div>
  );
}
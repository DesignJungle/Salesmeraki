// Add missing type declarations
declare module 'openai';

interface MetricPoint {
  date: string;
  value: number;
}

interface DocumentChange {
  id: string;
  changes: Record<string, any>;
  timestamp: number;
}

// Add Jest-DOM extensions
declare namespace jest {
  interface Matchers<R> {
    toBeInTheDocument(): R;
    toHaveStyle(style: Record<string, any>): R;
  }
}

// Add any other missing type declarations here
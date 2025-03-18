import { logger } from './logger';

interface PerformanceMetric {
  component: string;
  action: string;
  duration: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private isEnabled: boolean;
  
  constructor() {
    this.isEnabled = process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true';
  }
  
  startMeasure(component: string, action: string): () => void {
    if (!this.isEnabled) return () => {};
    
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      this.metrics.push({
        component,
        action,
        duration,
        timestamp: Date.now()
      });
      
      // Log if duration exceeds threshold (e.g., 500ms)
      if (duration > 500) {
        logger.warn(`Performance issue: ${component} - ${action} took ${duration.toFixed(2)}ms`);
      }
      
      // Send metrics to analytics if in production
      if (process.env.NODE_ENV === 'production') {
        this.sendMetricsToAnalytics();
      }
    };
  }
  
  private sendMetricsToAnalytics(): void {
    // Implementation would depend on your analytics service
    // This is a placeholder for actual implementation
    if (this.metrics.length > 10) {
      // Send batch of metrics
      fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics: this.metrics })
      }).then(() => {
        this.metrics = [];
      }).catch(err => {
        logger.error('Failed to send performance metrics', err);
      });
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();
export interface AnalyticsData {
  performanceOverTime: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
    }[];
  };
  sessionBreakdown: {
    labels: string[];
    data: number[];
  };
  improvementAreas: {
    area: string;
    score: number;
  }[];
}

export interface SalesMetric {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface SalesForecast {
  period: string;
  predicted: number;
  lowerBound: number;
  upperBound: number;
}

export interface PerformanceInsight {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
}

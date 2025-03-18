interface AnalyticsData {
  salesOverview: {
    totalSales: number;
    averageOrderValue: number;
    conversionRate: number;
  };
  timeSeriesData: {
    labels: string[];
    datasets: any[];
  };
}
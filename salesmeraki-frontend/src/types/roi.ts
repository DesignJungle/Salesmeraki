export interface ROICalculation {
  teamSize: number;
  closeRate: number;
  dealSize: number;
  timeFrame?: number;
}

export interface ROIResult {
  currentRevenue: number;
  projectedRevenue: number;
  increase: number;
  percentageIncrease: number;
  timeToROI: number;
}
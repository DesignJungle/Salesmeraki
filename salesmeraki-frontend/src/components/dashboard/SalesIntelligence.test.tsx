import { render, screen, fireEvent } from '@testing-library/react';
import { SalesIntelligenceDashboard } from './SalesIntelligence';

// Mock the hooks
jest.mock('@/hooks/useSalesMetrics', () => ({
  useSalesMetrics: () => ({
    metrics: {
      salesTrend: {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [
          {
            label: 'Revenue',
            data: [10000, 15000, 12000],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
          },
        ],
      },
      topProducts: [
        { name: 'Product A', revenue: 50000, growth: 12 },
        { name: 'Product B', revenue: 30000, growth: -5 },
      ],
    },
    loading: false,
    error: null,
  }),
}));

jest.mock('@/hooks/useCustomerInsights', () => ({
  useCustomerInsights: () => ({
    insights: {
      customerSegments: {
        labels: ['Segment A', 'Segment B'],
        datasets: [
          {
            data: [60, 40],
            backgroundColor: ['#f00', '#00f'],
          },
        ],
      },
      keyFindings: [
        'Finding 1',
        'Finding 2',
      ],
    },
    loading: false,
    error: null,
  }),
}));

jest.mock('@/hooks/useForecastData', () => ({
  useForecastData: () => ({
    forecast: {
      growthRate: 15,
      revenueProjection: {
        labels: ['Q1', 'Q2'],
        datasets: [
          {
            label: 'Projected Revenue',
            data: [100000, 120000],
            backgroundColor: '#0f0',
          },
        ],
      },
    },
    loading: false,
    error: null,
  }),
}));

// Mock Chart.js components
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="mock-line-chart" />,
  Bar: () => <div data-testid="mock-bar-chart" />,
  Doughnut: () => <div data-testid="mock-doughnut-chart" />,
}));

describe('SalesIntelligenceDashboard', () => {
  it('renders the overview tab by default', () => {
    render(<SalesIntelligenceDashboard />);
    
    // Check if top products section is visible
    expect(screen.getByText('Top Products')).toBeInTheDocument();
    expect(screen.getByText('Product A')).toBeInTheDocument();
    expect(screen.getByText('Product B')).toBeInTheDocument();
    
    // Check if the chart is rendered
    expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();
  });
  
  it('switches to customer insights tab when clicked', () => {
    render(<SalesIntelligenceDashboard />);
    
    // Click on the Customer Insights tab
    fireEvent.click(screen.getByText('Customer Insights'));
    
    // Check if customer segments section is visible
    expect(screen.getByText('Customer Segments')).toBeInTheDocument();
    expect(screen.getByTestId('mock-doughnut-chart')).toBeInTheDocument();
    
    // Check if key findings are displayed
    expect(screen.getByText('Key Findings')).toBeInTheDocument();
    expect(screen.getByText('Finding 1')).toBeInTheDocument();
    expect(screen.getByText('Finding 2')).toBeInTheDocument();
  });
  
  it('switches to forecast tab when clicked', () => {
    render(<SalesIntelligenceDashboard />);
    
    // Click on the Sales Forecast tab
    fireEvent.click(screen.getByText('Sales Forecast'));
    
    // Check if revenue projection section is visible
    expect(screen.getByText('Revenue Projection')).toBeInTheDocument();
    expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
    
    // Check if growth metrics are displayed
    expect(screen.getByText('Growth Metrics')).toBeInTheDocument();
    expect(screen.getByText('15%')).toBeInTheDocument();
    expect(screen.getByText('Projected Annual Growth Rate')).toBeInTheDocument();
  });
});

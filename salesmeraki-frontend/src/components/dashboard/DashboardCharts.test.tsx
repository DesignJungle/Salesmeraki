import { render, screen } from '@testing-library/react';
import { RevenueChart, SalesBarChart } from './DashboardCharts';

// Mock Chart.js
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="mock-line-chart" />,
  Bar: () => <div data-testid="mock-bar-chart" />,
}));

describe('DashboardCharts', () => {
  const mockLineData = {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Revenue',
        data: [1000, 2000, 3000],
        borderColor: '#000',
        backgroundColor: '#fff',
      },
    ],
  };

  const mockBarData = {
    labels: ['Category A', 'Category B', 'Category C'],
    datasets: [
      {
        label: 'Sales',
        data: [5000, 3000, 2000],
        backgroundColor: ['#f00', '#0f0', '#00f'],
      },
    ],
  };

  describe('RevenueChart', () => {
    it('renders the chart component', () => {
      render(<RevenueChart data={mockLineData} />);
      expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();
    });
  });

  describe('SalesBarChart', () => {
    it('renders the chart component', () => {
      render(<SalesBarChart data={mockBarData} />);
      expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
    });
  });
});

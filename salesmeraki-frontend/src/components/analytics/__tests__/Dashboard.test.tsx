import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../Dashboard';

// Mock fetch
global.fetch = jest.fn();

describe('Dashboard', () => {
  const mockAnalyticsData = {
    salesOverview: {
      totalSales: 150000,
      averageOrderValue: 250,
      conversionRate: 3.5
    },
    timeSeriesData: {
      labels: ['Jan', 'Feb', 'Mar'],
      datasets: [{
        label: 'Sales',
        data: [10000, 15000, 20000],
        borderColor: '#3b82f6'
      }]
    }
  };

  beforeEach(() => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockAnalyticsData)
    });
  });

  it('renders loading state initially', () => {
    render(<Dashboard timeRange="30d" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays analytics data after loading', async () => {
    render(<Dashboard timeRange="30d" />);
    
    await waitFor(() => {
      expect(screen.getByText('Sales Performance')).toBeInTheDocument();
      expect(screen.getByText('$150,000')).toBeInTheDocument();
      expect(screen.getByText('$250')).toBeInTheDocument();
      expect(screen.getByText('3.5%')).toBeInTheDocument();
    });
  });
});

import { render, screen, waitFor } from '@/utils/test-utils';
import { SessionProvider } from 'next-auth/react';
import Dashboard from '../Dashboard';
import TopNav from '../layout/TopNav';

// Mock fetch
global.fetch = jest.fn();

describe('Component Integration Tests', () => {
  const mockSession = {
    user: { name: 'Test User', email: 'test@example.com' },
    expires: '2024-01-01'
  };

  beforeEach(() => {
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ 
          salesOverview: {
            totalSales: 150000,
            averageOrderValue: 250,
            conversionRate: 3.5
          }
        }),
      })
    );
  });

  it('should integrate navigation and dashboard', async () => {
    render(
      <SessionProvider session={mockSession}>
        <>
          <TopNav user={mockSession.user} />
          <Dashboard timeRange="30d" />
        </>
      </SessionProvider>
    );

    // Wait for the user initial to be visible in the nav
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    // Wait for the dashboard to load
    await waitFor(() => {
      expect(screen.getByText('Sales Overview')).toBeInTheDocument();
    });
  });
});

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get time range from query parameters
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('timeRange') || '30d';

    // In a real app, you would fetch this data from your backend
    // For now, we'll return mock data based on the time range
    return NextResponse.json({
      salesOverview: {
        totalSales: getRandomValue(100000, 150000, timeRange),
        averageOrderValue: getRandomValue(1000, 1500, timeRange),
        conversionRate: getRandomValue(2.5, 4.5, timeRange),
        totalDeals: getRandomValue(120, 180, timeRange),
        activeDeals: getRandomValue(50, 80, timeRange),
        closedDeals: getRandomValue(60, 100, timeRange)
      },
      performanceMetrics: {
        salesGrowth: getRandomValue(8, 15, timeRange),
        customerRetention: getRandomValue(75, 95, timeRange),
        leadConversion: getRandomValue(18, 30, timeRange),
        avgResponseTime: getRandomValue(2, 5, timeRange)
      },
      revenueData: generateRevenueData(timeRange),
      salesByCategory: generateSalesByCategoryData(),
      upcomingTasks: [
        { id: '1', title: 'Follow up with Enterprise client', dueDate: getFutureDate(7), priority: 'high' },
        { id: '2', title: 'Prepare quarterly review', dueDate: getFutureDate(10), priority: 'medium' },
        { id: '3', title: 'Update sales forecast', dueDate: getFutureDate(12), priority: 'medium' },
        { id: '4', title: 'Client onboarding call', dueDate: getFutureDate(3), priority: 'high' }
      ],
      recentActivities: [
        { id: '1', type: 'deal_closed', description: 'Closed deal with TechCorp for $25,000', timestamp: getRecentDate(0) },
        { id: '2', type: 'new_lead', description: 'New lead from website: InnovateSoft', timestamp: getRecentDate(1) },
        { id: '3', type: 'meeting', description: 'Meeting scheduled with GlobalTech', timestamp: getRecentDate(2) },
        { id: '4', type: 'email', description: 'Sent proposal to NextGen Solutions', timestamp: getRecentDate(3) }
      ]
    });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions for generating mock data
function getRandomValue(min: number, max: number, timeRange: string): number {
  // Adjust values based on time range to simulate different periods
  const multiplier = timeRange === '7d' ? 0.7 :
                    timeRange === '90d' ? 1.2 :
                    timeRange === '1y' ? 1.5 : 1;

  const value = min + Math.random() * (max - min);
  return Math.round(value * multiplier * 100) / 100; // Round to 2 decimal places
}

function generateRevenueData(timeRange: string) {
  let labels: string[] = [];
  let dataPoints: number[] = [];
  let targetPoints: number[] = [];

  // Generate appropriate labels and data points based on time range
  if (timeRange === '7d') {
    // Last 7 days
    labels = Array.from({length: 7}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    });

    dataPoints = Array.from({length: 7}, () => Math.floor(Math.random() * 5000) + 2000);
    targetPoints = Array.from({length: 7}, () => 3500);
  } else if (timeRange === '30d') {
    // Last 30 days (show weeks)
    labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    dataPoints = Array.from({length: 4}, () => Math.floor(Math.random() * 20000) + 10000);
    targetPoints = Array.from({length: 4}, () => 15000);
  } else if (timeRange === '90d') {
    // Last 90 days (show months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();

    labels = Array.from({length: 3}, (_, i) => {
      const monthIndex = (currentMonth - 2 + i) % 12;
      return months[monthIndex < 0 ? monthIndex + 12 : monthIndex];
    });

    dataPoints = Array.from({length: 3}, () => Math.floor(Math.random() * 60000) + 30000);
    targetPoints = Array.from({length: 3}, () => 45000);
  } else {
    // Last year (show months)
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    dataPoints = Array.from({length: 12}, () => Math.floor(Math.random() * 80000) + 40000);
    targetPoints = Array.from({length: 12}, (_, i) => 50000 + (i * 5000));
  }

  return {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: dataPoints,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)'
      },
      {
        label: 'Target',
        data: targetPoints,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)'
      }
    ]
  };
}

function generateSalesByCategoryData() {
  return {
    labels: ['Enterprise', 'Mid-Market', 'SMB', 'Startup'],
    datasets: [
      {
        label: 'Sales by Category',
        data: [
          Math.floor(Math.random() * 20000) + 35000,
          Math.floor(Math.random() * 15000) + 25000,
          Math.floor(Math.random() * 10000) + 20000,
          Math.floor(Math.random() * 8000) + 10000
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(239, 68, 68, 0.7)'
        ]
      }
    ]
  };
}

function getFutureDate(daysAhead: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString();
}

function getRecentDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}
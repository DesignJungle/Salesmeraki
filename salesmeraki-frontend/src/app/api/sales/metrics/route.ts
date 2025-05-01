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

    // Mock data for development
    const mockData = {
      salesTrend: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Revenue',
            data: [12000, 19000, 15000, 22000, 30000, 28000],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
          },
          {
            label: 'Target',
            data: [15000, 15000, 18000, 18000, 21000, 21000],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
          }
        ],
      },
      topProducts: [
        { name: 'Enterprise Solution', revenue: 125000, growth: 12.5 },
        { name: 'CRM Integration', revenue: 85000, growth: 8.3 },
        { name: 'Analytics Platform', revenue: 65000, growth: 15.2 },
        { name: 'Mobile App', revenue: 45000, growth: -2.1 },
        { name: 'Support Package', revenue: 35000, growth: 5.7 }
      ],
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error in sales metrics API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales metrics' },
      { status: 500 }
    );
  }
}
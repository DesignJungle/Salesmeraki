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
    const timeRange = searchParams.get('timeRange') || '6m';

    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    // Mock data for development
    const mockData = {
      growthRate: 18.5,
      revenueProjection: {
        labels: [
          `Q1 ${currentYear}`,
          `Q2 ${currentYear}`,
          `Q3 ${currentYear}`,
          `Q4 ${currentYear}`,
          `Q1 ${nextYear}`,
          `Q2 ${nextYear}`
        ],
        datasets: [
          {
            label: 'Projected Revenue',
            data: [120000, 135000, 150000, 175000, 195000, 220000],
            backgroundColor: 'rgba(16, 185, 129, 0.7)' // Green
          }
        ]
      }
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error in sales forecast API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forecast data' },
      { status: 500 }
    );
  }
}
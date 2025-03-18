import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AnalyticsData } from '@/types/analytics';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('range') || '30d';

    // For development/demo purposes, you can return mock data if the API isn't ready
    // In production, uncomment the fetch code below
    
    // const response = await fetch(
    //   `${process.env.API_BASE_URL}/analytics/dashboard?range=${timeRange}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${session.accessToken}`,
    //     },
    //   }
    // );
    // const data: AnalyticsData = await response.json();
    
    // Mock data for development
    const data: AnalyticsData = {
      performanceOverTime: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Sales',
            data: [12, 19, 15, 22, 30, 28],
          },
          {
            label: 'Conversions',
            data: [5, 8, 7, 10, 15, 13],
          }
        ],
      },
      sessionBreakdown: {
        labels: ['Calls', 'Emails', 'Meetings', 'Demos', 'Follow-ups'],
        data: [30, 25, 15, 10, 20],
      },
      improvementAreas: [
        { area: 'Objection Handling', score: 65 },
        { area: 'Product Knowledge', score: 78 },
        { area: 'Follow-up Timing', score: 45 },
        { area: 'Closing Techniques', score: 60 },
        { area: 'Discovery Questions', score: 72 },
      ],
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
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
      customerSegments: {
        labels: ['Enterprise', 'Mid-Market', 'SMB', 'Startup'],
        datasets: [
          {
            data: [35, 40, 15, 10],
            backgroundColor: [
              'rgba(59, 130, 246, 0.7)',  // Blue
              'rgba(16, 185, 129, 0.7)',  // Green
              'rgba(245, 158, 11, 0.7)',  // Yellow
              'rgba(239, 68, 68, 0.7)'    // Red
            ]
          }
        ]
      },
      keyFindings: [
        'Mid-Market segment shows the highest growth potential with 40% of revenue',
        'Enterprise customers have the highest retention rate at 85%',
        'SMB segment has the shortest sales cycle averaging 15 days',
        'Startup segment shows the highest churn rate at 12%',
        'Cross-selling opportunities identified in 65% of Mid-Market accounts'
      ]
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error in customer insights API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer insights' },
      { status: 500 }
    );
  }
}
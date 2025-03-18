import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock data for development
    const mockData = {
      revenueProjection: {
        labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Projected Revenue',
          data: [32000, 35000, 40000, 38000, 42000, 50000],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }],
      },
      confidenceInterval: {
        upper: [34000, 38000, 43000, 42000, 46000, 55000],
        lower: [30000, 32000, 37000, 34000, 38000, 45000],
      },
      growthRate: 15.8,
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
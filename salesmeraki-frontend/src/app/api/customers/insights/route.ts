import { NextResponse } from 'next/server';
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
      customerSegments: {
        labels: ['Enterprise', 'Mid-Market', 'SMB', 'Startup', 'Individual'],
        datasets: [{
          data: [35, 25, 20, 15, 5],
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
          borderColor: [
            'rgb(54, 162, 235)',
            'rgb(255, 99, 132)',
            'rgb(75, 192, 192)',
            'rgb(255, 206, 86)',
            'rgb(153, 102, 255)',
          ],
          borderWidth: 1,
        }],
      },
      keyFindings: [
        'Enterprise customers have the highest lifetime value, averaging $85,000',
        'Mid-Market segment shows the fastest growth at 28% YoY',
        'Customer retention is highest in the Enterprise segment at 92%',
        'SMB customers respond best to educational content and webinars',
        'Startups have the shortest sales cycle at 15 days average',
      ],
      customerLifetimeValue: 42000,
      churnRate: 5.2,
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
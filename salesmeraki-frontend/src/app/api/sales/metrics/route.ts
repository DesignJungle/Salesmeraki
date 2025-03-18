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
      salesTrend: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Revenue',
            data: [12000, 19000, 15000, 22000, 30000, 28000],
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
          },
          {
            label: 'Transactions',
            data: [120, 190, 150, 220, 300, 280],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
          }
        ],
      },
      conversionRates: [3.2, 3.5, 3.8, 4.1, 4.3, 4.0],
      topProducts: [
        { name: 'Product A', revenue: 45000, growth: 12 },
        { name: 'Product B', revenue: 32000, growth: 8 },
        { name: 'Product C', revenue: 28000, growth: -3 },
        { name: 'Product D', revenue: 21000, growth: 15 },
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
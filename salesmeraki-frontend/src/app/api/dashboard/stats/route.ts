import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In a real app, you would fetch this data from your backend
    // For now, we'll return mock data
    return NextResponse.json({
      stats: {
        totalSales: 12500,
        activeDeals: 24,
        conversionRate: 32,
        averageDealSize: 4200
      },
      recentActivity: [
        { id: 1, type: 'deal_closed', customer: 'Acme Inc.', value: 5000, date: new Date().toISOString() },
        { id: 2, type: 'meeting_scheduled', customer: 'Globex Corp', date: new Date().toISOString() },
        { id: 3, type: 'proposal_sent', customer: 'Initech', date: new Date().toISOString() }
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
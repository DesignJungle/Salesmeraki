import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('timeRange') || '30d';

    try {
      // Add timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(
        `${process.env.API_BASE_URL}/workflows/${params.id}/analytics?timeRange=${timeRange}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
          signal: controller.signal,
        }
      );
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.error(`API route: Backend API error: ${response.status}`, errorText);
        return NextResponse.json(
          { error: `Failed to fetch analytics: ${response.status}` },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (fetchError: any) {
      console.error('API route: Fetch error:', fetchError);
      
      // Check for specific error types
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'API request timed out' },
          { status: 504 }
        );
      }
      
      // Return mock data for development/testing
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({
          totalExecutions: 42,
          successRate: 87,
          avgExecutionTime: 1250,
          timeRange: timeRange,
          note: 'Mock data - API connection failed'
        });
      }
      
      return NextResponse.json(
        { error: `API connection error: ${fetchError.message}` },
        { status: 503 }
      );
    }
  } catch (error: any) {
    console.error('API route: Unexpected error:', error);
    return NextResponse.json(
      { error: `Server error: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}

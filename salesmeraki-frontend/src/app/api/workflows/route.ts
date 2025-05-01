import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      console.error('API route: Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      // Add timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${process.env.API_BASE_URL}/workflows`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`API route: Backend API error: ${response.status}`);
        return NextResponse.json(
          { error: `Failed to fetch workflows: ${response.status}` },
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
      
      // Return a more descriptive error
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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      console.error('API route: Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    try {
      // Add timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${process.env.API_BASE_URL}/workflows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`API route: Backend API error: ${response.status}`, errorData);
        return NextResponse.json(
          { error: errorData.error || `Failed to create workflow: ${response.status}` },
          { status: response.status }
        );
      }

      const data = await response.json();
      console.log('API route: Successfully created workflow');
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
      
      // Fallback: Create a local workflow with a generated ID
      const savedWorkflow = {
        ...body,
        id: `local-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return NextResponse.json(savedWorkflow);
    }
  } catch (error: any) {
    console.error('API route: Unexpected error:', error);
    return NextResponse.json(
      { error: `Server error: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}

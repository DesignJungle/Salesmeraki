import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  console.log("API: Workflow POST request received");
  
  try {
    const body = await request.json();
    console.log("API: Workflow data received:", body);
    
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      console.log('API route: No valid session found for POST workflow');
      return NextResponse.json({ error: 'Unauthorized - Please log in again' }, { status: 401 });
    }

    console.log('API route: Creating new workflow', { workflowName: body.name });

    try {
      // Make the actual API call to your backend
      const response = await fetch(
        `${process.env.API_BASE_URL}/workflows`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API route: Backend error response:', errorText);
        return NextResponse.json(
          { error: `Backend API error: ${response.status}` },
          { status: response.status }
        );
      }

      const data = await response.json();
      console.log('API route: Successfully created workflow');
      return NextResponse.json(data);
    } catch (fetchError: any) {
      console.error('API route: Fetch error:', fetchError);
      
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

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = await fetch(
      `${process.env.API_BASE_URL}/workflows`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch workflows: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch workflows' },
      { status: 500 }
    );
  }
}

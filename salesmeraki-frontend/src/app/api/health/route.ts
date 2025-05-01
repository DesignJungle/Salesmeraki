import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if we can connect to the backend API
    const apiUrl = process.env.API_BASE_URL;
    const services = {
      main: { status: 'unknown' },
      workflows: { status: 'unknown' }
    };

    if (!apiUrl) {
      return NextResponse.json(
        {
          status: 'warning',
          message: 'API_BASE_URL not configured',
          services,
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV,
          version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
        },
        { status: 200 }
      );
    }

    try {
      // Add timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${apiUrl}/health`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        services.main.status = 'healthy';

        // Check workflows API specifically
        try {
          const workflowsController = new AbortController();
          const workflowsTimeoutId = setTimeout(() => workflowsController.abort(), 5000);

          const workflowsResponse = await fetch(`${apiUrl}/workflows/health`, {
            signal: workflowsController.signal,
          });

          clearTimeout(workflowsTimeoutId);
          services.workflows.status = workflowsResponse.ok ? 'healthy' : 'error';
        } catch (workflowsError) {
          services.workflows.status = 'unreachable';
          services.workflows.error = workflowsError instanceof Error ? workflowsError.message : 'Unknown error';
        }

        return NextResponse.json(
          {
            status: services.workflows.status === 'healthy' ? 'healthy' : 'partial',
            api: 'connected',
            services,
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          {
            status: 'warning',
            api: 'error',
            apiStatus: response.status,
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
          },
          { status: 200 }
        );
      }
    } catch (error) {
      // API is unreachable, but our server is running
      return NextResponse.json(
        {
          status: 'warning',
          api: 'unreachable',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV,
          version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
        },
        { status: 200 }
      );
    }
  } catch (error) {
    // Something went wrong with our health check itself
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: 'Unauthorized - Please log in again' }, { status: 401 });
    }

    // Mock data for team members
    // In a real app, you would fetch this from your database
    const teamMembers = [
      { id: '1', name: 'John Doe', role: 'Sales Manager' },
      { id: '2', name: 'Jane Smith', role: 'Sales Rep' },
      { id: '3', name: 'Alex Johnson', role: 'Marketing Specialist' }
    ];

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}
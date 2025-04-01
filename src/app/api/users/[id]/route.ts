import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

interface RequestContext {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  context: RequestContext
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: context.params.id,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: RequestContext
) {
  try {
    const session = await getServerSession(authOptions);
    const data = await request.json();

    if (!session || session.user.id !== context.params.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: context.params.id,
      },
      data,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export interface UserPermissions {
  canManageUsers: boolean;
  canManageWorkflows: boolean;
  canViewAnalytics: boolean;
  canManageIntegrations: boolean;
}

export async function rbacMiddleware(request: NextRequest) {
  const token = await getToken({ req: request });
  
  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  const path = request.nextUrl.pathname;
  const permissions = token.permissions as UserPermissions;

  // Admin routes protection
  if (path.startsWith('/admin') && !permissions.canManageUsers) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Analytics routes protection
  if (path.startsWith('/analytics') && !permissions.canViewAnalytics) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}
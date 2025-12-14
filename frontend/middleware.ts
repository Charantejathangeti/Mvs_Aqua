import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_TOKEN_COOKIE_NAME, USER_ROLE_COOKIE_NAME, API_BASE_URL } from './constants';
import { Role } from './types';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(AUTH_TOKEN_COOKIE_NAME)?.value;
  const userRole = req.cookies.get(USER_ROLE_COOKIE_NAME)?.value as Role | undefined;
  const currentPath = req.nextUrl.pathname;

  // Protect /admin routes
  if (currentPath.startsWith('/admin')) {
    if (!token) {
      // If no token, redirect to login page
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', currentPath); // Optional: redirect back after login
      return NextResponse.redirect(loginUrl);
    }

    // If token exists, verify it with the backend
    try {
      const backendVerifyUrl = `${API_BASE_URL}/auth/verify-role`;
      const response = await fetch(backendVerifyUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Token invalid or expired, redirect to login
        req.cookies.delete(AUTH_TOKEN_COOKIE_NAME);
        req.cookies.delete(USER_ROLE_COOKIE_NAME);
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('error', 'session_expired');
        return NextResponse.redirect(loginUrl);
      }

      const data: { isAuthenticated: boolean; role: Role } = await response.json();

      if (!data.isAuthenticated || !(data.role === 'ADMIN' || data.role === 'OWNER')) {
        // User is authenticated but not an ADMIN/OWNER
        const unauthorizedUrl = new URL('/unauthorized', req.url);
        return NextResponse.redirect(unauthorizedUrl);
      }
      
      // Update cookie with latest role from backend if it differs
      if (userRole !== data.role) {
        const res = NextResponse.next();
        res.cookies.set(USER_ROLE_COOKIE_NAME, data.role);
        return res;
      }

    } catch (error) {
      console.error('Backend verification failed:', error);
      req.cookies.delete(AUTH_TOKEN_COOKIE_NAME);
      req.cookies.delete(USER_ROLE_COOKIE_NAME);
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('error', 'verification_failed');
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/auth/verify-role'], // Apply middleware to /admin paths and optionally to the /api/auth/verify-role route itself if needed for internal checks
};

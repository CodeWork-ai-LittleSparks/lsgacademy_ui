import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies or headers
  const token = request.cookies.get('lsg_access_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/forgot-password', '/reset-password'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Auth routes (should redirect if already authenticated)
  const authRoutes = ['/login', '/forgot-password'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Protected route groups
  const superAdminRoutes = ['/dashboard', '/schools', '/programs', '/curriculum', '/reports', '/settings'];
  const schoolAdminRoutes = ['/school-dashboard', '/teachers', '/students', '/evaluations', '/Programs', '/school-reports', '/school-settings'];
  
  const isSuperAdminRoute = superAdminRoutes.some(route => pathname.startsWith(route));
  const isSchoolAdminRoute = schoolAdminRoutes.some(route => pathname.startsWith(route));

  // If no token and trying to access protected route, redirect to login
  if (!token && !isPublicRoute && pathname !== '/') {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If has token and trying to access auth routes, redirect to appropriate dashboard
  if (token && isAuthRoute) {
    // Since we can't decode JWT in middleware easily, redirect to a default dashboard
    // The auth context will handle the proper role-based redirect
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Handle root path redirect
  if (pathname === '/') {
    if (token) {
      // Redirect to dashboard, let auth context handle role-based routing
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // For protected routes, let the auth context handle role-based access control
  // The middleware just ensures authentication, not authorization
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
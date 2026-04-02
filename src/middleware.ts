import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Rewrite for SEO: /jastip-[brand] -> /brand/[brand]
  if (pathname.startsWith('/jastip-')) {
    const brand = pathname.slice(8);
    const newUrl = new URL(`/brand/${brand}`, request.url);
    return NextResponse.rewrite(newUrl);
  }

  // 2. Admin Authentication
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin';
  const isAdminApiLogin = pathname === '/api/admin/login';
  
  if (isAdminApiLogin) {
    return NextResponse.next();
  }

  if (isAdminRoute) {
    const session = request.cookies.get('admin_session');
    const isAuthenticated = session?.value === 'authenticated';

    if (isLoginPage) {
      if (isAuthenticated) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.next();
    }

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/admin', '/jastip-:path*'],
};

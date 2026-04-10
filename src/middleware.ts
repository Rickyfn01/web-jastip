import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_SECRET = process.env.CUSTOMER_SESSION_SECRET || 'customer-session-secret';

async function verifyCustomerSessionToken(token: string): Promise<string | null> {
  const [customerId, signature] = token.split('.');

  if (!customerId || !signature) {
    return null;
  }

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(SESSION_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signed = await crypto.subtle.sign('HMAC', key, encoder.encode(customerId));
  const expectedSignature = Array.from(new Uint8Array(signed))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  return signature === expectedSignature ? customerId : null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Rewrite for SEO: /jastip-[brand] -> /brand/[brand]
  if (pathname.startsWith('/jastip-')) {
    const brand = pathname.slice(8);
    const newUrl = new URL(`/brand/${brand}`, request.url);
    return NextResponse.rewrite(newUrl);
  }

  // 2. Member Authentication
  const isMemberRoute = pathname.startsWith('/member');
  if (isMemberRoute) {
    const customerSession = request.cookies.get('customer_session');
    const customerId = customerSession?.value
      ? await verifyCustomerSessionToken(customerSession.value)
      : null;
    const isAuthenticated = Boolean(customerId);

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/register?next=' + encodeURIComponent(pathname), request.url));
    }

    // Sliding session: perpanjang cookie 10 menit setiap ada aktivitas
    const response = NextResponse.next();
    response.cookies.set('customer_session', customerSession!.value, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 10, // Reset 10 menit
    });
    return response;
  }

  // 3. Admin Authentication
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
  matcher: ['/admin/:path*', '/admin', '/jastip-:path*', '/member/:path*'],
};

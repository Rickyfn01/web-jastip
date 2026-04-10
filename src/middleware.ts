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
  const hostname = request.headers.get('host');

  // 0. Redirect old Vercel URL to new custom domain
  if (hostname === 'web-jastip-ricky.vercel.app') {
    return NextResponse.redirect(`https://jastipvip.vercel.app${pathname}`, 301);
  }

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

  // Proteksi semua API admin (selain login)
  const isAdminApi = pathname.startsWith('/api/orders/') && request.method === 'PATCH';
  if (isAdminApi) {
    const session = request.cookies.get('admin_session');
    if (session?.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
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

  // Security headers untuk semua response
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images/ (static files)
     */
    '/((?!_next/static|_next/image|images/|favicon.ico).*)',
  ],
};

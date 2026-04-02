import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Check against env or fallback
    const validPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (password === validPassword) {
      // Set secure HTTP-only cookie
      cookies().set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });
      
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Password salah' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 });
  }
}

export async function DELETE() {
  cookies().delete('admin_session');
  return NextResponse.json({ success: true });
}

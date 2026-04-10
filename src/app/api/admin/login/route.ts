import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    const validPassword = process.env.ADMIN_PASSWORD;

    // Jika ADMIN_PASSWORD belum di-set di environment, tolak semua login
    if (!validPassword) {
      console.error('ADMIN_PASSWORD belum dikonfigurasi di environment variables!');
      return NextResponse.json({ error: 'Konfigurasi server belum lengkap.' }, { status: 500 });
    }

    // Anti brute-force: tambahkan delay 1 detik
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (typeof password === 'string' && password.length > 0 && password === validPassword) {
      // Set secure HTTP-only cookie
      cookies().set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 4, // 4 jam (bukan 7 hari)
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

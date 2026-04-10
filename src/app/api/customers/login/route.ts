import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  createCustomerSessionToken,
  normalizeWhatsAppNumber,
  verifyCustomerPassword,
} from '@/lib/customer-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const whatsappNumber =
      typeof body.whatsappNumber === 'string'
        ? normalizeWhatsAppNumber(body.whatsappNumber)
        : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!whatsappNumber || !password) {
      return NextResponse.json(
        { error: 'Nomor WhatsApp dan password wajib diisi.' },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.findUnique({
      where: { whatsappNumber },
    });

    if (!customer || !verifyCustomerPassword(password, customer.passwordHash)) {
      return NextResponse.json(
        { error: 'Nomor WhatsApp atau password salah.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        fullName: customer.fullName,
        whatsappNumber: customer.whatsappNumber,
        email: customer.email,
      },
    });

    response.cookies.set('customer_session', createCustomerSessionToken(customer.id), {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 10, // 10 menit - auto expire jika tidak ada aktivitas
    });

    return response;
  } catch (error) {
    console.error('Error logging in customer:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat login pelanggan.' },
      { status: 500 }
    );
  }
}

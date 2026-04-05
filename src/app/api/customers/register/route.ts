import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createCustomerSessionToken, hashCustomerPassword, normalizeWhatsAppNumber } from '@/lib/customer-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
    const whatsappNumber = typeof body.whatsappNumber === 'string' ? normalizeWhatsAppNumber(body.whatsappNumber) : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!fullName || !whatsappNumber || !password) {
      return NextResponse.json(
        { error: 'Nama lengkap, nomor WhatsApp, dan password wajib diisi.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password minimal 8 karakter.' },
        { status: 400 }
      );
    }

    const existingCustomer = await prisma.customer.findFirst({
      where: {
        OR: [
          { whatsappNumber },
          ...(email ? [{ email }] : []),
        ],
      },
    });

    if (existingCustomer) {
      return NextResponse.json(
        { error: 'Nomor WhatsApp atau email sudah terdaftar.' },
        { status: 409 }
      );
    }

    const customer = await prisma.customer.create({
      data: {
        fullName,
        whatsappNumber,
        email: email || null,
        passwordHash: hashCustomerPassword(password),
      },
    });

    const response = NextResponse.json(
      {
        success: true,
        customer: {
          id: customer.id,
          fullName: customer.fullName,
          whatsappNumber: customer.whatsappNumber,
          email: customer.email,
        },
      },
      { status: 201 }
    );

    response.cookies.set('customer_session', createCustomerSessionToken(customer.id), {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    console.error('Error registering customer:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat akun pelanggan.' },
      { status: 500 }
    );
  }
}
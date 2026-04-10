import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = params.id;

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID diperlukan' },
        { status: 400 }
      );
    }

    // Validasi: pastikan ada session cookie (mencegah akses data tanpa login)
    const customerSession = cookies().get('customer_session');
    if (!customerSession?.value) {
      return NextResponse.json(
        { error: 'Akses tidak diizinkan. Silakan login.' },
        { status: 401 }
      );
    }

    // Fetch customer
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Data customer tidak ditemukan' },
        { status: 404 }
      );
    }

    // Fetch orders using raw SQL
    const orders = await prisma.$queryRaw`
      SELECT * FROM "Order" 
      WHERE "customerId" = ${customerId}
      ORDER BY "createdAt" DESC
    `;

    // Don't return password hash
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...customerWithoutPassword } = customer;

    return NextResponse.json({
      customer: customerWithoutPassword,
      orders: orders,
    });
  } catch (error: unknown) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data customer' },
      { status: 500 }
    );
  }
}

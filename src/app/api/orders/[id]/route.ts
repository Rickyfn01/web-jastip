import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    // Verifikasi middleware sudah dilakukan, tapi double check sesi untuk API route
    const session = cookies().get('admin_session');
    if (session?.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;
    const body = await request.json();

    const { status, storePrice, finalPrice, dpAmount, receiptImage } = body;

    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan.' }, { status: 404 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: status !== undefined ? status : undefined,
        storePrice: storePrice !== undefined ? storePrice : undefined,
        finalPrice: finalPrice !== undefined ? finalPrice : undefined,
        dpAmount: dpAmount !== undefined ? dpAmount : undefined,
        receiptImage: receiptImage !== undefined ? receiptImage : undefined,
        // Jika admin menandai PAID_DP, catat waktu pembayaran
        ...(status === 'PAID_DP' && !existingOrder.dpPaidAt ? { dpPaidAt: new Date() } : {}),
      },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: unknown) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memperbarui pesanan.' },
      { status: 500 }
    );
  }
}


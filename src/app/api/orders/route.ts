import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadImage } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const customerName = formData.get('customerName') as string;
    const whatsappNumber = formData.get('whatsappNumber') as string;
    const brand = formData.get('brand') as string;
    const size = formData.get('size') as string | null;
    const dpPercentageStr = formData.get('dpPercentage') as string;
    const file = formData.get('file') as File | null;

    if (!customerName || !whatsappNumber || !brand || !dpPercentageStr) {
      return NextResponse.json(
        { error: 'Field nama, nomor WhatsApp, brand, dan persentase DP wajib diisi.' },
        { status: 400 }
      );
    }

    const dpPercentage = parseInt(dpPercentageStr, 10);
    if (isNaN(dpPercentage)) {
      return NextResponse.json(
        { error: 'Persentase DP tidak valid.' },
        { status: 400 }
      );
    }

    let productImageUrl = '';
    
    if (file && file.size > 0) {
      const url = await uploadImage(file, 'product-images');
      if (url) {
        productImageUrl = url;
      } else {
        return NextResponse.json(
          { error: 'Gagal mengupload gambar produk. Pastikan konfigurasi Supabase benar.' },
          { status: 500 }
        );
      }
    }

    const order = await prisma.order.create({
      data: {
        customerName,
        whatsappNumber,
        brand,
        size,
        dpPercentage,
        productImage: productImageUrl,
        status: 'PENDING',
      },
    });

    // Simulasi notifikasi WA
    console.log(`[WHATSAPP WEBHOOK DUMMY] Pesanan baru dari ${customerName} (${whatsappNumber}) untuk brand ${brand}. ID: ${order.id}`);

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat pesanan.' },
      { status: 500 }
    );
  }
}

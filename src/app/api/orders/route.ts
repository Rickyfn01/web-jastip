import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadImage } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const customerId = formData.get('customerId') as string;
    const customerName = formData.get('customerName') as string;
    const whatsappNumber = formData.get('whatsappNumber') as string;
    const brand = formData.get('brand') as string;
    const size = formData.get('size') as string | null;
    const dpPercentageStr = formData.get('dpPercentage') as string;
    const file = formData.get('file') as File | null;

    // Require customer to be registered
    if (!customerId) {
      return NextResponse.json(
        { error: 'Anda harus terdaftar sebagai calon pembeli untuk titip barang. Silakan daftar terlebih dahulu.' },
        { status: 401 }
      );
    }

    // Verify customer exists in database
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Data pembeli tidak valid. Silakan daftar ulang.' },
        { status: 401 }
      );
    }

    if (!customerName || !whatsappNumber || !brand || !dpPercentageStr) {
      return NextResponse.json(
        { error: 'Field nama, nomor WhatsApp, brand, dan persentase DP wajib diisi.' },
        { status: 400 }
      );
    }

    const dpPercentage = parseInt(dpPercentageStr, 10);
    if (isNaN(dpPercentage) || ![50, 75, 100].includes(dpPercentage)) {
      return NextResponse.json(
        { error: 'Persentase DP hanya boleh 50%, 75%, atau 100%.' },
        { status: 400 }
      );
    }

    let productImageUrl = '';
    let uploadWarning: string | null = null;
    
    if (file && file.size > 0) {
      // Validasi ukuran file: max 5MB
      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'Ukuran gambar maksimal 5MB.' },
          { status: 400 }
        );
      }

      // Validasi tipe file: hanya gambar
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Hanya file gambar yang diizinkan (JPG, PNG, WebP, GIF).' },
          { status: 400 }
        );
      }

      const url = await uploadImage(file, 'product-images');
      if (url) {
        productImageUrl = url;
      } else {
        uploadWarning = 'Gambar produk tidak berhasil diunggah, tetapi pesanan tetap kami terima.';
      }
    }

    const order = await prisma.order.create({
      data: {
        customerId,
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

    return NextResponse.json({ success: true, order, warning: uploadWarning }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat pesanan.' },
      { status: 500 }
    );
  }
}

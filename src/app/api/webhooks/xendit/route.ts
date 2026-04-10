import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface XenditInvoiceWebhookPayload {
  external_id?: string;
  status?: string;
  paid_amount?: number;
  paid_at?: string;
}

function resolveOrderIdFromExternalId(externalId?: string) {
  if (!externalId) {
    return null;
  }

  const prefix = 'order-dp-';
  if (!externalId.startsWith(prefix)) {
    return null;
  }

  return externalId.slice(prefix.length) || null;
}

export async function POST(request: Request) {
  try {
    const callbackToken = process.env.XENDIT_CALLBACK_TOKEN;
    const incomingToken = request.headers.get('x-callback-token');

    if (callbackToken && incomingToken !== callbackToken) {
      return NextResponse.json({ error: 'Unauthorized callback token.' }, { status: 401 });
    }

    const payload = (await request.json()) as XenditInvoiceWebhookPayload;

    if (!payload.external_id) {
      return NextResponse.json({ error: 'Payload callback tidak valid.' }, { status: 400 });
    }

    const orderId = resolveOrderIdFromExternalId(payload.external_id);
    if (!orderId) {
      return NextResponse.json({ success: true, ignored: true });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      return NextResponse.json({ success: true, ignored: true });
    }

    const xenditInvoiceStatus = payload.status || 'UNKNOWN';

    if (xenditInvoiceStatus === 'PAID') {
      const paidAt = payload.paid_at ? new Date(payload.paid_at) : new Date();

      await prisma.$executeRaw`
        UPDATE "Order"
        SET "xenditInvoiceStatus" = ${xenditInvoiceStatus}
        WHERE "id" = ${order.id}
      `;

      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'PAID_DP',
          dpPaidAt: paidAt,
          dpAmount: payload.paid_amount ?? order.dpAmount,
        },
      });

      return NextResponse.json({ success: true, orderId: order.id, status: 'PAID_DP' });
    }

    await prisma.$executeRaw`
      UPDATE "Order"
      SET "xenditInvoiceStatus" = ${xenditInvoiceStatus}
      WHERE "id" = ${order.id}
    `;

    return NextResponse.json({ success: true, orderId: order.id, status: xenditInvoiceStatus });
  } catch (error) {
    console.error('Xendit webhook processing error:', error);
    return NextResponse.json({ error: 'Gagal memproses webhook Xendit.' }, { status: 500 });
  }
}

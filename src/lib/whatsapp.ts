/**
 * WhatsApp Notification Helper
 * 
 * Menggunakan Fonnte API (https://fonnte.com) untuk mengirim notifikasi WA otomatis.
 * Set environment variables:
 *   FONNTE_API_TOKEN  — API token dari dashboard Fonnte
 * 
 * Jika FONNTE_API_TOKEN tidak diset, notifikasi akan di-log ke console saja (mode dev).
 */

const FONNTE_API_URL = 'https://api.fonnte.com/send';

interface WaSendResult {
  success: boolean;
  detail: string;
}

/**
 * Kirim pesan WhatsApp via Fonnte API
 */
export async function sendWhatsApp(
  to: string,
  message: string
): Promise<WaSendResult> {
  const token = process.env.FONNTE_API_TOKEN;

  // Normalise phone — strip leading 0, prefix 62
  const normalised = to.replace(/^0/, '62').replace(/[^0-9]/g, '');

  if (!token) {
    // Dev/fallback: log to console instead of sending
    console.log(`[WA DEV] Ke: ${normalised}\n${message}`);
    return { success: true, detail: 'Logged to console (no FONNTE_API_TOKEN set)' };
  }

  try {
    const res = await fetch(FONNTE_API_URL, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: new URLSearchParams({
        target: normalised,
        message,
      }),
    });

    const data = await res.json();

    if (data.status) {
      return { success: true, detail: `Fonnte: ${JSON.stringify(data)}` };
    }

    console.error('[WA ERROR] Fonnte response:', data);
    return { success: false, detail: `Fonnte error: ${JSON.stringify(data)}` };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[WA ERROR]', msg);
    return { success: false, detail: msg };
  }
}

/**
 * Kirim notifikasi pesanan baru ke admin
 */
export async function notifyAdminNewOrder(order: {
  id: string;
  customerName: string;
  whatsappNumber: string;
  brand: string;
  dpPercentage: number;
  productNote?: string | null;
}) {
  const adminNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890';
  const siteUrl = process.env.SITE_URL || 'http://localhost:3000';

  const message = [
    `🛍️ *PESANAN BARU MASUK!*`,
    ``,
    `👤 ${order.customerName}`,
    `📱 ${order.whatsappNumber}`,
    `🏷️ ${order.brand}`,
    order.productNote ? `📝 ${order.productNote}` : null,
    `💰 Pilihan DP: ${order.dpPercentage}%`,
    ``,
    `🔗 Kelola: ${siteUrl}/admin/orders/${order.id}`,
  ]
    .filter(Boolean)
    .join('\n');

  return sendWhatsApp(adminNumber, message);
}

/**
 * Kirim notifikasi update status ke customer
 */
export async function notifyCustomerStatusUpdate(order: {
  id: string;
  customerName: string;
  whatsappNumber: string;
  brand: string;
  status: string;
  finalPrice?: number | null;
  dpAmount?: number | null;
}) {
  const siteUrl = process.env.SITE_URL || 'http://localhost:3000';

  const statusLabels: Record<string, string> = {
    PENDING: 'Menunggu Konfirmasi',
    CHECKING: 'Sedang Dicek di Store',
    READY_TO_PAY: 'Barang Tersedia — Siap Dibayar',
    PAID_DP: 'Pembayaran Diterima',
    PURCHASED: 'Barang Sudah Dibelikan',
    SHIPPED: 'Dalam Pengiriman',
    COMPLETED: 'Selesai',
  };

  const formatIDR = (v: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

  const lines = [
    `📦 *UPDATE PESANAN*`,
    ``,
    `Halo ${order.customerName},`,
    `Status pesanan *${order.brand}* kamu telah diperbarui:`,
    ``,
    `📌 *${statusLabels[order.status] || order.status}*`,
  ];

  if (order.finalPrice) {
    lines.push(`💰 Total: ${formatIDR(order.finalPrice)}`);
  }
  if (order.dpAmount) {
    lines.push(`💳 DP: ${formatIDR(order.dpAmount)}`);
  }

  lines.push(``, `🔗 Lacak: ${siteUrl}/track/${order.id}`);
  lines.push(``, `Terima kasih sudah mempercayai JastipVIP! 🙏`);

  return sendWhatsApp(order.whatsappNumber, lines.join('\n'));
}

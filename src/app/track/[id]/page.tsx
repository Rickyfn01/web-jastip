/* eslint-disable @next/next/no-img-element */
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle2, Copy, MessageCircle, Banknote } from 'lucide-react';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

const STATUS_STEPS = [
  { id: 'PENDING', label: 'Menunggu Konfirmasi', description: 'Pesanan telah diterima admin.' },
  { id: 'CHECKING', label: 'Pengecekan Stok', description: 'Admin sedang mengecek ketersediaan di store.' },
  { id: 'READY_TO_PAY', label: 'Siap Dibayar', description: 'Barang tersedia! Silakan selesaikan pembayaran.' },
  { id: 'PAID_DP', label: 'Pembayaran Diterima', description: 'DP atau Lunas telah dikonfirmasi.' },
  { id: 'PURCHASED', label: 'Barang Dibelikan', description: 'Barang pesananmu telah diamankan.' },
  { id: 'SHIPPED', label: 'Dalam Pengiriman', description: 'Barang sedang meluncur ke alamatmu.' },
  { id: 'COMPLETED', label: 'Selesai', description: 'Pesanan telah diterima oleh pelanggan.' },
];

export default async function TrackOrderPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
  });

  if (!order) {
    notFound();
  }

  // Bank transfer info from environment
  const bankName = process.env.BANK_NAME || 'BCA';
  const bankAccountNumber = process.env.BANK_ACCOUNT_NUMBER || '1234567890';
  const bankAccountHolder = process.env.BANK_ACCOUNT_HOLDER || 'Nama Pemilik';
  const adminWhatsapp = process.env.ADMIN_WHATSAPP || '6281234567890';

  // Find the index of the current status
  const currentStatusIndex = Math.max(STATUS_STEPS.findIndex((s) => s.id === order.status), 0);

  // Format currency
  const formatIDR = (value: number | null) => {
    if (!value) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  const progressPercent = Math.round(((currentStatusIndex + 1) / STATUS_STEPS.length) * 100);

  // WhatsApp confirmation message
  const waConfirmMessage = encodeURIComponent(
    `Halo Admin JastipVIP, saya sudah transfer DP untuk pesanan:\n\n` +
    `📋 Order ID: ${order.id}\n` +
    `👤 Nama: ${order.customerName}\n` +
    `🏷️ Brand: ${order.brand}\n` +
    `💰 Jumlah: ${formatIDR(order.dpAmount)}\n` +
    `🏦 Ke rekening: ${bankName} ${bankAccountNumber}\n\n` +
    `Mohon dikonfirmasi. Terima kasih! 🙏`
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-emerald-500/30">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-xl">
            <div>
              <p className="text-zinc-400 text-sm mb-1 uppercase tracking-wider font-semibold">Order ID</p>
              <h1 className="text-xl md:text-2xl font-mono text-zinc-200">{order.id}</h1>
              <p className="mt-2 text-zinc-300">
                Halo, <span className="font-semibold text-white">{order.customerName}</span>! Berikut status pesanan <strong>{order.brand}</strong> Anda.
              </p>
            </div>
            <div className="hidden md:block min-w-[280px] bg-zinc-950/60 border border-zinc-800 rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3">
                <span>Progress</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-400" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-white">{STATUS_STEPS[currentStatusIndex > -1 ? currentStatusIndex : 0].label}</span>
                <span className="text-xs text-zinc-500">{currentStatusIndex + 1} / {STATUS_STEPS.length}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Timeline Column */}
            <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xl">
              <h3 className="text-xl font-bold mb-8">Riwayat Pesanan</h3>
              <div className="relative border-l border-zinc-800 ml-4 space-y-8">
                {STATUS_STEPS.map((step, index) => {
                  const isCompleted = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;
                  
                  return (
                    <div key={step.id} className="relative pl-8">
                      {/* Timeline Dot */}
                      <div className={`absolute -left-[17px] top-1 h-8 w-8 rounded-full border-4 border-zinc-900 flex items-center justify-center transition-colors duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-zinc-800'}`}>
                        {isCompleted && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      
                      {/* Content */}
                      <div>
                        <h4 className={`text-lg font-bold ${isCurrent ? 'text-white' : isCompleted ? 'text-zinc-200' : 'text-zinc-500'}`}>
                          {step.label}
                        </h4>
                        <p className={`text-sm mt-1 ${isCurrent ? 'text-zinc-400' : 'text-zinc-600'}`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-8">
              
              {/* Product Info */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="font-bold text-lg mb-2">Detail Produk</h3>
                {order.productImage ? (
                  <div className="aspect-square relative rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700">
                    <Image
                      src={order.productImage}
                      alt={order.brand}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-600 border border-zinc-700">
                    Tidak ada gambar
                  </div>
                )}
                
                <div>
                  <p className="text-zinc-400 text-sm">Brand & Item</p>
                  <p className="font-semibold text-white">{order.brand}</p>
                </div>
                {order.size && (
                  <div>
                    <p className="text-zinc-400 text-sm">Detail / Size</p>
                    <p className="font-semibold text-white">{order.size}</p>
                  </div>
                )}
              </div>

              {/* Price Details */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="font-bold text-lg mb-2">Informasi Pembayaran</h3>
                
                {order.finalPrice ? (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Harga Barang</span>
                      <span className="text-white">{formatIDR(order.storePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Total + Jasa</span>
                      <span className="text-white font-bold">{formatIDR(order.finalPrice)}</span>
                    </div>
                    <div className="border-t border-zinc-800 pt-3 flex justify-between">
                      <span className="text-zinc-400">Tagihan DP {order.dpPercentage}%</span>
                      <span className="text-emerald-400">{formatIDR(order.dpAmount)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-1">
                      <span className="text-zinc-300">Sisa Tagihan</span>
                      <span className="text-white">{formatIDR(order.finalPrice - (order.dpAmount || 0))}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-zinc-500 text-center py-4 border border-dashed border-zinc-700 rounded-xl">
                    Harga belum dikonfirmasi admin. Estimasi akan muncul setelah pengecekan stok.
                  </div>
                )}
              </div>

              {/* Bank Transfer Section - tampil saat READY_TO_PAY */}
              {order.status === 'READY_TO_PAY' && order.dpAmount && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-5">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-[#e9c349]" />
                    <h3 className="font-bold text-lg">Transfer Pembayaran DP</h3>
                  </div>

                  <div className="bg-zinc-800/70 border border-zinc-700 rounded-2xl p-5 space-y-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-1">Bank Tujuan</p>
                      <p className="text-white font-bold text-lg">{bankName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-1">Nomor Rekening</p>
                      <div className="flex items-center gap-3">
                        <p className="text-white font-mono text-xl font-bold tracking-wider">{bankAccountNumber}</p>
                        <Copy className="w-4 h-4 text-zinc-500" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-1">Atas Nama</p>
                      <p className="text-white font-semibold">{bankAccountHolder}</p>
                    </div>
                    <div className="border-t border-zinc-700 pt-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-1">Jumlah Transfer</p>
                      <p className="text-[#e9c349] font-extrabold text-2xl">{formatIDR(order.dpAmount)}</p>
                    </div>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-200">
                    ⚠️ Pastikan jumlah transfer <strong>sesuai persis</strong> agar kami bisa memproses pesanan lebih cepat.
                  </div>

                  <a
                    href={`https://wa.me/${adminWhatsapp}?text=${waConfirmMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#e9c349] hover:bg-[#f4d061] text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Konfirmasi Pembayaran via WhatsApp
                  </a>
                </div>
              )}

              {/* Payment Confirmed - tampil saat PAID_DP */}
              {order.status === 'PAID_DP' && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <h3 className="font-bold text-lg">Status Pembayaran</h3>
                  <div className="text-sm text-emerald-300 border border-emerald-500/30 bg-emerald-500/10 rounded-xl p-4">
                    ✅ Pembayaran DP sudah diterima dan dikonfirmasi oleh admin.
                    {order.dpPaidAt && (
                      <span className="block text-emerald-200/80 mt-1">
                        Dikonfirmasi pada {new Date(order.dpPaidAt).toLocaleString('id-ID')}.
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Receipt Image (If any) */}
              {order.receiptImage && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <h3 className="font-bold text-lg mb-2">Bukti Pembelian</h3>
                  <a href={order.receiptImage} target="_blank" rel="noopener noreferrer" className="block relative aspect-[3/4] rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700 group">
                    <Image
                      src={order.receiptImage}
                      alt="Struk Pembelian"
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-semibold">Lihat Penuh</span>
                    </div>
                  </a>
                </div>
              )}

              {/* WhatsApp Helper */}
              <a 
                href={`https://wa.me/${adminWhatsapp}?text=${encodeURIComponent(`Halo Admin JastipVIP, saya ingin bertanya mengenai pesanan saya dengan Order ID: ${order.id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Chat Admin via WA
              </a>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


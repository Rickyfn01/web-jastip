import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Package } from 'lucide-react';
import OrderAdminForm from '@/components/OrderAdminForm';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id }
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-16">
      <div className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link href="/admin/dashboard" className="text-zinc-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
          </Link>
          <div className="font-mono text-xs text-zinc-500">ID: {order.id}</div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 md:px-8 mt-8">
        <h1 className="text-2xl font-bold mb-6">Kelola Pesanan</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl flex gap-4">
            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-zinc-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Pemesan</p>
              <h2 className="text-lg font-bold text-white">{order.customerName}</h2>
              <p className="text-zinc-300 mt-1">{order.whatsappNumber}</p>
              <div className="mt-2 inline-block bg-blue-500/10 text-blue-400 text-xs px-2 py-1 rounded border border-blue-500/20">
                Pilihan DP: {order.dpPercentage}%
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl flex gap-4">
            <div className="w-12 h-12 flex items-center justify-center shrink-0 rounded-xl overflow-hidden bg-zinc-800 relative">
              {order.productImage ? (
                <Image
                  src={order.productImage}
                  alt="Product"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <Package className="w-6 h-6 text-zinc-400" />
              )}
            </div>
            <div>
              <p className="text-sm text-zinc-400">Detail Produk</p>
              <h2 className="text-lg font-bold text-white">{order.brand}</h2>
              <p className="text-zinc-300 mt-1 text-sm">{order.size || 'Tanpa detail size'}</p>
              <p className="text-xs text-zinc-500 mt-2">Dibuat: {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <OrderAdminForm order={order} />
        
      </main>
    </div>
  );
}

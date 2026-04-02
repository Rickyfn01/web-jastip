import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { LogOut, PackageSearch, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <PackageSearch className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <form action={async () => {
            'use server';
            cookies().delete('admin_session');
            redirect('/admin');
          }}>
            <button type="submit" className="text-zinc-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
              Logout <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Summary Cards */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400 text-sm font-medium mb-1">Total Pesanan</p>
            <p className="text-3xl font-bold">{orders.length}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400 text-sm font-medium mb-1">Pesanan Aktif (Belum Selesai)</p>
            <p className="text-3xl font-bold flex items-center gap-2">
              <Clock className="w-6 h-6 text-yellow-500" />
              {orders.filter(o => o.status !== 'COMPLETED').length}
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400 text-sm font-medium mb-1">Selesai</p>
            <p className="text-3xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              {orders.filter(o => o.status === 'COMPLETED').length}
            </p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-lg font-bold">Daftar Pesanan Terbaru</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900/50 text-zinc-400 text-sm border-b border-zinc-800">
                  <th className="font-medium p-4 pl-6">Tanggal</th>
                  <th className="font-medium p-4">Pelanggan</th>
                  <th className="font-medium p-4">Brand/Item</th>
                  <th className="font-medium p-4">Status</th>
                  <th className="font-medium p-4">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500">Belum ada pesanan masuk.</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="p-4 pl-6 whitespace-nowrap text-zinc-300 text-sm">
                        {new Date(order.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-white">{order.customerName}</div>
                        <div className="text-xs text-zinc-500">{order.whatsappNumber}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-zinc-200">{order.brand}</div>
                        {order.size && <div className="text-xs text-zinc-500">{order.size}</div>}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <Link href={`/admin/orders/${order.id}`} className="text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center gap-1 transition-colors">
                          Kelola <ArrowRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

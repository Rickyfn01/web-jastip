'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Package, User, Clock, CheckCircle2, AlertCircle, Wallet, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Order {
  id: string;
  brand: string;
  customerName: string;
  dpPercentage: number;
  status: string;
  createdAt: string;
  storePrice?: number;
  finalPrice?: number;
  dpAmount?: number;
  xenditInvoiceUrl?: string;
  xenditInvoiceStatus?: string;
  xenditInvoiceExpiryAt?: string;
}

interface Customer {
  id: string;
  fullName: string;
  whatsappNumber: string;
  email?: string;
  createdAt: string;
}

export default function MemberDashboard() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000 * 30);
    return () => window.clearInterval(timer);
  }, []);

  const fetchCustomerData = async (customerId: string) => {
    const res = await fetch(`/api/customers/${customerId}`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch customer data');
    }
    const data = await res.json();
    setCustomer(data.customer);
    setOrders(data.orders || []);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const customerId = localStorage.getItem('customer_id');
      const sessionMarker = localStorage.getItem('customer_session_marker');

      if (!customerId || !sessionMarker) {
        router.push('/register?next=/member/dashboard');
        return;
      }

      try {
        // Fetch customer profile and orders
        await fetchCustomerData(customerId);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/customers/logout', { method: 'POST' });
      localStorage.removeItem('customer_session_marker');
      localStorage.removeItem('customer_id');
      localStorage.removeItem('customer_name');
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      CHECKING: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      READY_TO_PAY: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      PAID_DP: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      PURCHASED: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      SHIPPED: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      COMPLETED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    };
    return colors[status] || colors.PENDING;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'CHECKING':
      case 'READY_TO_PAY':
      case 'PAID_DP':
      case 'PURCHASED':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'Menunggu Konfirmasi',
      CHECKING: 'Pengecekan Stok',
      READY_TO_PAY: 'Siap Dibayar',
      PAID_DP: 'DP Diterima',
      PURCHASED: 'Barang Dibeli',
      SHIPPED: 'Sedang Dikirim',
      COMPLETED: 'Selesai',
    };

    return labels[status] || status.replace(/_/g, ' ');
  };

  const getInvoiceDeadlineLabel = (expiryAt?: string) => {
    if (!expiryAt) {
      return null;
    }

    const expiry = new Date(expiryAt).getTime();
    const remainingMs = expiry - now;

    if (remainingMs <= 0) {
      return 'Invoice kadaluarsa';
    }

    const totalMinutes = Math.floor(remainingMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `Bayar dalam ${hours}j ${minutes}m`;
    }

    return `Bayar dalam ${minutes} menit`;
  };

  const handleRefreshPaymentStatus = async () => {
    const customerId = localStorage.getItem('customer_id');
    if (!customerId) {
      return;
    }

    try {
      setLoading(true);
      await fetchCustomerData(customerId);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#0e0e0e] flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#e9c349] mx-auto mb-4" />
            <p className="text-[#ababab]">Memuat data member...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !customer) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#0e0e0e] flex items-center justify-center pt-20">
          <div className="max-w-md text-center">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-6">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-300 mb-4">{error || 'Data member tidak ditemukan'}</p>
            </div>
            <Link href="/" className="bg-[#e9c349] px-6 py-3 text-[#4f3e00] font-semibold rounded-lg inline-block">
              Kembali ke Beranda
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0e0e0e] pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#f9f9f9] mb-2">Member Dashboard</h1>
              <p className="text-[#ababab]">Kelola pesanan dan profil akun Anda</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-6 py-3 rounded-lg transition border border-red-500/30"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Profile Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Profile Card */}
            <div className="bg-[#131313] border border-[#262626] rounded-lg p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-[#262626] rounded-lg flex items-center justify-center">
                  <User className="w-8 h-8 text-[#e9c349]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#f9f9f9]">{customer.fullName}</h2>
                  <p className="text-[#ababab] text-sm">Member aktif</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-t border-[#262626] pt-4">
                  <p className="text-[#757575] text-sm uppercase tracking-widest mb-1">Email</p>
                  <p className="text-[#f9f9f9]">{customer.email || 'Tidak diisi'}</p>
                </div>
                <div className="border-t border-[#262626] pt-4">
                  <p className="text-[#757575] text-sm uppercase tracking-widest mb-1">WhatsApp</p>
                  <a href={`https://wa.me/${customer.whatsappNumber}`} className="text-[#e9c349] hover:text-[#f4cc52]">
                    {customer.whatsappNumber}
                  </a>
                </div>
                <div className="border-t border-[#262626] pt-4">
                  <p className="text-[#757575] text-sm uppercase tracking-widest mb-1">Member Sejak</p>
                  <p className="text-[#f9f9f9]">{new Date(customer.createdAt).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-4">
              <div className="bg-[#131313] border border-[#262626] rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-5 h-5 text-[#e9c349]" />
                  <p className="text-[#ababab] text-sm">Total Pesanan</p>
                </div>
                <p className="text-3xl font-bold text-[#f9f9f9]">{orders.length}</p>
              </div>

              <div className="bg-[#131313] border border-[#262626] rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <p className="text-[#ababab] text-sm">Pesanan Selesai</p>
                </div>
                <p className="text-3xl font-bold text-[#f9f9f9]">{orders.filter(o => o.status === 'COMPLETED').length}</p>
              </div>

              <div className="bg-[#131313] border border-[#262626] rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <p className="text-[#ababab] text-sm">Pesanan Sedang Diproses</p>
                </div>
                <p className="text-3xl font-bold text-[#f9f9f9]">
                  {orders.filter(o => o.status !== 'COMPLETED').length}
                </p>
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div>
            <h2 className="text-2xl font-bold text-[#f9f9f9] mb-6">Riwayat Pesanan</h2>

            {orders.length === 0 ? (
              <div className="bg-[#131313] border border-[#262626] rounded-lg p-12 text-center">
                <Package className="w-16 h-16 text-[#484848] mx-auto mb-4" />
                <p className="text-[#ababab] mb-6">Belum ada pesanan. Mulai titip barang favorit Anda sekarang!</p>
                <Link href="/member/request" className="bg-[#e9c349] px-6 py-3 text-[#4f3e00] font-semibold rounded-lg inline-block hover:brightness-110">
                  Titip Barang Sekarang
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-[#131313] border border-[#262626] rounded-lg p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#f9f9f9] mb-2">{order.brand}</h3>
                        <p className="text-[#ababab] text-sm mb-3">Order ID: {order.id.slice(0, 8)}...</p>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {getStatusLabel(order.status)}
                          </span>
                          {order.status === 'READY_TO_PAY' && order.xenditInvoiceUrl && order.xenditInvoiceStatus !== 'PAID' && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold border border-[#e9c349]/40 bg-[#e9c349]/10 text-[#e9c349]">
                              Invoice siap dibayar
                            </span>
                          )}
                          {order.status === 'READY_TO_PAY' && order.xenditInvoiceStatus === 'EXPIRED' && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold border border-red-500/30 bg-red-500/10 text-red-300">
                              Invoice kadaluarsa
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        {order.dpPercentage && (
                          <p className="text-sm text-[#757575] mb-1">DP {order.dpPercentage}%</p>
                        )}
                        {order.dpAmount ? (
                          <p className="text-sm text-[#f9f9f9] mb-2">
                            Tagihan DP: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(order.dpAmount)}
                          </p>
                        ) : null}
                        <p className="text-[#ababab] text-sm">
                          {new Date(order.createdAt).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link
                        href={`/track/${order.id}`}
                        className="px-4 py-2.5 rounded-lg border border-[#313131] text-[#e5e5e5] hover:bg-[#1a1a1a] transition text-sm font-semibold"
                      >
                        Lihat Detail Tracking
                      </Link>

                      {order.status === 'READY_TO_PAY' && order.xenditInvoiceUrl && order.xenditInvoiceStatus !== 'PAID' && (
                        <div className="flex flex-wrap items-center gap-3">
                          <a
                            href={order.xenditInvoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2.5 rounded-lg bg-[#e9c349] hover:bg-[#f4d061] text-[#4f3e00] transition text-sm font-bold inline-flex items-center gap-2"
                          >
                            <Wallet className="w-4 h-4" />
                            Bayar DP Sekarang
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          {getInvoiceDeadlineLabel(order.xenditInvoiceExpiryAt) && (
                            <span className="text-xs text-[#ababab]">{getInvoiceDeadlineLabel(order.xenditInvoiceExpiryAt)}</span>
                          )}
                        </div>
                      )}

                      {order.status === 'READY_TO_PAY' && order.xenditInvoiceStatus === 'EXPIRED' && (
                        <p className="text-xs text-red-300 self-center">Hubungi admin untuk kirim ulang invoice pembayaran.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {orders.some((order) => order.status === 'READY_TO_PAY') && (
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={handleRefreshPaymentStatus}
                  className="px-4 py-2 rounded-lg border border-[#313131] text-[#e5e5e5] hover:bg-[#1a1a1a] transition text-sm font-semibold"
                >
                  Saya Sudah Bayar, Refresh Status
                </button>
                <p className="text-xs text-[#8a8a8a]">Gunakan tombol ini setelah pembayaran selesai di halaman Xendit.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

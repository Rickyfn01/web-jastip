'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RequestForm from '@/components/RequestForm';

interface CustomerProfile {
  fullName: string;
  whatsappNumber: string;
}

export default function MemberRequestPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);

  useEffect(() => {
    const customerId = localStorage.getItem('customer_id');
    const sessionMarker = localStorage.getItem('customer_session_marker');

    if (!customerId || !sessionMarker) {
      router.push('/login?next=/member/request');
      return;
    }

    const localName = localStorage.getItem('customer_name') || '';
    const localWhatsapp = localStorage.getItem('customer_whatsapp') || '';

    setProfile({
      fullName: localName,
      whatsappNumber: localWhatsapp,
    });

    fetch(`/api/customers/${customerId}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Gagal memuat data member');
        }
        return res.json();
      })
      .then((data) => {
        const fullName = data?.customer?.fullName || localName;
        const whatsappNumber = data?.customer?.whatsappNumber || localWhatsapp;

        setProfile({ fullName, whatsappNumber });
        localStorage.setItem('customer_name', fullName);
        localStorage.setItem('customer_whatsapp', whatsappNumber);
      })
      .catch(() => {
        // Keep local profile fallback if API request fails.
      });
  }, [router]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0e0e0e] pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <Link
              href="/member/dashboard"
              className="inline-flex items-center gap-2 text-[#ababab] hover:text-[#e9c349] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Dashboard
            </Link>
            <h1 className="mt-4 text-3xl md:text-4xl font-extrabold text-[#f9f9f9]">Form Titip Barang</h1>
            <p className="mt-2 text-[#ababab]">Isi form di bawah ini untuk mengirim request penitipan barang Anda.</p>
          </div>
        </div>
      </main>
      <RequestForm
        forceOpen
        hideFloatingButton
        memberMode
        initialCustomerName={profile?.fullName || ''}
        initialWhatsappNumber={profile?.whatsappNumber || ''}
      />
      <Footer />
    </>
  );
}

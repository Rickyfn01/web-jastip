'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RequestForm from '@/components/RequestForm';

export default function MemberRequestPage() {
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
      <RequestForm forceOpen hideFloatingButton />
      <Footer />
    </>
  );
}

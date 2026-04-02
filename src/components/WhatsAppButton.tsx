'use client';

import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const phoneNumber = '6281234567890'; // Ganti dengan nomor WA admin
  const message = encodeURIComponent('Halo, saya tertarik untuk titip barang via JastipVIP. Bisa dibantu?');

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 left-8 z-50 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-lg shadow-emerald-500/25 hover:scale-110 transition-all duration-300 group"
      aria-label="Chat via WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-zinc-900 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-zinc-800">
        Konsultasi via WA
      </span>
    </a>
  );
}

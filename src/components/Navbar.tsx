'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0e0e0e]/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <span className="text-lg font-extrabold text-white tracking-[-0.04em]">
            Jastip<span className="text-[#e9c349]">VIP</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollTo('how-it-works')} className="text-[11px] uppercase tracking-[0.14em] text-zinc-300 hover:text-[#e9c349] transition-colors">Cara Kerja</button>
          <button onClick={() => scrollTo('brands')} className="text-[11px] uppercase tracking-[0.14em] text-zinc-300 hover:text-[#e9c349] transition-colors">Brand</button>
          <button onClick={() => scrollTo('testimonials')} className="text-[11px] uppercase tracking-[0.14em] text-zinc-300 hover:text-[#e9c349] transition-colors">Testimoni</button>
          <button onClick={() => scrollTo('faq')} className="text-[11px] uppercase tracking-[0.14em] text-zinc-300 hover:text-[#e9c349] transition-colors">FAQ</button>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/register" className="text-[11px] uppercase tracking-[0.14em] text-zinc-300 hover:text-[#e9c349] transition-colors">
            Daftar Pembeli
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white">
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#111111] px-6 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <button onClick={() => scrollTo('how-it-works')} className="block w-full text-left text-[11px] uppercase tracking-[0.14em] text-zinc-300 hover:text-[#e9c349] py-2">Cara Kerja</button>
          <button onClick={() => scrollTo('brands')} className="block w-full text-left text-[11px] uppercase tracking-[0.14em] text-zinc-300 hover:text-[#e9c349] py-2">Brand</button>
          <button onClick={() => scrollTo('testimonials')} className="block w-full text-left text-[11px] uppercase tracking-[0.14em] text-zinc-300 hover:text-[#e9c349] py-2">Testimoni</button>
          <button onClick={() => scrollTo('faq')} className="block w-full text-left text-[11px] uppercase tracking-[0.14em] text-zinc-300 hover:text-[#e9c349] py-2">FAQ</button>
          <Link href="/register" onClick={() => setIsMenuOpen(false)} className="block w-full text-left text-[11px] uppercase tracking-[0.14em] text-zinc-300 hover:text-[#e9c349] py-2">
            Daftar Pembeli
          </Link>
        </div>
      )}
    </nav>
  );
}

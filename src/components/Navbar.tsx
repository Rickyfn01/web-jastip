'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-black" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            Jastip<span className="text-zinc-400">VIP</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollTo('how-it-works')} className="text-sm text-zinc-400 hover:text-white transition-colors">Cara Kerja</button>
          <button onClick={() => scrollTo('brands')} className="text-sm text-zinc-400 hover:text-white transition-colors">Brand</button>
          <button onClick={() => scrollTo('testimonials')} className="text-sm text-zinc-400 hover:text-white transition-colors">Testimoni</button>
          <button onClick={() => scrollTo('faq')} className="text-sm text-zinc-400 hover:text-white transition-colors">FAQ</button>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/register" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
            Daftar Pembeli
          </Link>
          <button onClick={() => scrollTo('request-form')} className="bg-white text-black text-sm font-semibold px-5 py-2 rounded-full hover:bg-zinc-200 transition-colors">
            Titip Sekarang
          </button>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white">
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-t border-zinc-900 px-6 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <button onClick={() => scrollTo('how-it-works')} className="block w-full text-left text-zinc-300 hover:text-white py-2">Cara Kerja</button>
          <button onClick={() => scrollTo('brands')} className="block w-full text-left text-zinc-300 hover:text-white py-2">Brand</button>
          <button onClick={() => scrollTo('testimonials')} className="block w-full text-left text-zinc-300 hover:text-white py-2">Testimoni</button>
          <button onClick={() => scrollTo('faq')} className="block w-full text-left text-zinc-300 hover:text-white py-2">FAQ</button>
          <Link href="/register" onClick={() => setIsMenuOpen(false)} className="block w-full text-left text-zinc-300 hover:text-white py-2">
            Daftar Pembeli
          </Link>
          <button onClick={() => scrollTo('request-form')} className="w-full bg-white text-black text-sm font-semibold px-5 py-2.5 rounded-full mt-2">
            Titip Sekarang
          </button>
        </div>
      )}
    </nav>
  );
}

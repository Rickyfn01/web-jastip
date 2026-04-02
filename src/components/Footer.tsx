import { ShoppingBag } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-black" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Jastip<span className="text-zinc-400">VIP</span>
              </span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              Layanan Personal Shopper terpercaya untuk produk-produk brand ternama dari jaringan MAP Group. 100% Original, tanpa ribet.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Navigasi</h4>
            <ul className="space-y-2.5 text-sm text-zinc-500">
              <li><a href="#how-it-works" className="hover:text-white transition-colors">Cara Kerja</a></li>
              <li><a href="#brands" className="hover:text-white transition-colors">Brand Tersedia</a></li>
              <li><a href="#testimonials" className="hover:text-white transition-colors">Testimoni</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Hubungi Kami</h4>
            <ul className="space-y-2.5 text-sm text-zinc-500">
              <li>
                <a 
                  href="https://wa.me/6281234567890" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  💬 WhatsApp
                </a>
              </li>
              <li>
                <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                  📸 Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-600">&copy; {new Date().getFullYear()} JastipVIP. All rights reserved.</p>
          <p className="text-xs text-zinc-700">100% Authentic MAP Store Products</p>
        </div>
      </div>
    </footer>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#0b0b0b] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-[1.5fr_1fr_1fr] gap-12 mb-14">
          {/* Brand */}
          <div>
            <p className="text-lg font-extrabold text-white tracking-[-0.03em] mb-4">
              Jastip<span className="text-[#e9c349]">VIP</span>
            </p>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-sm">
              Layanan Personal Shopper terpercaya untuk produk-produk brand ternama dari jaringan MAP Group. 100% Original, tanpa ribet.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] font-semibold text-zinc-400 mb-4 uppercase tracking-[0.18em]">Navigasi</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><a href="#how-it-works" className="hover:text-[#e9c349] transition-colors">Cara Kerja</a></li>
              <li><a href="#brands" className="hover:text-[#e9c349] transition-colors">Brand Tersedia</a></li>
              <li><a href="#testimonials" className="hover:text-[#e9c349] transition-colors">Testimoni</a></li>
              <li><a href="#faq" className="hover:text-[#e9c349] transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-semibold text-zinc-400 mb-4 uppercase tracking-[0.18em]">Hubungi Kami</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li>
                <a 
                  href="https://wa.me/6281234567890" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#e9c349] transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#e9c349] transition-colors">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">&copy; {new Date().getFullYear()} JastipVIP. All rights reserved.</p>
          <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-700">100% Authentic MAP Store Products</p>
        </div>
      </div>
    </footer>
  );
}

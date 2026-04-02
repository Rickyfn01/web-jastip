import { Search, ShieldCheck, CreditCard, Check, Star, Clock, ChevronDown, Package, Truck, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RequestForm from '@/components/RequestForm';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function LandingPage({ brandName }: { brandName?: string }) {
  const headline = brandName 
    ? `Dapatkan Koleksi Spesial dari ${brandName} dengan ` 
    : 'Dapatkan Barang Brand Favoritmu dengan ';

  const subHeadline = brandName
    ? `100% Original ${brandName} dari toko ritel resmi. Kami bantu carikan barang incaranmu langsung dari store resmi dengan harga terbaik. Tanpa antre, aman, dan bergaransi.`
    : '100% Original dari MAP Group. Kami bantu carikan barang incaranmu langsung dari store resmi dengan harga terbaik. Tanpa antre, aman, dan bergaransi.';

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-950 text-slate-50 selection:bg-white selection:text-black">
        
        {/* ═══════════════════════════════════ HERO ═══════════════════════════════════ */}
        <section className="relative px-6 pt-36 pb-20 md:pt-52 md:pb-32 max-w-7xl mx-auto overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-violet-500/8 via-indigo-500/5 to-transparent blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-40 right-0 w-[300px] h-[300px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-800 text-sm font-medium text-zinc-300 mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Layanan Personal Shopper VIP
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-5xl leading-[1.1]">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500">
                {headline}
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">
                Penawaran Spesial
              </span>
            </h1>
            
            {/* Sub-headline */}
            <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl text-balance mb-10 leading-relaxed">
              {subHeadline}
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <span className="text-sm border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 rounded-full text-zinc-300 flex items-center gap-2 backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Asli
              </span>
              <span className="text-sm border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 rounded-full text-zinc-300 flex items-center gap-2 backdrop-blur-sm">
                <Package className="w-4 h-4 text-blue-400" /> Langsung dari Store
              </span>
              <span className="text-sm border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 rounded-full text-zinc-300 flex items-center gap-2 backdrop-blur-sm">
                <Truck className="w-4 h-4 text-amber-400" /> Kirim ke Seluruh Indonesia
              </span>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ BRAND TRUST ═══════════════════════════════ */}
        <section id="brands" className="border-y border-zinc-900/80 bg-zinc-950/50 py-12">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-xs font-semibold text-zinc-600 uppercase tracking-[0.2em] mb-10">
              Titip Brand Apa Saja di MAP Group
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6 md:gap-x-16">
              <span className="text-3xl font-black uppercase tracking-[-0.05em] text-zinc-600 hover:text-white transition-colors duration-500 cursor-default">NIKE</span>
              <span className="text-3xl font-serif italic text-zinc-600 hover:text-white transition-colors duration-500 cursor-default">ZARA</span>
              <span className="text-2xl font-bold uppercase tracking-[0.15em] text-zinc-600 hover:text-white transition-colors duration-500 cursor-default">adidas</span>
              <span className="text-2xl font-medium tracking-tight text-zinc-600 hover:text-white transition-colors duration-500 cursor-default">SEPHORA</span>
              <span className="text-2xl font-bold uppercase tracking-[0.2em] text-zinc-600 hover:text-white transition-colors duration-500 cursor-default">LACOSTE</span>
              <span className="text-2xl font-black uppercase text-zinc-600 hover:text-white transition-colors duration-500 cursor-default">CONVERSE</span>
              <span className="text-xl font-semibold uppercase tracking-[0.3em] text-zinc-600 hover:text-white transition-colors duration-500 cursor-default">MARKS & SPENCER</span>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ HOW IT WORKS ═══════════════════════════════ */}
        <section id="how-it-works" className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-[0.2em] mb-3">Simpel & Transparan</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Bagaimana Cara Kerjanya?</h2>
            <p className="text-zinc-400 max-w-lg mx-auto text-lg">Cukup 3 langkah mudah, barang incaranmu sampai di depan pintu.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: Search,
                title: "Kirim Foto Barang",
                desc: `Upload screenshot barang dari Instagram, website, atau Pinterest. Isi detail brand${brandName ? ` ${brandName}` : ''}, ukuran, dan warna yang kamu mau.`,
                color: 'from-violet-500/10 to-violet-500/0',
                borderColor: 'hover:border-violet-500/30',
              },
              {
                step: '02',
                icon: Check,
                title: "Kami Cek di Store",
                desc: "Tim kami langsung cek ketersediaan di seluruh jaringan toko MAP. Harga terbaik dikonfirmasi via WhatsApp.",
                color: 'from-blue-500/10 to-blue-500/0',
                borderColor: 'hover:border-blue-500/30',
              },
              {
                step: '03',
                icon: CreditCard,
                title: "Bayar DP & Dikirim",
                desc: "Bayar DP sesuai pilihan (50/75/100%). Kami beli, kemas dengan aman, dan kirim langsung ke alamatmu.",
                color: 'from-emerald-500/10 to-emerald-500/0',
                borderColor: 'hover:border-emerald-500/30',
              }
            ].map((item, i) => (
              <div key={i} className={`relative bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-8 ${item.borderColor} transition-all duration-500 group overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-b ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <span className="text-sm font-mono text-zinc-600 mb-4 block">{item.step}</span>
                  <div className="w-12 h-12 bg-white/5 group-hover:bg-white/10 transition-colors border border-zinc-800 rounded-xl flex items-center justify-center mb-5">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                  <p className="text-zinc-400 leading-relaxed text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════ SOCIAL PROOF ═══════════════════════════════ */}
        <section className="py-16 px-6 border-y border-zinc-900/80">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Barang Dititipkan' },
              { value: '350+', label: 'Pelanggan Puas' },
              { value: '100%', label: 'Barang Original' },
              { value: '4.9★', label: 'Rating Pelayanan' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-3xl md:text-4xl font-extrabold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════ TESTIMONI ═══════════════════════════════ */}
        <section id="testimonials" className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-[0.2em] mb-3">Kata Mereka</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Dipercaya Ratusan Pelanggan</h2>
            <p className="text-zinc-400 max-w-lg mx-auto text-lg">Sudah 500+ barang branded sampai ke tangan pemiliknya dengan aman.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Rina A.',
                item: 'Nike Air Max 90',
                text: 'Awalnya ragu, tapi ternyata prosesnya super cepat. Barang sampai 3 hari, masih sealed, dan harganya jauh lebih murah dari marketplace!',
                stars: 5,
              },
              {
                name: 'Dimas P.',
                item: 'Polo Lacoste Original',
                text: 'Sudah 3x titip lewat sini. Selalu dikasih foto struk langsung, jadi yakin 100% original. Pelayanan ramah dan fast response.',
                stars: 5,
              },
              {
                name: 'Sarah M.',
                item: 'Sephora Skincare Set',
                text: 'Nyari skincare Sephora yang nggak ada di online store, eh ternyata bisa dititipin di sini. Packagingnya juga rapi dan aman banget.',
                stars: 5,
              },
            ].map((review, i) => (
              <div key={i} className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 hover:bg-zinc-900/60 transition-colors">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: review.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed mb-5">&ldquo;{review.text}&rdquo;</p>
                <div className="border-t border-zinc-800 pt-4">
                  <p className="font-semibold text-white text-sm">{review.name}</p>
                  <p className="text-xs text-zinc-500">Pesan: {review.item}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════ URGENCY / CTA ═══════════════════════════════ */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-10 md:p-14 relative overflow-hidden">
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[150px] bg-violet-500/10 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-6">
                <Clock className="w-4 h-4" />
                Slot Terbatas Bulan Ini
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Jangan Bayar Harga Penuh</h2>
              <p className="text-zinc-400 max-w-xl mx-auto mb-8 leading-relaxed">
                Kapasitas personal shopper kami terbatas setiap bulannya. Amankan slot titipanmu sekarang sebelum kuota penuh. 100% Authentic MAP Store — atau uang kembali.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="#request-form" className="bg-white text-black font-semibold px-8 py-3.5 rounded-full hover:bg-zinc-200 transition-colors inline-flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Titip Barang Sekarang
                </a>
                <a 
                  href="https://wa.me/6281234567890" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="border border-zinc-700 text-zinc-300 font-medium px-8 py-3.5 rounded-full hover:bg-zinc-900 hover:text-white transition-colors inline-flex items-center justify-center gap-2"
                >
                  Tanya via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ FAQ ═══════════════════════════════ */}
        <section id="faq" className="py-24 md:py-32 px-6 max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-[0.2em] mb-3">Pertanyaan Umum</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">FAQ</h2>
            <p className="text-zinc-400 text-lg">Hal-hal yang sering ditanyakan pelanggan kami.</p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'Apakah barangnya 100% original?',
                a: 'Ya, 100% original. Semua barang dibeli langsung dari store resmi brand (jaringan MAP Group). Kami selalu menyertakan foto struk pembelian sebagai bukti keaslian.',
              },
              {
                q: 'Berapa lama prosesnya dari order sampai barang dikirim?',
                a: 'Rata-rata 2-5 hari kerja, tergantung ketersediaan barang di store. Kami akan selalu update status pesananmu via WhatsApp.',
              },
              {
                q: 'Kenapa harganya bisa lebih murah?',
                a: 'Kami memiliki akses ke penawaran spesial dan promo di jaringan store MAP yang tidak selalu tersedia untuk umum, sehingga bisa memberikan harga lebih kompetitif.',
              },
              {
                q: 'Bagaimana sistem pembayarannya?',
                a: 'Kamu bisa pilih DP 50%, 75%, atau bayar penuh (100%). Sisa pembayaran dilunasi setelah barang sudah di tangan kami dan siap dikirim.',
              },
              {
                q: 'Bagaimana jika barang yang saya mau tidak tersedia?',
                a: 'Jika barang tidak tersedia di store manapun, kami akan segera mengabarkan dan uang DP akan dikembalikan 100%.',
              },
              {
                q: 'Apakah bisa kirim ke luar Jabodetabek?',
                a: 'Tentu! Kami melayani pengiriman ke seluruh Indonesia melalui kurir terpercaya (JNE, SiCepat, dll). Ongkir ditanggung pembeli.',
              },
            ].map((faq, i) => (
              <details key={i} className="group bg-zinc-900/30 border border-zinc-800/80 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between cursor-pointer px-6 py-5 text-white font-medium text-sm md:text-base list-none">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform duration-300 flex-shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-5 text-sm text-zinc-400 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

      </main>
      <Footer />
      <RequestForm />
      <WhatsAppButton />
    </>
  );
}

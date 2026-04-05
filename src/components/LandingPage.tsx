import { Camera, ChevronDown, MapPin, PackageCheck, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RequestForm from '@/components/RequestForm';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function LandingPage({ brandName }: { brandName?: string }) {
  const headline = 'Miliki Koleksi Brand Favoritmu dengan Harga Lebih Hemat.';

  const subHeadline = brandName
    ? `Layanan personal shopper terpercaya untuk ${brandName}, Nike, Zara, Sephora, dan brand ternama lainnya. Kami carikan penawaran terbaik langsung dari store resmi, khusus untuk Anda.`
    : 'Layanan personal shopper terpercaya untuk Nike, Zara, Sephora, dan brand ternama lainnya. Kami carikan penawaran terbaik langsung dari store resmi, khusus untuk Anda.';

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0e0e0e] text-[#e5e5e5]">
        <section className="relative overflow-hidden px-6 pt-36 pb-24 md:pt-44 md:pb-28">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.42)_45%,rgba(0,0,0,0.74)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_12%,rgba(233,195,73,0.2),transparent_34%)]" />
          <div className="absolute inset-0 opacity-20 [background:repeating-linear-gradient(90deg,transparent,transparent_46px,rgba(255,255,255,0.04)_47px,rgba(255,255,255,0.04)_48px)]" />

          <div className="relative z-10 mx-auto max-w-7xl">
            <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#e9c349]">Verified Personal Shopper</p>
            <h1 className="max-w-5xl text-4xl font-extrabold leading-[1.02] text-[#f9f9f9] md:text-7xl">{headline}</h1>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-[#ababab] md:text-lg">{subHeadline}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href="/register" className="bg-[#e9c349] px-8 py-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-[#4f3e00] transition hover:brightness-110">Titip Sekarang</a>
              <a href="#how-it-works" className="bg-transparent px-8 py-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-[#f9f9f9] transition hover:bg-[#1a1a1a]">Cara Order</a>
            </div>
          </div>
        </section>

        <section id="brands" className="bg-[#111111] px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl font-bold text-[#f9f9f9]">Trusted Brands</h2>
            <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-[#757575]">100% Authentic MAP Store Official Collections</p>
            <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-7 text-center text-sm font-semibold uppercase tracking-[0.22em] text-[#8a8a8a] md:grid-cols-7">
              <p>NIKE</p>
              <p>ZARA</p>
              <p>ADIDAS</p>
              <p>SEPHORA</p>
              <p>LACOSTE</p>
              <p>CONVERSE</p>
              <p>MAP</p>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-[#090909] px-6 py-24 md:py-28">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center text-3xl font-bold text-[#f9f9f9] md:text-5xl">Simple Concierge Experience</h2>
            <div className="mx-auto mt-4 h-[2px] w-14 bg-[#e9c349]" />
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {[
                {
                  step: 'Step 01',
                  title: 'Upload Foto Barang',
                  desc: `Kirim screenshot barang impianmu dan detail brand${brandName ? ` ${brandName}` : ''}.`,
                  icon: Camera,
                },
                {
                  step: 'Step 02',
                  title: 'Kami Cek di Store',
                  desc: 'Tim personal shopper langsung cek ketersediaan di store resmi MAP.',
                  icon: MapPin,
                },
                {
                  step: 'Step 03',
                  title: 'Bayar DP & Dikirim',
                  desc: 'Konfirmasi DP, kami beli lalu kirim ke alamatmu dengan aman.',
                  icon: PackageCheck,
                },
              ].map((item) => (
                <article key={item.step} className="bg-[#131313] px-8 py-10 text-center transition duration-300 hover:bg-[#1a1a1a]">
                  <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center bg-[#262626] text-[#e9c349]">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#e9c349]">{item.step}</p>
                  <h3 className="text-xl font-bold text-[#f9f9f9]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#ababab]">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[linear-gradient(90deg,#111111_0%,#0e0e0e_50%,#121212_100%)] px-6 py-24 md:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="max-w-xl text-4xl font-extrabold leading-tight text-[#f9f9f9] md:text-6xl">Siap Memiliki Koleksi Impian Tanpa Harga Retail?</h2>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-[#ababab]">Cukup daftar sebagai pembeli, lalu klik tombol titip di kanan bawah. Tim curator kami akan memproses barangmu dengan update status real-time.</p>
              <div className="mt-8 flex items-center gap-3 text-sm text-[#f9f9f9]">
                <div className="flex -space-x-2">
                  <span className="h-8 w-8 bg-[#262626]" />
                  <span className="h-8 w-8 bg-[#323232]" />
                  <span className="h-8 w-8 bg-[#3f3f3f]" />
                </div>
                <p>Bergabung dengan 400+ VIP Member lainnya</p>
              </div>
            </div>
            <div className="bg-[#f2f2f2] p-8 text-[#0e0e0e] md:p-10">
              <p className="text-2xl font-extrabold uppercase tracking-[-0.01em]">Request Item</p>
              <div className="mt-8 space-y-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6f6f6f]">Nama Barang</p>
                  <div className="mt-2 h-8 border-b border-[#c7c7c7]" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6f6f6f]">Ukuran / Warna</p>
                    <div className="mt-2 h-8 border-b border-[#c7c7c7]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6f6f6f]">Link / Foto</p>
                    <div className="mt-2 h-8 border-b border-[#c7c7c7]" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6f6f6f]">DP Selector Visualizer</p>
                  <div className="mt-2 grid grid-cols-3 text-xs font-bold">
                    <div className="bg-[#ececec] py-3 text-center">50%</div>
                    <div className="bg-[#e9c349] py-3 text-center text-[#4f3e00]">75%</div>
                    <div className="bg-[#ececec] py-3 text-center">100%</div>
                  </div>
                </div>
                <a href="/register" className="block bg-[#111111] py-4 text-center text-xs font-bold uppercase tracking-[0.18em] text-[#f9f9f9]">Daftar & Kirim Request</a>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="bg-[#090909] px-6 py-24 md:py-28">
          <div className="mx-auto max-w-7xl">
            <p className="text-center text-[10px] font-semibold uppercase tracking-[0.34em] text-[#e9c349]">Success Stories</p>
            <h2 className="mt-3 text-center text-3xl font-extrabold text-[#f9f9f9] md:text-5xl">Dipercaya Ratusan Pelanggan</h2>
            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {[
                {
                  name: 'Aditya Putra',
                  role: 'Sneakerhead, Jakarta',
                  text: 'Nggak nyangka bisa dapet Air Jordan harganya jauh di bawah retail. JastipVIP bener-bener recommended!',
                },
                {
                  name: 'Sarah Wijaya',
                  role: 'Beauty Enthusiast, Bandung',
                  text: 'Adminnya fast response, barang 100% original lengkap dengan box dan paper bag MAP. Puas banget!',
                },
                {
                  name: 'Jessica Tan',
                  role: 'Corporate Lawyer, Surabaya',
                  text: 'Udah langganan titip Zara di sini setiap bulan. Selalu dapat item yang susah dicari di store biasa.',
                },
              ].map((review) => (
                <article key={review.name} className="bg-[#131313] p-8">
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-[#e9c349] text-[#e9c349]" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-[#e5e5e5]">&ldquo;{review.text}&rdquo;</p>
                  <p className="mt-6 text-sm font-semibold text-[#f9f9f9]">{review.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[#757575]">{review.role}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="bg-[#101010] px-6 py-24 md:py-28">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-bold text-[#f9f9f9] md:text-4xl">Pertanyaan Umum</h2>
            <div className="mt-12 space-y-4">
              {[
                {
                  q: 'Apakah barangnya 100% original?',
                  a: 'Ya, semua barang dibeli langsung dari jaringan store resmi MAP Group dan disertai bukti pembelian.',
                },
                {
                  q: 'Berapa biaya jasanya?',
                  a: 'Mulai dari Rp 25.000 per item. Nilai final menyesuaikan kategori barang dan tingkat ketersediaan.',
                },
                {
                  q: 'Kenapa harganya bisa lebih murah?',
                  a: 'Kami memanfaatkan akses penawaran internal jaringan MAP, sehingga pelanggan bisa menikmati harga lebih efisien.',
                },
              ].map((faq) => (
                <details key={faq.q} className="group bg-[#0b0b0b]">
                  <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 text-sm font-semibold text-[#f9f9f9] md:text-base">
                    {faq.q}
                    <ChevronDown className="ml-4 h-5 w-5 text-[#e9c349] transition group-open:rotate-180" />
                  </summary>
                  <p className="px-6 pb-5 text-sm leading-relaxed text-[#ababab]">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <RequestForm />
      <WhatsAppButton />
    </>
  );
}

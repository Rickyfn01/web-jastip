'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, LogIn, ShoppingBag } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextPath, setNextPath] = useState('/member/dashboard');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next');
    if (next && next.startsWith('/')) {
      setNextPath(next);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/customers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsappNumber, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login gagal.');
      }

      localStorage.setItem('customer_session_marker', 'true');
      localStorage.setItem('customer_id', data.customer.id);
      localStorage.setItem('customer_name', data.customer.fullName);
      localStorage.setItem('customer_whatsapp', data.customer.whatsappNumber || whatsappNumber);

      router.push(nextPath);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-12">
        <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="flex flex-col justify-center gap-8">
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-4 py-2 text-sm text-zinc-300 backdrop-blur-sm transition-colors hover:text-white"
            >
              <ShoppingBag className="h-4 w-4" />
              Kembali ke beranda
            </Link>

            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e9c349]/20 bg-[#e9c349]/10 px-3 py-1.5 text-sm text-[#e9c349]">
                <LogIn className="h-4 w-4" />
                Login Member
              </div>
              <h1 className="max-w-2xl text-4xl font-black tracking-tight md:text-6xl">
                Masuk ke area member untuk melihat pesananmu.
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
                Gunakan nomor WhatsApp dan password yang kamu pakai saat registrasi.
              </p>
            </div>
          </section>

          <section className="relative rounded-[2rem] border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl backdrop-blur-sm md:p-8">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#e9c349] via-zinc-200 to-[#e9c349]" />
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-zinc-400">Akses Member</p>
                <h2 className="text-2xl font-bold">Login akun pembeli</h2>
              </div>
              <div className="rounded-full border border-zinc-700 bg-zinc-950/80 p-3 text-[#e9c349]">
                <LogIn className="h-5 w-5" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="whatsappNumber" className="text-sm font-medium text-zinc-300">
                  Nomor WhatsApp
                </label>
                <input
                  id="whatsappNumber"
                  value={whatsappNumber}
                  onChange={(event) => setWhatsappNumber(event.target.value)}
                  className="w-full rounded-2xl border border-zinc-700 bg-zinc-950/70 px-4 py-3.5 text-white outline-none transition focus:border-[#e9c349]/60 focus:ring-2 focus:ring-[#e9c349]/20"
                  placeholder="08xxxxxxxxxx"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-medium text-zinc-300">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-zinc-700 bg-zinc-950/70 px-4 py-3.5 text-white outline-none transition focus:border-[#e9c349]/60 focus:ring-2 focus:ring-[#e9c349]/20"
                  placeholder="Masukkan password"
                  required
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e9c349] px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-black transition hover:bg-[#f4d061] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Masuk...
                  </>
                ) : (
                  <>
                    Masuk ke Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-zinc-400">
                Belum punya akun?{' '}
                <Link href="/register" className="font-medium text-[#e9c349] hover:text-[#f4d061]">
                  Daftar sekarang
                </Link>
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, BadgeCheck, Loader2, LockKeyhole, ShoppingBag, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak sama.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/customers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, whatsappNumber, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal membuat akun.');
      }

      setSuccess(`Akun ${data.customer.fullName} berhasil dibuat.`);
      
      // Set session marker in localStorage for client-side auth check
      localStorage.setItem('customer_session_marker', 'true');
      localStorage.setItem('customer_id', data.customer.id);
      localStorage.setItem('customer_name', data.customer.fullName);
      
      router.push('/?registered=1');
    } catch (error: unknown) {
      setError((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-12">
        <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="flex flex-col justify-center gap-8">
            <Link href="/" className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-4 py-2 text-sm text-zinc-300 backdrop-blur-sm transition-colors hover:text-white">
              <ShoppingBag className="h-4 w-4" />
              Kembali ke beranda
            </Link>

            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-300">
                <Sparkles className="h-4 w-4" />
                Registrasi Calon Pembeli
              </div>
              <h1 className="max-w-2xl text-4xl font-black tracking-tight md:text-6xl">
                Buat akun pembeli untuk order yang lebih cepat dan rapi.
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
                Simpan identitas, nomor WhatsApp, dan akses akun calon pembeli agar proses penitipan berikutnya lebih singkat dan mudah dilacak.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                'Data pelanggan tersimpan rapi di database',
                'Siap dipakai untuk order berikutnya',
                'Nomor WhatsApp unik per akun',
                'Auto-login setelah registrasi berhasil',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 text-sm text-zinc-300 backdrop-blur-sm">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="relative rounded-[2rem] border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl backdrop-blur-sm md:p-8">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-white" />
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-zinc-400">Langkah 1</p>
                <h2 className="text-2xl font-bold">Daftarkan akun pembeli</h2>
              </div>
              <div className="rounded-full border border-zinc-700 bg-zinc-950/80 p-3 text-emerald-400">
                <LockKeyhole className="h-5 w-5" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="text-sm font-medium text-zinc-300">Nama Lengkap</label>
                <input
                  id="fullName"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="w-full rounded-2xl border border-zinc-700 bg-zinc-950/70 px-4 py-3.5 text-white outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Misal: Budi Santoso"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="whatsappNumber" className="text-sm font-medium text-zinc-300">Nomor WhatsApp</label>
                <input
                  id="whatsappNumber"
                  value={whatsappNumber}
                  onChange={(event) => setWhatsappNumber(event.target.value)}
                  className="w-full rounded-2xl border border-zinc-700 bg-zinc-950/70 px-4 py-3.5 text-white outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="08xxxxxxxxxx"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-zinc-300">Email Opsional</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-zinc-700 bg-zinc-950/70 px-4 py-3.5 text-white outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="nama@email.com"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-sm font-medium text-zinc-300">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-2xl border border-zinc-700 bg-zinc-950/70 px-4 py-3.5 text-white outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="Minimal 8 karakter"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-300">Konfirmasi Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="w-full rounded-2xl border border-zinc-700 bg-zinc-950/70 px-4 py-3.5 text-white outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="Ulangi password"
                    required
                  />
                </div>
              </div>

              {error && <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}
              {success && <p className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{success}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
                {isSubmitting ? 'Membuat akun...' : 'Daftar Sekarang'}
              </button>

              <p className="text-center text-sm text-zinc-500">
                Sudah punya akun? Silakan lanjut request order dari beranda.
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
'use client';

import { useState } from 'react';
import { Upload, X, CheckCircle2, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RequestForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [warningMsg, setWarningMsg] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    } else {
      setSelectedFile(null);
      setFileName('');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setWarningMsg('');

    const formData = new FormData(e.currentTarget);
    if (selectedFile) {
      formData.set('file', selectedFile);
    }
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat mengirim pesanan.');
      }

      setSuccessOrderId(data.order.id);
      if (data.warning) {
        setWarningMsg(data.warning);
      }
      
    } catch (error: unknown) {
      setErrorMsg((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        id="request-form"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 bg-white text-black px-6 py-4 rounded-full font-bold shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        Titip Barang Sekarang
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}>
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 p-6 pb-4 rounded-t-2xl z-10">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 text-zinc-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-xl md:text-2xl font-bold text-white">Form Penitipan VIP</h3>
          <p className="text-zinc-400 text-sm mt-1">Kami akan segera mengecek ketersediaan produkmu.</p>
        </div>

        {/* Success State */}
        {successOrderId ? (
          <div className="p-8 md:p-10 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-white mb-2">Permintaan Terkirim!</h4>
              <p className="text-zinc-400 text-sm md:text-base">
                Pesananmu telah masuk ke sistem kami. Kamu bisa memantau status pesanan kapan saja.
              </p>
            </div>
            
            <Link 
              href={`/track/${successOrderId}`}
              onClick={() => setIsOpen(false)}
              className="w-full bg-white text-black font-bold rounded-xl py-4 flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors"
            >
              Lacak Pesanan Saya <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
            {warningMsg && !errorMsg && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-200">{warningMsg}</p>
              </div>
            )}
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-400">{errorMsg}</p>
              </div>
            )}
          
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Nama Lengkap <span className="text-red-400">*</span></label>
              <input 
                type="text" 
                name="customerName"
                required
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-white/20 focus:border-zinc-500 outline-none transition-all" 
                placeholder="Misal: Budi Santoso" 
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">No. WhatsApp <span className="text-red-400">*</span></label>
              <input 
                type="tel" 
                name="whatsappNumber"
                required
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-white/20 focus:border-zinc-500 outline-none transition-all" 
                placeholder="08xxxxxxxxxx" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Brand & Detail (Size/Warna) <span className="text-red-400">*</span></label>
              <input 
                type="text" 
                name="brand"
                required
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-white/20 focus:border-zinc-500 outline-none transition-all" 
                placeholder="Contoh: Nike Air Force 1, Putih, Size 42" 
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Upload Foto Produk</label>
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-zinc-500 transition-all duration-200 cursor-pointer group ${isDragging ? 'border-emerald-500 bg-emerald-500/10 text-zinc-200' : 'border-zinc-700 hover:bg-zinc-800/50 hover:border-zinc-500'}`}
              >
                <Upload className={`w-5 h-5 mb-2 transition-colors ${isDragging ? 'text-emerald-400' : 'group-hover:text-white'}`} />
                <span className="text-sm group-hover:text-zinc-300 transition-colors text-center px-4">
                  {fileName ? fileName : 'Klik atau drag & drop gambar contoh produk'}
                </span>
                <span className="text-[11px] text-zinc-600 mt-1 text-center">
                  Opsional. JPG, PNG, atau WebP.
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Pilihan DP <span className="text-red-400">*</span></label>
              <select 
                name="dpPercentage"
                required
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-white/20 focus:border-zinc-500 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="">Pilih opsi pembayaran</option>
                <option value="50">DP 50% — Bayar setengah dulu</option>
                <option value="75">DP 75% — Lebih aman</option>
                <option value="100">Lunas 100% — Langsung proses</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-white text-black font-semibold rounded-xl py-3.5 mt-2 hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Kirim Permintaan
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

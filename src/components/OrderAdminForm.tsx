'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, Upload, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';


const STATUS_OPTIONS = [
  'PENDING',
  'CHECKING',
  'READY_TO_PAY',
  'PAID_DP',
  'PURCHASED',
  'SHIPPED',
  'COMPLETED'
];

const JASTIP_FEE = 25000;

export default function OrderAdminForm({ order }: { order: { id: string, status: string, storePrice: number | null, finalPrice: number | null, dpAmount: number | null, dpPercentage: number, receiptImage: string | null } }) {
  const router = useRouter();
  
  const [status, setStatus] = useState(order.status);
  const [storePrice, setStorePrice] = useState<string>(order.storePrice?.toString() || '');
  const [finalPrice, setFinalPrice] = useState<string>(order.finalPrice?.toString() || '');
  const [dpAmount, setDpAmount] = useState<string>(order.dpAmount?.toString() || '');
  
  const [isUploading, setIsUploading] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState(order.receiptImage || '');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const calculateFinalPrice = () => {
    const price = parseFloat(storePrice.toString());
    if (!isNaN(price)) {
      setFinalPrice((price + JASTIP_FEE).toString());
      setDpAmount(((price + JASTIP_FEE) * (order.dpPercentage / 100)).toString());
    }
  };

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    setIsUploading(true);
    const file = e.target.files[0];
    
    // Custom supabase upload just for this to receipt bucket
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `receipts/${fileName}`;

      const { error } = await supabase.storage
        .from('product-images') // Reusing product-images bucket as fallback if receipts bucket doesn't exist
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (error) throw error;

      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      setReceiptUrl(data.publicUrl);
      
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      alert('Upload failed: ' + message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setMessage('');
    
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          storePrice: storePrice ? parseFloat(storePrice) : null,
          finalPrice: finalPrice ? parseFloat(finalPrice) : null,
          dpAmount: dpAmount ? parseFloat(dpAmount) : null,
          receiptImage: receiptUrl || null
        }),
      });

      if (!res.ok) throw new Error('Gagal menyimpan');
      
      setMessage('Perubahan berhasil disimpan!');
      router.refresh();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Gagal menyimpan perubahan';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl mt-6">
      <div className="p-6 md:p-8 space-y-8">
        
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Status Pesanan</label>
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Pricing */}
        <div className="p-6 bg-zinc-800/50 border border-zinc-700 rounded-2xl space-y-4">
          <h3 className="font-bold text-lg mb-4">Kalkulator Harga</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Harga Toko (Rp)</label>
              <input 
                type="number" 
                value={storePrice}
                onChange={(e) => setStorePrice(e.target.value)}
                placeholder="Contoh: 1000000"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-emerald-500/50 outline-none"
              />
            </div>
            
            <div className="flex items-end">
              <button 
                onClick={calculateFinalPrice}
                type="button"
                className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-xl py-3 transition-colors border border-zinc-600"
              >
                Hitung + Jastip (25k) + DP
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-700 mt-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Harga Final (Rp)</label>
              <input 
                type="number" 
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value)}
                className="w-full bg-black/50 border border-emerald-500/30 rounded-xl px-4 py-3 text-emerald-400 font-bold focus:ring-2 focus:ring-emerald-500/50 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Tagihan DP {order.dpPercentage}% (Rp)</label>
              <input 
                type="number" 
                value={dpAmount}
                onChange={(e) => setDpAmount(e.target.value)}
                className="w-full bg-black/50 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Receipt Uploader */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Foto Struk Pembelian</label>
          {receiptUrl ? (
            <div className="space-y-3">
              <div className="relative w-full max-w-sm aspect-[4/3] rounded-xl overflow-hidden border border-zinc-700">
                <Image
                  src={receiptUrl}
                  alt="Struk"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
              <button 
                onClick={() => setReceiptUrl('')}
                className="text-red-400 text-sm hover:underline"
              >
                Hapus & Ganti Foto
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-zinc-700 hover:border-zinc-500 transition-colors rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer group">
              {isUploading ? (
                <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mb-2" />
              ) : (
                <Upload className="w-6 h-6 text-zinc-500 group-hover:text-zinc-300 mb-2 transition-colors" />
              )}
              <span className="text-zinc-400 text-sm">{isUploading ? 'Mengunggah...' : 'Upload Struk (.jpg, .png)'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleReceiptUpload} disabled={isUploading} />
            </label>
          )}
        </div>

      </div>
      
      <div className="bg-zinc-800/80 p-6 flex items-center justify-between border-t border-zinc-800">
        <div className="text-emerald-400 text-sm font-medium flex items-center gap-2">
          {message && <><CheckCircle2 className="w-4 h-4" /> {message}</>}
        </div>
        <button 
          onClick={handleSave}
          disabled={isSubmitting}
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 py-3 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}

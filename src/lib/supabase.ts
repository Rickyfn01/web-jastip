import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload file ke Supabase Storage
 * @param file - File yang akan diupload
 * @param bucket - Nama bucket (default: 'product-images')
 * @returns URL publik dari file yang diupload
 */
export async function uploadImage(
  file: File,
  bucket: string = 'product-images'
): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error.message);
    return null;
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Upload foto struk belanja (admin)
 * @param file - File struk
 * @returns URL publik struk
 */
export async function uploadReceipt(file: File): Promise<string | null> {
  return uploadImage(file, 'receipts');
}

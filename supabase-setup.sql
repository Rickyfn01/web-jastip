/**
 * JALANKAN SCRIPT INI DI SUPABASE SQL EDITOR
 * 
 * Buka: https://supabase.com/dashboard/project/blqfiqpsvxcafbxigfis/sql/new
 * Paste seluruh isi script ini, lalu klik "Run"
 */

-- 1. Buat bucket "product-images" (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Policy: Siapa saja bisa MELIHAT gambar (SELECT)
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- 3. Policy: Siapa saja bisa UPLOAD gambar (INSERT)  
CREATE POLICY "Allow public upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

-- 4. Policy: Siapa saja bisa UPDATE gambar
CREATE POLICY "Allow public update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images');

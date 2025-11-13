-- =====================================================
-- Tambah Kolom LILA Lahir ke Tabel Balita
-- =====================================================

-- Tambah kolom lila_lahir (LILA saat lahir)
ALTER TABLE balita 
ADD COLUMN IF NOT EXISTS lila_lahir DECIMAL(5,2);

-- Pastikan kolom pengukuran_ke ada di tabel pemeriksaan
ALTER TABLE pemeriksaan 
ADD COLUMN IF NOT EXISTS pengukuran_ke INTEGER;

-- Set default status_gizi di pemeriksaan agar tidak error
ALTER TABLE pemeriksaan 
ALTER COLUMN status_gizi SET DEFAULT 'Normal';

-- Verifikasi kolom balita
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'balita' 
  AND column_name IN ('lila_lahir', 'berat_lahir', 'tinggi_lahir');

-- Verifikasi kolom pemeriksaan
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'pemeriksaan' 
  AND column_name IN ('pengukuran_ke', 'status_gizi', 'usia_bulan');

-- Cek data balita
SELECT 
  id,
  nama,
  berat_lahir,
  tinggi_lahir,
  lila_lahir
FROM balita
ORDER BY created_at DESC
LIMIT 5;

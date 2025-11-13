-- =====================================================
-- FIX TABEL BALITA - Tambah Kolom yang Kurang
-- =====================================================

-- 1. Cek struktur tabel balita saat ini
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'balita'
ORDER BY ordinal_position;

-- 2. Tambah kolom kode_balita (format: YYYYMMDD-II-NNN)
ALTER TABLE balita 
ADD COLUMN IF NOT EXISTS kode_balita VARCHAR(20) UNIQUE;

-- 3. Tambah kolom lainnya yang mungkin kurang
ALTER TABLE balita 
ADD COLUMN IF NOT EXISTS nama_ibu VARCHAR(100),
ADD COLUMN IF NOT EXISTS nama_ayah VARCHAR(100),
ADD COLUMN IF NOT EXISTS desa_kelurahan VARCHAR(100),
ADD COLUMN IF NOT EXISTS posyandu VARCHAR(100),
ADD COLUMN IF NOT EXISTS lila_lahir DECIMAL(5,2);

-- 4. Update kolom yang mungkin masih pakai nama lama
-- (Jika ada nama_ortu, pecah jadi nama_ibu dan nama_ayah)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'balita' AND column_name = 'nama_ortu'
  ) THEN
    UPDATE balita
    SET 
      nama_ibu = SPLIT_PART(nama_ortu, '/', 1),
      nama_ayah = SPLIT_PART(nama_ortu, '/', 2)
    WHERE nama_ortu IS NOT NULL 
      AND (nama_ibu IS NULL OR nama_ayah IS NULL);
  END IF;
END $$;

-- 5. Generate kode_balita untuk data yang sudah ada (jika belum ada)
UPDATE balita
SET kode_balita = TO_CHAR(tanggal_lahir, 'YYYYMMDD') || '-' || 
                  UPPER(SUBSTRING(nama FROM 1 FOR 1)) || 
                  UPPER(SUBSTRING(nama FROM 2 FOR 1)) || '-' ||
                  LPAD(id::TEXT, 3, '0')
WHERE kode_balita IS NULL;

-- 6. Tambah index untuk performa
CREATE INDEX IF NOT EXISTS idx_balita_kode 
ON balita(kode_balita);

CREATE INDEX IF NOT EXISTS idx_balita_status_gizi 
ON balita(status_gizi);

CREATE INDEX IF NOT EXISTS idx_balita_tanggal_lahir 
ON balita(tanggal_lahir);

-- 7. Verifikasi hasil
SELECT 
  kode_balita,
  nama,
  jenis_kelamin,
  tanggal_lahir,
  nama_ibu,
  nama_ayah,
  desa_kelurahan,
  posyandu,
  status_gizi
FROM balita
ORDER BY created_at DESC
LIMIT 10;

-- 8. Cek apakah ada balita tanpa kode_balita
SELECT COUNT(*) as total_tanpa_kode
FROM balita
WHERE kode_balita IS NULL;

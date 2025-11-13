-- =====================================================
-- FIX TABEL PEMERIKSAAN - Tambah Kolom yang Kurang
-- =====================================================

-- STRUKTUR TABEL SAAT INI:
-- id, balita_id, tanggal, usia_bulan, berat_badan, tinggi_badan, 
-- lingkar_kepala, lingkar_lengan, status_gizi, catatan, created_at, updated_at

-- STEP 1: Tambah kolom pengukuran_ke
ALTER TABLE pemeriksaan 
ADD COLUMN IF NOT EXISTS pengukuran_ke INTEGER;

-- STEP 1.5: Set default value untuk kolom status_gizi (agar tidak error saat insert)
ALTER TABLE pemeriksaan 
ALTER COLUMN status_gizi SET DEFAULT 'Normal';

-- Jika ingin status_gizi boleh NULL, uncomment baris di bawah:
-- ALTER TABLE pemeriksaan ALTER COLUMN status_gizi DROP NOT NULL;

-- STEP 2: Update pengukuran_ke untuk data yang sudah ada
-- (hitung urutan berdasarkan tanggal per balita)
WITH ranked_pemeriksaan AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY balita_id 
      ORDER BY tanggal, created_at
    ) as row_num
  FROM pemeriksaan
)
UPDATE pemeriksaan p
SET pengukuran_ke = rp.row_num
FROM ranked_pemeriksaan rp
WHERE p.id = rp.id;

-- STEP 3: Set default untuk pengukuran_ke baru (auto increment per balita)
-- Buat function untuk auto set pengukuran_ke
CREATE OR REPLACE FUNCTION set_pengukuran_ke()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.pengukuran_ke IS NULL THEN
    SELECT COALESCE(MAX(pengukuran_ke), 0) + 1
    INTO NEW.pengukuran_ke
    FROM pemeriksaan
    WHERE balita_id = NEW.balita_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Buat trigger
DROP TRIGGER IF EXISTS trigger_set_pengukuran_ke ON pemeriksaan;
CREATE TRIGGER trigger_set_pengukuran_ke
  BEFORE INSERT ON pemeriksaan
  FOR EACH ROW
  EXECUTE FUNCTION set_pengukuran_ke();

-- STEP 4: Tambah index untuk performa
CREATE INDEX IF NOT EXISTS idx_pemeriksaan_balita 
ON pemeriksaan(balita_id);

CREATE INDEX IF NOT EXISTS idx_pemeriksaan_balita_tanggal 
ON pemeriksaan(balita_id, tanggal DESC);

-- STEP 5: Verifikasi hasil
SELECT 
  balita_id,
  pengukuran_ke,
  tanggal,
  usia_bulan,
  berat_badan,
  tinggi_badan,
  lingkar_lengan,
  status_gizi
FROM pemeriksaan
ORDER BY balita_id, pengukuran_ke
LIMIT 20;

-- STEP 6: Cek apakah ada pemeriksaan tanpa pengukuran_ke
SELECT COUNT(*) as total_tanpa_pengukuran_ke
FROM pemeriksaan
WHERE pengukuran_ke IS NULL;

-- =====================================================
-- SETUP LENGKAP DATABASE SIPEKAN POSYANDU
-- =====================================================
-- Jalankan file ini di Supabase SQL Editor jika ingin
-- membuat database dari awal atau memperbaiki struktur

-- =====================================================
-- 1. TABEL BALITA (Data Anak)
-- =====================================================
CREATE TABLE IF NOT EXISTS balita (
  id BIGSERIAL PRIMARY KEY,
  kode_balita VARCHAR(20) UNIQUE NOT NULL,
  nama VARCHAR(100) NOT NULL,
  jenis_kelamin VARCHAR(20) NOT NULL CHECK (jenis_kelamin IN ('Laki-laki', 'Perempuan')),
  tanggal_lahir DATE NOT NULL,
  nik VARCHAR(16),
  nama_ibu VARCHAR(100),
  nama_ayah VARCHAR(100),
  alamat TEXT,
  desa_kelurahan VARCHAR(100),
  posyandu VARCHAR(100),
  status_gizi VARCHAR(50) DEFAULT 'Normal' CHECK (status_gizi IN ('Normal', 'Resiko Stunting', 'Gizi Buruk', 'Gizi Kurang', 'Gizi Lebih')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_balita_kode ON balita(kode_balita);
CREATE INDEX IF NOT EXISTS idx_balita_nama ON balita(nama);
CREATE INDEX IF NOT EXISTS idx_balita_status_gizi ON balita(status_gizi);
CREATE INDEX IF NOT EXISTS idx_balita_tanggal_lahir ON balita(tanggal_lahir);

-- =====================================================
-- 2. TABEL PEMERIKSAAN (Riwayat Pengukuran)
-- =====================================================
CREATE TABLE IF NOT EXISTS pemeriksaan (
  id BIGSERIAL PRIMARY KEY,
  balita_id BIGINT NOT NULL REFERENCES balita(id) ON DELETE CASCADE,
  tanggal_pemeriksaan DATE NOT NULL,
  pengukuran_ke INTEGER NOT NULL,
  berat_badan DECIMAL(5,2) NOT NULL,
  tinggi_badan DECIMAL(5,2) NOT NULL,
  lingkar_lengan DECIMAL(5,2),
  catatan TEXT,
  pemeriksa VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_pemeriksaan_balita ON pemeriksaan(balita_id);
CREATE INDEX IF NOT EXISTS idx_pemeriksaan_balita_tanggal ON pemeriksaan(balita_id, tanggal_pemeriksaan DESC);
CREATE INDEX IF NOT EXISTS idx_pemeriksaan_tanggal ON pemeriksaan(tanggal_pemeriksaan);

-- =====================================================
-- 3. TABEL KEGIATAN (Jadwal Posyandu)
-- =====================================================
CREATE TABLE IF NOT EXISTS kegiatan (
  id BIGSERIAL PRIMARY KEY,
  judul VARCHAR(200) NOT NULL,
  tanggal DATE NOT NULL,
  waktu TIME,
  lokasi VARCHAR(200),
  deskripsi TEXT,
  status VARCHAR(50) DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Selesai', 'Dibatalkan')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_kegiatan_tanggal ON kegiatan(tanggal DESC);
CREATE INDEX IF NOT EXISTS idx_kegiatan_status ON kegiatan(status);

-- =====================================================
-- 4. TABEL BERITA (Artikel/Informasi)
-- =====================================================
CREATE TABLE IF NOT EXISTS berita (
  id BIGSERIAL PRIMARY KEY,
  judul VARCHAR(200) NOT NULL,
  konten TEXT NOT NULL,
  gambar_url TEXT,
  penulis VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published')),
  tanggal_publish TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_berita_status ON berita(status);
CREATE INDEX IF NOT EXISTS idx_berita_tanggal_publish ON berita(tanggal_publish DESC);

-- =====================================================
-- 5. FUNCTION: Auto Update pengukuran_ke
-- =====================================================
CREATE OR REPLACE FUNCTION set_pengukuran_ke()
RETURNS TRIGGER AS $$
BEGIN
  -- Hitung pengukuran_ke berdasarkan jumlah pemeriksaan balita ini
  IF NEW.pengukuran_ke IS NULL THEN
    SELECT COALESCE(MAX(pengukuran_ke), 0) + 1
    INTO NEW.pengukuran_ke
    FROM pemeriksaan
    WHERE balita_id = NEW.balita_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk auto set pengukuran_ke
DROP TRIGGER IF EXISTS trigger_set_pengukuran_ke ON pemeriksaan;
CREATE TRIGGER trigger_set_pengukuran_ke
  BEFORE INSERT ON pemeriksaan
  FOR EACH ROW
  EXECUTE FUNCTION set_pengukuran_ke();

-- =====================================================
-- 6. FUNCTION: Auto Update updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk semua tabel
DROP TRIGGER IF EXISTS trigger_balita_updated_at ON balita;
CREATE TRIGGER trigger_balita_updated_at
  BEFORE UPDATE ON balita
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_pemeriksaan_updated_at ON pemeriksaan;
CREATE TRIGGER trigger_pemeriksaan_updated_at
  BEFORE UPDATE ON pemeriksaan
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_kegiatan_updated_at ON kegiatan;
CREATE TRIGGER trigger_kegiatan_updated_at
  BEFORE UPDATE ON kegiatan
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_berita_updated_at ON berita;
CREATE TRIGGER trigger_berita_updated_at
  BEFORE UPDATE ON berita
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- 7. ROW LEVEL SECURITY (RLS)
-- =====================================================
-- Enable RLS pada semua tabel
ALTER TABLE balita ENABLE ROW LEVEL SECURITY;
ALTER TABLE pemeriksaan ENABLE ROW LEVEL SECURITY;
ALTER TABLE kegiatan ENABLE ROW LEVEL SECURITY;
ALTER TABLE berita ENABLE ROW LEVEL SECURITY;

-- Policy untuk public read (kegiatan & berita)
DROP POLICY IF EXISTS "Public can read kegiatan" ON kegiatan;
CREATE POLICY "Public can read kegiatan"
  ON kegiatan FOR SELECT
  USING (status = 'Aktif');

DROP POLICY IF EXISTS "Public can read berita" ON berita;
CREATE POLICY "Public can read berita"
  ON berita FOR SELECT
  USING (status = 'Published');

-- Policy untuk authenticated users (full access)
DROP POLICY IF EXISTS "Authenticated can do all on balita" ON balita;
CREATE POLICY "Authenticated can do all on balita"
  ON balita FOR ALL
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can do all on pemeriksaan" ON pemeriksaan;
CREATE POLICY "Authenticated can do all on pemeriksaan"
  ON pemeriksaan FOR ALL
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can do all on kegiatan" ON kegiatan;
CREATE POLICY "Authenticated can do all on kegiatan"
  ON kegiatan FOR ALL
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can do all on berita" ON berita;
CREATE POLICY "Authenticated can do all on berita"
  ON berita FOR ALL
  USING (auth.role() = 'authenticated');

-- =====================================================
-- 8. DATA SAMPLE (Optional - untuk testing)
-- =====================================================
-- Uncomment jika mau insert data sample

/*
-- Sample Balita
INSERT INTO balita (kode_balita, nama, jenis_kelamin, tanggal_lahir, nama_ibu, nama_ayah, desa_kelurahan, posyandu, status_gizi)
VALUES 
  ('20240115-AA-001', 'Ahmad Alfarizi', 'Laki-laki', '2024-01-15', 'Siti Aminah', 'Budi Santoso', 'Sleman', 'Posyandu Melati', 'Normal'),
  ('20240203-BB-002', 'Bella Bintang', 'Perempuan', '2024-02-03', 'Wulandari', 'Agus Prasetyo', 'Sleman', 'Posyandu Mawar', 'Normal'),
  ('20240312-CC-003', 'Cinta Cahaya', 'Perempuan', '2024-03-12', 'Rina Kusuma', 'Hendra Wijaya', 'Sleman', 'Posyandu Melati', 'Resiko Stunting')
ON CONFLICT (kode_balita) DO NOTHING;

-- Sample Pemeriksaan
INSERT INTO pemeriksaan (balita_id, tanggal_pemeriksaan, berat_badan, tinggi_badan, lingkar_lengan)
VALUES 
  (1, '2024-04-01', 8.5, 70.0, 13.5),
  (1, '2024-05-01', 8.8, 71.2, 13.7),
  (2, '2024-04-01', 7.8, 68.5, 13.0),
  (2, '2024-05-01', 8.1, 69.8, 13.2)
ON CONFLICT DO NOTHING;

-- Sample Kegiatan
INSERT INTO kegiatan (judul, tanggal, waktu, lokasi, deskripsi, status)
VALUES 
  ('Posyandu Bulan Januari', '2025-01-15', '08:00:00', 'Balai Desa', 'Pemeriksaan rutin bulanan', 'Selesai'),
  ('Posyandu Bulan Februari', '2025-02-15', '08:00:00', 'Balai Desa', 'Pemeriksaan rutin bulanan', 'Aktif')
ON CONFLICT DO NOTHING;
*/

-- =====================================================
-- 9. VERIFIKASI
-- =====================================================
-- Cek semua tabel
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
  AND table_name IN ('balita', 'pemeriksaan', 'kegiatan', 'berita')
ORDER BY table_name;

-- Cek struktur balita
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'balita'
ORDER BY ordinal_position;

-- Cek struktur pemeriksaan
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'pemeriksaan'
ORDER BY ordinal_position;

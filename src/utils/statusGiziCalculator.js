/**
 * ============================================
 * STATUS GIZI CALCULATOR
 * ============================================
 * 
 * Menghitung status gizi anak berdasarkan:
 * - BB/U (Berat Badan per Umur)
 * - TB/U (Tinggi Badan per Umur)
 * - LILA (Lingkar Lengan Atas)
 * 
 * Kriteria:
 * NORMAL: BB/U (-2 SD s/d +1 SD) DAN TB/U (≥ -2 SD) DAN LILA (≥ 12.5 cm)
 * RESIKO STUNTING: Salah satu tidak memenuhi kriteria normal
 * ============================================
 */

/**
 * Hitung Z-Score untuk BB/U (Berat Badan per Umur)
 * Menggunakan referensi WHO Growth Standards
 */
export const calculateBBU = (beratBadan, usiaBulan, jenisKelamin) => {
  // Simplified Z-score calculation
  // Dalam implementasi real, gunakan tabel WHO lengkap
  
  // Median berat badan berdasarkan usia dan jenis kelamin (contoh sederhana)
  const medianBB = jenisKelamin === 'Laki-laki' 
    ? 3.3 + (usiaBulan * 0.35) // Laki-laki
    : 3.2 + (usiaBulan * 0.33); // Perempuan
  
  const sd = 1.5; // Standar deviasi (simplified)
  
  const zScore = (beratBadan - medianBB) / sd;
  
  // BB/U Normal: -2 SD s/d +1 SD
  return zScore >= -2 && zScore <= 1;
};

/**
 * Hitung Z-Score untuk TB/U (Tinggi Badan per Umur)
 * Status Normal: ≥ -2 SD
 * Status Stunting: < -2 SD
 */
export const calculateTBU = (tinggiBadan, usiaBulan, jenisKelamin) => {
  // Simplified Z-score calculation
  // Dalam implementasi real, gunakan tabel WHO lengkap
  
  // Median tinggi badan berdasarkan usia dan jenis kelamin
  const medianTB = jenisKelamin === 'Laki-laki'
    ? 49.9 + (usiaBulan * 1.5) // Laki-laki
    : 49.1 + (usiaBulan * 1.45); // Perempuan
  
  const sd = 3.5; // Standar deviasi (simplified)
  
  const zScore = (tinggiBadan - medianTB) / sd;
  
  // TB/U Normal: ≥ -2 SD
  return zScore >= -2;
};

/**
 * Cek status LILA (Lingkar Lengan Atas)
 * Normal: ≥ 12.5 cm
 * Resiko: < 12.5 cm
 */
export const checkLILA = (lila) => {
  if (!lila || lila === 0) return true; // Jika tidak ada data, anggap normal
  return lila >= 12.5;
};

/**
 * Hitung status gizi anak berdasarkan semua parameter
 * @param {Object} data - Data anak (beratBadan, tinggiBadan, lila, usiaBulan, jenisKelamin)
 * @returns {String} - "Normal" atau "Resiko Stunting"
 */
export const calculateStatusGizi = (data) => {
  const { beratBadan, tinggiBadan, lila, usiaBulan, jenisKelamin } = data;
  
  // Validasi data
  if (!beratBadan || !tinggiBadan || !usiaBulan || !jenisKelamin) {
    return "Normal"; // Default jika data tidak lengkap
  }
  
  // Cek semua parameter
  const isBBUNormal = calculateBBU(beratBadan, usiaBulan, jenisKelamin);
  const isTBUNormal = calculateTBU(tinggiBadan, usiaBulan, jenisKelamin);
  const isLILANormal = checkLILA(lila);
  
  // Status NORMAL hanya jika SEMUA parameter normal
  if (isBBUNormal && isTBUNormal && isLILANormal) {
    return "Normal";
  }
  
  // Jika salah satu tidak memenuhi kriteria = Resiko Stunting
  return "Resiko Stunting";
};

/**
 * Hitung usia dalam bulan dari tanggal lahir
 */
export const calculateUsiaBulan = (tanggalLahir) => {
  const today = new Date();
  const birthDate = new Date(tanggalLahir);
  
  let months = (today.getFullYear() - birthDate.getFullYear()) * 12;
  months += today.getMonth() - birthDate.getMonth();
  
  // Adjust if birth day hasn't occurred this month
  if (today.getDate() < birthDate.getDate()) {
    months--;
  }
  
  return Math.max(0, months);
};

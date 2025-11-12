/**
 * Generate unique code for balita
 * Format: YYYYMMDD-II-NNN
 * Example: 20250113-AR-001 (Ari Ramadhan born on 2025-01-13)
 */

/**
 * Extract initials from full name
 * @param {string} nama - Full name of the child
 * @returns {string} - 2-letter initials (uppercase)
 */
const getInitials = (nama) => {
  if (!nama) return 'XX';
  
  const words = nama.trim().split(/\s+/);
  
  if (words.length === 1) {
    // Single name: take first 2 letters
    return words[0].substring(0, 2).toUpperCase();
  }
  
  // Multiple words: take first letter of first 2 words
  return (words[0][0] + words[1][0]).toUpperCase();
};

/**
 * Format date to YYYYMMDD
 * @param {string} tanggalLahir - Date in YYYY-MM-DD format
 * @returns {string} - Date in YYYYMMDD format
 */
const formatDateForCode = (tanggalLahir) => {
  if (!tanggalLahir) return '00000000';
  return tanggalLahir.replace(/-/g, '');
};

/**
 * Generate kode balita
 * @param {string} nama - Child's full name
 * @param {string} tanggalLahir - Date of birth (YYYY-MM-DD)
 * @param {number} sequenceNumber - Sequential number (1, 2, 3, ...)
 * @returns {string} - Generated code (e.g., "20250113-AR-001")
 */
export const generateKodeBalita = (nama, tanggalLahir, sequenceNumber = 1) => {
  const datePart = formatDateForCode(tanggalLahir);
  const initialsPart = getInitials(nama);
  const sequencePart = sequenceNumber.toString().padStart(3, '0');
  
  return `${datePart}-${initialsPart}-${sequencePart}`;
};

/**
 * Parse kode balita to extract information
 * @param {string} kode - Balita code
 * @returns {object} - { tanggal: '2025-01-13', inisial: 'AR', nomor: 1 }
 */
export const parseKodeBalita = (kode) => {
  if (!kode) return null;
  
  const parts = kode.split('-');
  if (parts.length !== 3) return null;
  
  const [datePart, initialsPart, sequencePart] = parts;
  
  return {
    tanggal: `${datePart.substring(0, 4)}-${datePart.substring(4, 6)}-${datePart.substring(6, 8)}`,
    inisial: initialsPart,
    nomor: parseInt(sequencePart, 10),
  };
};

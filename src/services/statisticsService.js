/**
 * ============================================
 * STATISTICS SERVICE
 * ============================================
 * 
 * Handle aggregation queries untuk dashboard statistics
 * 
 * Functions:
 * - getDashboardStats()
 * - getBalitaGrowthTrend(balitaId)
 * - getMonthlyStats(year)
 * - getStuntingDistribution()
 * 
 * ============================================
 */

import { supabase } from '../lib/supabaseClient';

/**
 * Get comprehensive dashboard statistics
 * @returns {Promise<{data, error}>}
 */
export const getDashboardStats = async () => {
  try {
    // Get balita count by status
    const { data: balitaData, error: balitaError } = await supabase
      .from('balita')
      .select('status_gizi');

    if (balitaError) {
      console.error('❌ Get balita stats error:', balitaError.message);
      return { data: null, error: balitaError };
    }

    // Count balita by status
    const totalBalita = balitaData.length;
    const stunting = balitaData.filter(b => b.status_gizi === 'stunting').length;
    const normal = balitaData.filter(b => b.status_gizi === 'normal').length;
    const giziBuruk = balitaData.filter(b => b.status_gizi === 'gizi buruk').length;
    const giziKurang = balitaData.filter(b => b.status_gizi === 'gizi kurang').length;
    const giziLebih = balitaData.filter(b => b.status_gizi === 'gizi lebih').length;

    // Get total pemeriksaan count
    const { count: totalPemeriksaan, error: pemeriksaanError } = await supabase
      .from('pemeriksaan')
      .select('*', { count: 'exact', head: true });

    if (pemeriksaanError) {
      console.error('❌ Get pemeriksaan count error:', pemeriksaanError.message);
    }

    // Get active kegiatan count
    const { count: kegiatanAktif, error: kegiatanError } = await supabase
      .from('kegiatan')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'aktif');

    if (kegiatanError) {
      console.error('❌ Get kegiatan count error:', kegiatanError.message);
    }

    // Get published berita count
    const { count: beritaPublished, error: beritaError } = await supabase
      .from('berita')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    if (beritaError) {
      console.error('❌ Get berita count error:', beritaError.message);
    }

    const stats = {
      totalBalita,
      stunting,
      normal,
      giziBuruk,
      giziKurang,
      giziLebih,
      totalPemeriksaan: totalPemeriksaan || 0,
      kegiatanAktif: kegiatanAktif || 0,
      beritaPublished: beritaPublished || 0,
      // Percentages
      stuntingPercentage: totalBalita > 0 ? ((stunting / totalBalita) * 100).toFixed(2) : 0,
      normalPercentage: totalBalita > 0 ? ((normal / totalBalita) * 100).toFixed(2) : 0,
      giziBurukPercentage: totalBalita > 0 ? ((giziBuruk / totalBalita) * 100).toFixed(2) : 0,
    };

    console.log('✅ Fetched dashboard statistics:', stats);
    return { data: stats, error: null };
  } catch (error) {
    console.error('❌ Get dashboard stats exception:', error);
    return { data: null, error };
  }
};

/**
 * Get balita growth trend (pemeriksaan history)
 * @param {string} balitaId - Balita ID
 * @returns {Promise<{data, error}>}
 */
export const getBalitaGrowthTrend = async (balitaId) => {
  try {
    const { data, error } = await supabase
      .from('pemeriksaan')
      .select('tanggal, berat_badan, tinggi_badan, lingkar_kepala')
      .eq('balita_id', balitaId)
      .order('tanggal', { ascending: true });

    if (error) {
      console.error('❌ Get growth trend error:', error.message);
      return { data: null, error };
    }

    console.log(`✅ Fetched ${data.length} growth trend data points for balita: ${balitaId}`);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Get growth trend exception:', error);
    return { data: null, error };
  }
};

/**
 * Get monthly statistics for a year
 * @param {number} year - Year (e.g., 2024)
 * @returns {Promise<{data, error}>}
 */
export const getMonthlyStats = async (year) => {
  try {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    // Get pemeriksaan per month
    const { data: pemeriksaanData, error: pemeriksaanError } = await supabase
      .from('pemeriksaan')
      .select('tanggal')
      .gte('tanggal', startDate)
      .lte('tanggal', endDate);

    if (pemeriksaanError) {
      console.error('❌ Get monthly pemeriksaan error:', pemeriksaanError.message);
      return { data: null, error: pemeriksaanError };
    }

    // Get kegiatan per month
    const { data: kegiatanData, error: kegiatanError } = await supabase
      .from('kegiatan')
      .select('tanggal')
      .gte('tanggal', startDate)
      .lte('tanggal', endDate);

    if (kegiatanError) {
      console.error('❌ Get monthly kegiatan error:', kegiatanError.message);
      return { data: null, error: kegiatanError };
    }

    // Group by month
    const monthlyPemeriksaan = Array(12).fill(0);
    const monthlyKegiatan = Array(12).fill(0);

    pemeriksaanData.forEach(p => {
      const month = new Date(p.tanggal).getMonth();
      monthlyPemeriksaan[month]++;
    });

    kegiatanData.forEach(k => {
      const month = new Date(k.tanggal).getMonth();
      monthlyKegiatan[month]++;
    });

    const monthlyStats = {
      year,
      months: [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ],
      pemeriksaan: monthlyPemeriksaan,
      kegiatan: monthlyKegiatan,
    };

    console.log(`✅ Fetched monthly statistics for year: ${year}`);
    return { data: monthlyStats, error: null };
  } catch (error) {
    console.error('❌ Get monthly stats exception:', error);
    return { data: null, error };
  }
};

/**
 * Get stunting distribution by age group
 * @returns {Promise<{data, error}>}
 */
export const getStuntingDistribution = async () => {
  try {
    const { data: balitaData, error } = await supabase
      .from('balita')
      .select('tanggal_lahir, status_gizi')
      .eq('status_gizi', 'stunting');

    if (error) {
      console.error('❌ Get stunting distribution error:', error.message);
      return { data: null, error };
    }

    // Calculate age in months and group
    const today = new Date();
    const ageGroups = {
      '0-6 bulan': 0,
      '7-12 bulan': 0,
      '13-24 bulan': 0,
      '25-36 bulan': 0,
      '37-60 bulan': 0,
    };

    balitaData.forEach(balita => {
      const birthDate = new Date(balita.tanggal_lahir);
      const ageInMonths = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24 * 30.44));

      if (ageInMonths <= 6) ageGroups['0-6 bulan']++;
      else if (ageInMonths <= 12) ageGroups['7-12 bulan']++;
      else if (ageInMonths <= 24) ageGroups['13-24 bulan']++;
      else if (ageInMonths <= 36) ageGroups['25-36 bulan']++;
      else if (ageInMonths <= 60) ageGroups['37-60 bulan']++;
    });

    console.log('✅ Fetched stunting distribution by age group');
    return { data: ageGroups, error: null };
  } catch (error) {
    console.error('❌ Get stunting distribution exception:', error);
    return { data: null, error };
  }
};

/**
 * Get recent activity summary
 * @param {number} days - Number of days to look back
 * @returns {Promise<{data, error}>}
 */
export const getRecentActivity = async (days = 7) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    // Get recent pemeriksaan
    const { data: recentPemeriksaan, error: pemeriksaanError } = await supabase
      .from('pemeriksaan')
      .select('id, tanggal')
      .gte('tanggal', startDateStr)
      .order('tanggal', { ascending: false });

    if (pemeriksaanError) {
      console.error('❌ Get recent pemeriksaan error:', pemeriksaanError.message);
    }

    // Get recent kegiatan
    const { data: recentKegiatan, error: kegiatanError } = await supabase
      .from('kegiatan')
      .select('id, tanggal, judul')
      .gte('created_at', startDateStr)
      .order('created_at', { ascending: false });

    if (kegiatanError) {
      console.error('❌ Get recent kegiatan error:', kegiatanError.message);
    }

    // Get recent berita
    const { data: recentBerita, error: beritaError } = await supabase
      .from('berita')
      .select('id, tanggal, judul')
      .gte('created_at', startDateStr)
      .order('created_at', { ascending: false });

    if (beritaError) {
      console.error('❌ Get recent berita error:', beritaError.message);
    }

    const activity = {
      recentPemeriksaan: recentPemeriksaan || [],
      recentKegiatan: recentKegiatan || [],
      recentBerita: recentBerita || [],
      summary: {
        totalPemeriksaan: recentPemeriksaan?.length || 0,
        totalKegiatan: recentKegiatan?.length || 0,
        totalBerita: recentBerita?.length || 0,
      },
    };

    console.log(`✅ Fetched recent activity for last ${days} days`);
    return { data: activity, error: null };
  } catch (error) {
    console.error('❌ Get recent activity exception:', error);
    return { data: null, error };
  }
};

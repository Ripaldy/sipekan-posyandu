/**
 * ============================================
 * KEGIATAN SERVICE
 * ============================================
 * 
 * Handle CRUD operations untuk data kegiatan posyandu
 * 
 * Functions:
 * - getAllKegiatan()
 * - getKegiatanById(id)
 * - createKegiatan(data)
 * - updateKegiatan(id, data)
 * - deleteKegiatan(id)
 * - getKegiatanByStatus(status)
 * - getUpcomingKegiatan()
 * 
 * ============================================
 */

import { supabase } from '../lib/supabaseClient';

/**
 * Get all kegiatan
 * @param {Object} options - Filter options
 * @returns {Promise<{data, error}>}
 */
export const getAllKegiatan = async (options = {}) => {
  try {
    let query = supabase
      .from('kegiatan')
      .select('*')
      .order('tanggal', { ascending: false });

    // Apply filters if provided
    if (options.status) {
      query = query.eq('status', options.status);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Get all kegiatan error:', error.message);
      return { data: null, error };
    }

    console.log(`✅ Fetched ${data.length} kegiatan records`);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Get all kegiatan exception:', error);
    return { data: null, error };
  }
};

/**
 * Get kegiatan by ID
 * @param {string} id - Kegiatan ID
 * @returns {Promise<{data, error}>}
 */
export const getKegiatanById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('kegiatan')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Get kegiatan by ID error:', error.message);
      return { data: null, error };
    }

    console.log('✅ Fetched kegiatan:', data.judul);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Get kegiatan by ID exception:', error);
    return { data: null, error };
  }
};

/**
 * Create new kegiatan
 * @param {Object} kegiatanData - Kegiatan data
 * @returns {Promise<{data, error}>}
 */
export const createKegiatan = async (kegiatanData) => {
  try {
    const { data, error } = await supabase
      .from('kegiatan')
      .insert([kegiatanData])
      .select()
      .single();

    if (error) {
      console.error('❌ Create kegiatan error:', error.message);
      return { data: null, error };
    }

    console.log('✅ Created kegiatan:', data.judul);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Create kegiatan exception:', error);
    return { data: null, error };
  }
};

/**
 * Update kegiatan
 * @param {string} id - Kegiatan ID
 * @param {Object} kegiatanData - Updated kegiatan data
 * @returns {Promise<{data, error}>}
 */
export const updateKegiatan = async (id, kegiatanData) => {
  try {
    const { data, error } = await supabase
      .from('kegiatan')
      .update(kegiatanData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Update kegiatan error:', error.message);
      return { data: null, error };
    }

    console.log('✅ Updated kegiatan:', data.judul);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Update kegiatan exception:', error);
    return { data: null, error };
  }
};

/**
 * Delete kegiatan
 * @param {string} id - Kegiatan ID
 * @returns {Promise<{error}>}
 */
export const deleteKegiatan = async (id) => {
  try {
    const { error } = await supabase
      .from('kegiatan')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Delete kegiatan error:', error.message);
      return { error };
    }

    console.log('✅ Deleted kegiatan ID:', id);
    return { error: null };
  } catch (error) {
    console.error('❌ Delete kegiatan exception:', error);
    return { error };
  }
};

/**
 * Get kegiatan by status
 * @param {string} status - Status (aktif, selesai, dibatalkan)
 * @returns {Promise<{data, error}>}
 */
export const getKegiatanByStatus = async (status) => {
  try {
    const { data, error } = await supabase
      .from('kegiatan')
      .select('*')
      .eq('status', status)
      .order('tanggal', { ascending: false });

    if (error) {
      console.error('❌ Get kegiatan by status error:', error.message);
      return { data: null, error };
    }

    console.log(`✅ Fetched ${data.length} kegiatan with status: ${status}`);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Get kegiatan by status exception:', error);
    return { data: null, error };
  }
};

/**
 * Get upcoming kegiatan (future dates with status aktif)
 * @param {number} limit - Limit results
 * @returns {Promise<{data, error}>}
 */
export const getUpcomingKegiatan = async (limit = 5) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('kegiatan')
      .select('*')
      .eq('status', 'aktif')
      .gte('tanggal', today)
      .order('tanggal', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('❌ Get upcoming kegiatan error:', error.message);
      return { data: null, error };
    }

    console.log(`✅ Fetched ${data.length} upcoming kegiatan`);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Get upcoming kegiatan exception:', error);
    return { data: null, error };
  }
};

/**
 * Search kegiatan by title
 * @param {string} query - Search query
 * @returns {Promise<{data, error}>}
 */
export const searchKegiatan = async (query) => {
  try {
    const { data, error } = await supabase
      .from('kegiatan')
      .select('*')
      .ilike('judul', `%${query}%`)
      .order('tanggal', { ascending: false });

    if (error) {
      console.error('❌ Search kegiatan error:', error.message);
      return { data: null, error };
    }

    console.log(`✅ Search found ${data.length} results for: "${query}"`);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Search kegiatan exception:', error);
    return { data: null, error };
  }
};

/**
 * ============================================
 * BERITA SERVICE
 * ============================================
 * 
 * Handle CRUD operations untuk data berita/artikel
 * 
 * Functions:
 * - getAllBerita()
 * - getBeritaById(id)
 * - createBerita(data)
 * - updateBerita(id, data)
 * - deleteBerita(id)
 * - getBeritaByStatus(status)
 * - getLatestBerita(limit)
 * 
 * ============================================
 */

import { supabase } from '../lib/supabaseClient';

/**
 * Get all berita
 * @param {Object} options - Filter options
 * @returns {Promise<{data, error}>}
 */
export const getAllBerita = async (options = {}) => {
  try {
    let query = supabase
      .from('berita')
      .select('*')
      .order('tanggal', { ascending: false });

    // Apply filters if provided
    if (options.status) {
      query = query.eq('status', options.status);
    }

    if (options.kategori) {
      query = query.eq('kategori', options.kategori);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Get all berita error:', error.message);
      return { data: null, error };
    }

    console.log(`✅ Fetched ${data.length} berita records`);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Get all berita exception:', error);
    return { data: null, error };
  }
};

/**
 * Get berita by ID
 * @param {string} id - Berita ID
 * @returns {Promise<{data, error}>}
 */
export const getBeritaById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('berita')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Get berita by ID error:', error.message);
      return { data: null, error };
    }

    console.log('✅ Fetched berita:', data.judul);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Get berita by ID exception:', error);
    return { data: null, error };
  }
};

/**
 * Create new berita
 * @param {Object} beritaData - Berita data
 * @returns {Promise<{data, error}>}
 */
export const createBerita = async (beritaData) => {
  try {
    const { data, error } = await supabase
      .from('berita')
      .insert([beritaData])
      .select()
      .single();

    if (error) {
      console.error('❌ Create berita error:', error.message);
      return { data: null, error };
    }

    console.log('✅ Created berita:', data.judul);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Create berita exception:', error);
    return { data: null, error };
  }
};

/**
 * Update berita
 * @param {string} id - Berita ID
 * @param {Object} beritaData - Updated berita data
 * @returns {Promise<{data, error}>}
 */
export const updateBerita = async (id, beritaData) => {
  try {
    const { data, error } = await supabase
      .from('berita')
      .update(beritaData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Update berita error:', error.message);
      return { data: null, error };
    }

    console.log('✅ Updated berita:', data.judul);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Update berita exception:', error);
    return { data: null, error };
  }
};

/**
 * Delete berita
 * @param {string} id - Berita ID
 * @returns {Promise<{error}>}
 */
export const deleteBerita = async (id) => {
  try {
    const { error } = await supabase
      .from('berita')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Delete berita error:', error.message);
      return { error };
    }

    console.log('✅ Deleted berita ID:', id);
    return { error: null };
  } catch (error) {
    console.error('❌ Delete berita exception:', error);
    return { error };
  }
};

/**
 * Get berita by status
 * @param {string} status - Status (draft, published, archived)
 * @returns {Promise<{data, error}>}
 */
export const getBeritaByStatus = async (status) => {
  try {
    const { data, error } = await supabase
      .from('berita')
      .select('*')
      .eq('status', status)
      .order('tanggal', { ascending: false });

    if (error) {
      console.error('❌ Get berita by status error:', error.message);
      return { data: null, error };
    }

    console.log(`✅ Fetched ${data.length} berita with status: ${status}`);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Get berita by status exception:', error);
    return { data: null, error };
  }
};

/**
 * Get latest published berita
 * @param {number} limit - Limit results
 * @returns {Promise<{data, error}>}
 */
export const getLatestBerita = async (limit = 5) => {
  try {
    const { data, error } = await supabase
      .from('berita')
      .select('*')
      .eq('status', 'published')
      .order('tanggal', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('❌ Get latest berita error:', error.message);
      return { data: null, error };
    }

    console.log(`✅ Fetched ${data.length} latest berita`);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Get latest berita exception:', error);
    return { data: null, error };
  }
};

/**
 * Search berita by title or content
 * @param {string} query - Search query
 * @returns {Promise<{data, error}>}
 */
export const searchBerita = async (query) => {
  try {
    const { data, error } = await supabase
      .from('berita')
      .select('*')
      .or(`judul.ilike.%${query}%,isi.ilike.%${query}%`)
      .eq('status', 'published')
      .order('tanggal', { ascending: false });

    if (error) {
      console.error('❌ Search berita error:', error.message);
      return { data: null, error };
    }

    console.log(`✅ Search found ${data.length} results for: "${query}"`);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Search berita exception:', error);
    return { data: null, error };
  }
};

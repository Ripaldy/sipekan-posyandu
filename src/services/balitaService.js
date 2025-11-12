/**
 * ============================================
 * BALITA SERVICE
 * ============================================
 * 
 * Handle CRUD operations untuk data balita
 * 
 * Functions:
 * - getAllBalita()
 * - getBalitaById(id)
 * - createBalita(data)
 * - updateBalita(id, data)
 * - deleteBalita(id)
 * - searchBalita(query)
 * - getBalitaByStatus(status)
 * 
 * ============================================
 */

import { supabase } from '../lib/supabaseClient';
import { generateKodeBalita } from '../utils/kodeBalitaGenerator';

/**
 * Get all balita with optional filtering
 * @param {Object} options - Filter options
 * @returns {Promise<{data, error}>}
 */
export const getAllBalita = async (options = {}) => {
  try {
    let query = supabase
      .from('balita')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters if provided
    if (options.status_gizi) {
      query = query.eq('status_gizi', options.status_gizi);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Get all balita error:', error.message);
      return { data: null, error };
    }

    console.log(`✅ Fetched ${data.length} balita records`);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Get all balita exception:', error);
    return { data: null, error };
  }
};

/**
 * Get balita by ID
 * @param {string} id - Balita ID
 * @returns {Promise<{data, error}>}
 */
export const getBalitaById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('balita')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Get balita by ID error:', error.message);
      return { data: null, error };
    }

    console.log('✅ Fetched balita:', data.nama);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Get balita by ID exception:', error);
    return { data: null, error };
  }
};

/**
 * Create new balita with auto-generated kode_balita
 * @param {Object} balitaData - Balita data
 * @returns {Promise<{data, error}>}
 */
export const createBalita = async (balitaData) => {
  try {
    // Step 1: Count existing balita with same birth date to get sequence number
    const { count, error: countError } = await supabase
      .from('balita')
      .select('*', { count: 'exact', head: true })
      .eq('tanggal_lahir', balitaData.tanggal_lahir);

    if (countError) {
      console.error('❌ Count balita error:', countError.message);
    }

    // Step 2: Generate kode_balita
    const sequenceNumber = (count || 0) + 1;
    const kodeBalita = generateKodeBalita(
      balitaData.nama,
      balitaData.tanggal_lahir,
      sequenceNumber
    );

    // Step 3: Add kode_balita to data
    const dataWithKode = {
      ...balitaData,
      kode_balita: kodeBalita,
    };

    // Step 4: Insert to database
    const { data, error } = await supabase
      .from('balita')
      .insert([dataWithKode])
      .select()
      .single();

    if (error) {
      console.error('❌ Create balita error:', error.message);
      return { data: null, error };
    }

    console.log('✅ Created balita:', data.nama, 'with kode:', data.kode_balita);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Create balita exception:', error);
    return { data: null, error };
  }
};

/**
 * Update balita
 * @param {string} id - Balita ID
 * @param {Object} balitaData - Updated balita data
 * @returns {Promise<{data, error}>}
 */
export const updateBalita = async (id, balitaData) => {
  try {
    const { data, error } = await supabase
      .from('balita')
      .update(balitaData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Update balita error:', error.message);
      return { data: null, error };
    }

    console.log('✅ Updated balita:', data.nama);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Update balita exception:', error);
    return { data: null, error };
  }
};

/**
 * Delete balita
 * @param {string} id - Balita ID
 * @returns {Promise<{error}>}
 */
export const deleteBalita = async (id) => {
  try {
    const { error } = await supabase
      .from('balita')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Delete balita error:', error.message);
      return { error };
    }

    console.log('✅ Deleted balita ID:', id);
    return { error: null };
  } catch (error) {
    console.error('❌ Delete balita exception:', error);
    return { error };
  }
};

/**
 * Search balita by name or kode_balita
 * @param {string} query - Search query
 * @returns {Promise<{data, error}>}
 */
export const searchBalita = async (query) => {
  try {
    const { data, error } = await supabase
      .from('balita')
      .select('*')
      .or(`nama.ilike.%${query}%,kode_balita.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Search balita error:', error.message);
      return { data: null, error };
    }

    console.log(`✅ Search found ${data.length} results for: "${query}"`);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Search balita exception:', error);
    return { data: null, error };
  }
};

/**
 * Get balita by status gizi
 * @param {string} status - Status gizi (normal, stunting, gizi kurang, dll)
 * @returns {Promise<{data, error}>}
 */
export const getBalitaByStatus = async (status) => {
  try {
    const { data, error } = await supabase
      .from('balita')
      .select('*')
      .eq('status_gizi', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Get balita by status error:', error.message);
      return { data: null, error };
    }

    console.log(`✅ Fetched ${data.length} balita with status: ${status}`);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Get balita by status exception:', error);
    return { data: null, error };
  }
};

/**
 * Get balita count by status
 * @returns {Promise<{data, error}>}
 */
export const getBalitaCountByStatus = async () => {
  try {
    const { data, error } = await supabase
      .from('balita')
      .select('status_gizi');

    if (error) {
      console.error('❌ Get balita count error:', error.message);
      return { data: null, error };
    }

    // Count by status
    const counts = data.reduce((acc, item) => {
      acc[item.status_gizi] = (acc[item.status_gizi] || 0) + 1;
      return acc;
    }, {});

    console.log('✅ Balita count by status:', counts);
    return { data: counts, error: null };
  } catch (error) {
    console.error('❌ Get balita count exception:', error);
    return { data: null, error };
  }
};

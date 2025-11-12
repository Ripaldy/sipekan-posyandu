/**
 * ============================================
 * PEMERIKSAAN SERVICE
 * ============================================
 * 
 * Handle CRUD operations untuk data pemeriksaan balita
 * 
 * Functions:
 * - getPemeriksaanByBalitaId(balitaId)
 * - createPemeriksaan(data)
 * - updatePemeriksaan(id, data)
 * - deletePemeriksaan(id)
 * - getLatestPemeriksaan(balitaId)
 * 
 * ============================================
 */

import { supabase } from '../lib/supabaseClient';

/**
 * Get all pemeriksaan for a specific balita
 * @param {string} balitaId - Balita ID
 * @returns {Promise<{data, error}>}
 */
export const getPemeriksaanByBalitaId = async (balitaId) => {
  try {
    const { data, error } = await supabase
      .from('pemeriksaan')
      .select('*')
      .eq('balita_id', balitaId)
      .order('tanggal', { ascending: false });

    if (error) {
      console.error('❌ Get pemeriksaan error:', error.message);
      return { data: null, error };
    }

    console.log(`✅ Fetched ${data.length} pemeriksaan records for balita: ${balitaId}`);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Get pemeriksaan exception:', error);
    return { data: null, error };
  }
};

/**
 * Get latest pemeriksaan for a balita
 * @param {string} balitaId - Balita ID
 * @returns {Promise<{data, error}>}
 */
export const getLatestPemeriksaan = async (balitaId) => {
  try {
    const { data, error } = await supabase
      .from('pemeriksaan')
      .select('*')
      .eq('balita_id', balitaId)
      .order('tanggal', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('❌ Get latest pemeriksaan error:', error.message);
      return { data: null, error };
    }

    console.log('✅ Fetched latest pemeriksaan for balita:', balitaId);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Get latest pemeriksaan exception:', error);
    return { data: null, error };
  }
};

/**
 * Create new pemeriksaan
 * @param {Object} pemeriksaanData - Pemeriksaan data
 * @returns {Promise<{data, error}>}
 */
export const createPemeriksaan = async (pemeriksaanData) => {
  try {
    const { data, error } = await supabase
      .from('pemeriksaan')
      .insert([pemeriksaanData])
      .select()
      .single();

    if (error) {
      console.error('❌ Create pemeriksaan error:', error.message);
      return { data: null, error };
    }

    console.log('✅ Created pemeriksaan for balita:', pemeriksaanData.balita_id);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Create pemeriksaan exception:', error);
    return { data: null, error };
  }
};

/**
 * Update pemeriksaan
 * @param {string} id - Pemeriksaan ID
 * @param {Object} pemeriksaanData - Updated pemeriksaan data
 * @returns {Promise<{data, error}>}
 */
export const updatePemeriksaan = async (id, pemeriksaanData) => {
  try {
    const { data, error } = await supabase
      .from('pemeriksaan')
      .update(pemeriksaanData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Update pemeriksaan error:', error.message);
      return { data: null, error };
    }

    console.log('✅ Updated pemeriksaan ID:', id);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Update pemeriksaan exception:', error);
    return { data: null, error };
  }
};

/**
 * Delete pemeriksaan
 * @param {string} id - Pemeriksaan ID
 * @returns {Promise<{error}>}
 */
export const deletePemeriksaan = async (id) => {
  try {
    const { error } = await supabase
      .from('pemeriksaan')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Delete pemeriksaan error:', error.message);
      return { error };
    }

    console.log('✅ Deleted pemeriksaan ID:', id);
    return { error: null };
  } catch (error) {
    console.error('❌ Delete pemeriksaan exception:', error);
    return { error };
  }
};

/**
 * Get pemeriksaan with balita data (JOIN)
 * @param {string} balitaId - Balita ID
 * @returns {Promise<{data, error}>}
 */
export const getPemeriksaanWithBalita = async (balitaId) => {
  try {
    const { data, error } = await supabase
      .from('pemeriksaan')
      .select(`
        *,
        balita (
          id,
          nama,
          nik,
          tanggal_lahir,
          jenis_kelamin
        )
      `)
      .eq('balita_id', balitaId)
      .order('tanggal', { ascending: false });

    if (error) {
      console.error('❌ Get pemeriksaan with balita error:', error.message);
      return { data: null, error };
    }

    console.log(`✅ Fetched ${data.length} pemeriksaan with balita data`);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Get pemeriksaan with balita exception:', error);
    return { data: null, error };
  }
};

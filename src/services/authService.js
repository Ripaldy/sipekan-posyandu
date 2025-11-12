/**
 * ============================================
 * AUTHENTICATION SERVICE
 * ============================================
 * 
 * Handle semua operasi authentication menggunakan Supabase Auth
 * 
 * Functions:
 * - login(email, password)
 * - logout()
 * - getCurrentUser()
 * - getSession()
 * - checkSession()
 * 
 * ============================================
 */

import { supabase } from '../lib/supabaseClient';

/**
 * Login dengan email dan password
 * @param {string} email - Email user
 * @param {string} password - Password user
 * @returns {Promise<{user, session, error}>}
 */
export const login = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Login error:', error.message);
      return { user: null, session: null, error };
    }

    console.log('✅ Login successful:', data.user.email);
    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    console.error('❌ Login exception:', error.message);
    return { user: null, session: null, error };
  }
};

/**
 * Logout user
 * @returns {Promise<{error}>}
 */
export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('❌ Logout error:', error.message);
      return { error };
    }

    console.log('✅ Logout successful');
    return { error: null };
  } catch (error) {
    console.error('❌ Logout exception:', error.message);
    return { error };
  }
};

/**
 * Get current logged in user
 * @returns {Promise<{user, error}>}
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('❌ Get user error:', error.message);
      return { user: null, error };
    }

    return { user, error: null };
  } catch (error) {
    console.error('❌ Get user exception:', error.message);
    return { user: null, error };
  }
};

/**
 * Get current session
 * @returns {Promise<{session, error}>}
 */
export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('❌ Get session error:', error.message);
      return { session: null, error };
    }

    return { session, error: null };
  } catch (error) {
    console.error('❌ Get session exception:', error.message);
    return { session: null, error };
  }
};

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>}
 */
export const checkSession = async () => {
  try {
    const { session } = await getSession();
    return !!session;
  } catch (error) {
    console.error('❌ Check session exception:', error.message);
    return false;
  }
};

/**
 * Subscribe to auth state changes
 * @param {Function} callback - Callback function yang dipanggil saat auth state berubah
 * @returns {Object} Subscription object dengan unsubscribe method
 */
export const onAuthStateChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      console.log('🔄 Auth state changed:', event);
      callback(event, session);
    }
  );

  return subscription;
};

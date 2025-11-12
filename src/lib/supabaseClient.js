/**
 * ============================================
 * SUPABASE CLIENT CONFIGURATION
 * ============================================
 * 
 * Initialize Supabase client untuk digunakan di seluruh aplikasi
 * Menggunakan environment variables dari .env file
 * 
 * Usage:
 * import { supabase } from '@/lib/supabaseClient'
 * 
 * const { data, error } = await supabase
 *   .from('table_name')
 *   .select('*')
 * 
 * ============================================
 */

import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials missing!');
  console.error('Please check your .env file and make sure you have:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- VITE_SUPABASE_ANON_KEY');
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persist auth session in localStorage
    persistSession: true,
    // Auto refresh token before expiry
    autoRefreshToken: true,
    // Detect session from URL (for email confirmations, password resets, etc)
    detectSessionInUrl: true,
    // Storage key for auth session
    storageKey: 'sipekan-auth-token',
  },
});

// Helper function to check if Supabase is configured correctly
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('balita').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Supabase connection error:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connected successfully!');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    return false;
  }
};

// Export for debugging purposes (remove in production)
if (import.meta.env.DEV) {
  console.log('🔧 Supabase Client initialized');
  console.log('📍 URL:', supabaseUrl);
  console.log('🔑 Key:', supabaseAnonKey ? '✓ Set' : '✗ Missing');
}

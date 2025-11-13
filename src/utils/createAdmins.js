/**
 * ============================================
 * CREATE ADMIN ACCOUNTS
 * ============================================
 * 
 * Script untuk membuat akun admin baru di Supabase
 * Jalankan sekali saja untuk membuat akun
 * 
 * ============================================
 */

import { supabase } from '../lib/supabaseClient';

// List 5 admin baru
const newAdmins = [
  {
    email: 'admin1@sipekan.com',
    password: 'sipekan2024#Admin',
    role: 'admin'
  },
  {
    email: 'admin2@sipekan.com',
    password: 'sipekanSecure@456',
    role: 'admin'
  },
  {
    email: 'admin3@sipekan.com',
    password: 'sipekan!Posyandu99',
    role: 'admin'
  },
  {
    email: 'admin4@sipekan.com',
    password: 'sipekanDash#789',
    role: 'admin'
  },
  {
    email: 'admin5@sipekan.com',
    password: 'sipekan@Manager321',
    role: 'admin'
  }
];

/**
 * Register admin account
 */
const registerAdmin = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'admin'
        }
      }
    });

    if (error) {
      console.error(`❌ Failed to register ${email}:`, error.message);
      return { success: false, email, error: error.message };
    }

    console.log(`✅ Successfully registered: ${email}`);
    return { success: true, email, user: data.user };
  } catch (error) {
    console.error(`❌ Exception registering ${email}:`, error.message);
    return { success: false, email, error: error.message };
  }
};

/**
 * Create all admin accounts
 */
export const createAllAdmins = async () => {
  console.log('🔄 Starting admin account creation...\n');
  
  const results = [];
  
  for (const admin of newAdmins) {
    const result = await registerAdmin(admin.email, admin.password);
    results.push({
      ...result,
      password: admin.password
    });
    
    // Delay untuk menghindari rate limit
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n📊 Registration Summary:');
  console.log('========================\n');
  
  results.forEach((result, index) => {
    if (result.success) {
      console.log(`✅ Admin ${index + 1}:`);
      console.log(`   Email: ${result.email}`);
      console.log(`   Password: ${result.password}`);
      console.log('');
    } else {
      console.log(`❌ Admin ${index + 1} FAILED:`);
      console.log(`   Email: ${result.email}`);
      console.log(`   Error: ${result.error}`);
      console.log('');
    }
  });
  
  const successCount = results.filter(r => r.success).length;
  console.log(`\n🎉 Total: ${successCount}/${newAdmins.length} accounts created successfully`);
  
  return results;
};

// Export admin list untuk referensi
export const adminList = newAdmins;

// Uncomment baris di bawah dan jalankan file ini untuk create admins
// createAllAdmins();

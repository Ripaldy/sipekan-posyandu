/**
 * ============================================
 * AUTHENTICATION CONTEXT
 * ============================================
 * 
 * Global state management untuk authentication
 * Menyediakan user data, session, dan auth functions ke seluruh aplikasi
 * 
 * Usage:
 * import { useAuth } from '@/contexts/AuthContext'
 * 
 * const { user, session, login, logout, loading } = useAuth()
 * 
 * ============================================
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check session saat pertama kali load
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        setLoading(true);
        const { session, error } = await authService.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error('Session check error:', error.message);
          setSession(null);
          setUser(null);
        } else if (session) {
          setSession(session);
          setUser(session.user);
          console.log('✅ Session restored:', session.user.email);
        }
      } catch (error) {
        console.error('Session check exception:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    // Subscribe to auth changes
    const { data: subscription } = authService.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      console.log('Auth event:', event);
      
      if (event === 'SIGNED_IN' && session) {
        setSession(session);
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        navigate('/login-admin');
      } else if (event === 'INITIAL_SESSION' && session) {
        setSession(session);
        setUser(session.user);
      }
    });

    // Cleanup
    return () => {
      mounted = false;
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, [navigate]);

  /**
   * Login function
   */
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { user, session, error } = await authService.login(email, password);

      if (error) {
        return { success: false, error };
      }

      setUser(user);
      setSession(session);
      
      console.log('✅ Login successful in context');
      return { success: true, error: null };
    } catch (error) {
      console.error('Login error in context:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout function
   */
  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await authService.logout();

      if (error) {
        console.error('Logout error:', error.message);
        return { success: false, error };
      }

      setUser(null);
      setSession(null);
      
      console.log('✅ Logout successful in context');
      navigate('/login-admin');
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Logout error in context:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = () => {
    return !!user && !!session;
  };

  const value = {
    user,
    session,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

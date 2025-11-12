/**
 * ============================================
 * PROTECTED ROUTE COMPONENT
 * ============================================
 * 
 * Component untuk protect route yang membutuhkan authentication
 * Redirect ke /login-admin jika user belum login
 * 
 * Usage:
 * <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>} />
 * 
 * ============================================
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '16px',
        background: '#f5f5f5'
      }}>
        <div className="spinner" style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #4caf50',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#666', fontSize: '14px' }}>Checking authentication...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log('🚫 Unauthorized access attempt to:', location.pathname);
    return <Navigate to="/login-admin" state={{ from: location }} replace />;
  }

  // User is authenticated, render protected content
  console.log('✅ Authenticated access to:', location.pathname);
  return children;
};

export default ProtectedRoute;

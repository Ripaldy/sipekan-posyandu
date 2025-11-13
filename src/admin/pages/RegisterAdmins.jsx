import React, { useState } from 'react';
import { createAllAdmins, adminList } from '../../utils/createAdmins';
import '../../styles/admin/RegisterAdmins.css';

const RegisterAdmins = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleCreateAdmins = async () => {
    setIsLoading(true);
    setIsComplete(false);
    
    try {
      const registrationResults = await createAllAdmins();
      setResults(registrationResults);
      setIsComplete(true);
    } catch (error) {
      console.error('Error creating admins:', error);
      alert('Terjadi kesalahan saat membuat akun admin');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-admins-container">
      <div className="register-card">
        <h1>🔐 Buat 5 Akun Admin Baru</h1>
        <p className="subtitle">Klik tombol di bawah untuk mendaftarkan 5 admin baru ke Supabase</p>

        {!isComplete ? (
          <div className="action-section">
            <button 
              onClick={handleCreateAdmins} 
              disabled={isLoading}
              className="btn-create"
            >
              {isLoading ? '⏳ Sedang Membuat Akun...' : '🚀 Buat Semua Akun Admin'}
            </button>
            
            <div className="admin-preview">
              <h3>📋 Akun yang akan dibuat:</h3>
              <ul>
                {adminList.map((admin, index) => (
                  <li key={index}>
                    <strong>Admin {index + 1}:</strong> {admin.email}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="results-section">
            <h2>✅ Proses Selesai!</h2>
            
            <div className="results-summary">
              <p className="success-count">
                Berhasil: {results.filter(r => r.success).length} / {results.length} akun
              </p>
            </div>

            <div className="results-list">
              {results.map((result, index) => (
                <div 
                  key={index} 
                  className={`result-item ${result.success ? 'success' : 'error'}`}
                >
                  <div className="result-header">
                    <span className="result-icon">
                      {result.success ? '✅' : '❌'}
                    </span>
                    <span className="result-email">{result.email}</span>
                  </div>
                  
                  {result.success ? (
                    <div className="result-details">
                      <p><strong>Password:</strong> <code>{result.password}</code></p>
                      <p className="success-msg">Akun berhasil dibuat!</p>
                    </div>
                  ) : (
                    <div className="result-details">
                      <p className="error-msg">Error: {result.error}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="credentials-box">
              <h3>📝 Copy Credentials:</h3>
              <textarea 
                readOnly 
                value={results.filter(r => r.success).map((r, i) => 
                  `Admin ${i + 1}:\nEmail: ${r.email}\nPassword: ${r.password}\n`
                ).join('\n')}
                rows={15}
                className="credentials-textarea"
              />
              <button 
                onClick={() => {
                  const text = results.filter(r => r.success).map((r, i) => 
                    `Admin ${i + 1}:\nEmail: ${r.email}\nPassword: ${r.password}\n`
                  ).join('\n');
                  navigator.clipboard.writeText(text);
                  alert('✅ Credentials berhasil dicopy ke clipboard!');
                }}
                className="btn-copy"
              >
                📋 Copy ke Clipboard
              </button>
            </div>

            <p className="warning-text">
              ⚠️ <strong>Penting:</strong> Simpan credentials ini dengan aman! 
              Halaman ini hanya untuk one-time setup.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterAdmins;

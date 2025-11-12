import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/LoginAdmin.css";
import logo from "../assets/logo.png";
import { ArrowLeft, Lock, User, CheckCircle, AlertCircle } from "lucide-react";

const LoginAdmin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState("initial");
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setToastMessage({ message: "", type: "" });
    setLoginStatus("initial");
    setIsLoading(true);

    setTimeout(() => {
      if (username === "admin" && password === "password123") {
        setToastMessage({
          message: "Login Berhasil! Mengalihkan...",
          type: "success",
        });
        setLoginStatus("success");

        setTimeout(() => {
          navigate("/admin");
        }, 2000);
      } else {
        setToastMessage({
          message: "Username atau password salah.",
          type: "error",
        });

        setTimeout(() => {
          setToastMessage({ message: "", type: "" });
        }, 3000);
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="login-container" data-aos="fade-in">
      {/* Decorative elements */}
      <div className="login-decoration login-decoration-top"></div>
      <div className="login-decoration login-decoration-bottom"></div>

      {/* Back button */}
      <button className="back-button" onClick={handleBack}>
        <ArrowLeft size={20} />
        <span>Kembali</span>
      </button>

      {/* Toast notification */}
      {toastMessage.message && (
        <div className={`toast-notification ${toastMessage.type}`}>
          <span className="toast-icon">
            {toastMessage.type === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
          </span>
          <span>{toastMessage.message}</span>
        </div>
      )}

      <div className="login-wrapper">
        <div className={`login-card status-${loginStatus}`}>
          {/* Top accent bar */}
          <div className="login-accent-bar"></div>

          {/* Header section */}
          <div className="login-header">
            <div className="login-logo-container">
              <img src={logo} alt="Logo SiPekan" className="login-logo" />
            </div>
            <h2>Login Admin</h2>
            <p>Masuk untuk lanjut ke tampilan Admin</p>
          </div>

          {/* Form section */}
          <form onSubmit={handleLogin} className="login-form">
            {/* Username field */}
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div
                className={`input-wrapper ${
                  focusedField === "username" ? "focused" : ""
                }`}
              >
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Masukkan username"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div
                className={`input-wrapper ${
                  focusedField === "password" ? "focused" : ""
                }`}
              >
                <Lock className="input-icon" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Masukkan password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁" : "👁‍🗨"}
                </button>
              </div>
            </div>

            {/* Login button */}
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Memproses...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Footer info */}
          <div className="login-footer">
            <p>
              Demo: <span>admin</span> / <span>password123</span>
            </p>
          </div>
        </div>

        {/* Security badge */}
        <div className="security-badge">
          <span className="badge-dot"></span>
          <span>Koneksi aman</span>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;

import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../../styles/admin/AdminLayout.css";
import logo from "../../assets/logo.png";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    alert("Anda telah logout.");
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="header-logo-container">
          <img src={logo} alt="Logo" />
          <span>Admin SiPekan</span>
        </div>

        <nav className="header-nav-desktop">
          <NavLink to="/admin" end>
            Dashboard
          </NavLink>
          <NavLink to="/admin/kelola-kegiatan">Kelola Kegiatan</NavLink>
          <NavLink to="/admin/kelola-data-balita" onClick={closeMenu}>
            Kelola Data Balita
          </NavLink>
        </nav>

        <div className="header-controls-right">
          <button
            className="hamburger-btn"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? "✖" : "☰"}
          </button>
          <div className="header-controls-desktop">
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div
        className={`mobile-menu-overlay ${isMenuOpen ? "open" : ""}`}
        onClick={closeMenu}
      >
        <nav className="admin-nav-mobile" onClick={(e) => e.stopPropagation()}>
          <NavLink to="/admin" end onClick={closeMenu}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/kelola-kegiatan" onClick={closeMenu}>
            Kelola Kegiatan
          </NavLink>
          <NavLink to="/admin/kelola-data-balita">Kelola Data Balita</NavLink>

          <div className="mobile-logout-footer">
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </nav>
      </div>
      <main className="admin-content-horizontal">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import "../styles/components/Navbar.css";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Buat sebuah ref untuk menunjuk ke elemen header
  const navRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    // Efek untuk mengelola class pada body saat menu mobile terbuka
    if (isMenuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      // Gunakan ref.current untuk mengakses elemen, dan pastikan tidak null
      if (navRef.current) {
        if (window.scrollY > 10) {
          navRef.current.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
        } else {
          navRef.current.style.boxShadow = "0 1px 6px rgba(0, 0, 0, 0.05)";
        }
      }
    };

    // Tambahkan event listener saat komponen dimuat
    window.addEventListener("scroll", handleScroll);

    // Hapus event listener saat komponen akan dilepas (penting!)
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Array kosong memastikan useEffect ini hanya berjalan sekali

  return (
    // Pasang ref pada elemen header yang ingin dimanipulasi
    <header className="navbar" ref={navRef}>
      <NavLink to="/" className="logo" onClick={closeMenu}>
        <span className="logo-icon">
          <img src={logo} alt="SiPekan Logo" />
        </span>
        SiPekan
      </NavLink>

      <nav className={isMenuOpen ? "active" : ""}>
        <ul>
          <li>
            <NavLink to="/" onClick={closeMenu}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/kegiatan" onClick={closeMenu}>
              Kegiatan
            </NavLink>
          </li>
          <li>
            <NavLink to="/data-anak" onClick={closeMenu}>
              Data Anak
            </NavLink>
          </li>
          <li>
            <NavLink to="/berita" onClick={closeMenu}>
              Berita
            </NavLink>
          </li>
        </ul>

        <div className="auth-buttons auth-buttons-mobile">
          <Link to="/login-admin" className="btn-login" onClick={closeMenu}>
            Login Admin
          </Link>
        </div>
      </nav>

      <div className="auth-buttons auth-buttons-desktop">
        <Link to="/login-admin" className="btn-login">
          Login Admin
        </Link>
      </div>

      <button
        className={`hamburger ${isMenuOpen ? "active" : ""}`}
        id="hamburger"
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
};

export default Navbar;

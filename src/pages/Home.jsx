import React, { useState } from "react";
import {
  Heart,
  Users,
  Leaf,
  Activity,
  ArrowRight,
  UsersRound,
  Smile,
  Clock,
} from "lucide-react";
import "../styles/pages/Home.css";

const Home = () => {
  const [activeCard, setActiveCard] = useState(0);

  const features = [
    {
      icon: Heart,
      title: "Meningkatkan Kesehatan Ibu dan Anak",
      description:
        "Posyandu berperan penting dalam memantau pertumbuhan dan perkembangan anak sejak dini serta memberikan layanan kesehatan dasar bagi ibu hamil, ibu menyusui, dan balita.",
      color: "from-red-50",
      borderColor: "border-red-500",
      iconBg: "bg-red-100",
      iconColor: "#ef4444",
      shadowColor: "rgba(239, 68, 68, 0.4)",
    },
    {
      icon: Users,
      title: "Mendorong Partisipasi Masyarakat",
      description:
        "Melalui kegiatan Posyandu, masyarakat didorong untuk berperan aktif dalam menjaga kesehatan keluarga dan lingkungan dengan komitmen penuh.",
      color: "from-blue-50",
      borderColor: "border-blue-500",
      iconBg: "bg-blue-100",
      iconColor: "#3b82f6",
      shadowColor: "rgba(59, 130, 246, 0.4)",
    },
    {
      icon: Leaf,
      title: "Meningkatkan Kesadaran dan Edukasi Gizi",
      description:
        "Posyandu menjadi pusat edukasi tentang pentingnya asupan gizi seimbang, imunisasi, dan pola hidup sehat guna mencegah stunting.",
      color: "from-green-50",
      borderColor: "border-green-500",
      iconBg: "bg-green-100",
      iconColor: "#22c55e",
      shadowColor: "rgba(34, 197, 94, 0.4)",
    },
  ];

  const stats = [
    {
      icon: UsersRound,
      number: "500+",
      label: "Keluarga Terlayani",
    },
    {
      icon: Smile,
      number: "98%",
      label: "Kepuasan Pelanggan",
    },
    {
      icon: Clock,
      number: "24/7",
      label: "Siap Melayani",
    },
  ];

  const FloatingShapes = () => (
    <div className="floating-shapes-container">
      <div className="floating-shape floating-shape-1" />
      <div className="floating-shape floating-shape-2" />
      <div className="floating-shape floating-shape-3" />
    </div>
  );

  return (
    <div className="home-wrapper">
      {/* HERO SECTION */}
      <section className="hero-section">
        <FloatingShapes />
        <div className="hero-overlay" />

        <div className="hero-content-wrapper">
          <div className="hero-text-center">
            {/* Badge */}
            <div className="hero-badge">
              <Activity className="badge-icon" />
              <span className="badge-text">Posyandu Karang Anyar</span>
            </div>

            {/* Main Heading */}
            <h1 className="hero-title">
              Menuju Generasi Sehat <br />
              <span className="hero-title-highlight">Masa Depan Cerah</span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle">
              Tingkatkan kesehatan keluarga Anda bersama kami. Dengan perawatan
              ahli, layanan terbaik, dan komitmen pada kesejahteraan anak-anak,
              kami memberikan solusi kesehatan untuk semua.
            </p>

            {/* CTA Button */}
            <button className="hero-cta-button">
              Jelajahi Layanan Kami
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-section">
        <div className="features-container">
          {/* Section Title */}
          <div className="features-header">
            <h2 className="features-title">
              Komitmen Kami untuk Kesehatan Anda
            </h2>
            <div className="features-title-divider" />
          </div>

          {/* Feature Cards */}
          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`feature-card ${
                    activeCard === index ? "active" : ""
                  }`}
                  onMouseEnter={() => setActiveCard(index)}
                  onClick={() => setActiveCard(index)}
                  style={{ "--shadow-color": feature.shadowColor }}
                >
                  {/* Background */}
                  <div className={`feature-bg-gradient ${feature.color}`} />

                  {/* Border */}
                  <div className={`feature-border ${feature.borderColor}`} />

                  {/* Content */}
                  <div className="feature-card-content">
                    {/* Icon */}
                    <div className={`feature-icon-wrapper ${feature.iconBg}`}>
                      <Icon
                        className="feature-icon"
                        style={{ color: feature.iconColor }}
                        size={32}
                      />
                    </div>

                    {/* Title */}
                    <h3 className="feature-card-title">{feature.title}</h3>

                    {/* Description */}
                    <p className="feature-card-description">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover Shadow */}
                  <div className="feature-hover-shadow" />
                </div>
              );
            })}
          </div>

          {/* Statistics Bottom */}
          <div className="features-stats">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="features-stat-card">
                  <div className="features-stat-icon-wrapper">
                    <Icon size={28} className="features-stat-icon" />
                  </div>
                  <div className="features-stat-number">{stat.number}</div>
                  <div className="features-stat-label">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom Wave */}
      <div className="wave-container">
        <svg
          className="wave-svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            className="wave-path"
            fill="rgba(34, 197, 94, 0.1)"
            fillOpacity="1"
            d="M0,160L48,170.7C96,181,192,203,288,208C384,213,480,203,576,176C672,149,768,107,864,112C960,117,1056,171,1152,181.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Home;

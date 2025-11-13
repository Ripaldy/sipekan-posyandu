import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Users,
  Leaf,
  Activity,
  ArrowRight,
  UsersRound,
  Smile,
  Clock,
  Calendar,
  MapPin,
} from "lucide-react";
import { getAllKegiatan } from "../services/kegiatanService";
import "../styles/pages/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState(0);
  const [kegiatanList, setKegiatanList] = useState([]);
  const [isLoadingKegiatan, setIsLoadingKegiatan] = useState(true);

  useEffect(() => {
    const fetchKegiatan = async () => {
      const { data, error } = await getAllKegiatan();
      if (data && !error) {
        // Get only upcoming/active activities, limit to 3
        const upcomingKegiatan = data
          .filter((k) => k.status !== "Selesai")
          .slice(0, 3)
          .map((k) => ({
            id: k.id,
            judul: k.judul,
            deskripsi: k.deskripsi,
            tanggalWaktu: k.tanggal_waktu,
            lokasi: k.lokasi || k.lokasi_posyandu,
            kategori: k.kategori,
            status: k.status,
          }));
        setKegiatanList(upcomingKegiatan);
      } else {
        console.error("Error fetching kegiatan:", error);
      }
      setIsLoadingKegiatan(false);
    };

    fetchKegiatan();
  }, []);

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

  const getCategoryColor = (kategori) => {
    const colors = {
      imunisasi: "bg-blue-100 text-blue-700 border-blue-300",
      edukasi: "bg-green-100 text-green-700 border-green-300",
      pemeriksaan: "bg-purple-100 text-purple-700 border-purple-300",
      posyandu: "bg-orange-100 text-orange-700 border-orange-300",
      penyuluhan: "bg-yellow-100 text-yellow-700 border-yellow-300",
      konseling: "bg-pink-100 text-pink-700 border-pink-300",
      pemantauan: "bg-teal-100 text-teal-700 border-teal-300",
    };
    return colors[kategori] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

      {/* KEGIATAN SECTION */}
      <section className="kegiatan-section">
        <div className="kegiatan-container">
          {/* Section Header */}
          <div className="kegiatan-header">
            <h2 className="kegiatan-title">Kegiatan Mendatang</h2>
            <p className="kegiatan-subtitle">
              Ikuti kegiatan kesehatan terbaru di posyandu kami
            </p>
          </div>

          {/* Kegiatan List */}
          {isLoadingKegiatan ? (
            <div className="kegiatan-loading">
              <p>Memuat kegiatan...</p>
            </div>
          ) : kegiatanList.length > 0 ? (
            <div className="kegiatan-grid">
              {kegiatanList.map((kegiatan, index) => (
                <div
                  key={kegiatan.id}
                  className="kegiatan-card"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Category Badge */}
                  <div className={`kegiatan-badge ${getCategoryColor(kegiatan.kategori)}`}>
                    {kegiatan.kategori
                      ? kegiatan.kategori.charAt(0).toUpperCase() +
                        kegiatan.kategori.slice(1)
                      : "Kegiatan"}
                  </div>

                  {/* Title */}
                  <h3 className="kegiatan-card-title">{kegiatan.judul}</h3>

                  {/* Description */}
                  <p className="kegiatan-card-description">
                    {kegiatan.deskripsi && kegiatan.deskripsi.length > 120
                      ? kegiatan.deskripsi.substring(0, 120) + "..."
                      : kegiatan.deskripsi || ""}
                  </p>

                  {/* Info */}
                  <div className="kegiatan-card-info">
                    <div className="kegiatan-info-item">
                      <Calendar size={16} className="kegiatan-info-icon" />
                      <span>{formatDate(kegiatan.tanggalWaktu)}</span>
                    </div>
                    <div className="kegiatan-info-item">
                      <Clock size={16} className="kegiatan-info-icon" />
                      <span>{formatTime(kegiatan.tanggalWaktu)}</span>
                    </div>
                    <div className="kegiatan-info-item">
                      <MapPin size={16} className="kegiatan-info-icon" />
                      <span>{kegiatan.lokasi || "Posyandu"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="kegiatan-empty">
              <p>Belum ada kegiatan yang dijadwalkan</p>
            </div>
          )}

          {/* View All Button */}
          {kegiatanList.length > 0 && (
            <div className="kegiatan-footer">
              <button
                onClick={() => navigate("/kegiatan")}
                className="kegiatan-view-all"
              >
                Lihat Semua Kegiatan
                <ArrowRight size={18} />
              </button>
            </div>
          )}
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

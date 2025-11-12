import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Calendar,
  MapPin,
  Users,
  Stethoscope,
  BookOpen,
  Syringe,
  ChevronRight,
} from "lucide-react";
import { getAllKegiatan } from "../services/kegiatanService";
import "../styles/pages/Kegiatan.css";

const Kegiatan = () => {
  const [tanggalFilter, setTanggalFilter] = useState("");
  const [cariFilter, setCariFilter] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [expandedCard, setExpandedCard] = useState(null);
  const [kegiatanList, setKegiatanList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await getAllKegiatan();
      if (data && !error) {
        const transformedData = data.map((k) => ({
          id: k.id,
          judul: k.judul,
          deskripsi: k.deskripsi,
          jadwal: k.tanggal_waktu,
          posyandu: k.lokasi_posyandu || "Posyandu",
          kategori: k.kategori,
          pemateri: k.penanggung_jawab,
          lokasi: k.lokasi || k.lokasi_posyandu,
          target: k.target_peserta || "Tidak disebutkan",
          status: k.status || "Terjadwal",
        }));
        setKegiatanList(transformedData);
      } else {
        console.error("Error fetching kegiatan:", error);
        setKegiatanList([]);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleResetFilter = () => {
    setTanggalFilter("");
    setCariFilter("");
    setKategoriFilter("");
  };

  const filteredKegiatan = useMemo(() => {
    return kegiatanList.filter((kegiatan) => {
      const filterDate = tanggalFilter ? new Date(tanggalFilter) : null;
      const kegiatanDate = new Date(kegiatan.jadwal);

      const tanggalMatch =
        !filterDate ||
        (kegiatanDate.getFullYear() === filterDate.getFullYear() &&
          kegiatanDate.getMonth() === filterDate.getMonth() &&
          kegiatanDate.getDate() === filterDate.getDate());

      const cariLower = cariFilter.toLowerCase();
      const cariMatch =
        !cariFilter ||
        kegiatan.judul.toLowerCase().includes(cariLower) ||
        kegiatan.deskripsi.toLowerCase().includes(cariLower) ||
        kegiatan.posyandu.toLowerCase().includes(cariLower) ||
        kegiatan.lokasi.toLowerCase().includes(cariLower) ||
        kegiatan.pemateri.toLowerCase().includes(cariLower);

      const kategoriMatch =
        !kategoriFilter || kegiatan.kategori === kategoriFilter;

      return tanggalMatch && cariMatch && kategoriMatch;
    });
  }, [kegiatanList, tanggalFilter, cariFilter, kategoriFilter]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      imunisasi: <Syringe />,
      edukasi: <BookOpen />,
      pemeriksaan: <Stethoscope />,
      posyandu: <Users />,
      penyuluhan: <BookOpen />,
      konseling: <Users />,
      pemantauan: <Stethoscope />,
    };
    return icons[category] || <Users />;
  };

  const getCategoryLabel = (category) => {
    const labels = {
      imunisasi: "Imunisasi",
      edukasi: "Edukasi",
      pemeriksaan: "Pemeriksaan",
      posyandu: "Posyandu",
      penyuluhan: "Penyuluhan",
      konseling: "Konseling",
      pemantauan: "Pemantauan",
    };
    return labels[category] || category;
  };

  if (isLoading) {
    return (
      <div className="kegiatan-container">
        <div className="kegiatan-wrapper">
          <div className="kegiatan-header">
            <h1 className="kegiatan-title">Memuat Data...</h1>
            <p className="kegiatan-subtitle">
              Mengambil data kegiatan dari server
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kegiatan-container">
      <div className="kegiatan-wrapper">
        <div className="kegiatan-header">
          <h1 className="kegiatan-title">Jadwal Kegiatan Kesehatan</h1>
          <p className="kegiatan-subtitle">
            Jelajahi semua kegiatan kesehatan masyarakat yang tersedia untuk
            Anda
          </p>
        </div>

        {/* Filter Section */}
        <div className="kegiatan-filter-wrapper">
          <div className="kegiatan-search-container">
            <Search className="kegiatan-search-icon" />
            <input
              type="text"
              value={cariFilter}
              onChange={(e) => setCariFilter(e.target.value)}
              placeholder="Cari kegiatan, lokasi, atau pemateri..."
              className="kegiatan-search-input"
            />
          </div>

          <div className="kegiatan-filter-controls">
            <div className="kegiatan-filter-group">
              <label className="kegiatan-filter-label">Tanggal</label>
              <input
                type="date"
                value={tanggalFilter}
                onChange={(e) => setTanggalFilter(e.target.value)}
                className="kegiatan-filter-input"
              />
            </div>

            <div className="kegiatan-filter-group">
              <label className="kegiatan-filter-label">Kategori</label>
              <select
                value={kategoriFilter}
                onChange={(e) => setKategoriFilter(e.target.value)}
                className="kegiatan-filter-select"
              >
                <option value="">Semua Kategori</option>
                <option value="imunisasi">Imunisasi</option>
                <option value="edukasi">Edukasi</option>
                <option value="pemeriksaan">Pemeriksaan</option>
                <option value="posyandu">Posyandu</option>
                <option value="penyuluhan">Penyuluhan</option>
                <option value="konseling">Konseling</option>
                <option value="pemantauan">Pemantauan</option>
              </select>
            </div>

            <div className="kegiatan-filter-group">
              <label className="kegiatan-filter-label">&nbsp;</label>
              <button
                onClick={handleResetFilter}
                className="kegiatan-reset-btn"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="kegiatan-results-info">
            Menampilkan <strong>{filteredKegiatan.length}</strong> dari{" "}
            <strong>{kegiatanList.length}</strong> kegiatan
          </div>
        </div>

        {/* Kegiatan List */}
        <div className="kegiatan-list">
          {filteredKegiatan.length > 0 ? (
            filteredKegiatan.map((kegiatan) => {
              const isExpanded = expandedCard === kegiatan.id;
              return (
                <div
                  key={kegiatan.id}
                  className={`kegiatan-card ${kegiatan.kategori} ${
                    isExpanded ? "expanded" : ""
                  }`}
                >
                  <div
                    className="kegiatan-card-header"
                    onClick={() =>
                      setExpandedCard(isExpanded ? null : kegiatan.id)
                    }
                  >
                    <div className="kegiatan-card-icon-wrapper">
                      {getCategoryIcon(kegiatan.kategori)}
                    </div>

                    <div className="kegiatan-card-content">
                      <div className="kegiatan-card-title-row">
                        <h3 className="kegiatan-card-title">
                          {kegiatan.judul}
                        </h3>
                        <span className="kegiatan-card-badge">
                          {getCategoryLabel(kegiatan.kategori)}
                        </span>
                      </div>

                      <p className="kegiatan-card-description">
                        {kegiatan.deskripsi}
                      </p>

                      <div className="kegiatan-card-quick-info">
                        <div className="kegiatan-quick-info-item">
                          <Calendar />
                          <span className="kegiatan-quick-info-text">
                            {formatDate(kegiatan.jadwal)} WIB
                          </span>
                        </div>
                        <div className="kegiatan-quick-info-item">
                          <MapPin />
                          <span className="kegiatan-quick-info-text">
                            {kegiatan.posyandu}
                          </span>
                        </div>
                        <div className="kegiatan-quick-info-item">
                          <Users />
                          <span className="kegiatan-quick-info-text">
                            {kegiatan.target}
                          </span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="kegiatan-card-chevron" />
                  </div>

                  {isExpanded && (
                    <div className="kegiatan-card-expanded">
                      <table className="kegiatan-detail-table">
                        <tbody>
                          <tr>
                            <td className="kegiatan-detail-label">
                              Jadwal Lengkap
                            </td>
                            <td className="kegiatan-detail-value">
                              {formatDate(kegiatan.jadwal)} WIB
                            </td>
                          </tr>
                          <tr>
                            <td className="kegiatan-detail-label">Lokasi</td>
                            <td className="kegiatan-detail-value">
                              {kegiatan.lokasi}
                            </td>
                          </tr>
                          <tr>
                            <td className="kegiatan-detail-label">Posyandu</td>
                            <td className="kegiatan-detail-value">
                              {kegiatan.posyandu}
                            </td>
                          </tr>
                          <tr>
                            <td className="kegiatan-detail-label">
                              Penanggung Jawab / Pemateri
                            </td>
                            <td className="kegiatan-detail-value">
                              {kegiatan.pemateri}
                            </td>
                          </tr>
                          <tr>
                            <td className="kegiatan-detail-label">
                              Target Peserta
                            </td>
                            <td className="kegiatan-detail-value">
                              {kegiatan.target}
                            </td>
                          </tr>
                          <tr>
                            <td className="kegiatan-detail-label">Status</td>
                            <td className="kegiatan-detail-value">
                              {kegiatan.status}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="kegiatan-empty-state">
              <div className="kegiatan-empty-icon">🔍</div>
              <h3 className="kegiatan-empty-title">
                Tidak ada kegiatan ditemukan
              </h3>
              <p className="kegiatan-empty-text">
                Coba ubah kriteria pencarian atau filter untuk melihat kegiatan
                lain
              </p>
              <button
                onClick={handleResetFilter}
                className="kegiatan-empty-btn"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Kegiatan;

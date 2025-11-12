import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  Calendar,
  MapPin,
  Users,
} from "lucide-react";
import { getAllKegiatan, deleteKegiatan } from "../../services/kegiatanService";
import "../../styles/admin/KelolaKegiatan.css";

const KelolaKegiatan = () => {
  const navigate = useNavigate();
  const [kegiatanList, setKegiatanList] = useState([]);
  const [filter, setFilter] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await getAllKegiatan();
      if (data && !error) {
        // Transform Supabase data to match component structure
        const transformedData = data.map((kegiatan) => ({
          id: kegiatan.id,
          judul: kegiatan.judul,
          posyandu: kegiatan.lokasi_posyandu || "Posyandu",
          jadwal: kegiatan.tanggal_waktu,
          deskripsi: kegiatan.deskripsi,
          kategori: kegiatan.kategori,
          pemateri: kegiatan.penanggung_jawab,
          lokasi: kegiatan.lokasi || kegiatan.lokasi_posyandu,
          target: kegiatan.target_peserta || "Tidak disebutkan",
          status: kegiatan.status || "Terjadwal",
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

  const filteredKegiatan = useMemo(() => {
    if (!filter) return kegiatanList;
    return kegiatanList.filter(
      (k) =>
        k.judul.toLowerCase().includes(filter.toLowerCase()) ||
        k.posyandu.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, kegiatanList]);

  const handleTambahKegiatan = () => {
    navigate("/admin/form-kegiatan");
  };

  const handleEditKegiatan = (kegiatan) => {
    navigate(`/admin/form-kegiatan/${kegiatan.id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kegiatan ini?")) {
      const { error } = await deleteKegiatan(id);
      if (!error) {
        setKegiatanList(kegiatanList.filter((k) => k.id !== id));
        alert("Kegiatan berhasil dihapus!");
      } else {
        console.error("Error deleting kegiatan:", error);
        alert("Gagal menghapus kegiatan!");
      }
    }
  };

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getCategoryLabel = (category) => {
    const labels = {
      imunisasi: "Imunisasi",
      edukasi: "Edukasi",
      pemeriksaan: "Pemeriksaan",
    };
    return labels[category] || category;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="kelola-kegiatan-container">
        <p>Memuat data kegiatan...</p>
      </div>
    );
  }

  return (
    <div className="kelola-kegiatan-container">
      {/* Header */}
      <div className="kelola-kegiatan-header">
        <div>
          <h1 className="kelola-kegiatan-title">Kelola Kegiatan</h1>
          <p className="kelola-kegiatan-subtitle">
            Kelola semua kegiatan kesehatan di posyandu Anda
          </p>
        </div>
        <button onClick={handleTambahKegiatan} className="kelola-btn-tambah">
          <Plus size={20} />
          Tambah Kegiatan
        </button>
      </div>

      {/* Filter */}
      <div className="kelola-kegiatan-filter">
        <div className="search-box-kegiatan">
          <Search size={20} color="#22c55e" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama kegiatan atau posyandu..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="kelola-filter-input"
          />
        </div>
      </div>

      {/* List Kegiatan */}
      <div className="kelola-kegiatan-list">
        {filteredKegiatan.length > 0 ? (
          filteredKegiatan.map((kegiatan, idx) => (
            <div
              key={kegiatan.id}
              className="kelola-kegiatan-card"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* Card Header - Summary */}
              <div
                className="kelola-card-summary"
                onClick={() => toggleExpanded(kegiatan.id)}
              >
                <div className="kelola-summary-content">
                  <div className="kelola-summary-title-section">
                    <h3 className="kelola-card-title">{kegiatan.judul}</h3>
                    <div className="kelola-card-badges">
                      <span className="kelola-badge kelola-badge-kategori">
                        {getCategoryLabel(kegiatan.kategori)}
                      </span>
                      <span
                        className={`kelola-badge ${
                          kegiatan.status === "Selesai"
                            ? "kelola-badge-selesai"
                            : "kelola-badge-terjadwal"
                        }`}
                      >
                        {kegiatan.status}
                      </span>
                    </div>
                  </div>
                  <div className="kelola-summary-info">
                    <div className="kelola-summary-item">
                      <Calendar size={16} />
                      <span>{formatDate(kegiatan.jadwal)}</span>
                    </div>
                    <div className="kelola-summary-item">
                      <MapPin size={16} />
                      <span>{kegiatan.posyandu}</span>
                    </div>
                  </div>
                </div>
                <ChevronDown
                  size={24}
                  className={`kelola-chevron ${
                    expandedId === kegiatan.id ? "expanded" : ""
                  }`}
                />
              </div>

              {/* Card Details - Dropdown */}
              {expandedId === kegiatan.id && (
                <div className="kelola-card-details">
                  <div className="kelola-details-divider"></div>

                  {/* Info Table */}
                  <table className="kelola-details-table">
                    <thead>
                      <tr>
                        <th>Lokasi</th>
                        <th>Penanggung Jawab / Pemateri</th>
                        <th>Target</th>
                        <th>Deskripsi</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{kegiatan.lokasi}</td>
                        <td>{kegiatan.pemateri}</td>
                        <td>{kegiatan.target}</td>
                        <td>{kegiatan.deskripsi}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Card Actions */}
                  <div className="kelola-card-actions">
                    <button
                      onClick={() => handleEditKegiatan(kegiatan)}
                      className="kelola-btn kelola-btn-edit"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(kegiatan.id)}
                      className="kelola-btn kelola-btn-hapus"
                    >
                      <Trash2 size={16} /> Hapus
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="kelola-empty-state">
            <p className="kelola-empty-icon">◯</p>
            <h3 className="kelola-empty-title">Tidak ada kegiatan ditemukan</h3>
            <p className="kelola-empty-text">
              Klik tombol "Tambah Kegiatan" untuk membuat kegiatan baru
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KelolaKegiatan;

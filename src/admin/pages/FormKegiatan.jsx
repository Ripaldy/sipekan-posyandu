import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/admin/FormKegiatan.css";

const FormKegiatan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData || null;

  const [formData, setFormData] = useState(
    editData || {
      judul: "",
      deskripsi: "",
      jadwal: "",
      posyandu: "",
      kategori: "imunisasi",
      pemateri: "",
      lokasi: "",
      target: "",
      status: "Terjadwal",
    }
  );

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.judul.trim()) newErrors.judul = "Judul kegiatan harus diisi";
    if (!formData.deskripsi.trim())
      newErrors.deskripsi = "Deskripsi kegiatan harus diisi";
    if (!formData.jadwal) newErrors.jadwal = "Jadwal kegiatan harus dipilih";
    if (!formData.posyandu.trim()) newErrors.posyandu = "Posyandu harus diisi";
    if (!formData.kategori) newErrors.kategori = "Kategori harus dipilih";
    if (!formData.pemateri.trim())
      newErrors.pemateri = "Pemateri/PJ harus diisi";
    if (!formData.lokasi.trim()) newErrors.lokasi = "Lokasi harus diisi";
    if (!formData.target.trim())
      newErrors.target = "Target peserta harus diisi";
    if (!formData.status) newErrors.status = "Status harus dipilih";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Data kegiatan:", formData);
      navigate("/admin/kelola-kegiatan", {
        state: {
          successMessage: editData
            ? "Kegiatan berhasil diperbarui"
            : "Kegiatan berhasil ditambahkan",
        },
      });
    }
  };

  const handleReset = () => {
    setFormData({
      judul: "",
      deskripsi: "",
      jadwal: "",
      posyandu: "",
      kategori: "imunisasi",
      pemateri: "",
      lokasi: "",
      target: "",
      status: "Terjadwal",
    });
    setErrors({});
  };

  const handleCancel = () => navigate("/admin/kelola-kegiatan");

  return (
    <div className="form-kegiatan-page-container">
      <div className="form-kegiatan-page-wrapper">
        {/* ===== HEADER BARU ===== */}
        <div className="form-kegiatan-page-header">
          {/* Judul di tengah */}
          <h1 className="form-kegiatan-page-title-center">
            {editData ? "Edit Kegiatan" : "Tambah Kegiatan"}
          </h1>

          {/* Subjudul dan tombol kembali */}
          <div className="form-kegiatan-page-subheader">
            <p className="form-kegiatan-page-subtitle">
              {editData
                ? "Update informasi kegiatan kesehatan"
                : "Buat kegiatan kesehatan baru"}
            </p>
            <button
              onClick={handleCancel}
              className="form-page-back-btn"
              type="button"
            >
              <span className="icon-back">←</span> Kembali
            </button>
          </div>
        </div>

        {/* ===== FORM BODY ===== */}
        <form onSubmit={handleSubmit} className="form-kegiatan-page-body">
          {/* Informasi Dasar */}
          <div className="form-kegiatan-page-section">
            <h3 className="form-page-section-title">
              <span className="section-icon">▣</span> Informasi Dasar
            </h3>

            <div className="form-kegiatan-page-group">
              <label className="form-kegiatan-page-label">
                Judul Kegiatan <span className="form-page-required">*</span>
              </label>
              <input
                type="text"
                name="judul"
                value={formData.judul}
                onChange={handleChange}
                placeholder="Contoh: Imunisasi Anak Batch 1"
                className={`form-kegiatan-page-input ${
                  errors.judul ? "form-page-input-error" : ""
                }`}
              />
              {errors.judul && (
                <span className="form-page-error-text">
                  <span className="error-icon">●</span> {errors.judul}
                </span>
              )}
            </div>

            <div className="form-kegiatan-page-group">
              <label className="form-kegiatan-page-label">
                Deskripsi Kegiatan <span className="form-page-required">*</span>
              </label>
              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                placeholder="Jelaskan detail kegiatan..."
                className={`form-kegiatan-page-textarea ${
                  errors.deskripsi ? "form-page-input-error" : ""
                }`}
              />
              {errors.deskripsi && (
                <span className="form-page-error-text">
                  <span className="error-icon">●</span> {errors.deskripsi}
                </span>
              )}
            </div>
          </div>

          {/* Jadwal & Lokasi */}
          <div className="form-kegiatan-page-section">
            <h3 className="form-page-section-title">
              <span className="section-icon">▢</span> Jadwal & Lokasi
            </h3>

            <div className="form-kegiatan-page-row">
              <div className="form-kegiatan-page-group">
                <label className="form-kegiatan-page-label">
                  Jadwal Kegiatan <span className="form-page-required">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="jadwal"
                  value={formData.jadwal}
                  onChange={handleChange}
                  className={`form-kegiatan-page-input ${
                    errors.jadwal ? "form-page-input-error" : ""
                  }`}
                />
                {errors.jadwal && (
                  <span className="form-page-error-text">
                    <span className="error-icon">●</span> {errors.jadwal}
                  </span>
                )}
              </div>

              <div className="form-kegiatan-page-group">
                <label className="form-kegiatan-page-label">
                  Posyandu <span className="form-page-required">*</span>
                </label>
                <input
                  type="text"
                  name="posyandu"
                  value={formData.posyandu}
                  onChange={handleChange}
                  placeholder="Contoh: Posyandu Anggrek"
                  className={`form-kegiatan-page-input ${
                    errors.posyandu ? "form-page-input-error" : ""
                  }`}
                />
                {errors.posyandu && (
                  <span className="form-page-error-text">
                    <span className="error-icon">●</span> {errors.posyandu}
                  </span>
                )}
              </div>
            </div>

            <div className="form-kegiatan-page-group">
              <label className="form-kegiatan-page-label">
                Lokasi <span className="form-page-required">*</span>
              </label>
              <input
                type="text"
                name="lokasi"
                value={formData.lokasi}
                onChange={handleChange}
                placeholder="Contoh: Jl. Merdeka No. 45, Kecamatan A"
                className={`form-kegiatan-page-input ${
                  errors.lokasi ? "form-page-input-error" : ""
                }`}
              />
              {errors.lokasi && (
                <span className="form-page-error-text">
                  <span className="error-icon">●</span> {errors.lokasi}
                </span>
              )}
            </div>
          </div>

          {/* Kategori & Status */}
          <div className="form-kegiatan-page-section">
            <h3 className="form-page-section-title">
              <span className="section-icon">◆</span> Kategori & Status
            </h3>

            <div className="form-kegiatan-page-row">
              <div className="form-kegiatan-page-group">
                <label className="form-kegiatan-page-label">
                  Kategori <span className="form-page-required">*</span>
                </label>
                <select
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleChange}
                  className={`form-kegiatan-page-select ${
                    errors.kategori ? "form-page-input-error" : ""
                  }`}
                >
                  <option value="imunisasi">Imunisasi</option>
                  <option value="edukasi">Edukasi</option>
                  <option value="pemeriksaan">Pemeriksaan</option>
                </select>
                {errors.kategori && (
                  <span className="form-page-error-text">
                    <span className="error-icon">●</span> {errors.kategori}
                  </span>
                )}
              </div>

              <div className="form-kegiatan-page-group">
                <label className="form-kegiatan-page-label">
                  Status <span className="form-page-required">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`form-kegiatan-page-select ${
                    errors.status ? "form-page-input-error" : ""
                  }`}
                >
                  <option value="Terjadwal">Terjadwal</option>
                  <option value="Berlangsung">Berlangsung</option>
                  <option value="Selesai">Selesai</option>
                </select>
                {errors.status && (
                  <span className="form-page-error-text">
                    <span className="error-icon">●</span> {errors.status}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Pemateri & Target */}
          <div className="form-kegiatan-page-section">
            <h3 className="form-page-section-title">
              <span className="section-icon">◉</span> Pemateri & Target
            </h3>

            <div className="form-kegiatan-page-group">
              <label className="form-kegiatan-page-label">
                Pemateri/Penanggung Jawab{" "}
                <span className="form-page-required">*</span>
              </label>
              <input
                type="text"
                name="pemateri"
                value={formData.pemateri}
                onChange={handleChange}
                placeholder="Contoh: Dr. Siti Nurhaliza"
                className={`form-kegiatan-page-input ${
                  errors.pemateri ? "form-page-input-error" : ""
                }`}
              />
              {errors.pemateri && (
                <span className="form-page-error-text">
                  <span className="error-icon">●</span> {errors.pemateri}
                </span>
              )}
            </div>

            <div className="form-kegiatan-page-group">
              <label className="form-kegiatan-page-label">
                Target Peserta <span className="form-page-required">*</span>
              </label>
              <input
                type="text"
                name="target"
                value={formData.target}
                onChange={handleChange}
                placeholder="Contoh: 50 anak"
                className={`form-kegiatan-page-input ${
                  errors.target ? "form-page-input-error" : ""
                }`}
              />
              {errors.target && (
                <span className="form-page-error-text">
                  <span className="error-icon">●</span> {errors.target}
                </span>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="form-kegiatan-page-footer">
          <button
            onClick={handleReset}
            className="form-page-btn form-page-btn-reset"
            type="button"
          >
            <span className="icon-reset">↻</span> Reset
          </button>
          <div className="form-page-footer-actions">
            <button
              onClick={handleCancel}
              className="form-page-btn form-page-btn-cancel"
              type="button"
            >
              <span className="icon-cancel">✕</span> Batal
            </button>
            <button
              onClick={handleSubmit}
              className="form-page-btn form-page-btn-submit"
              type="submit"
            >
              <span className="icon-save">▼</span> Simpan Kegiatan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormKegiatan;

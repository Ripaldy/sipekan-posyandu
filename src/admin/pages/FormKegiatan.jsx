import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getKegiatanById,
  createKegiatan,
  updateKegiatan,
} from "../../services/kegiatanService";
import "../../styles/admin/FormKegiatan.css";

const FormKegiatan = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
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

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch kegiatan data if editing
  useEffect(() => {
    const fetchData = async () => {
      if (isEditing) {
        const { data, error } = await getKegiatanById(id);
        if (data && !error) {
          setFormData({
            judul: data.judul || "",
            deskripsi: data.deskripsi || "",
            jadwal: data.tanggal_waktu || "",
            posyandu: data.lokasi_posyandu || "",
            kategori: data.kategori || "imunisasi",
            pemateri: data.penanggung_jawab || "",
            lokasi: data.lokasi || "",
            target: data.target_peserta || "",
            status: data.status || "Terjadwal",
          });
        } else {
          alert("Data kegiatan tidak ditemukan!");
          navigate("/admin/kelola-kegiatan");
        }
      }
      setIsLoading(false);
    };

    fetchData();
  }, [id, isEditing, navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSaving(true);

      try {
        // Transform data to match Supabase schema
        const kegiatanData = {
          judul: formData.judul,
          deskripsi: formData.deskripsi,
          tanggal_waktu: formData.jadwal,
          lokasi_posyandu: formData.posyandu,
          kategori: formData.kategori,
          penanggung_jawab: formData.pemateri,
          lokasi: formData.lokasi,
          target_peserta: formData.target,
          status: formData.status,
        };

        let result;
        if (isEditing) {
          result = await updateKegiatan(id, kegiatanData);
        } else {
          result = await createKegiatan(kegiatanData);
        }

        if (result.data && !result.error) {
          alert(
            isEditing
              ? "Kegiatan berhasil diperbarui!"
              : "Kegiatan berhasil ditambahkan!"
          );
          navigate("/admin/kelola-kegiatan");
        } else {
          throw new Error(result.error?.message || "Gagal menyimpan kegiatan");
        }
      } catch (error) {
        console.error("Submit error:", error);
        alert(`Terjadi kesalahan: ${error.message}`);
      } finally {
        setIsSaving(false);
      }
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

  if (isLoading) {
    return (
      <div className="form-kegiatan-page-container">
        <p>Memuat data kegiatan...</p>
      </div>
    );
  }

  return (
    <div className="form-kegiatan-page-container">
      <div className="form-kegiatan-page-wrapper">
        {/* ===== HEADER BARU ===== */}
        <div className="form-kegiatan-page-header">
          {/* Judul di tengah */}
          <h1 className="form-kegiatan-page-title-center">
            {isEditing ? "Edit Kegiatan" : "Tambah Kegiatan"}
          </h1>

          {/* Subjudul dan tombol kembali */}
          <div className="form-kegiatan-page-subheader">
            <p className="form-kegiatan-page-subtitle">
              {isEditing
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
                  <option value="posyandu">Posyandu</option>
                  <option value="penyuluhan">Penyuluhan</option>
                  <option value="konseling">Konseling</option>
                  <option value="pemantauan">Pemantauan</option>
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
              disabled={isSaving}
            >
              <span className="icon-save">▼</span>{" "}
              {isSaving ? "Menyimpan..." : "Simpan Kegiatan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormKegiatan;

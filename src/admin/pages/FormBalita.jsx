import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/admin/FormBalita.css";

const hitungUmur = (tanggalLahir) => {
  if (!tanggalLahir) return "0 tahun 0 bulan";
  const tglLahir = new Date(tanggalLahir);
  const hariIni = new Date();
  let tahun = hariIni.getFullYear() - tglLahir.getFullYear();
  let bulan = hariIni.getMonth() - tglLahir.getMonth();

  if (bulan < 0 || (bulan === 0 && hariIni.getDate() < tglLahir.getDate())) {
    tahun--;
    bulan += 12;
  }
  return `${tahun} tahun ${bulan} bulan`;
};

const validateField = (name, value) => {
  if (!value && value !== 0) return "Wajib diisi";
  switch (name) {
    case "nama":
      return value.length < 3 ? "Nama minimal 3 karakter" : "";
    case "beratBadan":
      return value < 1 || value > 50 ? "Berat harus antara 1-50 kg" : "";
    case "tinggiBadan":
      return value < 40 || value > 150 ? "Tinggi harus antara 40-150 cm" : "";
    case "lila":
      return value < 10 || value > 20 ? "LILA harus antara 10-20 cm" : "";
    case "pengukuranKe":
      return value < 1 ? "Pengukuran minimal ke-1" : "";
    case "jenisKelamin":
      return value === "" ? "Pilih jenis kelamin" : "";
    case "namaOrtu":
      return value.length < 3 ? "Nama orang tua minimal 3 karakter" : "";
    case "tanggalLahir":
      return value === "" ? "Tanggal lahir wajib diisi" : "";
    case "desa":
      return value.length < 2 ? "Desa/Kel minimal 2 karakter" : "";
    case "posyandu":
      return value.length < 2 ? "Posyandu minimal 2 karakter" : "";
    default:
      return "";
  }
};

const findBalitaById = (id) => {
  const mockDataBalita = [
    {
      id: 1,
      nama: "Budi Santoso",
      jenisKelamin: "Laki-laki",
      tanggalLahir: "2023-05-20",
      pengukuranKe: 3,
      namaOrtu: "Santi Dewi",
      tinggiBadan: 75.5,
      beratBadan: 10.2,
      lila: 14.5,
      desa: "Sukamekar",
      posyandu: "Anggrek",
    },
    {
      id: 2,
      nama: "Alya Putri",
      jenisKelamin: "Perempuan",
      tanggalLahir: "2024-01-10",
      pengukuranKe: 2,
      namaOrtu: "Rudi Hartono",
      tinggiBadan: 68.0,
      beratBadan: 8.5,
      lila: 13.2,
      desa: "Sukatani",
      posyandu: "Mawar",
    },
  ];
  return mockDataBalita.find((d) => d.id === parseInt(id));
};

const FormBalita = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    nama: "",
    jenisKelamin: "",
    tanggalLahir: "",
    namaOrtu: "",
    beratBadan: "",
    tinggiBadan: "",
    lila: "",
    pengukuranKe: "",
    desa: "",
    posyandu: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const data = findBalitaById(id);
      if (data) {
        const { umur: _umur, statusGizi: _statusGizi, ...rest } = data;
        setFormData(rest);
      } else {
        alert("Data Balita tidak ditemukan!");
        navigate("/admin/kelola-data-balita");
      }
    }
    setIsLoading(false);
  }, [id, isEditing, navigate]);

  const umurTerkini = useMemo(
    () => hitungUmur(formData.tanggalLahir),
    [formData.tanggalLahir]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    const allTouched = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
      allTouched[key] = true;
    });

    setErrors(newErrors);
    setTouched(allTouched);

    if (Object.keys(newErrors).length > 0) {
      alert("Harap periksa kembali form, masih ada data yang belum valid.");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      console.log(isEditing ? "Update Data:" : "Tambah Data:", {
        ...formData,
        umur: umurTerkini,
      });
      setIsSaving(false);
      alert(
        isEditing
          ? `Data ${formData.nama} berhasil diubah!`
          : `Data ${formData.nama} berhasil ditambahkan!`
      );
      navigate("/admin/kelola-data-balita");
    }, 800);
  };

  if (isLoading && isEditing) {
    return (
      <div className="kelola-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="kelola-container" data-aos="fade-in">
      <div className="balita-form-page">
        <div className="form-header-simple">
          <h1>{isEditing ? "Edit Data Balita" : "Tambah Data Balita Baru"}</h1>
          <p className="form-subtitle-simple">
            {isEditing
              ? "Perbarui informasi balita dengan lengkap dan akurat"
              : "Isi formulir di bawah untuk menambahkan data balita baru"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="form-balita-simple">
          {/* INFORMASI ANAK */}
          <div className="form-section-simple">
            <h3 className="section-title-simple">Informasi Anak</h3>

            <div className="form-group-page">
              <label>
                Nama Anak <span className="required-mark">*</span>
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.nama && touched.nama ? "input-error" : ""}
                placeholder="Masukkan nama lengkap anak"
              />
              {errors.nama && touched.nama && (
                <span className="error-text">
                  <span className="error-icon">●</span> {errors.nama}
                </span>
              )}
            </div>

            <div className="form-group-page">
              <label>
                Jenis Kelamin <span className="required-mark">*</span>
              </label>
              <select
                name="jenisKelamin"
                value={formData.jenisKelamin || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.jenisKelamin && touched.jenisKelamin
                    ? "input-error"
                    : ""
                }
              >
                <option value="">-- Pilih Jenis Kelamin --</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
              {errors.jenisKelamin && touched.jenisKelamin && (
                <span className="error-text">
                  <span className="error-icon">●</span> {errors.jenisKelamin}
                </span>
              )}
            </div>

            <div className="form-row-simple">
              <div className="form-group-page">
                <label>
                  Tanggal Lahir <span className="required-mark">*</span>
                </label>
                <input
                  type="date"
                  name="tanggalLahir"
                  value={formData.tanggalLahir || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.tanggalLahir && touched.tanggalLahir
                      ? "input-error"
                      : ""
                  }
                />
                {errors.tanggalLahir && touched.tanggalLahir && (
                  <span className="error-text">
                    <span className="error-icon">●</span> {errors.tanggalLahir}
                  </span>
                )}
              </div>
              <div className="form-group-page">
                <label>Umur (Otomatis)</label>
                <input
                  type="text"
                  value={umurTerkini}
                  readOnly
                  className="input-readonly"
                />
              </div>
            </div>
          </div>

          {/* INFORMASI ORANG TUA & LOKASI */}
          <div className="form-section-simple">
            <h3 className="section-title-simple">
              Informasi Orang Tua & Lokasi
            </h3>
            <div className="form-group-page">
              <label>
                Nama Orang Tua/Wali <span className="required-mark">*</span>
              </label>
              <input
                type="text"
                name="namaOrtu"
                value={formData.namaOrtu || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.namaOrtu && touched.namaOrtu ? "input-error" : ""
                }
                placeholder="Masukkan nama orang tua/wali"
              />
              {errors.namaOrtu && touched.namaOrtu && (
                <span className="error-text">
                  <span className="error-icon">●</span> {errors.namaOrtu}
                </span>
              )}
            </div>

            <div className="form-row-simple">
              <div className="form-group-page">
                <label>
                  Desa/Kel <span className="required-mark">*</span>
                </label>
                <input
                  type="text"
                  name="desa"
                  value={formData.desa || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.desa && touched.desa ? "input-error" : ""}
                  placeholder="Masukkan nama desa/kelurahan"
                />
                {errors.desa && touched.desa && (
                  <span className="error-text">
                    <span className="error-icon">●</span> {errors.desa}
                  </span>
                )}
              </div>
              <div className="form-group-page">
                <label>
                  Posyandu <span className="required-mark">*</span>
                </label>
                <input
                  type="text"
                  name="posyandu"
                  value={formData.posyandu || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.posyandu && touched.posyandu ? "input-error" : ""
                  }
                  placeholder="Cth: Posyandu Anggrek"
                />
                {errors.posyandu && touched.posyandu && (
                  <span className="error-text">
                    <span className="error-icon">●</span> {errors.posyandu}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* DATA PENGUKURAN */}
          <div className="form-section-simple">
            <h3 className="section-title-simple">Data Pengukuran</h3>
            <div className="form-row-simple">
              <div className="form-group-page">
                <label>
                  Berat Badan (kg) <span className="required-mark">*</span>
                </label>
                <input
                  type="number"
                  name="beratBadan"
                  value={formData.beratBadan || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  step="0.1"
                  placeholder="Cth: 8.5"
                  className={
                    errors.beratBadan && touched.beratBadan ? "input-error" : ""
                  }
                />
                {errors.beratBadan && touched.beratBadan && (
                  <span className="error-text">
                    <span className="error-icon">●</span> {errors.beratBadan}
                  </span>
                )}
              </div>
              <div className="form-group-page">
                <label>
                  Tinggi Badan (cm) <span className="required-mark">*</span>
                </label>
                <input
                  type="number"
                  name="tinggiBadan"
                  value={formData.tinggiBadan || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  step="0.1"
                  placeholder="Cth: 75.5"
                  className={
                    errors.tinggiBadan && touched.tinggiBadan
                      ? "input-error"
                      : ""
                  }
                />
                {errors.tinggiBadan && touched.tinggiBadan && (
                  <span className="error-text">
                    <span className="error-icon">●</span> {errors.tinggiBadan}
                  </span>
                )}
              </div>
            </div>

            <div className="form-row-simple">
              <div className="form-group-page">
                <label>
                  LILA (cm) <span className="required-mark">*</span>
                </label>
                <input
                  type="number"
                  name="lila"
                  value={formData.lila || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  step="0.1"
                  placeholder="Cth: 14.5"
                  className={errors.lila && touched.lila ? "input-error" : ""}
                />
                {errors.lila && touched.lila && (
                  <span className="error-text">
                    <span className="error-icon">●</span> {errors.lila}
                  </span>
                )}
              </div>
              <div className="form-group-page">
                <label>
                  Pengukuran Ke- <span className="required-mark">*</span>
                </label>
                <input
                  type="number"
                  name="pengukuranKe"
                  value={formData.pengukuranKe || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min="1"
                  placeholder="1"
                  className={
                    errors.pengukuranKe && touched.pengukuranKe
                      ? "input-error"
                      : ""
                  }
                />
                {errors.pengukuranKe && touched.pengukuranKe && (
                  <span className="error-text">
                    <span className="error-icon">●</span> {errors.pengukuranKe}
                  </span>
                )}
              </div>
            </div>

            <div className="form-group-page">
              <label>
                <input
                  type="checkbox"
                  name="isPengukuranPertama"
                  checked={
                    formData.pengukuranKe === "1" || formData.pengukuranKe === 1
                  }
                  readOnly
                />
                Pengukuran Pertama
              </label>
              {formData.pengukuranKe && (
                <p className="checkbox-hint">
                  {formData.pengukuranKe === "1" || formData.pengukuranKe === 1
                    ? "Ini adalah pengukuran pertama anak."
                    : "Tidak dicentang karena ini bukan pengukuran pertama."}
                </p>
              )}
            </div>
          </div>

          {/* TOMBOL AKSI */}
          <div className="form-actions-page">
            <button
              type="button"
              onClick={() => navigate("/admin/kelola-data-balita")}
              className="btn-kembali"
              disabled={isSaving}
            >
              ← Kembali
            </button>
            <button type="submit" className="btn-simpan" disabled={isSaving}>
              {isSaving
                ? "Menyimpan..."
                : isEditing
                ? "Simpan Perubahan"
                : "Tambah Data"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormBalita;

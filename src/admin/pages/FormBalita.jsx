import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBalitaById, createBalita, updateBalita } from "../../services/balitaService";
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
    case "namaIbu":
      return value.length < 3 ? "Nama ibu minimal 3 karakter" : "";
    case "beratLahir":
      return value < 0.5 || value > 10 ? "Berat lahir harus antara 0.5-10 kg" : "";
    case "tinggiLahir":
      return value < 30 || value > 70 ? "Tinggi lahir harus antara 30-70 cm" : "";
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

const FormBalita = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    nama: "",
    jenisKelamin: "",
    tanggalLahir: "",
    namaIbu: "",
    namaAyah: "",
    alamat: "",
    beratLahir: "",
    tinggiLahir: "",
    statusGizi: "normal",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch balita data if editing
  useEffect(() => {
    const fetchData = async () => {
      if (isEditing) {
        const { data, error } = await getBalitaById(id);
        if (data && !error) {
          setFormData({
            nama: data.nama || "",
            jenisKelamin: data.jenis_kelamin || "",
            tanggalLahir: data.tanggal_lahir || "",
            namaIbu: data.nama_ibu || "",
            namaAyah: data.nama_ayah || "",
            alamat: data.alamat || "",
            beratLahir: data.berat_lahir || "",
            tinggiLahir: data.tinggi_lahir || "",
            statusGizi: data.status_gizi || "normal",
          });
        } else {
          alert("Data Balita tidak ditemukan!");
          navigate("/admin/kelola-data-balita");
        }
      }
      setIsLoading(false);
    };

    fetchData();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const allTouched = {};
    
    // Validate required fields
    const requiredFields = ['nama', 'jenisKelamin', 'tanggalLahir', 'namaIbu', 'beratLahir', 'tinggiLahir'];
    requiredFields.forEach((key) => {
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

    try {
      // Transform data to match Supabase schema
      const balitaData = {
        nama: formData.nama,
        jenis_kelamin: formData.jenisKelamin,
        tanggal_lahir: formData.tanggalLahir,
        nama_ibu: formData.namaIbu || null,
        nama_ayah: formData.namaAyah || null,
        alamat: formData.alamat || null,
        berat_lahir: formData.beratLahir ? parseFloat(formData.beratLahir) : null,
        tinggi_lahir: formData.tinggiLahir ? parseFloat(formData.tinggiLahir) : null,
        status_gizi: formData.statusGizi || 'normal',
      };

      let result;
      if (isEditing) {
        result = await updateBalita(id, balitaData);
      } else {
        result = await createBalita(balitaData);
      }

      if (result.data && !result.error) {
        const successMessage = isEditing
          ? `Data ${formData.nama} berhasil diubah!`
          : `✅ Data ${formData.nama} berhasil ditambahkan!\n\nKode Balita: ${result.data.kode_balita}\n\nSimpan kode ini untuk referensi.`;
        
        alert(successMessage);
        navigate("/admin/kelola-data-balita");
      } else {
        throw new Error(result.error?.message || 'Gagal menyimpan data');
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
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
    <div className="kelola-container">
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
                Nama Ibu <span className="required-mark">*</span>
              </label>
              <input
                type="text"
                name="namaIbu"
                value={formData.namaIbu || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Masukkan nama ibu"
                className={
                  errors.namaIbu && touched.namaIbu ? "input-error" : ""
                }
              />
              {errors.namaIbu && touched.namaIbu && (
                <span className="error-text">
                  <span className="error-icon">●</span> {errors.namaIbu}
                </span>
              )}
            </div>

            <div className="form-group-page">
              <label>Nama Ayah</label>
              <input
                type="text"
                name="namaAyah"
                value={formData.namaAyah || ""}
                onChange={handleChange}
                placeholder="Masukkan nama ayah (opsional)"
              />
            </div>

            <div className="form-group-page">
              <label>
                Berat Lahir (kg) <span className="required-mark">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                name="beratLahir"
                value={formData.beratLahir || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Contoh: 3.2"
                className={
                  errors.beratLahir && touched.beratLahir ? "input-error" : ""
                }
              />
              {errors.beratLahir && touched.beratLahir && (
                <span className="error-text">
                  <span className="error-icon">●</span> {errors.beratLahir}
                </span>
              )}
            </div>

            <div className="form-group-page">
              <label>
                Tinggi Lahir (cm) <span className="required-mark">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                name="tinggiLahir"
                value={formData.tinggiLahir || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Contoh: 50"
                className={
                  errors.tinggiLahir && touched.tinggiLahir ? "input-error" : ""
                }
              />
              {errors.tinggiLahir && touched.tinggiLahir && (
                <span className="error-text">
                  <span className="error-icon">●</span> {errors.tinggiLahir}
                </span>
              )}
            </div>

            <div className="form-row-simple">
              <div className="form-group-page">
                <label>
                  Alamat
                </label>
                <input
                  type="text"
                  name="alamat"
                  value={formData.alamat || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Masukkan alamat lengkap"
                />
              </div>
              <div className="form-group-page">
                <label>
                  Posyandu
                </label>
                <input
                  type="text"
                  name="posyandu"
                  value={formData.posyandu || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Cth: Posyandu Anggrek"
                />
              </div>
            </div>

            <div className="form-group-page">
              <label>
                Status Gizi
              </label>
              <select
                name="statusGizi"
                value={formData.statusGizi || "normal"}
                onChange={handleChange}
              >
                <option value="normal">Normal</option>
                <option value="stunting">Stunting</option>
                <option value="gizi buruk">Gizi Buruk</option>
                <option value="gizi kurang">Gizi Kurang</option>
                <option value="gizi lebih">Gizi Lebih</option>
              </select>
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

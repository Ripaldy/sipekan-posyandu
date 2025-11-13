import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBalita, deleteBalita, updateBalita } from "../../services/balitaService";
import "../../styles/admin/KelolaDataBalita.css";

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

const KelolaDataBalita = () => {
  const [dataBalitaList, setDataBalitaList] = useState([]);
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch data balita from Supabase
  useEffect(() => {
    const fetchBalita = async () => {
      setIsLoading(true);
      const { data, error } = await getAllBalita();
      
      if (data && !error) {
        // Transform data to match component structure
        const transformedData = data.map(balita => ({
          id: balita.id,
          kodeBalita: balita.kode_balita || '-',
          nama: balita.nama,
          jenisKelamin: balita.jenis_kelamin,
          tanggalLahir: balita.tanggal_lahir,
          umur: hitungUmur(balita.tanggal_lahir),
          namaOrtu: balita.nama_ortu,
          posyandu: balita.posyandu || "Belum ditentukan",
          statusGizi: balita.status_gizi,
        }));
        setDataBalitaList(transformedData);
      } else {
        console.error("Failed to fetch balita:", error);
        alert("Gagal memuat data balita. Silakan refresh halaman.");
      }
      
      setIsLoading(false);
    };

    fetchBalita();
  }, []);

  const filteredData = useMemo(() => {
    if (!filter) return dataBalitaList;
    return dataBalitaList.filter(
      (d) =>
        d.nama.toLowerCase().includes(filter.toLowerCase()) ||
        d.kodeBalita.toLowerCase().includes(filter.toLowerCase()) ||
        d.posyandu.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, dataBalitaList]);

  const handleViewDetail = (id) => navigate(`/admin/balita/detail/${id}`);
  const handleAdd = () => navigate("/admin/balita/tambah");
  const handleEdit = (id) => navigate(`/admin/balita/edit/${id}`);

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data balita ini?")) {
      const { error } = await deleteBalita(id);
      
      if (!error) {
        // Remove from local state after successful delete
        setDataBalitaList(dataBalitaList.filter((d) => d.id !== id));
        alert("Data balita berhasil dihapus!");
      } else {
        console.error("Failed to delete balita:", error);
        alert("Gagal menghapus data balita. Silakan coba lagi.");
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    // Toggle between "Normal" and "Resiko Stunting"
    const newStatus = currentStatus === "Normal" ? "Resiko Stunting" : "Normal";
    
    // Confirm action
    if (!window.confirm(`Ubah status gizi menjadi "${newStatus}"?`)) {
      return;
    }

    // Update in database
    const { error } = await updateBalita(id, { status_gizi: newStatus });
    
    if (!error) {
      // Update local state
      setDataBalitaList(dataBalitaList.map(balita => 
        balita.id === id 
          ? { ...balita, statusGizi: newStatus }
          : balita
      ));
      alert(`Status gizi berhasil diubah menjadi "${newStatus}"!`);
    } else {
      console.error("Failed to update status:", error);
      alert("Gagal mengubah status gizi. Silakan coba lagi.");
    }
  };

  return (
    <div className="kelola-container">
      <div className="kelola-header">
        <h1>Kelola Data Balita</h1>
        <button onClick={handleAdd} className="btn-tambah">
          <span className="icon-plus">+</span> Tambah Data Balita
        </button>
      </div>

      <div className="filter-wrapper">
        <input
          type="text"
          placeholder="Cari berdasarkan kode balita, nama, atau posyandu..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="table-wrapper">
        {isLoading ? (
          <div className="loading-container" style={{ textAlign: 'center', padding: '40px' }}>
            <p>Memuat data balita...</p>
          </div>
        ) : (
          <table className="content-table">
            <thead>
              <tr>
                <th>Kode Balita</th>
                <th>Nama Balita</th>
                <th>Jenis Kelamin</th>
                <th>Posyandu</th>
                <th>Umur</th>
                <th>Status Gizi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
              filteredData.map((data) => (
                <tr key={data.id}>
                  <td>
                    <span className="kode-badge">{data.kodeBalita}</span>
                  </td>
                  <td>
                    <strong>{data.nama}</strong>
                  </td>
                  <td>{data.jenisKelamin}</td>
                  <td>{data.posyandu}</td>
                  <td>{data.umur}</td>
                  <td>
                    <button
                      onClick={() => handleToggleStatus(data.id, data.statusGizi)}
                      className={`status-badge status-clickable ${
                        data.statusGizi === "Normal" ? "normal" : "resiko"
                      }`}
                      title="Klik untuk mengubah status"
                    >
                      {data.statusGizi}
                    </button>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleViewDetail(data.id)}
                        className="btn-detail"
                        title="Lihat Detail"
                      >
                        <span className="icon-eye">◉</span> Detail
                      </button>
                      <button
                        onClick={() => handleEdit(data.id)}
                        className="btn-edit"
                        title="Edit Data"
                      >
                        <span className="icon-edit">✎</span> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(data.id)}
                        className="btn-hapus"
                        title="Hapus Data"
                      >
                        <span className="icon-trash">✕</span> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data-message">
                  Tidak ada data balita yang ditemukan.
                </td>
              </tr>
            )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default KelolaDataBalita;

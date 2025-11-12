import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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

const mockDataBalita = [
  {
    id: 1,
    nama: "Budi Santoso",
    jenisKelamin: "Laki-laki",
    tanggalLahir: "2023-05-20",
    umur: hitungUmur("2023-05-20"),
    pengukuranKe: 3,
    namaOrtu: "Santi Dewi",
    tinggiBadan: 75.5,
    beratBadan: 10.2,
    posyandu: "Anggrek",
    statusGizi: "Normal",
  },
  {
    id: 2,
    nama: "Alya Putri",
    jenisKelamin: "Perempuan",
    tanggalLahir: "2024-01-10",
    umur: hitungUmur("2024-01-10"),
    pengukuranKe: 2,
    namaOrtu: "Rudi Hartono",
    tinggiBadan: 68.0,
    beratBadan: 8.5,
    posyandu: "Mawar",
    statusGizi: "Resiko Stunting",
  },
];

const KelolaDataBalita = () => {
  const [dataBalitaList, setDataBalitaList] = useState(mockDataBalita);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  const filteredData = useMemo(() => {
    if (!filter) return dataBalitaList;
    return dataBalitaList.filter(
      (d) =>
        d.nama.toLowerCase().includes(filter.toLowerCase()) ||
        d.posyandu.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, dataBalitaList]);

  const handleViewDetail = (id) => navigate(`/admin/balita/detail/${id}`);
  const handleAdd = () => navigate("/admin/balita/tambah");
  const handleEdit = (id) => navigate(`/admin/balita/edit/${id}`);

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data balita ini?")) {
      setDataBalitaList(dataBalitaList.filter((d) => d.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setDataBalitaList(
      dataBalitaList.map((d) =>
        d.id === id
          ? {
              ...d,
              statusGizi:
                d.statusGizi === "Normal" ? "Resiko Stunting" : "Normal",
            }
          : d
      )
    );
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
          placeholder="Cari berdasarkan nama balita/posyandu..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="table-wrapper">
        <table className="content-table">
          <thead>
            <tr>
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
                    <strong>{data.nama}</strong>
                  </td>
                  <td>{data.jenisKelamin}</td>
                  <td>{data.posyandu}</td>
                  <td>{data.umur}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        data.statusGizi === "Normal" ? "normal" : "resiko"
                      }`}
                    >
                      {data.statusGizi}
                    </span>
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
                      <button
                        onClick={() => handleToggleStatus(data.id)}
                        className="btn-status"
                        title="Ubah Status"
                      >
                        <span className="icon-toggle">↻</span>
                        {data.statusGizi === "Normal"
                          ? " Tandai Resiko"
                          : " Tandai Normal"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data-message">
                  Tidak ada data balita yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KelolaDataBalita;

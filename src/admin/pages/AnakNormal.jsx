import React, { useState } from "react";
import { Search, CheckCircle, Filter, Users } from "lucide-react";
import "../../styles/admin/AnakNormal.css";

const AnakNormal = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJenisKelamin, setFilterJenisKelamin] = useState("semua");

  const anakNormalData = [
    {
      id: 1,
      nama: "Budi Santoso",
      jenisKelamin: "Laki-laki",
      tanggalLahir: "2023-06-15",
      umur: "24 bulan",
      bb: "11.5 kg",
      tb: "85 cm",
      lila: "17.2 cm",
      status: "Normal",
    },
    {
      id: 2,
      nama: "Siti Nurhaliza",
      jenisKelamin: "Perempuan",
      tanggalLahir: "2023-08-20",
      umur: "18 bulan",
      bb: "10.8 kg",
      tb: "82 cm",
      lila: "16.8 cm",
      status: "Normal",
    },
    {
      id: 3,
      nama: "Dewi Lestari",
      jenisKelamin: "Perempuan",
      tanggalLahir: "2023-02-05",
      umur: "30 bulan",
      bb: "13.2 kg",
      tb: "90 cm",
      lila: "18.5 cm",
      status: "Normal",
    },
    {
      id: 4,
      nama: "Maya Kusuma",
      jenisKelamin: "Perempuan",
      tanggalLahir: "2023-07-18",
      umur: "22 bulan",
      bb: "11.0 kg",
      tb: "83 cm",
      lila: "17.0 cm",
      status: "Normal",
    },
    {
      id: 5,
      nama: "Toni Wijaya",
      jenisKelamin: "Laki-laki",
      tanggalLahir: "2023-03-25",
      umur: "28 bulan",
      bb: "12.5 kg",
      tb: "88 cm",
      lila: "18.0 cm",
      status: "Normal",
    },
    {
      id: 6,
      nama: "Lisa Maulana",
      jenisKelamin: "Perempuan",
      tanggalLahir: "2023-09-08",
      umur: "20 bulan",
      bb: "10.5 kg",
      tb: "81 cm",
      lila: "16.5 cm",
      status: "Normal",
    },
    {
      id: 7,
      nama: "Andi Prasetyo",
      jenisKelamin: "Laki-laki",
      tanggalLahir: "2023-05-30",
      umur: "26 bulan",
      bb: "12.2 kg",
      tb: "87 cm",
      lila: "17.8 cm",
      status: "Normal",
    },
    {
      id: 8,
      nama: "Nina Handayani",
      jenisKelamin: "Perempuan",
      tanggalLahir: "2023-10-02",
      umur: "19 bulan",
      bb: "10.3 kg",
      tb: "80 cm",
      lila: "16.3 cm",
      status: "Normal",
    },
  ];

  const filteredData = anakNormalData.filter((anak) => {
    const matchSearch = anak.nama
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchJenisKelamin =
      filterJenisKelamin === "semua" ||
      anak.jenisKelamin === filterJenisKelamin;
    return matchSearch && matchJenisKelamin;
  });

  const totalLaki = anakNormalData.filter(
    (a) => a.jenisKelamin === "Laki-laki"
  ).length;
  const totalPerempuan = anakNormalData.filter(
    (a) => a.jenisKelamin === "Perempuan"
  ).length;

  return (
    <div className="page-container">
      <div className="header-bg">
        <div className="page-header">
          <div className="header-title">
            <CheckCircle size={40} color="white" />
            <div>
              <h1>Data Anak dengan Pertumbuhan Normal</h1>
              <p>
                Total: {anakNormalData.length} anak dengan pertumbuhan normal
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card laki-laki">
          <div className="stat-icon">
            <Users size={32} />
          </div>
          <div className="stat-content">
            <h3>Laki-laki</h3>
            <p className="stat-number">{totalLaki}</p>
          </div>
        </div>

        <div className="stat-card perempuan">
          <div className="stat-icon">
            <Users size={32} />
          </div>
          <div className="stat-content">
            <h3>Perempuan</h3>
            <p className="stat-number">{totalPerempuan}</p>
          </div>
        </div>

        <div className="stat-card total">
          <div className="stat-icon">
            <CheckCircle size={32} />
          </div>
          <div className="stat-content">
            <h3>Total</h3>
            <p className="stat-number">{anakNormalData.length}</p>
          </div>
        </div>
      </div>

      <div className="search-filter-section">
        <div className="search-box">
          <Search size={20} color="#22c55e" />
          <input
            type="text"
            placeholder="Cari nama anak..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-box">
          <Filter size={20} color="#22c55e" />
          <label htmlFor="jenisKelaminFilter">Filter Jenis Kelamin:</label>
          <select
            id="jenisKelaminFilter"
            value={filterJenisKelamin}
            onChange={(e) => setFilterJenisKelamin(e.target.value)}
            className="filter-select"
          >
            <option value="semua">Semua</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Jenis Kelamin</th>
              <th>Tanggal Lahir</th>
              <th>Umur</th>
              <th>BB</th>
              <th>TB</th>
              <th>LILA</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((anak) => (
                <tr key={anak.id}>
                  <td>{anak.nama}</td>
                  <td>{anak.jenisKelamin}</td>
                  <td>{anak.tanggalLahir}</td>
                  <td>{anak.umur}</td>
                  <td>{anak.bb}</td>
                  <td>{anak.tb}</td>
                  <td>{anak.lila}</td>
                  <td>
                    <span className="status-badge status-normal">
                      {anak.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  Tidak ada data yang ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnakNormal;

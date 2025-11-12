import React, { useState } from "react";
import { Search, Users, Filter } from "lucide-react";
import "../../styles/admin/AnakTerdaftar.css";

const AnakTerdaftar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState("semua");

  const anakData = [
    {
      id: 1,
      nama: "Budi Santoso",
      jenisKelamin: "Laki-laki",
      tanggalLahir: "2023-06-15",
      umur: "24 bulan",
      desaKel: "Desa Makmur",
      namaOrtu: "Santoso",
      posyandu: "Posyandu Sejahtera",
      bb: 12.5,
      tb: 87.5,
      lila: 14.2,
      status: "Normal",
    },
    {
      id: 2,
      nama: "Siti Nurhaliza",
      jenisKelamin: "Perempuan",
      tanggalLahir: "2023-08-20",
      umur: "18 bulan",
      desaKel: "Desa Sejahtera",
      namaOrtu: "Nur Haliza",
      posyandu: "Posyandu Maju",
      bb: 10.8,
      tb: 82.3,
      lila: 13.5,
      status: "Normal",
    },
    {
      id: 3,
      nama: "Ahmad Rahman",
      jenisKelamin: "Laki-laki",
      tanggalLahir: "2023-10-10",
      umur: "12 bulan",
      desaKel: "Desa Makmur",
      namaOrtu: "Rahman",
      posyandu: "Posyandu Sehat",
      bb: 8.5,
      tb: 72.0,
      lila: 12.1,
      status: "Stunting",
    },
    {
      id: 4,
      nama: "Dewi Lestari",
      jenisKelamin: "Perempuan",
      tanggalLahir: "2023-02-05",
      umur: "30 bulan",
      desaKel: "Desa Jaya",
      namaOrtu: "Lestari",
      posyandu: "Posyandu Bersama",
      bb: 13.2,
      tb: 92.5,
      lila: 14.8,
      status: "Normal",
    },
    {
      id: 5,
      nama: "Rudi Hartono",
      jenisKelamin: "Laki-laki",
      tanggalLahir: "2023-04-12",
      umur: "15 bulan",
      desaKel: "Desa Sejahtera",
      namaOrtu: "Hartono",
      posyandu: "Posyandu Maju",
      bb: 9.2,
      tb: 76.5,
      lila: 12.8,
      status: "Stunting",
    },
    {
      id: 6,
      nama: "Maya Kusuma",
      jenisKelamin: "Perempuan",
      tanggalLahir: "2023-07-18",
      umur: "22 bulan",
      desaKel: "Desa Jaya",
      namaOrtu: "Kusuma",
      posyandu: "Posyandu Sehat",
      bb: 11.5,
      tb: 84.2,
      lila: 13.9,
      status: "Normal",
    },
    {
      id: 7,
      nama: "Toni Wijaya",
      jenisKelamin: "Laki-laki",
      tanggalLahir: "2023-03-25",
      umur: "28 bulan",
      desaKel: "Desa Makmur",
      namaOrtu: "Wijaya",
      posyandu: "Posyandu Sejahtera",
      bb: 12.8,
      tb: 90.0,
      lila: 14.5,
      status: "Normal",
    },
    {
      id: 8,
      nama: "Lisa Maulana",
      jenisKelamin: "Perempuan",
      tanggalLahir: "2023-09-08",
      umur: "20 bulan",
      desaKel: "Desa Indah",
      namaOrtu: "Maulana",
      posyandu: "Posyandu Bersama",
      bb: 10.2,
      tb: 80.5,
      lila: 13.2,
      status: "Normal",
    },
  ];

  const filteredData = anakData.filter((anak) => {
    const matchSearch = anak.nama
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchGender =
      filterGender === "semua" || anak.jenisKelamin === filterGender;
    return matchSearch && matchGender;
  });

  return (
    <div className="page-container">
      <div className="header-bg">
        <div className="page-header">
          <div className="header-title">
            <Users size={40} color="white" />
            <div>
              <h1>Data Anak Terdaftar</h1>
              <p>Total: {anakData.length} anak terdaftar dalam sistem</p>
            </div>
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
          <label htmlFor="genderFilter">Filter Jenis Kelamin:</label>
          <select
            id="genderFilter"
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
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
              <th>Desa/Kel</th>
              <th>Nama Ortu</th>
              <th>Posyandu</th>
              <th>BB (kg)</th>
              <th>TB (cm)</th>
              <th>LILA (cm)</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((anak) => (
                <tr key={anak.id}>
                  <td>{anak.nama}</td>
                  <td>{anak.jenisKelamin}</td>
                  <td>{anak.tanggalLahir}</td>
                  <td>{anak.desaKel}</td>
                  <td>{anak.namaOrtu}</td>
                  <td>{anak.posyandu}</td>
                  <td>{anak.bb}</td>
                  <td>{anak.tb}</td>
                  <td>{anak.lila}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-data">
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

export default AnakTerdaftar;

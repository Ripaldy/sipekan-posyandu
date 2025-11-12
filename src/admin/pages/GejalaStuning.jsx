import React, { useState } from "react";
import { Search, AlertCircle, Filter } from "lucide-react";
import "../../styles/admin/GejalaStuning.css";

const GejalaStuning = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisiko, setFilterRisiko] = useState("semua");

  const stuntingData = [
    {
      id: 1,
      nama: "Ahmad Rahman",
      jenisKelamin: "Laki-laki",
      tanggalLahir: "2023-10-10",
      umur: "12 bulan",
      bb: "8.2 kg",
      tb: "72 cm",
      lila: "14.5 cm",
      status: "Risiko Tinggi",
    },
    {
      id: 2,
      nama: "Rudi Hartono",
      jenisKelamin: "Laki-laki",
      tanggalLahir: "2023-04-12",
      umur: "15 bulan",
      bb: "9.5 kg",
      tb: "75 cm",
      lila: "15.2 cm",
      status: "Risiko Sedang",
    },
    {
      id: 3,
      nama: "Rina Suwandi",
      jenisKelamin: "Perempuan",
      tanggalLahir: "2023-08-05",
      umur: "18 bulan",
      bb: "10.1 kg",
      tb: "78 cm",
      lila: "15.8 cm",
      status: "Risiko Tinggi",
    },
    {
      id: 4,
      nama: "Boni Kurniawan",
      jenisKelamin: "Laki-laki",
      tanggalLahir: "2023-05-22",
      umur: "16 bulan",
      bb: "9.8 kg",
      tb: "76 cm",
      lila: "15.5 cm",
      status: "Risiko Sedang",
    },
    {
      id: 5,
      nama: "Tina Wijaya",
      jenisKelamin: "Perempuan",
      tanggalLahir: "2023-06-30",
      umur: "14 bulan",
      bb: "8.9 kg",
      tb: "73 cm",
      lila: "14.8 cm",
      status: "Risiko Tinggi",
    },
    {
      id: 6,
      nama: "Bambang Sutrisno",
      jenisKelamin: "Laki-laki",
      tanggalLahir: "2023-03-15",
      umur: "20 bulan",
      bb: "10.5 kg",
      tb: "79 cm",
      lila: "16.2 cm",
      status: "Risiko Sedang",
    },
    {
      id: 7,
      nama: "Siska Mardiana",
      jenisKelamin: "Perempuan",
      tanggalLahir: "2023-07-12",
      umur: "17 bulan",
      bb: "9.7 kg",
      tb: "77 cm",
      lila: "15.9 cm",
      status: "Risiko Tinggi",
    },
    {
      id: 8,
      nama: "Hendra Gunawan",
      jenisKelamin: "Laki-laki",
      tanggalLahir: "2023-02-28",
      umur: "19 bulan",
      bb: "10.2 kg",
      tb: "78.5 cm",
      lila: "16.0 cm",
      status: "Risiko Sedang",
    },
  ];

  const filteredData = stuntingData.filter((anak) => {
    const matchSearch = anak.nama
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchRisiko =
      filterRisiko === "semua" || anak.status === filterRisiko;
    return matchSearch && matchRisiko;
  });

  const risikoTinggi = stuntingData.filter(
    (a) => a.status === "Risiko Tinggi"
  ).length;
  const risikoSedang = stuntingData.filter(
    (a) => a.status === "Risiko Sedang"
  ).length;

  return (
    <div className="page-container">
      <div className="header-bg">
        <div className="page-header">
          <div className="header-title">
            <AlertCircle size={40} color="white" />
            <div>
              <h1>Data Gejala Stunting</h1>
              <p>Total: {stuntingData.length} anak dengan risiko stunting</p>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card risiko-tinggi">
          <div className="stat-icon">
            <AlertCircle size={32} />
          </div>
          <div className="stat-content">
            <h3>Risiko Tinggi</h3>
            <p className="stat-number">{risikoTinggi}</p>
          </div>
        </div>

        <div className="stat-card risiko-sedang">
          <div className="stat-icon">
            <AlertCircle size={32} />
          </div>
          <div className="stat-content">
            <h3>Risiko Sedang</h3>
            <p className="stat-number">{risikoSedang}</p>
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
          <label htmlFor="risikoFilter">Filter Risiko:</label>
          <select
            id="risikoFilter"
            value={filterRisiko}
            onChange={(e) => setFilterRisiko(e.target.value)}
            className="filter-select"
          >
            <option value="semua">Semua</option>
            <option value="Risiko Tinggi">Risiko Tinggi</option>
            <option value="Risiko Sedang">Risiko Sedang</option>
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
                    <span
                      className={`status-badge status-${anak.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
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

export default GejalaStuning;

import React, { useState, useEffect } from "react";
import { Search, CheckCircle, Filter, Users } from "lucide-react";
import { getBalitaByStatus } from "../../services/balitaService";
import "../../styles/admin/AnakNormal.css";

const hitungUmur = (tanggalLahir) => {
  if (!tanggalLahir) return "0 bulan";
  const tglLahir = new Date(tanggalLahir);
  const hariIni = new Date();
  let tahun = hariIni.getFullYear() - tglLahir.getFullYear();
  let bulan = hariIni.getMonth() - tglLahir.getMonth();

  if (bulan < 0 || (bulan === 0 && hariIni.getDate() < tglLahir.getDate())) {
    tahun--;
    bulan += 12;
  }

  const totalBulan = tahun * 12 + bulan;
  if (totalBulan < 12) {
    return `${totalBulan} bulan`;
  } else {
    return `${tahun} tahun ${bulan} bulan`;
  }
};

const AnakNormal = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJenisKelamin, setFilterJenisKelamin] = useState("semua");
  const [anakNormalData, setAnakNormalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await getBalitaByStatus("Normal");
      if (data && !error) {
        const transformedData = data.map((balita) => ({
          id: balita.id,
          nama: balita.nama,
          jenisKelamin: balita.jenis_kelamin,
          tanggalLahir: balita.tanggal_lahir,
          umur: hitungUmur(balita.tanggal_lahir),
          namaOrtu: balita.nama_ibu || "-",
          alamat: balita.alamat || balita.desa_kelurahan || "-",
          posyandu: balita.posyandu || "-",
          statusGizi: balita.status_gizi,
        }));
        setAnakNormalData(transformedData);
      } else {
        console.error("Error fetching normal balita:", error);
        setAnakNormalData([]);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

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

  if (isLoading) {
    return (
      <div className="page-container">
        <p>Memuat data anak dengan pertumbuhan normal...</p>
      </div>
    );
  }

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
              <th>Nama Ortu</th>
              <th>Alamat</th>
              <th>Posyandu</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((anak) => (
                <tr key={anak.id}>
                  <td>{anak.nama}</td>
                  <td>{anak.jenisKelamin}</td>
                  <td>
                    {new Date(anak.tanggalLahir).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td>{anak.umur}</td>
                  <td>{anak.namaOrtu}</td>
                  <td>{anak.alamat || "-"}</td>
                  <td>{anak.posyandu || "-"}</td>
                  <td>
                    <span className="status-badge status-normal">
                      {anak.statusGizi || "Normal"}
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

import React, { useState, useEffect } from "react";
import { Search, Users, Filter } from "lucide-react";
import { getAllBalita } from "../../services/balitaService";
import "../../styles/admin/AnakTerdaftar.css";

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

const AnakTerdaftar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState("semua");
  const [anakData, setAnakData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await getAllBalita();
      if (data && !error) {
        const transformedData = data.map((balita) => ({
          id: balita.id,
          nama: balita.nama,
          jenisKelamin: balita.jenis_kelamin,
          tanggalLahir: balita.tanggal_lahir,
          umur: hitungUmur(balita.tanggal_lahir),
          alamat: balita.alamat,
          namaOrtu: balita.nama_ortu,
          posyandu: balita.posyandu,
          statusGizi: balita.status_gizi,
        }));
        setAnakData(transformedData);
      } else {
        console.error("Error fetching balita:", error);
        setAnakData([]);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const filteredData = anakData.filter((anak) => {
    const matchSearch = anak.nama
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchGender =
      filterGender === "semua" || anak.jenisKelamin === filterGender;
    return matchSearch && matchGender;
  });

  if (isLoading) {
    return (
      <div className="page-container">
        <p>Memuat data anak terdaftar...</p>
      </div>
    );
  }

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
              <th>Umur</th>
              <th>Alamat</th>
              <th>Nama Ortu</th>
              <th>Posyandu</th>
              <th>Status Gizi</th>
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
                  <td>{anak.alamat || "-"}</td>
                  <td>{anak.namaOrtu}</td>
                  <td>{anak.posyandu || "-"}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        anak.statusGizi?.toLowerCase() === "stunting"
                          ? "status-stunting"
                          : anak.statusGizi?.toLowerCase() === "normal"
                          ? "status-normal"
                          : "status-lainnya"
                      }`}
                    >
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

export default AnakTerdaftar;

import React, { useState, useEffect } from "react";
import { Search, AlertCircle, Filter } from "lucide-react";
import { getBalitaByStatus, updateBalita } from "../../services/balitaService";
import "../../styles/admin/GejalaStuning.css";

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

const GejalaStuning = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisiko, setFilterRisiko] = useState("semua");
  const [stuntingData, setStuntingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch balita with "Resiko Stunting" status
      const { data, error } = await getBalitaByStatus("Resiko Stunting");
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
          // Use risiko_stunting field from database, default to "Risiko Tinggi"
          status: balita.risiko_stunting || "Risiko Tinggi",
        }));
        setStuntingData(transformedData);
      } else {
        console.error("Error fetching stunting data:", error);
        setStuntingData([]);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleToggleRisiko = async (id) => {
    // Update local state immediately for responsive UI
    const updatedData = stuntingData.map(anak =>
      anak.id === id
        ? {
            ...anak,
            status: anak.status === "Risiko Tinggi" ? "Risiko Sedang" : "Risiko Tinggi"
          }
        : anak
    );
    setStuntingData(updatedData);

    // Find the updated item to save to database
    const updatedAnak = updatedData.find(anak => anak.id === id);
    if (updatedAnak) {
      // Save to database
      const { error } = await updateBalita(id, { 
        risiko_stunting: updatedAnak.status 
      });
      
      if (error) {
        console.error('Failed to update risiko status:', error);
        // Revert on error
        setStuntingData(stuntingData);
        alert('Gagal mengubah status risiko. Silakan coba lagi.');
      } else {
        console.log('✅ Status risiko updated:', updatedAnak.status);
      }
    }
  };

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

  if (isLoading) {
    return (
      <div className="page-container">
        <p>Memuat data gejala stunting...</p>
      </div>
    );
  }

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
                    <span
                      className={`status-badge status-${anak.status
                        .toLowerCase()
                        .replace(" ", "-")} status-clickable`}
                      onClick={() => handleToggleRisiko(anak.id)}
                      style={{ cursor: 'pointer' }}
                      title="Klik untuk mengubah status risiko"
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

import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { searchBalita } from "../services/balitaService";
import { getPemeriksaanByBalitaId } from "../services/pemeriksaanService";
import "../styles/pages/DataAnak.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DataAnak = () => {
  const [kodeUnik, setKodeUnik] = useState("");
  const [dataAnak, setDataAnak] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!kodeUnik) {
      setError("Kode unik/nama tidak boleh kosong.");
      return;
    }

    setIsLoading(true);
    setDataAnak(null);
    setError("");

    try {
      // Search balita by name or NIK
      const { data: balitaList, error: searchError } = await searchBalita(kodeUnik);

      if (searchError || !balitaList || balitaList.length === 0) {
        setError(`Data anak dengan kata kunci "${kodeUnik}" tidak ditemukan.`);
        setIsLoading(false);
        return;
      }

      // Get first result
      const balita = balitaList[0];

      // Get pemeriksaan history
      const { data: pemeriksaanList, error: pemeriksaanError } =
        await getPemeriksaanByBalitaId(balita.id);

      if (pemeriksaanError) {
        console.error("Error fetching pemeriksaan:", pemeriksaanError);
      }

      // Transform data
      const riwayat = pemeriksaanList
        ? pemeriksaanList
            .map((p, index) => ({
              pengukuranKe: p.pengukuran_ke || index + 1,
              tanggal: p.tanggal,
              berat: p.berat_badan,
              tinggi: p.tinggi_badan,
              lila: p.lingkar_lengan || 0,
            }))
            .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal))
        : [];

      setDataAnak({
        kodeBalita: balita.kode_balita || '-',
        nama: balita.nama,
        jenisKelamin: balita.jenis_kelamin,
        tanggalLahir: balita.tanggal_lahir,
        namaOrtu: balita.nama_ortu,
        alamat: balita.alamat,
        posyandu: balita.posyandu,
        statusGizi: balita.status_gizi,
        riwayat: riwayat,
      });
    } catch (err) {
      console.error("Search error:", err);
      setError("Terjadi kesalahan saat mencari data.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const chartData = {
    labels: dataAnak?.riwayat.map((r) =>
      new Date(r.tanggal).toLocaleDateString("id-ID", {
        month: "short",
        year: "numeric",
      })
    ),
    datasets: [
      {
        label: "Berat Badan (kg)",
        data: dataAnak?.riwayat.map((r) => r.berat),
        borderColor: "rgb(56, 142, 60)",
        backgroundColor: "rgba(56, 142, 60, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "rgb(56, 142, 60)",
        pointBorderColor: "white",
        pointBorderWidth: 2,
        yAxisID: "y",
      },
      {
        label: "Tinggi Badan (cm)",
        data: dataAnak?.riwayat.map((r) => r.tinggi),
        borderColor: "rgb(244, 67, 54)",
        backgroundColor: "rgba(244, 67, 54, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "rgb(244, 67, 54)",
        pointBorderColor: "white",
        pointBorderWidth: 2,
        yAxisID: "y1",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          padding: 15,
          font: { size: 12, weight: "bold" },
          usePointStyle: true,
          borderRadius: 4,
        },
      },
      title: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        borderRadius: 8,
        titleFont: { weight: "bold", size: 13 },
        bodyFont: { size: 12 },
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Berat Badan (kg)",
          font: { weight: "bold" },
        },
        grid: { color: "rgba(56, 142, 60, 0.05)" },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Tinggi Badan (cm)",
          font: { weight: "bold" },
        },
        grid: { drawOnChartArea: false },
      },
    },
  };

  return (
    <div className="data-anak-container" data-aos="fade-in">
      <div className="hero-data-anak">
        <h1>📊 Cek Data Anak</h1>
        <p>
          Masukkan kode unik atau nama anak untuk melihat data dan grafik pertumbuhannya
          secara detail.
        </p>
      </div>

      <div className="search-form-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={kodeUnik}
            onChange={(e) => setKodeUnik(e.target.value)}
            placeholder="Masukkan Kode Unik atau Nama Anak (contoh: 20220730-RB-001)"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "⏳ Mencari..." : "🔍 Cari Data"}
          </button>
        </form>
      </div>

      <div className="results-container">
        {isLoading && (
          <p className="status-info">⏳ Mencari data, mohon tunggu...</p>
        )}
        {error && <p className="status-error">❌ {error}</p>}
        {!isLoading && !error && !dataAnak && (
          <p className="status-info">
            📝 Silakan masukkan nama anak dan klik "Cari Data" untuk
            menampilkan informasi
          </p>
        )}

        {dataAnak && (
          <div className="data-display" data-aos="fade-up">
            <h2>✅ Hasil Pencarian</h2>
            <table className="data-table">
              <tbody>
                <tr className="kode-row">
                  <td>🔑 Kode Balita</td>
                  <td>
                    <strong className="kode-highlight">{dataAnak.kodeBalita}</strong>
                  </td>
                </tr>
                <tr>
                  <td>👤 Nama</td>
                  <td>
                    <strong>{dataAnak.nama}</strong>
                  </td>
                </tr>
                <tr>
                  <td>🚻 Jenis Kelamin</td>
                  <td>
                    {dataAnak.jenisKelamin === "Laki-laki" ? "👦" : "👧"}{" "}
                    {dataAnak.jenisKelamin}
                  </td>
                </tr>
                <tr>
                  <td>🎂 Tanggal Lahir</td>
                  <td>
                    {new Date(dataAnak.tanggalLahir).toLocaleDateString(
                      "id-ID",
                      { day: "numeric", month: "long", year: "numeric" }
                    )}
                  </td>
                </tr>
                <tr>
                  <td>⏰ Usia</td>
                  <td>{calculateAge(dataAnak.tanggalLahir)} tahun</td>
                </tr>
                {dataAnak.riwayat && dataAnak.riwayat.length > 0 && (
                  <>
                    <tr>
                      <td>⚖️ Berat Badan Terakhir</td>
                      <td>
                        <strong>
                          {dataAnak.riwayat.slice(-1)[0].berat} kg
                        </strong>
                      </td>
                    </tr>
                    <tr>
                      <td>📏 Tinggi Badan Terakhir</td>
                      <td>
                        <strong>
                          {dataAnak.riwayat.slice(-1)[0].tinggi} cm
                        </strong>
                      </td>
                    </tr>
                  </>
                )}
                <tr>
                  <td>📊 Status Gizi</td>
                  <td>
                    <strong>{dataAnak.statusGizi || "Normal"}</strong>
                  </td>
                </tr>
              </tbody>
            </table>

            {dataAnak.riwayat && dataAnak.riwayat.length > 0 && (
              <div className="riwayat-pengukuran-section">
                <h3>📋 Riwayat Pengukuran</h3>
                <div className="table-wrapper">
                  <table className="riwayat-table">
                    <thead>
                      <tr>
                        <th>Pengukuran Ke-</th>
                        <th>Tanggal</th>
                        <th>Berat Badan (kg)</th>
                        <th>Tinggi Badan (cm)</th>
                        <th>LILA (cm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataAnak.riwayat.map((item, index) => (
                        <tr key={index}>
                          <td>{item.pengukuranKe}</td>
                          <td>
                            {new Date(item.tanggal).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </td>
                          <td>{item.berat}</td>
                          <td>{item.tinggi}</td>
                          <td>{item.lila || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {dataAnak.riwayat && dataAnak.riwayat.length > 0 ? (
              <div className="grafik-container">
                <h3>📈 Grafik Pertumbuhan</h3>
                <div className="chart-wrapper">
                  <Line options={chartOptions} data={chartData} />
                </div>
              </div>
            ) : (
              <div className="grafik-container">
                <p className="status-info">
                  📝 Belum ada data pemeriksaan untuk ditampilkan dalam grafik.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataAnak;

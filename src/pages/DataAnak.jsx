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

const mockDatabase = {
  AZ123: {
    nama: "Budi Santoso",
    jenisKelamin: "Laki-laki",
    tanggalLahir: "2024-01-15",
    riwayat: [
      { tanggal: "2024-01-15", berat: 3.2, tinggi: 50 },
      { tanggal: "2024-02-15", berat: 4.1, tinggi: 54 },
      { tanggal: "2024-03-16", berat: 5.0, tinggi: 57 },
      { tanggal: "2024-04-15", berat: 5.8, tinggi: 60 },
    ],
  },
  BC456: {
    nama: "Citra Lestari",
    jenisKelamin: "Perempuan",
    tanggalLahir: "2023-11-20",
    riwayat: [
      { tanggal: "2023-11-20", berat: 2.9, tinggi: 48 },
      { tanggal: "2023-12-21", berat: 3.8, tinggi: 52 },
      { tanggal: "2024-01-20", berat: 4.5, tinggi: 55 },
      { tanggal: "2024-02-19", berat: 5.1, tinggi: 58 },
    ],
  },
};

const DataAnak = () => {
  const [kodeUnik, setKodeUnik] = useState("");
  const [dataAnak, setDataAnak] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!kodeUnik) {
      setError("Kode unik tidak boleh kosong.");
      return;
    }

    setIsLoading(true);
    setDataAnak(null);
    setError("");

    setTimeout(() => {
      const result = mockDatabase[kodeUnik.toUpperCase()];
      if (result) {
        setDataAnak(result);
      } else {
        setError(`Data anak dengan kode unik "${kodeUnik}" tidak ditemukan.`);
      }
      setIsLoading(false);
    }, 1500);
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
          Masukkan kode unik anak untuk melihat data dan grafik pertumbuhannya
          secara detail.
        </p>
      </div>

      <div className="search-form-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={kodeUnik}
            onChange={(e) => setKodeUnik(e.target.value)}
            placeholder="Masukkan Kode Unik (contoh: AZ123)"
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
            📝 Silakan masukkan kode unik dan klik "Cari Data" untuk menampilkan
            informasi.
          </p>
        )}

        {dataAnak && (
          <div className="data-display" data-aos="fade-up">
            <h2>✅ Hasil Pencarian</h2>
            <table className="data-table">
              <tbody>
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
                <tr>
                  <td>⚖️ Berat Badan Terakhir</td>
                  <td>
                    <strong>{dataAnak.riwayat.slice(-1)[0].berat} kg</strong>
                  </td>
                </tr>
                <tr>
                  <td>📏 Tinggi Badan Terakhir</td>
                  <td>
                    <strong>{dataAnak.riwayat.slice(-1)[0].tinggi} cm</strong>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="grafik-container">
              <h3>📈 Grafik Pertumbuhan</h3>
              <div className="chart-wrapper">
                <Line options={chartOptions} data={chartData} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataAnak;

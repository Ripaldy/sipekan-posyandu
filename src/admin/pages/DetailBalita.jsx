import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
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
import { getBalitaById } from "../../services/balitaService";
import { getPemeriksaanByBalitaId } from "../../services/pemeriksaanService";
import "../../styles/admin/DetailBalita.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DetailBalita = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const componentToPrintRef = useRef();

  const [dataAnak, setDataAnak] = useState(null);
  const [riwayatPemeriksaan, setRiwayatPemeriksaan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        console.log('🔄 Starting fetch for balita ID:', id);
        
        // Fetch balita data
        const { data: balita, error: balitaError } = await getBalitaById(id);
        
        console.log('📊 Balita fetch result:', { balita, balitaError });

        if (!isMounted) return;

        if (balitaError) {
          console.error("❌ Error fetching balita:", balitaError);
          setError("Gagal memuat data balita: " + balitaError.message);
          setIsLoading(false);
          return;
        }

        if (!balita) {
          console.error("❌ Balita not found");
          setError("Data balita tidak ditemukan");
          setIsLoading(false);
          return;
        }

        console.log('✅ Setting balita data:', balita.nama);

        // Transform balita data
        const transformedBalita = {
          id: balita.id,
          kodeBalita: balita.kode_balita || '-',
          nama: balita.nama || '',
          jenisKelamin: balita.jenis_kelamin || '',
          tanggalLahir: balita.tanggal_lahir || '',
          namaOrtu: balita.nama_ortu || '',
          alamat: balita.alamat || '',
          posyandu: balita.posyandu || '',
          statusGizi: balita.status_gizi || 'Normal',
        };

        setDataAnak(transformedBalita);
        console.log('✅ Balita data set successfully');

        // Fetch pemeriksaan data
        console.log('🔄 Fetching pemeriksaan...');
        const { data: pemeriksaan, error: pemeriksaanError } =
          await getPemeriksaanByBalitaId(id);

        console.log('📊 Pemeriksaan fetch result:', { 
          count: pemeriksaan?.length || 0, 
          pemeriksaanError 
        });

        if (!isMounted) return;

        if (!pemeriksaanError && pemeriksaan && pemeriksaan.length > 0) {
          const transformedRiwayat = pemeriksaan
            .map((p, index) => ({
              id: p.id,
              tanggal: p.tanggal_pemeriksaan || p.tanggal,
              berat: p.berat_badan || 0,
              tinggi: p.tinggi_badan || 0,
              lila: p.lingkar_lengan || 0,
              pengukuranKe: p.pengukuran_ke || index + 1,
            }))
            .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
          
          setRiwayatPemeriksaan(transformedRiwayat);
          console.log('✅ Pemeriksaan data set:', transformedRiwayat.length, 'records');
        } else {
          setRiwayatPemeriksaan([]);
          console.log('ℹ️ No pemeriksaan data');
        }

        console.log('✅ All data loaded successfully');
        setIsLoading(false);
        
      } catch (error) {
        console.error("❌ Error in fetchData:", error);
        if (isMounted) {
          setError("Terjadi kesalahan: " + error.message);
          setIsLoading(false);
        }
      }
    };

    if (id) {
      fetchData();
    } else {
      setError("ID balita tidak valid");
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handlePrint = useReactToPrint({
    content: () => componentToPrintRef.current,
    documentTitle: `Data Pertumbuhan - ${dataAnak?.nama || "Anak"}`,
  });

  if (isLoading) {
    return (
      <div className="detail-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Memuat data balita...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-container">
        <div className="error-state">
          <h2>⚠️ Terjadi Kesalahan</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate("/admin/kelola-data-balita")}
            className="btn-kembali"
          >
            Kembali ke Daftar
          </button>
        </div>
      </div>
    );
  }

  if (!dataAnak) {
    return (
      <div className="detail-container">
        <div className="error-state">
          <h1>❌ Data Tidak Ditemukan</h1>
          <p>Data balita dengan ID tersebut tidak ditemukan di database.</p>
          <button
            onClick={() => navigate("/admin/kelola-data-balita")}
            className="btn-kembali"
          >
            Kembali ke Daftar
          </button>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: riwayatPemeriksaan.map((r) =>
      new Date(r.tanggal).toLocaleDateString("id-ID", {
        month: "short",
        year: "numeric",
      })
    ),
    datasets: [
      {
        label: "Berat Badan (kg)",
        data: riwayatPemeriksaan.map((r) => r.berat),
        borderColor: "#3498db",
        yAxisID: "y",
      },
      {
        label: "Tinggi Badan (cm)",
        data: riwayatPemeriksaan.map((r) => r.tinggi),
        borderColor: "#e74c3c",
        yAxisID: "y1",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    animation: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Grafik Pertumbuhan Anak" },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: { display: true, text: "Berat Badan (kg)" },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: { display: true, text: "Tinggi Badan (cm)" },
        grid: { drawOnChartArea: false },
      },
    },
  };

  return (
    <div className="detail-container">
      <div className="detail-header">
        <h1>Detail Data: {dataAnak.nama}</h1>
        <div className="header-buttons">
          <button onClick={() => navigate(-1)} className="btn-kembali">
            Kembali
          </button>
          <button onClick={handlePrint} className="btn-print">
            Download PDF
          </button>
        </div>
      </div>

      <div ref={componentToPrintRef} className="print-area">
        <div className="detail-layout">
          <div className="detail-card info-card">
            <h3>Informasi Personal</h3>
            <ul>
              <li className="kode-highlight">
                <strong>Kode Balita:</strong>
                <span className="kode-value">{dataAnak.kodeBalita || '-'}</span>
              </li>
              <li>
                <strong>Nama:</strong>
                <span>{dataAnak.nama}</span>
              </li>
              <li>
                <strong>Jenis Kelamin:</strong>
                <span>{dataAnak.jenisKelamin}</span>
              </li>
              <li>
                <strong>Tanggal Lahir:</strong>
                <span>
                  {new Date(dataAnak.tanggalLahir).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </li>
              <li>
                <strong>Nama Orang Tua:</strong>
                <span>{dataAnak.namaOrtu}</span>
              </li>
              <li>
                <strong>Alamat:</strong>
                <span>{dataAnak.alamat || "-"}</span>
              </li>
              <li>
                <strong>Posyandu:</strong>
                <span>{dataAnak.posyandu || "-"}</span>
              </li>
              <li>
                <strong>Status Gizi:</strong>
                <span className={`status-badge status-${dataAnak.statusGizi?.toLowerCase().replace(" ", "-")}`}>
                  {dataAnak.statusGizi || "Normal"}
                </span>
              </li>
            </ul>
          </div>
          <div className="detail-card table-card">
            <h3>Riwayat Pengukuran</h3>
            {riwayatPemeriksaan.length === 0 ? (
              <p className="no-data-message">Belum ada data pemeriksaan untuk balita ini.</p>
            ) : (
              <div className="table-wrapper">
                <table className="history-table">
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
                    {riwayatPemeriksaan.map((item) => (
                      <tr key={item.id}>
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
                        <td>{item.lila}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="detail-card chart-card">
            <h3>Grafik Pertumbuhan</h3>
            {riwayatPemeriksaan.length === 0 ? (
              <p className="no-data-message">Tidak ada data untuk ditampilkan dalam grafik.</p>
            ) : (
              <Line options={chartOptions} data={chartData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailBalita;

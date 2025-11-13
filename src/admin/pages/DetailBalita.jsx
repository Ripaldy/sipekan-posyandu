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
import { getPemeriksaanByBalitaId, createPemeriksaan, updatePemeriksaan, deletePemeriksaan } from "../../services/pemeriksaanService";
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newMeasurement, setNewMeasurement] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    beratBadan: '',
    tinggiBadan: '',
    lingkarLengan: '',
  });

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
          namaIbu: balita.nama_ibu || '-',
          namaAyah: balita.nama_ayah || '-',
          desaKelurahan: balita.desa_kelurahan || '-',
          alamat: balita.alamat || '-',
          posyandu: balita.posyandu || '-',
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
              tanggal: p.tanggal,
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
    contentRef: componentToPrintRef,
    documentTitle: `Data Pertumbuhan - ${dataAnak?.nama || "Anak"}`,
  });

  const handleAddMeasurement = async () => {
    if (!newMeasurement.beratBadan || !newMeasurement.tinggiBadan) {
      alert("Mohon isi Berat Badan dan Tinggi Badan!");
      return;
    }

    try {
      // Hitung usia balita dalam bulan
      const tanggalLahir = new Date(dataAnak.tanggalLahir);
      const tanggalPemeriksaan = new Date(newMeasurement.tanggal);
      const diffTime = Math.abs(tanggalPemeriksaan - tanggalLahir);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const usiaBulan = Math.floor(diffDays / 30);

      const pemeriksaanData = {
        balita_id: id,
        tanggal: newMeasurement.tanggal,
        usia_bulan: usiaBulan,
        berat_badan: parseFloat(newMeasurement.beratBadan),
        tinggi_badan: parseFloat(newMeasurement.tinggiBadan),
        lingkar_lengan: newMeasurement.lingkarLengan ? parseFloat(newMeasurement.lingkarLengan) : null,
        status_gizi: 'Normal', // Default status gizi
      };

      const { data, error } = await createPemeriksaan(pemeriksaanData);

      if (!error && data) {
        // Add to local state
        const newRecord = {
          id: data.id,
          tanggal: data.tanggal,
          berat: data.berat_badan,
          tinggi: data.tinggi_badan,
          lila: data.lingkar_lengan || 0,
          pengukuranKe: data.pengukuran_ke || riwayatPemeriksaan.length + 1,
        };
        
        setRiwayatPemeriksaan([...riwayatPemeriksaan, newRecord].sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal)));
        
        // Reset form and close modal
        setNewMeasurement({
          tanggal: new Date().toISOString().split('T')[0],
          beratBadan: '',
          tinggiBadan: '',
          lingkarLengan: '',
        });
        setShowAddModal(false);
        alert("Data pemeriksaan berhasil ditambahkan!");
      } else {
        console.error("Failed to add measurement:", error);
        alert("Gagal menambah data pemeriksaan. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error adding measurement:", error);
      alert("Terjadi kesalahan: " + error.message);
    }
  };

  const handleEditMeasurement = async () => {
    if (!newMeasurement.beratBadan || !newMeasurement.tinggiBadan) {
      alert("Mohon isi Berat Badan dan Tinggi Badan!");
      return;
    }

    try {
      // Hitung usia balita dalam bulan
      const tanggalLahir = new Date(dataAnak.tanggalLahir);
      const tanggalPemeriksaan = new Date(newMeasurement.tanggal);
      const diffTime = Math.abs(tanggalPemeriksaan - tanggalLahir);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const usiaBulan = Math.floor(diffDays / 30);

      const pemeriksaanData = {
        tanggal: newMeasurement.tanggal,
        usia_bulan: usiaBulan,
        berat_badan: parseFloat(newMeasurement.beratBadan),
        tinggi_badan: parseFloat(newMeasurement.tinggiBadan),
        lingkar_lengan: newMeasurement.lingkarLengan ? parseFloat(newMeasurement.lingkarLengan) : null,
        status_gizi: 'Normal',
      };

      const { data, error } = await updatePemeriksaan(editingId, pemeriksaanData);

      if (!error && data) {
        // Update local state
        const updatedRiwayat = riwayatPemeriksaan.map(item => 
          item.id === editingId 
            ? {
                ...item,
                tanggal: data.tanggal,
                berat: data.berat_badan,
                tinggi: data.tinggi_badan,
                lila: data.lingkar_lengan || 0,
              }
            : item
        ).sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
        
        setRiwayatPemeriksaan(updatedRiwayat);
        
        // Reset form and close modal
        setNewMeasurement({
          tanggal: new Date().toISOString().split('T')[0],
          beratBadan: '',
          tinggiBadan: '',
          lingkarLengan: '',
        });
        setShowEditModal(false);
        setEditingId(null);
        alert("Data pemeriksaan berhasil diperbarui!");
      } else {
        console.error("Failed to update measurement:", error);
        alert("Gagal memperbarui data. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error updating measurement:", error);
      alert("Terjadi kesalahan: " + error.message);
    }
  };

  const handleDeleteMeasurement = async (pemeriksaanId) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data pemeriksaan ini?")) {
      return;
    }

    try {
      const { error } = await deletePemeriksaan(pemeriksaanId);

      if (!error) {
        // Remove from local state
        setRiwayatPemeriksaan(riwayatPemeriksaan.filter(item => item.id !== pemeriksaanId));
        alert("Data pemeriksaan berhasil dihapus!");
      } else {
        console.error("Failed to delete measurement:", error);
        alert("Gagal menghapus data. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error deleting measurement:", error);
      alert("Terjadi kesalahan: " + error.message);
    }
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setNewMeasurement({
      tanggal: item.tanggal,
      beratBadan: item.berat.toString(),
      tinggiBadan: item.tinggi.toString(),
      lingkarLengan: item.lila ? item.lila.toString() : '',
    });
    setShowEditModal(true);
  };

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
                <span>{dataAnak.namaIbu && dataAnak.namaAyah ? `${dataAnak.namaIbu} / ${dataAnak.namaAyah}` : dataAnak.namaIbu || dataAnak.namaAyah || '-'}</span>
              </li>
              <li>
                <strong>Desa/Kelurahan:</strong>
                <span>{dataAnak.desaKelurahan}</span>
              </li>
              <li>
                <strong>Alamat:</strong>
                <span>{dataAnak.alamat}</span>
              </li>
              <li>
                <strong>Posyandu:</strong>
                <span>{dataAnak.posyandu}</span>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Riwayat Pengukuran</h3>
              <button 
                onClick={() => setShowAddModal(true)}
                className="btn-tambah-pengukuran"
                style={{
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(34, 197, 94, 0.3)';
                }}
              >
                + Tambah Data Pengukuran
              </button>
            </div>
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
                      <th>Aksi</th>
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
                        <td>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                              onClick={() => openEditModal(item)}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#2196f3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                transition: 'all 0.2s',
                              }}
                              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1976d2'}
                              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2196f3'}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMeasurement(item.id)}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#f44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                transition: 'all 0.2s',
                              }}
                              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
                              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f44336'}
                            >
                              🗑️ Hapus
                            </button>
                          </div>
                        </td>
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

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Tambah Data Pengukuran</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleAddMeasurement(); }}>
              <div className="form-group">
                <label>Tanggal Pemeriksaan</label>
                <input
                  type="date"
                  value={newMeasurement.tanggal}
                  onChange={(e) => setNewMeasurement({ ...newMeasurement, tanggal: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Berat Badan (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Contoh: 10.5"
                  value={newMeasurement.beratBadan}
                  onChange={(e) => setNewMeasurement({ ...newMeasurement, beratBadan: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Tinggi Badan (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Contoh: 85.5"
                  value={newMeasurement.tinggiBadan}
                  onChange={(e) => setNewMeasurement({ ...newMeasurement, tinggiBadan: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Lingkar Lengan Atas / LILA (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Contoh: 13.5"
                  value={newMeasurement.lingkarLengan}
                  onChange={(e) => setNewMeasurement({ ...newMeasurement, lingkarLengan: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-save">Simpan</button>
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Data Pengukuran</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleEditMeasurement(); }}>
              <div className="form-group">
                <label>Tanggal Pemeriksaan</label>
                <input
                  type="date"
                  value={newMeasurement.tanggal}
                  onChange={(e) => setNewMeasurement({ ...newMeasurement, tanggal: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Berat Badan (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Contoh: 10.5"
                  value={newMeasurement.beratBadan}
                  onChange={(e) => setNewMeasurement({ ...newMeasurement, beratBadan: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Tinggi Badan (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Contoh: 85.5"
                  value={newMeasurement.tinggiBadan}
                  onChange={(e) => setNewMeasurement({ ...newMeasurement, tinggiBadan: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Lingkar Lengan Atas / LILA (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Contoh: 13.5"
                  value={newMeasurement.lingkarLengan}
                  onChange={(e) => setNewMeasurement({ ...newMeasurement, lingkarLengan: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-save">Update</button>
                <button type="button" className="btn-cancel" onClick={() => {
                  setShowEditModal(false);
                  setEditingId(null);
                  setNewMeasurement({
                    tanggal: new Date().toISOString().split('T')[0],
                    beratBadan: '',
                    tinggiBadan: '',
                    lingkarLengan: '',
                  });
                }}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailBalita;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getDashboardStats, getMonthlyStats } from '../../services/statisticsService';
import '../../styles/admin/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(2025);
  const [stats, setStats] = useState({
    totalBalita: 0,
    stunting: 0,
    normal: 0,
    giziBuruk: 0,
    giziKurang: 0,
    giziLebih: 0,
    totalPemeriksaan: 0,
    kegiatanAktif: 0,
    beritaPublished: 0,
  });
  const [monthlyData, setMonthlyData] = useState({
    months: [],
    pemeriksaan: [],
    kegiatan: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      const { data, error } = await getDashboardStats();
      if (data && !error) {
        setStats(data);
      } else {
        console.error('Failed to fetch dashboard stats:', error);
      }
      setIsLoading(false);
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      const { data, error } = await getMonthlyStats(selectedYear);
      if (data && !error) {
        setMonthlyData(data);
      } else {
        console.error('Failed to fetch monthly stats:', error);
      }
    };
    fetchMonthlyData();
  }, [selectedYear]);

  if (isLoading) {
    return (
      <div className='dashboard-container'>
        <div className='dashboard-header'>
          <h1>Memuat Data...</h1>
          <p>Sedang mengambil data dari server</p>
        </div>
      </div>
    );
  }

  // Data untuk Pie Chart - Status Gizi
  const pieData = [
    { name: 'Normal', value: stats.normal, color: '#4caf50' },
    { name: 'Stunting', value: stats.stunting, color: '#f44336' },
  ];

  // Data untuk Line Chart - Tren Pertumbuhan Bulanan
  const trendData = monthlyData.months.map((month, index) => ({
    month,
    jumlah: (index + 1) * 10 + Math.floor(Math.random() * 20), // Simulasi data tren
  }));

  // Data untuk chart rata-rata pertumbuhan
  const growthData = monthlyData.months.map((month, index) => ({
    month,
    'Berat Badan (kg)': 75 + index * 1.5, // Simulasi data
    'Tinggi Badan (cm)': 8 + index * 0.3, // Simulasi data
  }));

  return (
    <div className='dashboard-container'>
      {/* Header */}
      <div className='dashboard-header'>
        <h1>Selamat Datang, Admin!</h1>
        <p>Panel admin SiPekan untuk manajemen data dan konten website.</p>
      </div>

      {/* Stats Cards */}
      <div className='stats-grid'>
        <div className='stat-card stat-card-primary' onClick={() => navigate('/admin/anak-terdaftar')}>
          <div className='stat-content'>
            <h3>Anak Terdaftar</h3>
            <p className='stat-number'>{stats.totalBalita}</p>
            <span className='stat-label'>Total anak dalam sistem</span>
          </div>
        </div>

        <div className='stat-card stat-card-warning' onClick={() => navigate('/admin/kelola-kegiatan')}>
          <div className='stat-content'>
            <h3>Total Kegiatan</h3>
            <p className='stat-number'>{stats.kegiatanAktif}</p>
            <span className='stat-label'>Kegiatan telah dipublikasi</span>
          </div>
        </div>

        <div className='stat-card stat-card-danger' onClick={() => navigate('/admin/gejala-stunting')}>
          <div className='stat-content'>
            <h3>Gejala Stunting</h3>
            <p className='stat-number'>{stats.stunting}</p>
            <span className='stat-label'>Data anak dengan resiko stunting</span>
          </div>
        </div>

        <div className='stat-card stat-card-success' onClick={() => navigate('/admin/anak-normal')}>
          <div className='stat-content'>
            <h3>Anak Normal</h3>
            <p className='stat-number'>{stats.normal}</p>
            <span className='stat-label'>Anak dengan pertumbuhan normal</span>
          </div>
        </div>
      </div>

      {/* Charts Row - Side by Side */}
      <div className='charts-row'>
        {/* Tren Jumlah Anak Terdaftar */}
        <div className='chart-card chart-half'>
          <h3>Tren Jumlah Anak Terdaftar</h3>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray='3 3' stroke='#e0e0e0' />
              <XAxis 
                dataKey='month' 
                tick={{ fontSize: 12 }}
                stroke='#666'
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke='#666'
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #ddd',
                  borderRadius: '8px'
                }}
              />
              <Line
                type='monotone'
                dataKey='jumlah'
                stroke='#2196f3'
                strokeWidth={2}
                dot={{ r: 4, fill: '#2196f3' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Status Gizi */}
        <div className='chart-card chart-half'>
          <h3>Perbandingan Status Gizi Anak</h3>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx='50%'
                cy='45%'
                labelLine={false}
                outerRadius={90}
                fill='#8884d8'
                dataKey='value'
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className='pie-legend'>
            <div className='legend-item'>
              <span className='legend-dot' style={{ backgroundColor: '#4caf50' }}></span>
              <span>Normal: {stats.normal} anak</span>
            </div>
            <div className='legend-item'>
              <span className='legend-dot' style={{ backgroundColor: '#f44336' }}></span>
              <span>Stunting: {stats.stunting} anak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rata-rata Pertumbuhan Chart - Full Width */}
      <div className='chart-card chart-full'>
        <div className='chart-header'>
          <h3>Rata-rata Pertumbuhan Anak Per Bulan</h3>
          <div className='chart-controls'>
            <label>Pilih Tahun:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className='year-selector'
            >
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
            </select>
          </div>
        </div>
        <ResponsiveContainer width='100%' height={350}>
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#e0e0e0' />
            <XAxis 
              dataKey='month' 
              tick={{ fontSize: 12 }}
              stroke='#666'
            />
            <YAxis 
              yAxisId='left' 
              tick={{ fontSize: 12 }}
              stroke='#666'
            />
            <YAxis
              yAxisId='right'
              orientation='right'
              tick={{ fontSize: 12 }}
              stroke='#666'
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #ddd',
                borderRadius: '8px'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType='circle'
            />
            <Line
              yAxisId='left'
              type='monotone'
              dataKey='Berat Badan (kg)'
              stroke='#4caf50'
              strokeWidth={2}
              dot={{ r: 4, fill: '#4caf50' }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId='right'
              type='monotone'
              dataKey='Tinggi Badan (cm)'
              stroke='#2196f3'
              strokeWidth={2}
              dot={{ r: 4, fill: '#2196f3' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;

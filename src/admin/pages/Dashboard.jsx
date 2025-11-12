import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "../../styles/admin/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(2025);

  const growthDataByYear = {
    2024: [
      { month: "Jan", height: 60.5, weight: 4.2 },
      { month: "Feb", height: 61.8, weight: 4.5 },
      { month: "Mar", height: 63.2, weight: 4.8 },
      { month: "Apr", height: 64.6, weight: 5.1 },
      { month: "May", height: 66.0, weight: 5.4 },
      { month: "Jun", height: 67.5, weight: 5.7 },
      { month: "Jul", height: 69.0, weight: 6.0 },
      { month: "Aug", height: 70.5, weight: 6.3 },
      { month: "Sep", height: 72.0, weight: 6.6 },
      { month: "Oct", height: 73.5, weight: 6.9 },
      { month: "Nov", height: 75.0, weight: 7.2 },
      { month: "Dec", height: 76.5, weight: 7.5 },
    ],
    2025: [
      { month: "Jan", height: 77.2, weight: 7.7 },
      { month: "Feb", height: 78.5, weight: 8.0 },
      { month: "Mar", height: 79.8, weight: 8.3 },
      { month: "Apr", height: 81.2, weight: 8.6 },
      { month: "May", height: 82.5, weight: 8.9 },
      { month: "Jun", height: 83.9, weight: 9.2 },
      { month: "Jul", height: 85.2, weight: 9.5 },
      { month: "Aug", height: 86.6, weight: 9.8 },
      { month: "Sep", height: 87.9, weight: 10.1 },
      { month: "Oct", height: 89.3, weight: 10.4 },
      { month: "Nov", height: 90.6, weight: 10.7 },
      { month: "Dec", height: 92.0, weight: 11.0 },
    ],
    2026: [
      { month: "Jan", height: 93.2, weight: 11.3 },
      { month: "Feb", height: 94.5, weight: 11.6 },
      { month: "Mar", height: 95.8, weight: 11.9 },
      { month: "Apr", height: 97.2, weight: 12.2 },
      { month: "May", height: 98.5, weight: 12.5 },
      { month: "Jun", height: 99.9, weight: 12.8 },
      { month: "Jul", height: 101.2, weight: 13.1 },
      { month: "Aug", height: 102.6, weight: 13.4 },
      { month: "Sep", height: 103.9, weight: 13.7 },
      { month: "Oct", height: 105.3, weight: 14.0 },
      { month: "Nov", height: 106.6, weight: 14.3 },
      { month: "Dec", height: 108.0, weight: 14.6 },
    ],
  };

  const nutritionStatusData = [
    { name: "Normal", value: 144, color: "#27ae60" },
    { name: "Stunting", value: 8, color: "#e74c3c" },
  ];

  const registrationTrendData = [
    { month: "Jan", anak: 8 },
    { month: "Feb", anak: 15 },
    { month: "Mar", anak: 24 },
    { month: "Apr", anak: 35 },
    { month: "May", anak: 48 },
    { month: "Jun", anak: 62 },
    { month: "Jul", anak: 78 },
    { month: "Aug", anak: 95 },
    { month: "Sep", anak: 115 },
    { month: "Oct", anak: 135 },
    { month: "Nov", anak: 152 },
    { month: "Dec", anak: 152 },
  ];

  const currentChartData = growthDataByYear[selectedYear];

  // Handler navigasi dengan console log untuk debugging
  const handleNavigation = (path) => {
    console.log("Navigating to:", path);
    navigate(path);
  };

  const renderCustomLabel = (entry) => {
    const total = nutritionStatusData.reduce(
      (sum, item) => sum + item.value,
      0
    );
    const percent = ((entry.value / total) * 100).toFixed(1);
    return `${percent}%`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = nutritionStatusData.reduce(
        (sum, item) => sum + item.value,
        0
      );
      const percent = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].name}</p>
          <p className="tooltip-value">
            {payload[0].value} anak ({percent}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-container" data-aos="fade-in">
      <div className="dashboard-header">
        <h1>Selamat Datang, Admin!</h1>
        <p>Panel admin SiPekan untuk manajemen data dan konten website.</p>
      </div>

      <div className="summary-cards">
        <div
          className="card anak-card"
          data-aos="fade-up"
          data-aos-delay="100"
          onClick={() => handleNavigation("/admin/anak-terdaftar")}
          onKeyDown={(e) =>
            e.key === "Enter" && handleNavigation("/admin/anak-terdaftar")
          }
          role="button"
          tabIndex="0"
          style={{ cursor: "pointer" }}
        >
          <h3>Anak Terdata</h3>
          <p className="card-number">152</p>
          <div className="card-footer">
            <span>Total anak dalam sistem</span>
          </div>
        </div>

        <div
          className="card kegiatan-card"
          data-aos="fade-up"
          data-aos-delay="200"
          onClick={() => handleNavigation("/admin/kelola-kegiatan")}
          onKeyDown={(e) =>
            e.key === "Enter" && handleNavigation("/admin/kelola-kegiatan")
          }
          role="button"
          tabIndex="0"
          style={{ cursor: "pointer" }}
        >
          <h3>Total Kegiatan</h3>
          <p className="card-number">4</p>
          <div className="card-footer">
            <span>Kegiatan telah dipublikasi</span>
          </div>
        </div>

        <div
          className="card berita-card"
          data-aos="fade-up"
          data-aos-delay="300"
          onClick={() => handleNavigation("/admin/gejala-stunting")}
          onKeyDown={(e) =>
            e.key === "Enter" && handleNavigation("/admin/gejala-stunting")
          }
          role="button"
          tabIndex="0"
          style={{ cursor: "pointer" }}
        >
          <h3>Gejala Stunting</h3>
          <p className="card-number">8</p>
          <div className="card-footer">
            <span>Data anak dengan resiko stunting</span>
          </div>
        </div>

        <div
          className="card normal-card"
          data-aos="fade-up"
          data-aos-delay="400"
          onClick={() => handleNavigation("/admin/anak-normal")}
          onKeyDown={(e) =>
            e.key === "Enter" && handleNavigation("/admin/anak-normal")
          }
          role="button"
          tabIndex="0"
          style={{ cursor: "pointer" }}
        >
          <h3>Anak Normal</h3>
          <p className="card-number">144</p>
          <div className="card-footer">
            <span>Anak dengan pertumbuhan normal</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-section" data-aos="fade-up" data-aos-delay="500">
          <div className="chart-container">
            <h2 className="chart-title">Tren Jumlah Anak Terdaftar</h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={registrationTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#3498db" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [`${value} anak`, "Terdaftar"]}
                />
                <Line
                  type="monotone"
                  dataKey="anak"
                  stroke="#3498db"
                  strokeWidth={2}
                  dot={{ fill: "#3498db", r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Jumlah Anak"
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-section" data-aos="fade-up" data-aos-delay="600">
          <div className="chart-container">
            <h2 className="chart-title">Perbandingan Status Gizi Anak</h2>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={nutritionStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {nutritionStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="legend-container">
              {nutritionStatusData.map((item, index) => (
                <div key={index} className="legend-item">
                  <div
                    className="legend-color"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="legend-text">
                    {item.name}: {item.value} anak
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="chart-section" data-aos="fade-up" data-aos-delay="700">
        <div className="chart-container">
          <div className="chart-header">
            <h2 className="chart-title">
              Rata-rata Pertumbuhan Anak Per Bulan
            </h2>
            <div className="year-selector">
              <label htmlFor="yearSelect">Pilih Tahun:</label>
              <select
                id="yearSelect"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="year-select"
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={currentChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis yAxisId="left" stroke="#3498db" />
              <YAxis yAxisId="right" orientation="right" stroke="#27ae60" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="height"
                stroke="#3498db"
                strokeWidth={2}
                dot={{ fill: "#3498db", r: 5 }}
                activeDot={{ r: 7 }}
                name="Tinggi Badan (cm)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="weight"
                stroke="#27ae60"
                strokeWidth={2}
                dot={{ fill: "#27ae60", r: 5 }}
                activeDot={{ r: 7 }}
                name="Berat Badan (kg)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useMemo } from "react";
import "../styles/pages/Berita.css";

const newsData = [
  {
    id: 1,
    category: "stunting",
    imgSrc: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?",
    date: "15 Oktober 2025",
    author: "Kemenkes RI",
    title: "Memahami Stunting: Penyebab dan Pencegahan",
    content:
      "Stunting adalah kondisi gagal tumbuh pada anak akibat kekurangan gizi kronis...",
    linkUrl:
      "https://medium.com/@AdePutriTifani/stunting-gejala-penyebab-dan-cara-pencegahan-8e5b5ca4e778",
  },
  {
    id: 2,
    category: "tumbuh-kembang",
    badgeClass: "badge-blue",
    imgSrc:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    date: "12 Oktober 2025",
    author: "IDAI",
    title: "Tahapan Tumbuh Kembang Anak Usia 0-5 Tahun",
    content:
      "Memahami milestone perkembangan anak sangat penting. Simak tahapan tumbuh kembang...",
    linkUrl:
      "https://www.idai.or.id/artikel/seputar-kesehatan-anak/pemantauan-perkembangan-anak-panduan-orang-tua",
  },
  {
    id: 3,
    category: "gizi",
    badgeClass: "badge-orange",
    imgSrc:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
    date: "10 Oktober 2025",
    author: "Nutrisionis",
    title: "Panduan Gizi Seimbang untuk Anak Balita",
    content:
      "Menu makanan bergizi adalah kunci mencegah stunting. Pelajari komposisi gizi seimbang...",
    linkUrl:
      "https://health.kompas.com/read/2022/03/21/130000168/panduan-gizi-seimbang-untuk-anak-balita",
  },
  {
    id: 4,
    category: "tips",
    badgeClass: "badge-purple",
    imgSrc:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80",
    date: "8 Oktober 2025",
    author: "Dr. Siti Aminah",
    title: "5 Tips Meningkatkan Imunitas Anak",
    content:
      "Sistem imun yang kuat membantu anak tumbuh sehat. Ikuti 5 tips mudah untuk meningkatkan...",
    linkUrl:
      "https://www.halodoc.com/artikel/5-cara-meningkatkan-sistem-imun-anak-agar-tidak-mudah-sakit",
  },
  {
    id: 5,
    category: "stunting",
    imgSrc:
      "https://images.unsplash.com/photo-1527576539890-dfa815648363?w=800&q=80",
    date: "5 Oktober 2025",
    author: "WHO Indonesia",
    title: "1000 Hari Pertama Kehidupan: Periode Emas Cegah Stunting",
    content:
      "Periode 1000 hari pertama kehidupan sangat krusial. Intervensi gizi yang tepat dapat...",
    linkUrl:
      "https://www.who.int/indonesia/news/campaign/1000-hari-pertama-kehidupan",
  },
  {
    id: 6,
    category: "tumbuh-kembang",
    badgeClass: "badge-blue",
    imgSrc:
      "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=800&q=80",
    date: "2 Oktober 2025",
    author: "Psikolog Anak",
    title: "Stimulasi Dini untuk Perkembangan Kognitif Anak",
    content:
      "Stimulasi sejak dini sangat penting untuk perkembangan otak anak. Ketahui aktivitas...",
    linkUrl:
      "https://www.unicef.org/indonesia/id/story/permainan-sederhana-yang-dapat-meningkatkan-perkembangan-otak-anak-anda",
  },
];

const NewsCard = ({ article, delay }) => (
  <article
    className="news-card"
    data-category={article.category}
    data-aos="fade-up"
    data-aos-delay={delay}
  >
    <div className="news-image">
      <img src={article.imgSrc} alt={article.title} />
      <span className={`news-badge ${article.badgeClass || ""}`}>
        {article.category.replace("-", " ")}
      </span>
    </div>
    <div className="news-content">
      <div className="news-meta">
        <span>
          <i className="far fa-calendar"></i> {article.date}
        </span>
        <span>
          <i className="far fa-user"></i> {article.author}
        </span>
      </div>
      <h3>{article.title}</h3>
      <p>{article.content}</p>
      <a
        href={article.linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="read-more"
      >
        Baca Selengkapnya <i className="fas fa-arrow-right"></i>
      </a>
    </div>
  </article>
);

const Berita = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredNews = useMemo(() => {
    if (activeFilter === "all") return newsData;
    return newsData.filter((news) => news.category === activeFilter);
  }, [activeFilter]);

  return (
    <>
      <section className="hero-berita" data-aos="fade-in">
        <div className="hero-content">
          <h1>Berita & Informasi</h1>
          <p>Informasi terkini seputar stunting dan tumbuh kembang anak</p>
        </div>
      </section>

      <div className="container-berita">
        <div className="filter-section" data-aos="fade-up">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              Semua
            </button>
            <button
              className={`filter-btn ${
                activeFilter === "stunting" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("stunting")}
            >
              Stunting
            </button>
            <button
              className={`filter-btn ${
                activeFilter === "tumbuh-kembang" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("tumbuh-kembang")}
            >
              Tumbuh Kembang
            </button>
            <button
              className={`filter-btn ${
                activeFilter === "gizi" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("gizi")}
            >
              Gizi & Nutrisi
            </button>
            <button
              className={`filter-btn ${
                activeFilter === "tips" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("tips")}
            >
              Tips Kesehatan
            </button>
          </div>
        </div>

        {filteredNews.length > 0 ? (
          <div className="news-grid">
            {filteredNews.map((article, index) => (
              <NewsCard
                key={article.id}
                article={article}
                delay={index * 100}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>Tidak ada berita ditemukan</h3>
            <p>Coba pilih kategori lain.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Berita;

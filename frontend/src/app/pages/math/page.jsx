'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MathDashboard() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.href = '/pages/login';
      return;
    }

    fetch('http://localhost:5000/api/math/chapters', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('অধ্যায়সমূহ লোড করতে ব্যর্থ হয়েছে');
        return res.json();
      })
      .then(data => {
        setChapters(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={s.loadingWrap}>
        <div style={s.spinner}></div>
        <p style={s.loadingText}>গণিত পাঠশালা লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div style={s.container}>
      <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      
      {/* Hero Section */}
      <div style={s.hero}>
        <h1 style={s.heroTitle}>📐 গণিত পাঠশালা</h1>
        <p style={s.heroSubtitle}>সহজ বাংলা ব্যাখ্যা এবং কৃত্রিম বুদ্ধিমত্তার (AI) সহায়তায় গণিত শেখার অভিনব প্ল্যাটফর্ম।</p>
      </div>

      {/* Jachai Banner */}
      <div style={s.jachaiBanner}>
        <div style={s.bannerLeft}>
          <h2 style={s.bannerTitle}>🤖 গণিত যাচাইকারী (Jachai Solver)</h2>
          <p style={s.bannerText}>যেকোনো গণিত প্রশ্ন নিজে সমাধান করে সঠিকতা পরীক্ষা করো, অথবা AI দিয়ে সাথে সাথে সমাধান করো!</p>
        </div>
        <Link href="/pages/math/jachai" style={s.bannerBtn}>
          শুরু করো ⚡
        </Link>
      </div>

      {/* Chapters Title */}
      <h2 style={s.sectionTitle}>📚 অধ্যায়সমূহ (Chapters)</h2>

      {/* Chapters Grid */}
      {error ? (
        <div style={s.errorBlock}>
          <p>⚠️ {error}</p>
        </div>
      ) : (
        <div style={s.grid}>
          {chapters.map((chap, idx) => (
            <Link key={chap.chapter_id} href={`/pages/math/chapters/${chap.chapter_id}`} style={s.card}>
              <div style={s.cardBadge}>অধ্যায় {idx + 1}</div>
              <h3 style={s.cardTitle}>{chap.chapter_name}</h3>
              <p style={s.cardDesc}>
                {chap.description || 'এই অধ্যায়ের গুরুত্বপূর্ণ সূত্র, কনসেপ্ট, সৃজনশীল ও অনুশীলনী প্র্যাকটিস করো।'}
              </p>
              <div style={s.cardFooter}>
                <span>অনুশীলন শুরু করো</span>
                <span>➔</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  container: {
    fontFamily: "'Hind Siliguri', 'Outfit', sans-serif",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)",
    padding: "40px 10% 80px",
  },
  loadingWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "80vh",
    fontFamily: "'Hind Siliguri', sans-serif",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid #e0f2fe",
    borderTop: "5px solid #0ea5e9",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "20px",
    fontSize: "18px",
    color: "#0369a1",
    fontWeight: "600",
  },
  hero: {
    textAlign: "center",
    marginBottom: "40px",
  },
  heroTitle: {
    fontSize: "42px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "12px",
  },
  heroSubtitle: {
    fontSize: "18px",
    color: "#475569",
    maxWidth: "600px",
    margin: "0 auto",
    lineHeight: "1.6",
  },
  jachaiBanner: {
    background: "linear-gradient(135deg, #0d9488 0%, #0ea5e9 100%)",
    borderRadius: "20px",
    padding: "30px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "white",
    boxShadow: "0 10px 25px rgba(14, 165, 233, 0.25)",
    marginBottom: "50px",
    flexWrap: "wrap",
    gap: "20px",
  },
  bannerLeft: {
    flex: "1",
    minWidth: "300px",
  },
  bannerTitle: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "10px",
  },
  bannerText: {
    fontSize: "15px",
    opacity: "0.9",
    lineHeight: "1.5",
  },
  bannerBtn: {
    background: "white",
    color: "#0284c7",
    padding: "14px 28px",
    borderRadius: "12px",
    fontWeight: "700",
    textDecoration: "none",
    fontSize: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "24px",
    borderLeft: "5px solid #0ea5e9",
    paddingLeft: "12px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "28px",
  },
  card: {
    background: "white",
    borderRadius: "18px",
    padding: "28px",
    textDecoration: "none",
    color: "inherit",
    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  },
  cardBadge: {
    alignSelf: "flex-start",
    background: "#e0f2fe",
    color: "#0369a1",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    marginBottom: "16px",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "10px",
  },
  cardDesc: {
    fontSize: "14px",
    color: "#64748b",
    lineHeight: "1.6",
    flexGrow: 1,
    marginBottom: "20px",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: "600",
    color: "#0ea5e9",
    fontSize: "14px",
  },
  errorBlock: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "16px",
    borderRadius: "12px",
    fontWeight: "500",
  }
};

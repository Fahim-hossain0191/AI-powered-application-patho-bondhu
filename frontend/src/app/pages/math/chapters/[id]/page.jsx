'use client'

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

export default function ChapterMenu({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.href = '/pages/login';
      return;
    }

    fetch(`http://localhost:5000/api/math/chapters/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('অধ্যায়ের বিবরণ লোড করতে ব্যর্থ হয়েছে');
        return res.json();
      })
      .then(data => {
        setChapter(data.data || {});
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={s.loadingWrap}>
        <div style={s.spinner}></div>
        <p style={s.loadingText}>অধ্যায় লোড হচ্ছে...</p>
      </div>
    );
  }

  const menuItems = [
    {
      title: '💡 কনসেপ্ট (Concepts)',
      desc: 'অধ্যায়ের মূল থিম এবং সংজ্ঞাগুলো সহজ ভাষায় শেখো।',
      link: `/pages/math/chapters/${id}/concepts`,
      color: '#e0f2fe',
      textColor: '#0369a1',
      borderColor: '#38bdf8'
    },
    {
      title: '📋 সূত্রাবলী (Formulas)',
      desc: 'সব গাণিতিক সূত্রাবলী ও ব্যবহারের নিয়মাবলী একসাথে।',
      link: `/pages/math/chapters/${id}/formulas`,
      color: '#f0fdf4',
      textColor: '#15803d',
      borderColor: '#4ade80'
    },
    {
      title: '✏️ অনুশীলনী (NCTB Exercises)',
      desc: 'সহজ, মাঝারি ও কঠিন ক্রমানুসারে এবং AI হিন্টের সাহায্যে সমাধান।',
      link: `/pages/math/chapters/${id}/exercises`,
      color: '#fef3c7',
      textColor: '#b45309',
      borderColor: '#fbbf24'
    },
    {
      title: '📂 সৃজনশীল প্রশ্ন (Srijonshil)',
      desc: 'পরীক্ষায় আসার মতো সৃজনশীল প্রশ্নাবলী ও সমাধান প্র্যাকটিস করো।',
      link: `/pages/math/chapters/${id}/srijonshil`,
      color: '#fce7f3',
      textColor: '#be185d',
      borderColor: '#f472b6'
    },
    {
      title: '⚡ এমসিকিউ অনুশীলন (MCQ Practice)',
      desc: 'AI জেনারেটেড ২০টি MCQ এবং সঠিক উত্তরের ব্যাখ্যাসহ প্র্যাকটিস করো।',
      link: `/pages/math/chapters/${id}/mcq`,
      color: '#faf5ff',
      textColor: '#6b21a8',
      borderColor: '#c084fc'
    }
  ];

  return (
    <div style={s.container}>
      <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      
      {/* Breadcrumb / Back Link */}
      <Link href="/pages/math" style={s.backLink}>
        🔙 গণিত পাঠশালা-এ ফিরে যাও
      </Link>

      {/* Hero Section */}
      <div style={s.hero}>
        <div style={s.badge}>অধ্যায় ভিত্তিক মেন্যু</div>
        <h1 style={s.chapterTitle}>{chapter?.chapter_name || 'অধ্যায়ের নাম'}</h1>
        <p style={s.chapterDesc}>
          {chapter?.description || 'এই অধ্যায়ের সমস্ত অনুশীলনী উপকরণ এবং গাণিতিক প্রস্তুতি সম্পন্ন করো।'}
        </p>
      </div>

      {error ? (
        <div style={s.errorBlock}>
          <p>⚠️ {error}</p>
        </div>
      ) : (
        <div style={s.grid}>
          {menuItems.map((item, idx) => (
            <Link key={idx} href={item.link} style={{ ...s.card, border: `2px solid ${item.borderColor}` }}>
              <div style={{ ...s.cardHeader, backgroundColor: item.color, color: item.textColor }}>
                {item.title}
              </div>
              <div style={s.cardBody}>
                <p style={s.cardDesc}>{item.desc}</p>
                <div style={{ ...s.cardLink, color: item.textColor }}>
                  শুরু করো ➔
                </div>
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
    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    padding: "30px 10% 80px",
  },
  backLink: {
    display: "inline-block",
    textDecoration: "none",
    color: "#64748b",
    fontWeight: "600",
    marginBottom: "30px",
    fontSize: "14px",
    transition: "color 0.2s",
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
    border: "5px solid #cbd5e1",
    borderTop: "5px solid #0284c7",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "20px",
    fontSize: "18px",
    color: "#0f172a",
    fontWeight: "600",
  },
  hero: {
    background: "white",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
    marginBottom: "40px",
    textAlign: "center",
  },
  badge: {
    display: "inline-block",
    background: "#f1f5f9",
    color: "#475569",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "16px",
  },
  chapterTitle: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "12px",
  },
  chapterDesc: {
    fontSize: "16px",
    color: "#64748b",
    maxWidth: "700px",
    margin: "0 auto",
    lineHeight: "1.6",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "30px",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    textDecoration: "none",
    color: "inherit",
    boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  },
  cardHeader: {
    padding: "20px 24px",
    fontSize: "18px",
    fontWeight: "700",
  },
  cardBody: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  cardDesc: {
    fontSize: "14px",
    color: "#64748b",
    lineHeight: "1.6",
    flexGrow: 1,
    marginBottom: "24px",
  },
  cardLink: {
    alignSelf: "flex-start",
    fontSize: "14px",
    fontWeight: "700",
  },
  errorBlock: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "16px",
    borderRadius: "12px",
    fontWeight: "500",
  }
};

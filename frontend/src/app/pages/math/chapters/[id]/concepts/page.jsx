'use client'

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

export default function ConceptsView({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.href = '/pages/login';
      return;
    }

    fetch(`http://localhost:5000/api/math/chapters/${id}/concepts`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('কনসেপ্টসমূহ লোড করতে ব্যর্থ হয়েছে');
        return res.json();
      })
      .then(data => {
        setConcepts(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // Load MathJax script and typeset
  useEffect(() => {
    if (!document.getElementById('mathjax-script')) {
      const script = document.createElement('script');
      script.id = 'mathjax-script';
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.MathJax && concepts.length > 0) {
      setTimeout(() => {
        window.MathJax.typesetPromise();
      }, 100);
    }
  }, [concepts]);

  if (loading) {
    return (
      <div style={s.loadingWrap}>
        <div style={s.spinner}></div>
        <p style={s.loadingText}>কনসেপ্ট লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div style={s.container}>
      <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      
      {/* Back Link */}
      <Link href={`/pages/math/chapters/${id}`} style={s.backLink}>
        🔙 পূর্ববর্তী মেন্যু-এ ফিরে যাও
      </Link>

      <div style={s.hero}>
        <h1 style={s.pageTitle}>💡 অধ্যায়ের গুরুত্বপূর্ণ কনসেপ্টসমূহ</h1>
        <p style={s.pageSubtitle}>মূল গাণিতিক থিম ও ভিত্তি মজবুত করার জন্য সহজ আলোচনা।</p>
      </div>

      {error ? (
        <div style={s.errorBlock}>
          <p>⚠️ {error}</p>
        </div>
      ) : concepts.length === 0 ? (
        <div style={s.emptyBlock}>
          <p>এই অধ্যায়ের জন্য কোনো কনসেপ্ট পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div style={s.list}>
          {concepts.map((concept, index) => (
            <div key={concept.concept_id} style={s.conceptCard}>
              <div style={s.conceptHeader}>
                <span style={s.conceptIndex}>Concept {index + 1}</span>
                <h3 style={s.conceptTitle}>{concept.module_title}</h3>
              </div>
              <div style={s.conceptBody}>
                <p style={s.conceptContent}>{concept.content}</p>
              </div>
            </div>
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
    padding: "30px 10% 80px",
  },
  backLink: {
    display: "inline-block",
    textDecoration: "none",
    color: "#64748b",
    fontWeight: "600",
    marginBottom: "30px",
    fontSize: "14px",
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
    borderTop: "5px solid #0d9488",
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
    textAlign: "center",
    marginBottom: "40px",
  },
  pageTitle: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "10px",
  },
  pageSubtitle: {
    fontSize: "16px",
    color: "#475569",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  conceptCard: {
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
  },
  conceptHeader: {
    background: "linear-gradient(90deg, #f0fdfa, #e0f2fe)",
    padding: "18px 24px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  conceptIndex: {
    background: "#0d9488",
    color: "white",
    padding: "3px 8px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  conceptTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
  },
  conceptBody: {
    padding: "24px",
  },
  conceptContent: {
    fontSize: "15px",
    color: "#334155",
    lineHeight: "1.7",
    whiteSpace: "pre-line",
  },
  errorBlock: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "16px",
    borderRadius: "12px",
    fontWeight: "500",
    textAlign: "center",
  },
  emptyBlock: {
    background: "white",
    padding: "40px",
    borderRadius: "16px",
    textAlign: "center",
    color: "#64748b",
    boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
  }
};

'use client'

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

export default function FormulasView({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;
  const [formulas, setFormulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.href = '/pages/login';
      return;
    }

    fetch(`http://localhost:5000/api/math/chapters/${id}/formulas`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('সূত্রাবলী লোড করতে ব্যর্থ হয়েছে');
        return res.json();
      })
      .then(data => {
        setFormulas(data.data || []);
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
    if (typeof window !== 'undefined' && window.MathJax && formulas.length > 0) {
      setTimeout(() => {
        window.MathJax.typesetPromise();
      }, 100);
    }
  }, [formulas]);

  if (loading) {
    return (
      <div style={s.loadingWrap}>
        <div style={s.spinner}></div>
        <p style={s.loadingText}>সূত্রাবলী লোড হচ্ছে...</p>
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
        <h1 style={s.pageTitle}>📋 অধ্যায়ের গাণিতিক সূত্রাবলী</h1>
        <p style={s.pageSubtitle}>প্রয়োজনীয় সকল গণিত সূত্রাবলী এবং কোন পরিস্থিতিতে কোন সূত্র ব্যবহার করবে তার নির্দেশিকা।</p>
      </div>

      {error ? (
        <div style={s.errorBlock}>
          <p>⚠️ {error}</p>
        </div>
      ) : formulas.length === 0 ? (
        <div style={s.emptyBlock}>
          <p>এই অধ্যায়ের জন্য কোনো সূত্র পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div style={s.list}>
          {formulas.map((formula, index) => (
            <div key={formula.formula_id} style={s.formulaCard}>
              <div style={s.formulaHeader}>
                <span style={s.formulaIndex}>সূত্র {index + 1}</span>
                <h3 style={s.formulaTitle}>{formula.formula_name || 'বীজগাণিতিক সূত্র'}</h3>
              </div>
              <div style={s.formulaBody}>
                {/* Math Display Box */}
                <div style={s.mathBox}>
                  {formula.formula_text}
                </div>
                {formula.explanation && (
                  <div style={s.detailSection}>
                    <strong style={s.sectionLabel}>ব্যাখ্যা:</strong>
                    <p style={s.detailText}>{formula.explanation}</p>
                  </div>
                )}
                {formula.when_to_use && (
                  <div style={s.detailSection}>
                    <strong style={s.sectionLabel}>কখন ব্যবহার করবে:</strong>
                    <p style={s.detailText}>{formula.when_to_use}</p>
                  </div>
                )}
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
    background: "linear-gradient(135deg, #f0fdf4 0%, #f0fdfa 100%)",
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
    borderTop: "5px solid #16a34a",
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
  formulaCard: {
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
  },
  formulaHeader: {
    background: "linear-gradient(90deg, #f0fdf4, #f0fdfa)",
    padding: "18px 24px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  formulaIndex: {
    background: "#16a34a",
    color: "white",
    padding: "3px 8px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  formulaTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
  },
  formulaBody: {
    padding: "24px",
  },
  mathBox: {
    background: "#f8fafc",
    border: "1px dashed #cbd5e1",
    borderRadius: "12px",
    padding: "20px",
    fontSize: "22px",
    color: "#0f172a",
    textAlign: "center",
    fontWeight: "600",
    fontFamily: "math, serif",
    marginBottom: "20px",
    letterSpacing: "1px",
  },
  detailSection: {
    marginBottom: "12px",
  },
  sectionLabel: {
    fontSize: "13px",
    color: "#475569",
    display: "block",
    marginBottom: "4px",
  },
  detailText: {
    fontSize: "15px",
    color: "#0f172a",
    margin: 0,
    lineHeight: "1.6",
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

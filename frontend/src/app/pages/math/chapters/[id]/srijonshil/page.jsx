'use client'

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

export default function SrijonshilView({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;

  const [questionsType, setQuestionsType] = useState(null); // 'board' or 'model'
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeSolutionId, setActiveSolutionId] = useState(null);
  const [activeAiHelpId, setActiveAiHelpId] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.href = '/pages/login';
      return;
    }

    fetch(`http://localhost:5000/api/math/chapters/${id}/srijonshil`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('সৃজনশীল প্রশ্ন লোড করতে ব্যর্থ হয়েছে');
        return res.json();
      })
      .then(data => {
        setAllQuestions(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // Load MathJax script
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
    if (typeof window !== 'undefined' && window.MathJax) {
      setTimeout(() => {
        window.MathJax.typesetPromise();
      }, 100);
    }
  }, [questionsType, allQuestions, activeSolutionId, activeAiHelpId, aiResponse]);

  // Filter questions based on selection
  const filteredQuestions = allQuestions.filter(q => {
    if (questionsType === 'board') {
      return q.source_type?.toLowerCase() === 'board' || q.category?.toLowerCase() === 'board';
    } else {
      return q.source_type?.toLowerCase() !== 'board' && q.category?.toLowerCase() !== 'board';
    }
  });

  const handleAiHelp = async (questionItem) => {
    setActiveAiHelpId(questionItem.srijonshil_id);
    setActiveSolutionId(null);
    setAiLoading(true);
    setAiResponse(null);

    try {
      const token = localStorage.getItem('accessToken');
      const fullText = `উদ্দীপক: ${questionItem.uddipok_text}\nপ্রশ্ন: ${questionItem.question_text}`;
      const res = await fetch('http://localhost:5000/api/math/jachai/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          question: fullText,
          chapter_id: parseInt(id)
        })
      });
      const data = await res.json();
      if (res.ok) {
        setAiResponse(data.data);
      } else {
        alert(data.message || 'AI সমাধান পেতে ব্যর্থ হয়েছে');
      }
    } catch (e) {
      alert('সার্ভারের সাথে কানেক্ট করা যাচ্ছে না');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={s.loadingWrap}>
        <div style={s.spinner}></div>
        <p style={s.loadingText}>সৃজনশীল প্রশ্ন লোড হচ্ছে...</p>
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
        <h1 style={s.pageTitle}>📂 সৃজনশীল প্রশ্ন অনুশীলন</h1>
        <p style={s.pageSubtitle}>বোর্ড পরীক্ষা এবং সেরা স্কুলের মডেল টেস্টের সৃজনশীল গণিত সমাধান প্র্যাকটিস করো।</p>
      </div>

      {/* Selector */}
      {!questionsType ? (
        <div style={s.selectionContainer}>
          <div style={s.choiceCard} onClick={() => setQuestionsType('board')}>
            <span style={s.choiceIcon}>🏛️</span>
            <h3 style={s.choiceTitle}>বোর্ড প্রশ্নাবলী</h3>
            <p style={s.choiceDesc}>বিগত বছরগুলোর এসএসসি পরীক্ষার সৃজনশীল প্রশ্ন ও উত্তরপত্র।</p>
            <button style={s.choiceBtn}>দেখুন</button>
          </div>
          <div style={s.choiceCard} onClick={() => setQuestionsType('model')}>
            <span style={s.choiceIcon}>📝</span>
            <h3 style={s.choiceTitle}>মডেল টেস্ট প্রশ্নাবলী</h3>
            <p style={s.choiceDesc}>গুরুত্বপূর্ণ স্কুল সমূহের নির্বাচনি পরীক্ষার সৃজনশীল প্রশ্ন ও উত্তরপত্র।</p>
            <button style={s.choiceBtn}>দেখুন</button>
          </div>
        </div>
      ) : (
        <div>
          <button onClick={() => setQuestionsType(null)} style={s.changeTypeBtn}>
            ⬅️ অন্য ক্যাটাগরি বেছে নিন
          </button>

          {error ? (
            <div style={s.errorBlock}>
              <p>⚠️ {error}</p>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div style={s.emptyBlock}>
              <p>এই ক্যাটাগরিতে কোনো সৃজনশীল প্রশ্ন পাওয়া যায়নি।</p>
            </div>
          ) : (
            <div style={s.list}>
              {filteredQuestions.map((q, idx) => (
                <div key={q.srijonshil_id} style={s.questionCard}>
                  <div style={s.qHeader}>
                    <span style={s.qIndex}>প্রশ্ন {idx + 1}</span>
                    <span style={s.qSource}>{q.source_name} ({q.exam_year || 'মডেল টেস্ট'})</span>
                  </div>

                  <div style={s.qBody}>
                    <div style={s.uddipok}>
                      <strong>উদ্দীপক:</strong>
                      <p style={s.uddipokText}>{q.uddipok_text}</p>
                    </div>
                    <div style={s.questionsList}>
                      <strong>প্রশ্নসমূহ:</strong>
                      <p style={s.questionItemText}>{q.question_text}</p>
                    </div>
                  </div>

                  <div style={s.qActions}>
                    <button 
                      onClick={() => {
                        setActiveSolutionId(activeSolutionId === q.srijonshil_id ? null : q.srijonshil_id);
                        setActiveAiHelpId(null);
                      }} 
                      style={s.solutionBtn}
                    >
                      📖 সমাধান দেখুন
                    </button>
                    <button 
                      onClick={() => handleAiHelp(q)} 
                      style={s.aiBtn}
                    >
                      🤖 হিন্ট বুঝে সমাধান করুন (AI)
                    </button>
                  </div>

                  {/* Render Static Solution */}
                  {activeSolutionId === q.srijonshil_id && (
                    <div style={s.solutionBox}>
                      <h4 style={s.boxTitle}>📋 উত্তর ও সমাধান:</h4>
                      <p style={s.boxText}>{q.solution}</p>
                    </div>
                  )}

                  {/* Render AI Solver */}
                  {activeAiHelpId === q.srijonshil_id && (
                    <div style={s.aiHelpBox}>
                      <h4 style={s.boxTitle}>🤖 AI টিউটর সমাধান:</h4>
                      {aiLoading ? (
                        <div style={s.aiLoadingIndicator}>
                          <div style={s.miniSpinner}></div>
                          <span>AI সমাধান তৈরি করছে...</span>
                        </div>
                      ) : aiResponse ? (
                        <div>
                          <div style={s.aiFinalAnswer}>
                            <strong>চূড়ান্ত উত্তর:</strong> {aiResponse.final_answer}
                          </div>
                          <div style={s.stepsList}>
                            {aiResponse.solution_steps?.map((step, sIdx) => (
                              <div key={sIdx} style={s.stepItem}>
                                <div style={s.stepNum}>ধাপ {step.step}</div>
                                <div style={s.stepContent}>
                                  <p style={{ margin: '0 0 8px 0' }}>{step.explanation}</p>
                                  <code style={s.mathCode}>{step.math}</code>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p style={{ color: '#ef4444' }}>কোনো সমাধান পাওয়া যায়নি।</p>
                      )}
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const s = {
  container: {
    fontFamily: "'Hind Siliguri', 'Outfit', sans-serif",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fce7f3 0%, #fae8ff 100%)",
    padding: "30px 10% 80px",
  },
  backLink: {
    display: "inline-block",
    textDecoration: "none",
    color: "#be185d",
    fontWeight: "600",
    marginBottom: "30px",
    fontSize: "14px",
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
  selectionContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    marginTop: "50px",
    flexWrap: "wrap",
  },
  choiceCard: {
    background: "white",
    borderRadius: "20px",
    padding: "40px 30px",
    width: "320px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
    border: "2px solid transparent",
    transition: "transform 0.2s, border-color 0.2s",
  },
  choiceIcon: {
    fontSize: "48px",
    display: "block",
    marginBottom: "20px",
  },
  choiceTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "12px",
  },
  choiceDesc: {
    fontSize: "14px",
    color: "#64748b",
    lineHeight: "1.6",
    marginBottom: "24px",
    height: "60px",
  },
  choiceBtn: {
    background: "#be185d",
    color: "white",
    border: "none",
    padding: "10px 24px",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
  },
  changeTypeBtn: {
    background: "white",
    color: "#be185d",
    border: "2px solid #be185d",
    borderRadius: "10px",
    padding: "10px 20px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "14px",
    marginBottom: "30px",
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
    borderTop: "5px solid #be185d",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "20px",
    fontSize: "18px",
    color: "#0f172a",
    fontWeight: "600",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    maxWidth: "850px",
    margin: "0 auto",
  },
  questionCard: {
    background: "white",
    borderRadius: "18px",
    boxShadow: "0 4px 25px rgba(0,0,0,0.03)",
    overflow: "hidden",
    border: "1px solid #f3e8ff",
  },
  qHeader: {
    background: "linear-gradient(90deg, #fce7f3, #fae8ff)",
    padding: "18px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #f3e8ff",
  },
  qIndex: {
    background: "#be185d",
    color: "white",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
  },
  qSource: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#be185d",
  },
  qBody: {
    padding: "24px",
  },
  uddipok: {
    marginBottom: "20px",
  },
  uddipokText: {
    fontSize: "16px",
    lineHeight: "1.7",
    color: "#334155",
    marginTop: "6px",
    whiteSpace: "pre-line",
  },
  questionsList: {
    background: "#faf5ff",
    padding: "16px 20px",
    borderRadius: "12px",
    border: "1px dashed #e9d5ff",
  },
  questionItemText: {
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#4a044e",
    marginTop: "6px",
    whiteSpace: "pre-line",
  },
  qActions: {
    padding: "0 24px 24px",
    display: "flex",
    gap: "16px",
  },
  solutionBtn: {
    background: "#475569",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "12px 24px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
  },
  aiBtn: {
    background: "linear-gradient(90deg, #be185d, #be185d)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "12px 24px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
    boxShadow: "0 4px 15px rgba(190,24,93,0.25)",
  },
  solutionBox: {
    background: "#f8fafc",
    padding: "24px",
    borderTop: "1px solid #f1f5f9",
  },
  aiHelpBox: {
    background: "#faf5ff",
    padding: "24px",
    borderTop: "1px solid #f3e8ff",
  },
  boxTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "12px",
  },
  boxText: {
    fontSize: "14px",
    lineHeight: "1.7",
    color: "#334155",
    margin: 0,
    whiteSpace: "pre-line",
  },
  aiLoadingIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#6b21a8",
    fontWeight: "600",
    fontSize: "14px",
  },
  miniSpinner: {
    width: "20px",
    height: "20px",
    border: "3px solid #f3e8ff",
    borderTop: "3px solid #be185d",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  aiFinalAnswer: {
    background: "#fae8ff",
    border: "1px solid #f5d0fe",
    padding: "12px 16px",
    borderRadius: "8px",
    color: "#701a75",
    fontSize: "15px",
    marginBottom: "20px",
  },
  stepsList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  stepItem: {
    background: "white",
    borderRadius: "10px",
    padding: "14px 18px",
    border: "1px solid #f3e8ff",
  },
  stepNum: {
    background: "#be185d",
    color: "white",
    fontSize: "11px",
    fontWeight: "700",
    padding: "2px 6px",
    borderRadius: "4px",
    display: "inline-block",
    marginBottom: "8px",
  },
  stepContent: {
    fontSize: "14px",
    color: "#334155",
    lineHeight: "1.6",
  },
  mathCode: {
    display: "block",
    background: "#f8fafc",
    padding: "10px",
    borderRadius: "6px",
    fontFamily: "monospace",
    marginTop: "6px",
    color: "#0f172a",
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

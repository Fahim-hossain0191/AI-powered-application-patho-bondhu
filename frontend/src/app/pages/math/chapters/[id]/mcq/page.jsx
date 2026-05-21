'use client'

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

export default function MCQPracticeView({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [session_id, setSessionId] = useState(null);
  const [mcqs, setMcqs] = useState([]);
  
  // Quiz tracking
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null); // 'ক', 'খ', 'গ', 'ঘ'
  const [isAnswered, setIsAnswered] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  // Score tracking
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.href = '/pages/login';
      return;
    }

    fetch(`http://localhost:5000/api/math/chapters/${id}/mcq/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('MCQ জেনারেট করতে ব্যর্থ হয়েছে। জেমিনি রেট লিমিট অতিক্রম করতে পারে।');
        return res.json();
      })
      .then(data => {
        setSessionId(data.data.session_id);
        setMcqs(data.data.mcqs || []);
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
    if (typeof window !== 'undefined' && window.MathJax && mcqs.length > 0) {
      setTimeout(() => {
        window.MathJax.typesetPromise();
      }, 100);
    }
  }, [mcqs, currentIndex, isAnswered, isFinished]);

  const handleSubmitAnswer = async () => {
    if (isAnswered || !selectedOption || submitLoading) return;
    setSubmitLoading(true);
    
    try {
      const token = localStorage.getItem('accessToken');
      const currentMcq = mcqs[currentIndex];
      const res = await fetch('http://localhost:5000/api/math/mcq/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          session_id,
          mcq_data: currentMcq,
          selected_option: selectedOption
        })
      });
      const data = await res.json();
      if (res.ok) {
        setEvaluation(data.data);
        setIsAnswered(true);
        if (data.data.is_correct) {
          setScore(prev => prev + 1);
        }
      } else {
        alert(data.message || 'উত্তর জমা দিতে সমস্যা হয়েছে');
      }
    } catch (e) {
      alert('সার্ভারের সাথে কানেক্ট করা যাচ্ছে না');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < mcqs.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setEvaluation(null);
    } else {
      setIsFinished(true);
    }
  };

  if (loading) {
    return (
      <div style={s.loadingWrap}>
        <div style={s.spinner}></div>
        <p style={s.loadingText}>🤖 AI আপনার জন্য ২০টি স্পেশাল MCQ তৈরি করছে...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={s.container}>
        <Link href={`/pages/math/chapters/${id}`} style={s.backLink}>
          🔙 পূর্ববর্তী মেন্যু-এ ফিরে যাও
        </Link>
        <div style={s.errorBlock}>
          <h2 style={{ fontWeight: '700', marginBottom: '10px' }}>⚠️ দুঃখিত!</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} style={s.retryBtn}>আবার চেষ্টা করুন</button>
        </div>
      </div>
    );
  }

  const currentMcq = mcqs[currentIndex];

  return (
    <div style={s.container}>
      <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      
      {/* Back Link */}
      <Link href={`/pages/math/chapters/${id}`} style={s.backLink}>
        🔙 পূর্ববর্তী মেন্যু-এ ফিরে যাও
      </Link>

      {!isFinished ? (
        <div style={s.quizCard}>
          {/* Progress bar */}
          <div style={s.progressContainer}>
            <div style={s.progressBarRow}>
              <span>প্রশ্ন: <strong>{currentIndex + 1} / {mcqs.length}</strong></span>
              <span>স্কোর: <strong>{score}</strong></span>
            </div>
            <div style={s.barBackground}>
              <div style={{ ...s.barFill, width: `${((currentIndex + 1) / mcqs.length) * 100}%` }}></div>
            </div>
          </div>

          {/* Question */}
          <h2 style={s.questionText}>{currentMcq?.question}</h2>

          {/* Options */}
          <div style={s.optionsGrid}>
            {currentMcq && Object.entries(currentMcq.options).map(([key, value]) => {
              const isSelected = selectedOption === key;
              const isCorrectAnswer = evaluation?.correct_option === key;
              
              let btnBg = 'white';
              let btnColor = '#0f172a';
              let btnBorder = '1.5px solid #cbd5e1';

              if (isAnswered) {
                if (isCorrectAnswer) {
                  btnBg = '#ecfdf5';
                  btnColor = '#047857';
                  btnBorder = '2px solid #10b981';
                } else if (isSelected) {
                  btnBg = '#fee2e2';
                  btnColor = '#b91c1c';
                  btnBorder = '2px solid #ef4444';
                }
              } else if (isSelected) {
                btnBg = '#e0f2fe';
                btnColor = '#0284c7';
                btnBorder = '2.5px solid #0ea5e9';
              }

              return (
                <button
                  key={key}
                  disabled={isAnswered}
                  onClick={() => setSelectedOption(key)}
                  style={{ ...s.optionBtn, backgroundColor: btnBg, color: btnColor, border: btnBorder }}
                >
                  <span style={s.optBadge}>{key}</span>
                  <span style={s.optText}>{value}</span>
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div style={s.actionRow}>
            {!isAnswered ? (
              <button
                disabled={!selectedOption || submitLoading}
                onClick={handleSubmitAnswer}
                style={{ ...s.submitBtn, opacity: selectedOption ? 1 : 0.6 }}
              >
                {submitLoading ? 'জমা হচ্ছে...' : 'উত্তর জমা দিন 🚀'}
              </button>
            ) : (
              <button onClick={handleNext} style={s.nextBtn}>
                {currentIndex + 1 === mcqs.length ? 'ফলাফল দেখুন 🎉' : 'পরবর্তী প্রশ্ন ➔'}
              </button>
            )}
          </div>

          {/* Explanation */}
          {isAnswered && evaluation && (
            <div style={s.explanationBox}>
              <h4 style={{ color: evaluation.is_correct ? '#047857' : '#b91c1c', fontWeight: '700', marginBottom: '8px' }}>
                {evaluation.is_correct ? '🎉 অভিনন্দন! উত্তর সঠিক হয়েছে।' : '⚠️ দুঃখিত! উত্তর সঠিক হয়নি।'}
              </h4>
              <p style={s.explanationText}><strong>ব্যাখ্যা:</strong> {evaluation.explanation}</p>
            </div>
          )}
        </div>
      ) : (
        <div style={s.resultCard}>
          <span style={s.resultIcon}>🏆</span>
          <h2 style={s.resultTitle}>অনুশীলন সম্পন্ন হয়েছে!</h2>
          <p style={s.resultDesc}>তোমার সামগ্রিক ফলাফল নিচে দেওয়া হলো:</p>
          
          <div style={s.scoreBox}>
            <span style={s.scoreNum}>{score}</span>
            <span style={s.scoreTotal}>/ {mcqs.length}</span>
          </div>

          <p style={s.motivationText}>
            {score >= 15 ? 'চমৎকার প্রস্তুতি! তোমার গণিত দক্ষতা দারুণ।' : score >= 10 ? 'বেশ ভালো করেছো! আরও একটু অনুশীলন করলে আরও নিখুঁত হবে।' : 'হতাশ হয়ো না, ভুল থেকেই আমরা শিখি। অধ্যায়টি আবার প্র্যাকটিস করো!'}
          </p>

          <button onClick={() => window.location.reload()} style={s.restartBtn}>
            আবার অনুশীলন করো 🔄
          </button>
        </div>
      )}
    </div>
  );
}

const s = {
  container: {
    fontFamily: "'Hind Siliguri', 'Outfit', sans-serif",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #faf5ff 0%, #fae8ff 100%)",
    padding: "30px 10% 80px",
  },
  backLink: {
    display: "inline-block",
    textDecoration: "none",
    color: "#6b21a8",
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
    border: "5px solid #e9d5ff",
    borderTop: "5px solid #701a75",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "20px",
    fontSize: "18px",
    color: "#701a75",
    fontWeight: "600",
  },
  quizCard: {
    background: "white",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
    padding: "40px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  progressContainer: {
    marginBottom: "30px",
  },
  progressBarRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    color: "#475569",
    marginBottom: "8px",
  },
  barBackground: {
    height: "8px",
    background: "#f1f5f9",
    borderRadius: "10px",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    background: "#c084fc",
    borderRadius: "10px",
    transition: "width 0.3s ease",
  },
  questionText: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "30px",
    lineHeight: "1.6",
  },
  optionsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "30px",
  },
  optionBtn: {
    padding: "16px 20px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "16px",
    fontWeight: "500",
    transition: "all 0.15s",
  },
  optBadge: {
    background: "#f1f5f9",
    color: "#475569",
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "14px",
    flexShrink: 0,
  },
  optText: {
    fontFamily: "'Hind Siliguri', sans-serif",
  },
  actionRow: {
    display: "flex",
    justifyContent: "flex-end",
  },
  submitBtn: {
    background: "linear-gradient(90deg, #a855f7, #c084fc)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "12px 28px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "15px",
    boxShadow: "0 4px 12px rgba(168,85,247,0.2)",
  },
  nextBtn: {
    background: "#0f172a",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "12px 28px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "15px",
  },
  explanationBox: {
    marginTop: "30px",
    background: "#faf5ff",
    padding: "20px",
    borderRadius: "12px",
    border: "1px dashed #e9d5ff",
  },
  explanationText: {
    fontSize: "14px",
    color: "#475569",
    lineHeight: "1.6",
    margin: 0,
  },
  resultCard: {
    background: "white",
    borderRadius: "20px",
    padding: "50px 40px",
    maxWidth: "500px",
    margin: "0 auto",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
  },
  resultIcon: {
    fontSize: "64px",
    display: "block",
    marginBottom: "20px",
  },
  resultTitle: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "8px",
  },
  resultDesc: {
    fontSize: "15px",
    color: "#64748b",
    marginBottom: "30px",
  },
  scoreBox: {
    display: "inline-block",
    background: "#faf5ff",
    border: "2px solid #e9d5ff",
    borderRadius: "20px",
    padding: "16px 40px",
    marginBottom: "24px",
  },
  scoreNum: {
    fontSize: "48px",
    fontWeight: "800",
    color: "#6b21a8",
  },
  scoreTotal: {
    fontSize: "20px",
    color: "#94a3b8",
    marginLeft: "4px",
  },
  motivationText: {
    fontSize: "15px",
    color: "#475569",
    lineHeight: "1.6",
    marginBottom: "30px",
    padding: "0 20px",
  },
  restartBtn: {
    background: "#6b21a8",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "14px 30px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "15px",
  },
  errorBlock: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "24px",
    borderRadius: "16px",
    textAlign: "center",
    maxWidth: "500px",
    margin: "40px auto 0",
  },
  retryBtn: {
    marginTop: "16px",
    background: "#b91c1c",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    fontWeight: "600",
    cursor: "pointer",
  }
};

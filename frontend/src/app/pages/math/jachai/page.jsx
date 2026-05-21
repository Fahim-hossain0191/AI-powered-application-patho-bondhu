'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function JachaiWorkspace() {
  const [activeTab, setActiveTab] = useState('image'); // 'image', 'solve', 'check'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Inputs
  const [question, setQuestion] = useState('');
  const [studentSolution, setStudentSolution] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
  }, [activeTab, result]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    setResult(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.href = '/pages/login';
      return;
    }

    try {
      if (activeTab === 'image') {
        if (!imageFile) {
          alert('অনুগ্রহ করে একটি ছবি সিলেক্ট করুন');
          setLoading(false);
          return;
        }

        // Convert file to base64
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = async () => {
          const base64String = reader.result.split(',')[1];
          const mimeType = imageFile.type;

          try {
            const res = await fetch('http://localhost:5000/api/math/jachai/image', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                image_base64: base64String,
                image_mime: mimeType
              })
            });
            const data = await res.json();
            if (res.ok) {
              setResult({ type: 'image', data: data.data });
            } else {
              alert(data.message || 'ছবি প্রসেস করতে ব্যর্থ হয়েছে');
            }
          } catch (err) {
            alert('সার্ভারের সাথে কানেক্ট করা যাচ্ছে না');
          } finally {
            setLoading(false);
          }
        };
      } else if (activeTab === 'solve') {
        if (!question.trim()) {
          alert('অনুগ্রহ করে একটি প্রশ্ন টাইপ করুন');
          setLoading(false);
          return;
        }

        const res = await fetch('http://localhost:5000/api/math/jachai/solve', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ question })
        });
        const data = await res.json();
        if (res.ok) {
          setResult({ type: 'solve', data: data.data });
        } else {
          alert(data.message || 'সমাধান করতে ব্যর্থ হয়েছে');
        }
        setLoading(false);
      } else if (activeTab === 'check') {
        if (!question.trim() || !studentSolution.trim()) {
          alert('অনুগ্রহ করে প্রশ্ন এবং সমাধান দুটোই টাইপ করুন');
          setLoading(false);
          return;
        }

        const res = await fetch('http://localhost:5000/api/math/jachai/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            question,
            student_solution: studentSolution
          })
        });
        const data = await res.json();
        if (res.ok) {
          setResult({ type: 'check', data: data.data });
        } else {
          alert(data.message || 'যাচাই করতে ব্যর্থ হয়েছে');
        }
        setLoading(false);
      }
    } catch (err) {
      alert('সার্ভারের সাথে কানেক্ট করা যাচ্ছে না');
      setLoading(false);
    }
  };

  return (
    <div style={s.container}>
      <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      
      {/* Back Link */}
      <Link href="/pages/math" style={s.backLink}>
        🔙 গণিত পাঠশালা-এ ফিরে যাও
      </Link>

      <div style={s.hero}>
        <h1 style={s.pageTitle}>🤖 AI গণিত যাচাইকারী (Jachai)</h1>
        <p style={s.pageSubtitle}>যেকোনো গণিত সমস্যার সমাধান ছবি তুলে বা টাইপ করে যাচাই করো মুহূর্তে!</p>
      </div>

      {/* Tabs */}
      <div style={s.tabsRow}>
        <button 
          onClick={() => { setActiveTab('image'); setResult(null); }} 
          style={{ ...s.tabBtn, borderBottom: activeTab === 'image' ? '3px solid #0d9488' : '3px solid transparent', color: activeTab === 'image' ? '#0d9488' : '#64748b' }}
        >
          📷 ছবি আপলোড করুন
        </button>
        <button 
          onClick={() => { setActiveTab('solve'); setResult(null); }} 
          style={{ ...s.tabBtn, borderBottom: activeTab === 'solve' ? '3px solid #0d9488' : '3px solid transparent', color: activeTab === 'solve' ? '#0d9488' : '#64748b' }}
        >
          ✍️ টাইপ করুন (শুধু প্রশ্ন)
        </button>
        <button 
          onClick={() => { setActiveTab('check'); setResult(null); }} 
          style={{ ...s.tabBtn, borderBottom: activeTab === 'check' ? '3px solid #0d9488' : '3px solid transparent', color: activeTab === 'check' ? '#0d9488' : '#64748b' }}
        >
          📝 টাইপ করুন (প্রশ্ন + সমাধান)
        </button>
      </div>

      <div style={s.workspace}>
        {/* Input Form Section */}
        <form onSubmit={handleFormSubmit} style={s.formPanel}>
          {activeTab === 'image' && (
            <div style={s.formGroup}>
              <label style={s.label}>গণিত খাতার ছবি সিলেক্ট করুন</label>
              <div style={s.uploadArea}>
                <input type="file" accept="image/*" onChange={handleImageChange} style={s.fileInput} id="imageUpload" />
                <label htmlFor="imageUpload" style={s.uploadLabel}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" style={s.previewImg} />
                  ) : (
                    <div style={s.uploadPlaceholder}>
                      <span style={{ fontSize: '40px' }}>📤</span>
                      <span>মোবাইল ক্যামেরা বা গ্যালারি থেকে ছবি যুক্ত করুন</span>
                    </div>
                  )}
                </label>
              </div>
            </div>
          )}

          {activeTab === 'solve' && (
            <div style={s.formGroup}>
              <label style={s.label}>গণিত প্রশ্নটি লিখুন</label>
              <textarea 
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="যেমন: x^2 - 5x + 6 = 0 সমীকরণটি সমাধান করো"
                style={s.textarea}
              />
            </div>
          )}

          {activeTab === 'check' && (
            <>
              <div style={s.formGroup}>
                <label style={s.label}>গণিত প্রশ্নটি লিখুন</label>
                <textarea 
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="যেমন: x^2 - 5x + 6 = 0"
                  style={s.textareaSmall}
                />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>তোমার কৃত সমাধানটি লিখুন (ধাপে ধাপে)</label>
                <textarea 
                  value={studentSolution}
                  onChange={(e) => setStudentSolution(e.target.value)}
                  placeholder="যেমন: x^2 - 3x - 2x + 6 = 0 => x(x-3) - 2(x-3) = 0 => x = 2, 3"
                  style={s.textarea}
                />
              </div>
            </>
          )}

          <button type="submit" disabled={loading} style={s.submitBtn}>
            {loading ? 'AI বিশ্লেষণ করছে...' : 'যাচাই শুরু করুন ⚡'}
          </button>
        </form>

        {/* Output Result Section */}
        <div style={s.resultPanel}>
          <h3 style={s.panelTitle}>AI টিউটরের বিশ্লেষণ</h3>
          {loading ? (
            <div style={s.loadingBox}>
              <div style={s.spinner}></div>
              <p style={{ marginTop: '16px', color: '#64748b' }}>AI আপনার গণিত সমাধান বিশ্লেষণ করছে...</p>
            </div>
          ) : result ? (
            <div style={s.resultContainer}>
              
              {/* IMAGE MODE RESPONSE */}
              {result.type === 'image' && (
                <div>
                  <div style={s.badge}>ছবি বিশ্লেষণ ফলাফল</div>
                  
                  {result.data.detected_question && (
                    <div style={s.detectedInfo}>
                      <strong>শনাক্তকৃত প্রশ্ন:</strong>
                      <p style={{ margin: '4px 0 0 0' }}>{result.data.detected_question}</p>
                    </div>
                  )}

                  {result.data.is_correct !== undefined ? (
                    // This was a question + solution check
                    <div style={s.checkDetails}>
                      <div style={{ ...s.statusCard, backgroundColor: result.data.is_correct ? '#ecfdf5' : '#fee2e2', color: result.data.is_correct ? '#065f46' : '#991b1b' }}>
                        <h3>{result.data.is_correct ? '✅ সমাধান সঠিক হয়েছে!' : '❌ সমাধান সঠিক হয়নি'}</h3>
                        <p style={{ margin: '8px 0 0 0' }}>{result.data.feedback}</p>
                      </div>

                      {result.data.show_solution && result.data.full_solution && (
                        <div style={s.fullSolSection}>
                          <strong>সঠিক সমাধান:</strong>
                          <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6', marginTop: '6px' }}>{result.data.full_solution}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    // This was just a question solve
                    <div>
                      <div style={s.finalAnsBox}>
                        <strong>চূড়ান্ত উত্তর:</strong> {result.data.final_answer}
                      </div>
                      <div style={s.stepsList}>
                        {result.data.solution_steps?.map((step, idx) => (
                          <div key={idx} style={s.stepItem}>
                            <span style={s.stepNum}>ধাপ {step.step}</span>
                            <p style={{ margin: '8px 0' }}>{step.explanation}</p>
                            <code style={s.mathCode}>{step.math}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SOLVE MODE RESPONSE */}
              {result.type === 'solve' && (
                <div>
                  <div style={s.finalAnsBox}>
                    <strong>চূড়ান্ত উত্তর:</strong> {result.data.final_answer}
                  </div>
                  <div style={s.stepsList}>
                    {result.data.solution_steps?.map((step, idx) => (
                      <div key={idx} style={s.stepItem}>
                        <span style={s.stepNum}>ধাপ {step.step}</span>
                        <p style={{ margin: '8px 0' }}>{step.explanation}</p>
                        <code style={s.mathCode}>{step.math}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CHECK MODE RESPONSE */}
              {result.type === 'check' && (
                <div style={s.checkDetails}>
                  <div style={{ ...s.statusCard, backgroundColor: result.data.is_correct ? '#ecfdf5' : '#fee2e2', color: result.data.is_correct ? '#065f46' : '#991b1b' }}>
                    <h3>{result.data.is_correct ? '✅ সমাধান সম্পূর্ণ সঠিক!' : '❌ সমাধানে ত্রুটি পাওয়া গেছে'}</h3>
                    <p style={{ margin: '8px 0 0 0' }}>{result.data.feedback}</p>
                  </div>

                  {result.data.what_went_wrong && (
                    <div style={s.wrongBox}>
                      <strong>কোথায় ভুল হয়েছে:</strong>
                      <p style={{ margin: '4px 0 0 0' }}>{result.data.what_went_wrong}</p>
                    </div>
                  )}

                  {result.data.what_should_be && (
                    <div style={s.shouldBeBox}>
                      <strong>কী করা উচিত ছিল:</strong>
                      <p style={{ margin: '4px 0 0 0' }}>{result.data.what_should_be}</p>
                    </div>
                  )}

                  {result.data.show_solution && result.data.full_solution && (
                    <div style={s.fullSolSection}>
                      <strong>সঠিক সমাধান:</strong>
                      <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6', marginTop: '6px' }}>{result.data.full_solution}</p>
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : (
            <div style={s.emptyState}>
              <span style={{ fontSize: '48px' }}>🤖</span>
              <p>আপনার গণিত প্রশ্ন সাবমিট করলে AI টিউটরের সম্পূর্ণ ব্যাখ্যা এখানে দেখা যাবে।</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  container: {
    fontFamily: "'Hind Siliguri', 'Outfit', sans-serif",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e0f2fe 0%, #f0fdfa 100%)",
    padding: "30px 10% 80px",
  },
  backLink: {
    display: "inline-block",
    textDecoration: "none",
    color: "#0369a1",
    fontWeight: "600",
    marginBottom: "30px",
    fontSize: "14px",
  },
  hero: {
    textAlign: "center",
    marginBottom: "35px",
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
  tabsRow: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    marginBottom: "30px",
    borderBottom: "1px solid #e2e8f0",
  },
  tabBtn: {
    padding: "12px 20px",
    fontSize: "16px",
    fontWeight: "700",
    background: "none",
    border: "none",
    cursor: "pointer",
    transition: "color 0.2s, border-bottom 0.2s",
  },
  workspace: {
    display: "grid",
    gridTemplateColumns: "1.1fr 1fr",
    gap: "40px",
    background: "white",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
  },
  formPanel: {
    borderRight: "1px solid #f1f5f9",
    paddingRight: "40px",
  },
  formGroup: {
    marginBottom: "24px",
  },
  label: {
    display: "block",
    fontSize: "15px",
    fontWeight: "600",
    color: "#334155",
    marginBottom: "10px",
  },
  uploadArea: {
    width: "100%",
  },
  fileInput: {
    display: "none",
  },
  uploadLabel: {
    display: "block",
    border: "2px dashed #cbd5e1",
    borderRadius: "14px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    background: "#f8fafc",
    transition: "border-color 0.2s",
  },
  uploadPlaceholder: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    color: "#64748b",
    fontSize: "14px",
  },
  previewImg: {
    maxWidth: "100%",
    maxHeight: "220px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  textarea: {
    width: "100%",
    height: "150px",
    padding: "14px",
    borderRadius: "12px",
    border: "1.5px solid #cbd5e1",
    fontSize: "14px",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
  },
  textareaSmall: {
    width: "100%",
    height: "80px",
    padding: "12px",
    borderRadius: "12px",
    border: "1.5px solid #cbd5e1",
    fontSize: "14px",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
  },
  submitBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(90deg, #0d9488, #0ea5e9)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "16px",
    boxShadow: "0 4px 15px rgba(13,148,136,0.25)",
  },
  resultPanel: {
    minHeight: "50vh",
    display: "flex",
    flexDirection: "column",
  },
  panelTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "20px",
    borderBottom: "2px solid #f1f5f9",
    paddingBottom: "8px",
  },
  loadingBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #f1f5f9",
    borderTop: "4px solid #0d9488",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    textAlign: "center",
    color: "#94a3b8",
    gap: "12px",
    padding: "40px 20px",
  },
  resultContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  badge: {
    background: "#0d9488",
    color: "white",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "700",
    display: "inline-block",
    marginBottom: "14px",
  },
  detectedInfo: {
    background: "#f1f5f9",
    padding: "12px 16px",
    borderRadius: "10px",
    color: "#475569",
    fontSize: "14px",
    marginBottom: "20px",
  },
  checkDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  statusCard: {
    padding: "20px",
    borderRadius: "12px",
    borderWidth: "1px",
    borderStyle: "solid",
  },
  wrongBox: {
    background: "#fef2f2",
    borderLeft: "4px solid #ef4444",
    padding: "12px 16px",
    fontSize: "14px",
  },
  shouldBeBox: {
    background: "#faf5ff",
    borderLeft: "4px solid #a855f7",
    padding: "12px 16px",
    fontSize: "14px",
  },
  fullSolSection: {
    background: "#f8fafc",
    padding: "16px 20px",
    borderRadius: "12px",
    border: "1px dashed #cbd5e1",
    fontSize: "14px",
  },
  finalAnsBox: {
    background: "#e0f2fe",
    border: "1px solid #bae6fd",
    padding: "14px 18px",
    borderRadius: "10px",
    color: "#0369a1",
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "20px",
  },
  stepsList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  stepItem: {
    background: "#faf5ff",
    borderRadius: "10px",
    padding: "14px 18px",
    border: "1px solid #e9d5ff",
  },
  stepNum: {
    background: "#701a75",
    color: "white",
    fontSize: "11px",
    fontWeight: "700",
    padding: "2px 6px",
    borderRadius: "4px",
    display: "inline-block",
  },
  mathCode: {
    display: "block",
    background: "#f8fafc",
    padding: "8px",
    borderRadius: "6px",
    fontFamily: "monospace",
    marginTop: "6px",
  }
};

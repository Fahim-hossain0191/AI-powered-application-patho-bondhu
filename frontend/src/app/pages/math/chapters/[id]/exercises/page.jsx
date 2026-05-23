'use client'
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

export default function ExercisesView({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;
  
  const [difficulty, setDifficulty] = useState(null); // 'easy', 'medium', 'hard'
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [selectedExercise, setSelectedExercise] = useState(null);
  
  // Hint states
  const [hints, setHints] = useState({ 1: null, 2: null, 3: null });
  const [unlockedPhase, setUnlockedPhase] = useState(1); // 1, 2, or 3
  const [hintLoading, setHintLoading] = useState(false);
  
  // Solution state
  const [solution, setSolution] = useState(null);
  const [solutionLoading, setSolutionLoading] = useState(false);
  
  // Check answer states
  const [studentAnswer, setStudentAnswer] = useState('');
  const [checkResult, setCheckResult] = useState(null);
  const [checkLoading, setCheckLoading] = useState(false);

  // Load exercises when difficulty changes
  useEffect(() => {
    if (!difficulty) return;
    
    setLoading(true);
    setError(null);
    setSelectedExercise(null);
    setHints({ 1: null, 2: null, 3: null });
    setUnlockedPhase(1);
    setSolution(null);
    setStudentAnswer('');
    setCheckResult(null);

    const token = localStorage.getItem('accessToken');
    fetch(`http://localhost:5000/api/math/chapters/${id}/exercises?difficulty=${difficulty}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('অনুশীলনী লোড করতে ব্যর্থ হয়েছে');
        return res.json();
      })
      .then(data => {
        setExercises(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [difficulty, id]);

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
  }, [selectedExercise, hints, solution, checkResult, exercises]);

  const selectExercise = (ex) => {
    setSelectedExercise(ex);
    setHints({ 1: null, 2: null, 3: null });
    setUnlockedPhase(1);
    setSolution(null);
    setStudentAnswer('');
    setCheckResult(null);
  };

  const getHint = async (phase) => {
    if (!selectedExercise) return;
    setHintLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:5000/api/math/hint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          exercise_id: selectedExercise.exercise_id,
          phase: phase
        })
      });
      const data = await res.json();
      if (res.ok) {
        setHints(prev => ({ ...prev, [phase]: data.data.hint }));
        setUnlockedPhase(phase + 1);
      } else {
        alert(data.message || 'হিন্ট পেতে সমস্যা হয়েছে');
      }
    } catch (e) {
      alert('সার্ভারের সাথে কানেক্ট করা যাচ্ছে না');
    } finally {
      setHintLoading(false);
    }
  };

  const getFullSolution = async () => {
    if (!selectedExercise) return;
    setSolutionLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`http://localhost:5000/api/math/exercises/${selectedExercise.exercise_id}/solution`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setSolution(data.data.solution_steps);
      } else {
        alert(data.message || 'সমাধান লোড করতে সমস্যা হয়েছে');
      }
    } catch (e) {
      alert('সার্ভারের সাথে কানেক্ট করা যাচ্ছে না');
    } finally {
      setSolutionLoading(false);
    }
  };

  const checkAnswer = async () => {
    if (!selectedExercise || !studentAnswer.trim()) return;
    setCheckLoading(true);
    setCheckResult(null);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:5000/api/math/jachai/exercise-check-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          exercise_id: selectedExercise.exercise_id,
          student_answer: studentAnswer
        })
      });
      const data = await res.json();
      if (res.ok) {
        setCheckResult(data.data);
      } else {
        alert(data.message || 'উত্তর যাচাই করতে সমস্যা হয়েছে');
      }
    } catch (e) {
      alert('সার্ভারের সাথে কানেক্ট করা যাচ্ছে না');
    } finally {
      setCheckLoading(false);
    }
  };

  return (
    <div style={s.container}>
      <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      
      {/* Back Link */}
      <Link href={`/pages/math/chapters/${id}`} style={s.backLink}>
        🔙 পূর্ববর্তী মেন্যু-এ ফিরে যাও
      </Link>

      <div style={s.hero}>
        <h1 style={s.pageTitle}>✏️ অনুশীলনী অনুশীলন ও যাচাই</h1>
        <p style={s.pageSubtitle}>প্রথমে তোমার দক্ষতার স্তর নির্বাচন করো এবং অনুশীলনী গণিতগুলো ক্রমান্বয়ে সমাধান করো।</p>
      </div>

      {/* Difficulty Selector */}
      <div style={s.difficultyRow}>
        <button 
          onClick={() => setDifficulty('easy')} 
          style={{ ...s.diffBtn, backgroundColor: difficulty === 'easy' ? '#14b8a6' : '#e0f2fe', color: difficulty === 'easy' ? 'white' : '#0f766e' }}
        >
          🟢 সহজ (Easy)
        </button>
        <button 
          onClick={() => setDifficulty('medium')} 
          style={{ ...s.diffBtn, backgroundColor: difficulty === 'medium' ? '#f59e0b' : '#fef3c7', color: difficulty === 'medium' ? 'white' : '#b45309' }}
        >
          🟡 মাঝারি (Medium)
        </button>
        <button 
          onClick={() => setDifficulty('hard')} 
          style={{ ...s.diffBtn, backgroundColor: difficulty === 'hard' ? '#ef4444' : '#fee2e2', color: difficulty === 'hard' ? 'white' : '#b91c1c' }}
        >
          🔴 কঠিন (Hard)
        </button>
      </div>

      {difficulty && (
        <div style={s.workspace}>
          {/* Left panel: List of exercises */}
          <div style={s.sidebar}>
            <h3 style={s.panelTitle}>প্রশ্ন তালিকা</h3>
            {loading ? (
              <p style={s.infoText}>লোড হচ্ছে...</p>
            ) : error ? (
              <p style={s.errorText}>{error}</p>
            ) : exercises.length === 0 ? (
              <p style={s.infoText}>এই স্তরের কোনো প্রশ্ন পাওয়া যায়নি।</p>
            ) : (
              <div style={s.exerciseList}>
                {exercises.map((ex) => (
                  <div 
                    key={ex.exercise_id} 
                    onClick={() => selectExercise(ex)}
                    style={{ ...s.exItem, borderLeft: selectedExercise?.exercise_id === ex.exercise_id ? '4px solid #0d9488' : '4px solid transparent', backgroundColor: selectedExercise?.exercise_id === ex.exercise_id ? '#f0fdfa' : 'white' }}
                  >
                    <strong>প্রশ্ন {ex.exercise_number}</strong>
                    <p style={s.exSnippet}>{ex.question_text.substring(0, 40)}...</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right panel: Active solving workspace */}
          <div style={s.mainBody}>
            {selectedExercise ? (
              <div style={s.questionWorkspace}>
                {/* Question */}
                <div style={s.questionBox}>
                  <span style={s.questionBadge}>প্রশ্ন {selectedExercise.exercise_number}</span>
                  <p style={s.questionText}>{selectedExercise.question_text}</p>
                </div>

                {/* Hint System */}
                <div style={s.section}>
                  <h4 style={s.sectionTitle}>💡 এআই সাহায্যকারী সংকেত (Hints)</h4>
                  <div style={s.hintButtonGroup}>
                    <button 
                      disabled={hintLoading} 
                      onClick={() => getHint(1)} 
                      style={{ ...s.actionBtn, backgroundColor: '#0d9488' }}
                    >
                      হিন্ট ১ {hints[1] ? '🔓' : '🔒'}
                    </button>
                    <button 
                      disabled={hintLoading || unlockedPhase < 2} 
                      onClick={() => getHint(2)} 
                      style={{ 
                        ...s.actionBtn, 
                        backgroundColor: unlockedPhase < 2 ? '#94a3b8' : '#0d9488',
                        cursor: unlockedPhase < 2 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      হিন্ট ২ {hints[2] ? '🔓' : '🔒'}
                    </button>
                    <button 
                      disabled={hintLoading || unlockedPhase < 3} 
                      onClick={() => getHint(3)} 
                      style={{ 
                        ...s.actionBtn, 
                        backgroundColor: unlockedPhase < 3 ? '#94a3b8' : '#0d9488',
                        cursor: unlockedPhase < 3 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      হিন্ট ৩ {hints[3] ? '🔓' : '🔒'}
                    </button>
                  </div>

                  {/* Render unlocked hints */}
                  <div style={s.hintsContainer}>
                    {hints[1] && <div style={s.hintBubble}><strong>হিন্ট ১:</strong> {hints[1]}</div>}
                    {hints[2] && <div style={s.hintBubble}><strong>হিন্ট ২:</strong> {hints[2]}</div>}
                    {hints[3] && <div style={s.hintBubble}><strong>হিন্ট ৩:</strong> {hints[3]}</div>}
                  </div>
                </div>

                {/* Answer Check */}
                <div style={s.section}>
                  <h4 style={s.sectionTitle}>📝 তোমার উত্তর টাইপ করো</h4>
                  <textarea 
                    value={studentAnswer}
                    onChange={(e) => setStudentAnswer(e.target.value)}
                    placeholder="যেমন: 4a^2 + 12ab + 9b^2"
                    style={s.textarea}
                  />
                  <button 
                    disabled={checkLoading || !studentAnswer.trim()} 
                    onClick={checkAnswer} 
                    style={s.verifyBtn}
                  >
                    {checkLoading ? 'যাচাই করা হচ্ছে...' : 'উত্তর যাচাই করো'}
                  </button>

                  {checkResult && (
                    <div style={{ ...s.resultBox, borderColor: checkResult.is_correct ? '#10b981' : '#ef4444', backgroundColor: checkResult.is_correct ? '#ecfdf5' : '#fef2f2' }}>
                      <strong style={{ color: checkResult.is_correct ? '#047857' : '#b91c1c' }}>
                        {checkResult.is_correct ? '✅ উত্তর সঠিক হয়েছে!' : '❌ উত্তর সঠিক হয়নি'}
                      </strong>
                      <p style={s.resultFeedback}>{checkResult.feedback}</p>
                    </div>
                  )}
                </div>

                {/* Full Solution */}
                <div style={s.section}>
                  <button onClick={getFullSolution} style={s.solutionTriggerBtn} disabled={solutionLoading}>
                    {solutionLoading ? 'সমাধান লোড হচ্ছে...' : '👉 সম্পূর্ণ গাণিতিক সমাধান দেখুন'}
                  </button>
                  {solution && (
                    <div style={s.solutionBox}>
                      <h5 style={{ fontWeight: '700', marginBottom: '8px', color: '#0f172a' }}>ধাপ অনুযায়ী সমাধান:</h5>
                      <p style={s.solutionText}>{solution}</p>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div style={s.emptyWorkspace}>
                <p>বামে থেকে যেকোনো একটি অংক সিলেক্ট করে প্র্যাকটিস শুরু করো।</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  container: {
    fontFamily: "'Hind Siliguri', 'Outfit', sans-serif",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)",
    padding: "30px 10% 80px",
  },
  backLink: {
    display: "inline-block",
    textDecoration: "none",
    color: "#475569",
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
  difficultyRow: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "40px",
    flexWrap: "wrap",
  },
  diffBtn: {
    padding: "14px 28px",
    borderRadius: "12px",
    border: "none",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "16px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    transition: "transform 0.1s",
  },
  workspace: {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    gap: "30px",
    background: "white",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
  },
  sidebar: {
    borderRight: "1px solid #f1f5f9",
    paddingRight: "20px",
  },
  panelTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "16px",
    borderBottom: "2px solid #f1f5f9",
    paddingBottom: "8px",
  },
  exerciseList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxHeight: "60vh",
    overflowY: "auto",
  },
  exItem: {
    padding: "14px",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  exSnippet: {
    fontSize: "12px",
    color: "#64748b",
    margin: "4px 0 0",
  },
  mainBody: {
    minHeight: "50vh",
  },
  emptyWorkspace: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "#94a3b8",
    fontSize: "16px",
    textAlign: "center",
    padding: "60px 20px",
  },
  questionWorkspace: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },
  questionBox: {
    background: "linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)",
    padding: "24px",
    borderRadius: "16px",
    border: "1px solid #ccfbf1",
  },
  questionBadge: {
    background: "#0d9488",
    color: "white",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
    display: "inline-block",
    marginBottom: "12px",
  },
  questionText: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
    lineHeight: "1.6",
  },
  section: {
    borderBottom: "1px solid #f1f5f9",
    paddingBottom: "24px",
  },
  sectionTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#475569",
    marginBottom: "14px",
  },
  hintButtonGroup: {
    display: "flex",
    gap: "16px",
    marginBottom: "16px",
  },
  actionBtn: {
    color: "white",
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
  },
  hintsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  hintBubble: {
    background: "#f8fafc",
    padding: "14px 18px",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#334155",
    borderLeft: "4px solid #0d9488",
    lineHeight: "1.6",
  },
  textarea: {
    width: "100%",
    height: "90px",
    padding: "12px",
    borderRadius: "10px",
    border: "1.5px solid #cbd5e1",
    fontSize: "14px",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: "12px",
  },
  verifyBtn: {
    background: "linear-gradient(90deg, #14b8a6, #0ea5e9)",
    color: "white",
    padding: "12px 24px",
    border: "none",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "14px",
    boxShadow: "0 4px 12px rgba(14,184,166,0.2)",
  },
  resultBox: {
    marginTop: "16px",
    padding: "16px",
    borderRadius: "10px",
    borderWidth: "1px",
    borderStyle: "solid",
  },
  resultFeedback: {
    fontSize: "14px",
    color: "#334155",
    marginTop: "6px",
    margin: 0,
    lineHeight: "1.6",
  },
  solutionTriggerBtn: {
    background: "none",
    border: "none",
    color: "#2563eb",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    padding: 0,
    textDecoration: "underline",
  },
  solutionBox: {
    marginTop: "12px",
    background: "#f8fafc",
    padding: "18px",
    borderRadius: "12px",
    border: "1px dashed #cbd5e1",
  },
  solutionText: {
    fontSize: "14px",
    color: "#334155",
    lineHeight: "1.6",
    margin: 0,
    whiteSpace: "pre-line",
  },
  infoText: {
    color: "#64748b",
    fontSize: "14px",
  },
  errorText: {
    color: "#ef4444",
    fontSize: "14px",
  }
};

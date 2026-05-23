"use client";

import { useEffect, useMemo, useState } from "react";
import { math } from "../../../services/api";

const fallbackChapters = [
  { chapter_id: 3, chapter_number: "৩", chapter_name: "বীজগণিতীয় রাশি", total_exercise_count: 20, is_active: true },
  { chapter_id: 1, chapter_number: "১", chapter_name: "সেট ও ফাংশন", total_exercise_count: 18, is_active: false },
  { chapter_id: 2, chapter_number: "২", chapter_name: "বাস্তব সংখ্যা", total_exercise_count: 16, is_active: false },
  { chapter_id: 4, chapter_number: "৪", chapter_name: "সূচক ও লগারিদম", total_exercise_count: 18, is_active: false },
];

const fallbackMcqs = [
  {
    question: "x + y = 5 এবং x - y = 3 হলে, x² - y² এর মান কত?",
    options: ["৮", "১৫", "১৬", "২"],
    correct: "১৫",
    explanation: "x² - y² = (x+y)(x-y) = 5 × 3 = 15।",
  },
  {
    question: "a³ - b³ এর উৎপাদক কোনটি?",
    options: ["(a-b)(a²+ab+b²)", "(a+b)(a²-ab+b²)", "(a-b)(a²-ab+b²)", "(a+b)³"],
    correct: "(a-b)(a²+ab+b²)",
    explanation: "ঘন রাশির সূত্র: a³-b³ = (a-b)(a²+ab+b²)।",
  },
  {
    question: "(a+b)² এর বিস্তৃত রূপ কোনটি?",
    options: ["a²+b²", "a²+2ab+b²", "a²-2ab+b²", "2a+2b"],
    correct: "a²+2ab+b²",
    explanation: "দ্বিপদীর বর্গ সূত্র অনুযায়ী মাঝের পদ 2ab যোগ হবে।",
  },
];

const sections = [
  { id: "concepts", label: "কনসেপ্ট", marks: "Foundation" },
  { id: "formulas", label: "সূত্রাবলী", marks: "Quick use" },
  { id: "exercises", label: "অনুশীলনী প্রশ্ন", marks: "Practice" },
  { id: "srijonshil", label: "সৃজনশীল প্রশ্ন", marks: "৫০ মার্কস" },
  { id: "short", label: "সংক্ষিপ্ত প্রশ্ন", marks: "২০ মার্কস" },
  { id: "mcq", label: "MCQ প্র্যাক্টিস", marks: "৩০ মার্কস" },
];

const hintPhases = [
  "চিন্তার দিক",
  "ব্যবহার্য টুল",
  "প্রথম পদক্ষেপ",
  "প্রায় সম্পূর্ণ পথ",
  "সম্পূর্ণ সমাধান",
];

const getChapterKey = (chapterId) => `math-progress-${chapterId}`;

const normalizeList = (payload) => payload?.data || payload || [];

function readProgress(chapterId) {
  if (typeof window === "undefined") return { solved: 0, mcqCorrect: 0, mcqTotal: 0, points: 0, hints: 0 };
  const raw = localStorage.getItem(getChapterKey(chapterId));
  return raw ? JSON.parse(raw) : { solved: 0, mcqCorrect: 0, mcqTotal: 0, points: 0, hints: 0 };
}

function saveProgress(chapterId, next) {
  localStorage.setItem(getChapterKey(chapterId), JSON.stringify(next));
  const allPoints = Object.keys(localStorage)
    .filter((key) => key.startsWith("math-progress-"))
    .reduce((sum, key) => sum + (JSON.parse(localStorage.getItem(key) || "{}").points || 0), 100);
  localStorage.setItem("points", String(allPoints));
}

export default function MathWorkspace() {
  const [mode, setMode] = useState("tutor");
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [activeSection, setActiveSection] = useState("concepts");
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [toast, setToast] = useState("");

  const [concepts, setConcepts] = useState([]);
  const [formulas, setFormulas] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [srijonshil, setSrijonshil] = useState([]);
  const [progressMap, setProgressMap] = useState({});

  const [selectedExercise, setSelectedExercise] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState(null);
  const [hintPhase, setHintPhase] = useState(1);
  const [hintResult, setHintResult] = useState(null);

  const [mcqs, setMcqs] = useState([]);
  const [mcqIndex, setMcqIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [mcqSubmitted, setMcqSubmitted] = useState(false);

  const [solveQuestion, setSolveQuestion] = useState("");
  const [solveResult, setSolveResult] = useState(null);
  const [verifyQuestion, setVerifyQuestion] = useState("");
  const [verifyAnswer, setVerifyAnswer] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);
  const [jachaiBusy, setJachaiBusy] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await math.getChapters();
        const list = normalizeList(res);
        const usable = list.length ? list : fallbackChapters;
        setChapters(usable);
        setProgressMap(Object.fromEntries(usable.map((chapter) => [chapter.chapter_id, readProgress(chapter.chapter_id)])));
      } catch {
        setChapters(fallbackChapters);
        setProgressMap(Object.fromEntries(fallbackChapters.map((chapter) => [chapter.chapter_id, readProgress(chapter.chapter_id)])));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const selectedProgress = selectedChapter ? progressMap[selectedChapter.chapter_id] || readProgress(selectedChapter.chapter_id) : null;

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 3200);
  };

  const bumpProgress = (patch) => {
    if (!selectedChapter) return;
    const current = readProgress(selectedChapter.chapter_id);
    const next = { ...current, ...patch };
    saveProgress(selectedChapter.chapter_id, next);
    setProgressMap((prev) => ({ ...prev, [selectedChapter.chapter_id]: next }));
  };

  const handleSelectChapter = async (chapter) => {
    if (!chapter.is_active && chapter.chapter_id !== 3) {
      showToast("এই অধ্যায়ের backend data এখনো live নয়। Chapter ৩ এখন demo/live হিসেবে খোলা আছে।");
      return;
    }

    setSelectedChapter(chapter);
    setActiveSection("concepts");
    setContentLoading(true);
    setSelectedExercise(null);
    setCheckResult(null);
    setHintResult(null);
    setMcqs([]);

    try {
      const [conceptRes, formulaRes, exerciseRes, srijonRes] = await Promise.allSettled([
        math.getConcepts(chapter.chapter_id),
        math.getFormulas(chapter.chapter_id),
        math.getExercises(chapter.chapter_id),
        math.getSrijonshil(chapter.chapter_id),
      ]);
      setConcepts(conceptRes.status === "fulfilled" ? normalizeList(conceptRes.value) : []);
      setFormulas(formulaRes.status === "fulfilled" ? normalizeList(formulaRes.value) : []);
      setExercises(exerciseRes.status === "fulfilled" ? normalizeList(exerciseRes.value) : []);
      setSrijonshil(srijonRes.status === "fulfilled" ? normalizeList(srijonRes.value) : []);
    } finally {
      setContentLoading(false);
    }
  };

  const convertImage = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const [meta, base64] = reader.result.split(",");
        resolve({ base64, mime: meta.match(/data:(.*);base64/)?.[1] || file.type });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleExerciseCheck = async () => {
    if (!selectedExercise) return;
    setChecking(true);
    setCheckResult(null);
    try {
      let response;
      if (uploadedImage) {
        const converted = await convertImage(uploadedImage);
        response = await math.checkImageAnswer({
          exercise_id: selectedExercise.id || selectedExercise.exercise_id,
          image_base64: converted.base64,
          image_mime: converted.mime,
          chapter_id: selectedChapter.chapter_id,
        });
      } else {
        response = await math.checkTextAnswer({
          exercise_id: selectedExercise.id || selectedExercise.exercise_id,
          student_answer: studentAnswer,
          chapter_id: selectedChapter.chapter_id,
        });
      }
      const result = response.data || response;
      setCheckResult(result);
      const correct = Boolean(result.is_correct || result.correct);
      if (correct) {
        bumpProgress({ solved: Math.min((selectedProgress?.solved || 0) + 1, exercises.length || 20), points: (selectedProgress?.points || 0) + 10 });
      }
    } catch (err) {
      setCheckResult({ feedback: err.message || "যাচাই করা যায়নি। Backend/AI module চালু আছে কিনা দেখুন।" });
    } finally {
      setChecking(false);
    }
  };

  const handleHint = async () => {
    if (!selectedExercise) return;
    try {
      const response = await math.getHint({
        exercise_id: selectedExercise.id || selectedExercise.exercise_id,
        phase: hintPhase,
        chapter_id: selectedChapter.chapter_id,
      });
      setHintResult(response.data || response);
      bumpProgress({ hints: (selectedProgress?.hints || 0) + 1, points: Math.max(0, (selectedProgress?.points || 0) - 2) });
    } catch (err) {
      setHintResult({ hint: err.message || "Hint generate করা যায়নি।" });
    }
  };

  const generateMcqSet = async () => {
    if (!selectedChapter) return;
    setMcqSubmitted(false);
    setSelectedOption("");
    setMcqIndex(0);
    try {
      const response = await math.generateMCQ({ chapter_id: selectedChapter.chapter_id, count: 20, previously_generated: [] });
      const data = response.data || response;
      const generated = Array.isArray(data.mcqs)
        ? data.mcqs.map((item) => {
            const entries = item.options ? Object.values(item.options).filter(Boolean) : item.options || [];
            const correct = item.options?.[item.correct] || item.correct_answer || item.correct || entries[0];
            return { question: item.question, options: entries, correct, explanation: item.explanation };
          })
        : [];
      setMcqs(generated.length ? generated : fallbackMcqs);
    } catch {
      setMcqs(fallbackMcqs);
      showToast("AI MCQ generate করা যায়নি, fallback practice set দেখানো হচ্ছে।");
    }
  };

  const submitMcq = () => {
    const current = mcqs[mcqIndex];
    if (!current || !selectedOption) return;
    setMcqSubmitted(true);
    const correct = selectedOption === current.correct;
    bumpProgress({
      mcqTotal: (selectedProgress?.mcqTotal || 0) + 1,
      mcqCorrect: (selectedProgress?.mcqCorrect || 0) + (correct ? 1 : 0),
      points: Math.max(0, (selectedProgress?.points || 0) + (correct ? 1 : -1)),
    });
  };

  const handleJachaiSolve = async () => {
    if (!solveQuestion.trim()) return;
    setJachaiBusy(true);
    setSolveResult(null);
    try {
      const response = await math.jachaiSolve({ question: solveQuestion, chapter_id: selectedChapter?.chapter_id || 3 });
      setSolveResult(response.data || response);
    } catch (err) {
      setSolveResult({ solution: err.message || "Solution আনা যায়নি।" });
    } finally {
      setJachaiBusy(false);
    }
  };

  const handleJachaiCheck = async () => {
    if (!verifyQuestion.trim() || !verifyAnswer.trim()) return;
    setJachaiBusy(true);
    setVerifyResult(null);
    try {
      const response = await math.jachaiCheck({ question: verifyQuestion, student_solution: verifyAnswer, chapter_id: selectedChapter?.chapter_id || 3 });
      setVerifyResult(response.data || response);
    } catch (err) {
      setVerifyResult({ feedback: err.message || "Answer check করা যায়নি।" });
    } finally {
      setJachaiBusy(false);
    }
  };

  const handleJachaiImage = async (file) => {
    if (!file) return;
    setJachaiBusy(true);
    try {
      const converted = await convertImage(file);
      const response = await math.jachaiImage({ image_base64: converted.base64, image_mime: converted.mime });
      const result = response.data || response;
      setSolveQuestion(result.detected_question || result.extracted_question || "");
      setSolveResult(result);
    } catch (err) {
      setSolveResult({ solution: err.message || "Image process করা যায়নি।" });
    } finally {
      setJachaiBusy(false);
    }
  };

  const chapterRows = useMemo(
    () =>
      chapters.map((chapter) => {
        const progress = progressMap[chapter.chapter_id] || { solved: 0, mcqCorrect: 0, mcqTotal: 0, points: 0 };
        const accuracy = progress.mcqTotal ? Math.round((progress.mcqCorrect / progress.mcqTotal) * 100) : 0;
        return { chapter, progress, accuracy };
      }),
    [chapters, progressMap]
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      {toast && <div className="fixed right-4 top-20 z-50 rounded-lg bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-lg">{toast}</div>}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-emerald-700">গণিত বই</p>
              <h1 className="mt-1 text-3xl font-black text-slate-950">Tutor, Jachai এবং Progress</h1>
              <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
                Current backend routes অনুযায়ী chapter, concept, formula, exercise, srijonshil, MCQ generate, hint এবং answer check live করা হয়েছে।
              </p>
            </div>
            <div className="grid grid-cols-3 rounded-lg border border-slate-200 bg-slate-50 p-1">
              {[
                ["tutor", "টিউটর"],
                ["jachai", "যাচাই"],
                ["progress", "অগ্রগতি"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setMode(id)}
                  className={`rounded-md px-5 py-2 text-sm font-black transition ${mode === id ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[360px_1fr] lg:px-8">
        <aside className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-black">Chapter list</h2>
            <p className="mt-1 text-xs font-semibold text-slate-500">প্রতিটি chapter পাশে activity-log based progress দেখাবে।</p>
            <div className="mt-4 space-y-3">
              {loading ? (
                <p className="text-sm font-semibold text-slate-500">লোড হচ্ছে...</p>
              ) : (
                chapterRows.map(({ chapter, progress, accuracy }) => (
                  <button
                    key={chapter.chapter_id}
                    onClick={() => handleSelectChapter(chapter)}
                    className={`w-full rounded-lg border p-4 text-left transition hover:border-emerald-300 ${
                      selectedChapter?.chapter_id === chapter.chapter_id ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-slate-950">
                          অধ্যায় {chapter.chapter_number || chapter.chapter_id}: {chapter.chapter_name}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-500">
                          📊 অনুশীলনী {progress.solved || 0}/{chapter.total_exercise_count || 20}
                        </p>
                      </div>
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-black text-slate-600">{chapter.is_active || chapter.chapter_id === 3 ? "Open" : "Soon"}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] font-black">
                      <span className="rounded-md bg-amber-50 px-2 py-2 text-amber-700">⚡ {accuracy}%</span>
                      <span className="rounded-md bg-emerald-50 px-2 py-2 text-emerald-700">✅ {progress.solved || 0}</span>
                      <span className="rounded-md bg-sky-50 px-2 py-2 text-sky-700">⭐ {progress.points || 0}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="font-black">মানবন্টন</h3>
            <div className="mt-3 space-y-2 text-sm font-semibold text-slate-600">
              <p className="flex justify-between rounded-md bg-slate-50 px-3 py-2"><span>সৃজনশীল</span><b>৫০</b></p>
              <p className="flex justify-between rounded-md bg-slate-50 px-3 py-2"><span>সংক্ষিপ্ত</span><b>২০</b></p>
              <p className="flex justify-between rounded-md bg-slate-50 px-3 py-2"><span>বহুনির্বাচনী</span><b>৩০</b></p>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          {mode === "progress" && <ProgressPanel rows={chapterRows} />}
          {mode === "jachai" && (
            <JachaiPanel
              busy={jachaiBusy}
              solveQuestion={solveQuestion}
              setSolveQuestion={setSolveQuestion}
              solveResult={solveResult}
              handleSolve={handleJachaiSolve}
              verifyQuestion={verifyQuestion}
              setVerifyQuestion={setVerifyQuestion}
              verifyAnswer={verifyAnswer}
              setVerifyAnswer={setVerifyAnswer}
              verifyResult={verifyResult}
              handleCheck={handleJachaiCheck}
              handleImage={handleJachaiImage}
            />
          )}
          {mode === "tutor" && !selectedChapter && <EmptyTutor />}
          {mode === "tutor" && selectedChapter && (
            <div className="space-y-5">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-emerald-700">টিউটর highlighted</p>
                    <h2 className="mt-1 text-2xl font-black">{selectedChapter.chapter_name}</h2>
                    <p className="mt-2 text-sm font-semibold text-slate-500">NCTB board-book first flow: concepts, formulas, exercise, creative, short and MCQ.</p>
                  </div>
                  {selectedProgress && (
                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-black">
                      <span className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700">Solved {selectedProgress.solved}</span>
                      <span className="rounded-lg bg-amber-50 px-3 py-2 text-amber-700">Hints {selectedProgress.hints}</span>
                      <span className="rounded-lg bg-sky-50 px-3 py-2 text-sky-700">Points {selectedProgress.points}</span>
                    </div>
                  )}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-3">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`rounded-lg border px-4 py-4 text-left transition ${
                        activeSection === section.id ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <span className="block text-sm font-black text-slate-950">{section.label}</span>
                      <span className="text-xs font-semibold text-slate-500">{section.marks}</span>
                    </button>
                  ))}
                </div>
              </div>

              {contentLoading ? <Panel title="লোড হচ্ছে">Content আনছি...</Panel> : null}
              {!contentLoading && activeSection === "concepts" && <ConceptsPanel concepts={concepts} />}
              {!contentLoading && activeSection === "formulas" && <FormulasPanel formulas={formulas} />}
              {!contentLoading && activeSection === "exercises" && (
                <ExercisesPanel
                  exercises={exercises}
                  selectedExercise={selectedExercise}
                  setSelectedExercise={setSelectedExercise}
                  studentAnswer={studentAnswer}
                  setStudentAnswer={setStudentAnswer}
                  setUploadedImage={setUploadedImage}
                  checking={checking}
                  checkResult={checkResult}
                  handleCheck={handleExerciseCheck}
                  hintPhase={hintPhase}
                  setHintPhase={setHintPhase}
                  hintResult={hintResult}
                  handleHint={handleHint}
                />
              )}
              {!contentLoading && activeSection === "srijonshil" && <SrijonshilPanel items={srijonshil} />}
              {!contentLoading && activeSection === "short" && <ShortPanel />}
              {!contentLoading && activeSection === "mcq" && (
                <McqPanel
                  mcqs={mcqs}
                  generate={generateMcqSet}
                  index={mcqIndex}
                  setIndex={setMcqIndex}
                  selected={selectedOption}
                  setSelected={setSelectedOption}
                  submitted={mcqSubmitted}
                  setSubmitted={setMcqSubmitted}
                  submit={submitMcq}
                />
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Panel({ title, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-black">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function EmptyTutor() {
  return (
    <Panel title="একটি chapter select করো">
      <p className="text-sm font-semibold leading-6 text-slate-600">
        বাম পাশের chapter list থেকে open chapter select করলে Tutor section-এ কনসেপ্ট, সূত্র, অনুশীলনী, সৃজনশীল ও MCQ প্র্যাক্টিস খুলবে।
      </p>
    </Panel>
  );
}

function ConceptsPanel({ concepts }) {
  return (
    <Panel title="কনসেপ্ট মডিউল">
      <div className="grid gap-3">
        {(concepts.length ? concepts : [{ module_title: "NCTB concept module", concept_text: "এই chapter এর concept backend থেকে এলে এখানে module আকারে দেখাবে।" }]).map((item, idx) => (
          <details key={item.concept_id || idx} className="rounded-lg border border-slate-200 bg-slate-50 p-4" open={idx === 0}>
            <summary className="cursor-pointer text-sm font-black text-slate-950">Module {idx + 1}: {item.module_title || item.title || "গুরুত্বপূর্ণ ধারণা"}</summary>
            <p className="mt-3 whitespace-pre-line text-sm font-semibold leading-7 text-slate-600">{item.concept_text || item.explanation || item.description || "ব্যাখ্যা পাওয়া যায়নি।"}</p>
            {item.examples && <p className="mt-3 rounded-lg bg-white p-3 text-sm font-semibold text-slate-600">{item.examples}</p>}
          </details>
        ))}
      </div>
    </Panel>
  );
}

function FormulasPanel({ formulas }) {
  return (
    <Panel title="সূত্রাবলী">
      <div className="grid gap-3 md:grid-cols-2">
        {(formulas.length ? formulas : [{ formula_text: "(a+b)² = a² + 2ab + b²", when_to_use: "দ্বিপদী রাশির বর্গ বের করতে।", variables_explanation: "a এবং b যেকোনো রাশি।" }]).map((item, idx) => (
          <div key={item.formula_id || idx} className="rounded-lg border border-slate-200 p-4">
            <p className="rounded-md bg-slate-950 px-3 py-3 text-center font-mono text-sm font-black text-white">{item.formula_text}</p>
            <p className="mt-3 text-sm font-semibold text-slate-600"><b>কখন ব্যবহার:</b> {item.when_to_use || "প্রাসঙ্গিক problem pattern এ।"}</p>
            <p className="mt-2 text-sm font-semibold text-slate-600"><b>Variable:</b> {item.variables_explanation || "রাশি/সংখ্যার মান অনুযায়ী বসবে।"}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ExercisesPanel(props) {
  const list = props.exercises.length ? props.exercises : [{ id: 1, title: "অনুশীলনী demo", question: "x + y = 5, x - y = 3 হলে x²-y² নির্ণয় কর।" }];
  const selected = props.selectedExercise;
  return (
    <Panel title="অনুশীলনী প্রশ্ন">
      <div className="mb-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
          <p className="font-black text-rose-700">🔴 বহুল জিজ্ঞাসিত</p>
          <p className="mt-1 text-xs font-semibold text-rose-700/80">৩+ বার Board এ এসেছে এমন প্রশ্ন এখানে group হবে।</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="font-black text-amber-700">🟡 কম জিজ্ঞাসিত</p>
          <p className="mt-1 text-xs font-semibold text-amber-700/80">১-২ বার Board এ এসেছে এমন প্রশ্ন এখানে group হবে।</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
        <div className="space-y-2">
          {list.map((item, idx) => (
            <button
              key={item.id || item.exercise_id || idx}
              onClick={() => {
                props.setSelectedExercise(item);
                props.setStudentAnswer("");
              }}
              className={`w-full rounded-lg border p-4 text-left text-sm font-bold transition ${
                selected === item ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              {item.title || `প্রশ্ন ${idx + 1}`}
              <span className="mt-1 block text-xs font-semibold text-slate-500">{item.question || item.question_text}</span>
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-slate-200 p-4">
          {selected ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-black text-slate-500">প্রশ্ন</p>
                <p className="mt-1 text-sm font-bold leading-7 text-slate-900">{selected.question || selected.question_text}</p>
              </div>
              <textarea
                value={props.studentAnswer}
                onChange={(event) => props.setStudentAnswer(event.target.value)}
                className="min-h-28 w-full rounded-lg border border-slate-200 p-3 text-sm font-semibold outline-none focus:border-emerald-300"
                placeholder="খাতায় না লিখে চাইলে এখানে solution লিখে submit করো..."
              />
              <label className="block rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-bold text-slate-600">
                📷 খাতার ছবি upload করো
                <input type="file" accept="image/*" onChange={(event) => props.setUploadedImage(event.target.files?.[0] || null)} className="mt-2 block text-xs" />
              </label>
              <button onClick={props.handleCheck} disabled={props.checking} className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-black text-white disabled:opacity-50">
                {props.checking ? "যাচাই হচ্ছে..." : "Submit"}
              </button>
              {props.checkResult && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-7 text-slate-700">
                  {props.checkResult.feedback || props.checkResult.result || props.checkResult.message || JSON.stringify(props.checkResult)}
                </div>
              )}
              <div className="border-t border-slate-200 pt-4">
                <p className="font-black">💡 Adaptive Hint System</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {hintPhases.map((phase, idx) => (
                    <button
                      key={phase}
                      onClick={() => props.setHintPhase(idx + 1)}
                      className={`rounded-md border px-3 py-2 text-xs font-black ${props.hintPhase === idx + 1 ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-slate-200"}`}
                    >
                      Phase {idx + 1}: {phase}
                    </button>
                  ))}
                </div>
                <button onClick={props.handleHint} className="mt-3 rounded-lg border border-slate-200 px-4 py-2 text-sm font-black text-slate-700">
                  Hint দেখাও
                </button>
                {props.hintResult && (
                  <p className="mt-3 rounded-lg bg-amber-50 p-4 text-sm font-semibold leading-7 text-amber-800">
                    {props.hintResult.hint || props.hintResult.message || JSON.stringify(props.hintResult)}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm font-semibold text-slate-500">একটি প্রশ্ন select করলে upload, hint এবং check panel খুলবে।</p>
          )}
        </div>
      </div>
    </Panel>
  );
}

function SrijonshilPanel({ items }) {
  return (
    <Panel title="সৃজনশীল প্রশ্ন">
      <div className="mb-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 font-black text-rose-700">🔴 Board Questions (Last 5 years)</div>
        <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 font-black text-sky-700">📘 Guide + Model Test Questions</div>
      </div>
      <div className="space-y-3">
        {(items.length ? items : [{ question_text: "Backend data এলে উদ্দীপক + ক/খ/গ প্রশ্ন ও solution এখানে দেখাবে।", solution: "Reference material হিসেবে solution shown." }]).map((item, idx) => (
          <details key={item.srijonshil_id || idx} className="rounded-lg border border-slate-200 p-4">
            <summary className="cursor-pointer font-black">সৃজনশীল {idx + 1} {item.board_name ? `- ${item.board_name}` : ""}</summary>
            <p className="mt-3 whitespace-pre-line text-sm font-semibold leading-7 text-slate-700">{item.uddipok || item.question_text}</p>
            <p className="mt-3 rounded-lg bg-slate-50 p-4 text-sm font-semibold leading-7 text-slate-700">{item.solution || "Solution backend থেকে এলে এখানে দেখাবে।"}</p>
          </details>
        ))}
      </div>
    </Panel>
  );
}

function ShortPanel() {
  return (
    <Panel title="সংক্ষিপ্ত প্রশ্ন">
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5">
        <p className="font-black text-slate-900">Frontend flow ready</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
          Current backend-e আলাদা short-question generate/check route নেই। Route add হলে এখানে pre-loaded questions, generate button, answer upload/check same pattern-e connect করা যাবে।
        </p>
      </div>
    </Panel>
  );
}

function McqPanel({ mcqs, generate, index, setIndex, selected, setSelected, submitted, setSubmitted, submit }) {
  const current = mcqs[index];
  return (
    <Panel title="MCQ প্র্যাক্টিস">
      <div className="mb-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
          <p className="font-black text-rose-700">🔴 Board MCQ</p>
          <p className="text-xs font-semibold text-rose-700/80">Reference MCQ backend data এলে এখানে answer সহ দেখাবে।</p>
        </div>
        <button onClick={generate} className="rounded-lg bg-slate-950 p-4 text-left font-black text-white">
          🎯 ২০টা MCQ set generate করো
        </button>
      </div>
      {!current ? (
        <p className="text-sm font-semibold text-slate-500">Generate করলে practice শুরু হবে।</p>
      ) : (
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-xs font-black text-slate-500">Question {index + 1}/{mcqs.length}</p>
          <h4 className="mt-2 text-lg font-black">{current.question}</h4>
          <div className="mt-4 grid gap-2">
            {current.options.map((option) => (
              <button
                key={option}
                onClick={() => !submitted && setSelected(option)}
                className={`rounded-lg border px-4 py-3 text-left text-sm font-bold ${
                  selected === option ? "border-emerald-300 bg-emerald-50" : "border-slate-200"
                } ${submitted && option === current.correct ? "border-emerald-400 bg-emerald-100" : ""}`}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={submit} disabled={!selected || submitted} className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-black text-white disabled:opacity-50">
              Answer submit
            </button>
            <button
              onClick={() => {
                setIndex(Math.min(index + 1, mcqs.length - 1));
                setSelected("");
                setSubmitted(false);
              }}
              className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-black"
            >
              Next
            </button>
          </div>
          {submitted && (
            <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm font-semibold leading-7">
              <p className={selected === current.correct ? "font-black text-emerald-700" : "font-black text-rose-700"}>
                {selected === current.correct ? "সঠিক উত্তর!" : `ভুল। সঠিক উত্তর: ${current.correct}`}
              </p>
              <p className="mt-1 text-slate-600">{current.explanation}</p>
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}

function JachaiPanel(props) {
  return (
    <div className="space-y-5">
      <Panel title="যাচাই: Question দিয়ে Answer চাওয়া">
        <label className="block rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-bold text-slate-600">
          Image/PDF থেকে math extract করার জন্য ছবি upload করো
          <input type="file" accept="image/*,.pdf" onChange={(event) => props.handleImage(event.target.files?.[0])} className="mt-2 block text-xs" />
        </label>
        <textarea value={props.solveQuestion} onChange={(event) => props.setSolveQuestion(event.target.value)} className="mt-4 min-h-28 w-full rounded-lg border border-slate-200 p-3 text-sm font-semibold" placeholder="অথবা প্রশ্ন লিখে দাও..." />
        <button onClick={props.handleSolve} disabled={props.busy} className="mt-3 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-black text-white disabled:opacity-50">
          Step-by-step solve
        </button>
        {props.solveResult && <ResultBox data={props.solveResult} />}
      </Panel>

      <Panel title="যাচাই: নিজের Answer Check">
        <textarea value={props.verifyQuestion} onChange={(event) => props.setVerifyQuestion(event.target.value)} className="min-h-20 w-full rounded-lg border border-slate-200 p-3 text-sm font-semibold" placeholder="Question লিখো..." />
        <textarea value={props.verifyAnswer} onChange={(event) => props.setVerifyAnswer(event.target.value)} className="mt-3 min-h-28 w-full rounded-lg border border-slate-200 p-3 text-sm font-semibold" placeholder="নিজের solution লিখো..." />
        <button onClick={props.handleCheck} disabled={props.busy} className="mt-3 rounded-lg bg-slate-950 px-5 py-3 text-sm font-black text-white disabled:opacity-50">
          Answer check
        </button>
        {props.verifyResult && <ResultBox data={props.verifyResult} />}
      </Panel>
    </div>
  );
}

function ResultBox({ data }) {
  return (
    <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-7 text-slate-700">
      {typeof data === "string" ? data : data.solution || data.feedback || data.message || JSON.stringify(data, null, 2)}
    </pre>
  );
}

function ProgressPanel({ rows }) {
  return (
    <Panel title="গণিত অগ্রগতি">
      <div className="space-y-3">
        {rows.map(({ chapter, progress, accuracy }) => (
          <div key={chapter.chapter_id} className="rounded-lg border border-slate-200 p-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="font-black">{chapter.chapter_name}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">Activity log local/session storage থেকে frontend-side representation.</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-black">
                <span className="rounded-md bg-emerald-50 px-3 py-2 text-emerald-700">Solved {progress.solved || 0}</span>
                <span className="rounded-md bg-amber-50 px-3 py-2 text-amber-700">Accuracy {accuracy}%</span>
                <span className="rounded-md bg-sky-50 px-3 py-2 text-sky-700">Points {progress.points || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

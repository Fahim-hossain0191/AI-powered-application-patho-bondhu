"use client";

import { useState } from "react";

const papers = {
  first: {
    title: "English 1st Paper",
    subtitle: "Part-A Reading 70 marks + Part-B Writing 30 marks",
    groups: [
      ["Seen Passage Practice", "MCQ, Answering Questions, Gap Filling based on EFT board book passages."],
      ["Unseen Passage Practice", "Information Transfer, Summary, Matching, Re-arranging Sentences."],
      ["Poems from EFT", "Line-by-line explanation, theme, vocabulary and question practice."],
      ["Stories from EFT", "Summary, characters, plot points, moral/theme and question practice."],
      ["Completing Stories", "Format rules, sample completed story, student answer checking."],
      ["Writing Dialogues", "Situation-wise dialogues with natural exchange and format feedback."],
      ["Model Test & Board Questions", "Full paper practice with timer-ready frontend layout."],
    ],
  },
  second: {
    title: "English 2nd Paper",
    subtitle: "Part-A Grammar 60 marks + Part-B Writing 40 marks",
    groups: [
      ["Gap Filling with Clues", "Learn by doing: clue থেকে parts of speech বুঝে answer."],
      ["Substitution Table", "Meaningful sentence construction and subject-verb agreement feedback."],
      ["Right Form of Verbs", "Tense marker, context and exception based smart practice."],
      ["Changing Sentences", "Affirmative/negative, assertive/interrogative/exclamatory, simple/complex/compound."],
      ["Tag Questions", "Positive/negative logic and special-case practice."],
      ["Suffixes & Prefixes", "Word formation with explanation."],
      ["Preposition", "Fixed preposition and common error focused practice."],
      ["Connector/Linking Words", "Addition, contrast, cause/effect, time connector practice."],
      ["Punctuation & Capitalization", "Passage correction with line-level feedback."],
      ["Paragraph / Email / Letter / Application / Composition", "Writing format, grammar, relevance and word limit feedback."],
    ],
  },
};

export default function EnglishPage() {
  const [mode, setMode] = useState("tutor");
  const [paper, setPaper] = useState("first");
  const active = papers[paper];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-end lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-sky-700">Pathobondhu subject workspace</p>
            <h1 className="text-3xl font-black">English Book</h1>
          </div>
          <div className="grid grid-cols-3 rounded-lg border border-slate-200 bg-slate-50 p-1">
            {[
              ["tutor", "টিউটর"],
              ["jachai", "যাচাই"],
              ["progress", "অগ্রগতি"],
            ].map(([id, label]) => (
              <button key={id} onClick={() => setMode(id)} className={`rounded-md px-5 py-2 text-sm font-black ${mode === id ? "bg-white text-sky-700 shadow-sm" : "text-slate-500"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          {Object.entries(papers).map(([id, item]) => (
            <button key={id} onClick={() => setPaper(id)} className={`rounded-xl border p-5 text-left ${paper === id ? "border-sky-300 bg-sky-50" : "border-slate-200 bg-white"}`}>
              <p className="text-xl font-black">{item.title}</p>
              <p className="mt-2 text-sm font-semibold text-slate-500">{item.subtitle}</p>
            </button>
          ))}
        </div>

        {mode === "tutor" && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wide text-sky-700">Tutor highlighted</p>
            <h2 className="mt-1 text-3xl font-black">{active.title}</h2>
            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">{active.subtitle}. Backend route pending, frontend structure is ready for EFT/Grammar-board-book data.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {active.groups.map(([title, body], idx) => (
                <details key={title} open={idx === 0} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <summary className="cursor-pointer text-lg font-black">{title}</summary>
                  <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{body}</p>
                  <div className="mt-4 grid gap-2">
                    <button className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm font-black">📖 Learn by Doing</button>
                    <button className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm font-black">🎯 Practice</button>
                    <button className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm font-black">📊 My Score</button>
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {mode === "jachai" && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-black">English যাচাই</h2>
            <p className="mt-2 text-sm font-semibold text-slate-600">Grammar exercise, writing, passage answer, composition সবকিছু image/PDF বা text দিয়ে check করার layout.</p>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <textarea className="min-h-44 rounded-lg border border-slate-200 p-4 text-sm font-semibold" placeholder="English question / answer..." />
              <label className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-sm font-black text-slate-600">
                Image/PDF upload
                <input type="file" accept="image/*,.pdf" className="mt-3 block text-xs" />
              </label>
            </div>
            <button className="mt-4 rounded-lg bg-slate-950 px-5 py-3 text-sm font-black text-white opacity-60">Backend route pending</button>
          </div>
        )}

        {mode === "progress" && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-black">English Progress</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {["Reading", "Grammar", "Writing"].map((item) => (
                <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="font-black">{item}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-500">0 complete • backend log pending</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

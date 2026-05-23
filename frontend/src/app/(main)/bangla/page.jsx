"use client";

import { useState } from "react";

const papers = {
  first: {
    title: "বাংলা ১ম পত্র",
    marks: ["সৃজনশীল ৫০", "বর্ণনামূলক ২০", "MCQ ৩০"],
    cards: [
      ["গুরুত্বপূর্ণ অংশ", "গদ্য summary, character highlight, কবিতার line-by-line ব্যাখ্যা।"],
      ["সৃজনশীল প্রশ্ন", "Board Questions + Guide/Model Test, ক/খ/গ/ঘ answer checking flow।"],
      ["বহুনির্বাচনী প্র্যাক্টিস", "Board MCQ + Guide/Model MCQ, answer দিলে correct answer দেখাবে।"],
    ],
  },
  second: {
    title: "বাংলা ২য় পত্র",
    marks: ["নির্মিত অংশ", "ব্যাকরণ MCQ", "Smart Practice Priority"],
    cards: [
      ["অনুচ্ছেদ রচনা", "Important topic list, sample answer, লিখে বা ছবি upload করে check।"],
      ["চিঠিপত্র/দরখাস্ত", "ব্যক্তিগত, দাপ্তরিক, দরখাস্ত format সহ practice।"],
      ["সারাংশ/সারমর্ম", "গদ্যাংশ/পদ্যাংশ আলাদা, নমুনা answer ও check flow।"],
      ["ভাবসম্প্রসারণ", "গুরুত্বপূর্ণ ভাব, sample answer, student answer feedback।"],
      ["প্রতিবেদন", "সংবাদপত্র ও প্রাতিষ্ঠানিক প্রতিবেদন format সহ।"],
      ["প্রবন্ধ/রচনা", "২০ মার্কস priority section, structure + word limit feedback।"],
      ["বহুনির্বাচনী প্র্যাক্টিস", "বাংলা ২য় পত্র board বই primary source হিসেবে grammar MCQ।"],
      ["গুরুত্ব অনুযায়ী অনুশীলন", "Prediction না বলে data-driven priority tier + disclaimer।"],
    ],
  },
};

export default function BanglaPage() {
  const [mode, setMode] = useState("tutor");
  const [paper, setPaper] = useState("first");
  const active = papers[paper];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <TopBar title="বাংলা বই" mode={mode} setMode={setMode} />
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          {Object.entries(papers).map(([id, item]) => (
            <button
              key={id}
              onClick={() => setPaper(id)}
              className={`rounded-xl border p-5 text-left transition ${paper === id ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}
            >
              <p className="text-xl font-black">{item.title}</p>
              <p className="mt-2 text-sm font-semibold text-slate-500">{item.marks.join(" • ")}</p>
            </button>
          ))}
        </div>

        {mode === "tutor" && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-rose-700">Tutor highlighted</p>
                <h1 className="mt-1 text-3xl font-black">{active.title}</h1>
                <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
                  Bangla backend route এখনো নেই, তাই এখানে তোমার described flow অনুযায়ী frontend structure interactive করা হয়েছে। Backend add হলে এই cards API data দিয়ে fill হবে।
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {active.marks.map((mark) => (
                  <span key={mark} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-black text-slate-700">{mark}</span>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {active.cards.map(([title, body]) => (
                <details key={title} className="rounded-xl border border-slate-200 bg-slate-50 p-5" open={title === active.cards[0][0]}>
                  <summary className="cursor-pointer text-lg font-black">{title}</summary>
                  <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{body}</p>
                  <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm font-bold text-slate-500">
                    Answer box, image/PDF upload, generate/check buttons backend route add হলে active হবে।
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {mode === "jachai" && <JachaiPlaceholder subject="বাংলা" />}
        {mode === "progress" && <ProgressPlaceholder subject="বাংলা" />}
      </section>
    </main>
  );
}

function TopBar({ title, mode, setMode }) {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-end lg:px-8">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-rose-700">Pathobondhu subject workspace</p>
          <h1 className="text-3xl font-black">{title}</h1>
        </div>
        <div className="grid grid-cols-3 rounded-lg border border-slate-200 bg-slate-50 p-1">
          {[
            ["tutor", "টিউটর"],
            ["jachai", "যাচাই"],
            ["progress", "অগ্রগতি"],
          ].map(([id, label]) => (
            <button key={id} onClick={() => setMode(id)} className={`rounded-md px-5 py-2 text-sm font-black ${mode === id ? "bg-white text-rose-700 shadow-sm" : "text-slate-500"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function JachaiPlaceholder({ subject }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-black">{subject} যাচাই</h2>
      <p className="mt-2 text-sm font-semibold text-slate-600">Image/PDF upload করে question solve বা নিজের answer check করার UI ready আছে; backend route add হলে active হবে।</p>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <textarea className="min-h-44 rounded-lg border border-slate-200 p-4 text-sm font-semibold" placeholder={`${subject} question বা answer লিখুন...`} />
        <label className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-sm font-black text-slate-600">
          Image/PDF upload
          <input type="file" accept="image/*,.pdf" className="mt-3 block text-xs" />
        </label>
      </div>
      <button className="mt-4 rounded-lg bg-slate-950 px-5 py-3 text-sm font-black text-white opacity-60">Backend route pending</button>
    </div>
  );
}

function ProgressPlaceholder({ subject }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-black">{subject} অগ্রগতি</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {["সৃজনশীল", "বর্ণনামূলক", "MCQ"].map((item) => (
          <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="font-black">{item}</p>
            <p className="mt-2 text-sm font-semibold text-slate-500">0 complete • backend log pending</p>
          </div>
        ))}
      </div>
    </div>
  );
}

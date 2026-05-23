"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";

export default function ProgressPage() {
  const [rows, setRows] = useState([]);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const mathRows = Object.keys(localStorage)
      .filter((key) => key.startsWith("math-progress-"))
      .map((key) => {
        const data = JSON.parse(localStorage.getItem(key) || "{}");
        const chapterId = key.replace("math-progress-", "");
        const accuracy = data.mcqTotal ? Math.round((data.mcqCorrect / data.mcqTotal) * 100) : 0;
        return { chapterId, ...data, accuracy };
      });
    setRows(mathRows);
    setPoints(Number(localStorage.getItem("points") || 0));
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-wide text-amber-700">Progress</p>
          <h1 className="mt-1 text-3xl font-black">অগ্রগতি ও Activity Snapshot</h1>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
            Current frontend local activity log থেকে গণিত progress দেখানো হচ্ছে। Backend activity log API add হলে এই page server-side data দেখাবে।
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 grid gap-4 md:grid-cols-4">
          <Metric label="Total Points" value={points} />
          <Metric label="Solved Exercises" value={rows.reduce((sum, row) => sum + (row.solved || 0), 0)} />
          <Metric label="MCQ Attempts" value={rows.reduce((sum, row) => sum + (row.mcqTotal || 0), 0)} />
          <Metric label="Hints Used" value={rows.reduce((sum, row) => sum + (row.hints || 0), 0)} />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">Chapter-wise Math Progress</h2>
          <div className="mt-4 space-y-3">
            {rows.length ? (
              rows.map((row) => (
                <div key={row.chapterId} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="font-black">অধ্যায় {row.chapterId}</p>
                  <div className="mt-3 grid gap-2 text-sm font-bold md:grid-cols-4">
                    <span>📊 অনুশীলনী: {row.solved || 0}</span>
                    <span>🎯 MCQ Accuracy: {row.accuracy}%</span>
                    <span>⭐ Points: {row.points || 0}</span>
                    <span>💡 Hints: {row.hints || 0}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm font-semibold text-slate-500">এখনো activity নেই। Math workspace থেকে practice শুরু করো।</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
    </div>
  );
}

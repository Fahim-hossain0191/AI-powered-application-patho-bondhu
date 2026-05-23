"use client";

import Link from "next/link";

const items = [
  ["গণিত Tutor Practice", "Live backend connected", "/math"],
  ["বাংলা Smart Practice", "Frontend flow ready", "/bangla"],
  ["English Smart Practice", "Frontend flow ready", "/english"],
  ["Priority Based Practice", "Question frequency tier system", "/bangla"],
];

export default function PracticePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Practice</p>
          <h1 className="mt-1 text-3xl font-black">Smart Practice Desk</h1>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
            Navbar-er Practice option subject-wise drills aggregate korbe. Current live practice engine গণিত backend routes ব্যবহার করছে।
          </p>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:px-6 md:grid-cols-2 lg:px-8">
        {items.map(([title, body, href]) => (
          <Link key={title} href={href} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <p className="text-xl font-black">{title}</p>
            <p className="mt-2 text-sm font-semibold text-slate-500">{body}</p>
            <span className="mt-5 inline-block rounded-lg bg-slate-950 px-4 py-2 text-sm font-black text-white">Open</span>
          </Link>
        ))}
      </section>
    </main>
  );
}

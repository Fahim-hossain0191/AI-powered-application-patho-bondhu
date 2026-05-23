"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import BanglaCover from "../../../../public/Container_31.png";
import MathCover from "../../../../public/Container_30.png";
import EnglishCover from "../../../../public/Container_42.png";

const books = [
  {
    title: "গণিত",
    subtitle: "Tutor, Jachai, chapter-wise progress",
    href: "/math",
    cover: MathCover,
    status: "লাইভ",
    accent: "emerald",
    points: ["কনসেপ্ট", "সূত্রাবলী", "অনুশীলনী", "সৃজনশীল", "MCQ প্র্যাক্টিস", "যাচাই"],
  },
  {
    title: "বাংলা",
    subtitle: "১ম পত্র, ২য় পত্র, সৃজনশীল ও রচনা",
    href: "/bangla",
    cover: BanglaCover,
    status: "ফ্রন্টএন্ড রেডি",
    accent: "rose",
    points: ["গুরুত্বপূর্ণ অংশ", "সৃজনশীল", "বর্ণনামূলক", "ব্যাকরণ", "MCQ", "অগ্রগতি"],
  },
  {
    title: "English",
    subtitle: "1st Paper, 2nd Paper, grammar smart practice",
    href: "/english",
    cover: EnglishCover,
    status: "ফ্রন্টএন্ড রেডি",
    accent: "sky",
    points: ["Seen Passage", "Unseen", "Poems", "Stories", "Grammar", "Writing"],
  },
];

const accentClass = {
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
  sky: "border-sky-200 bg-sky-50 text-sky-700",
};

export default function Home() {
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(100);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const savedPoints = localStorage.getItem("points");
    setUser(userData ? JSON.parse(userData) : null);
    if (savedPoints) setPoints(Number(savedPoints));
    else localStorage.setItem("points", "100");
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.35fr_.65fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <span className="mb-4 w-fit rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
              Class 9-10 Board Exam Companion
            </span>
            <h1 className="max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              স্বাগতম{user?.full_name ? `, ${user.full_name}` : ""}. আজ কোন বই দিয়ে শুরু করবে?
            </h1>
            <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-slate-600">
              পাঠবন্ধুতে প্রতিটি subject-এ Tutor, Jachai এবং Progress flow থাকবে। এখনকার live backend অনুযায়ী গণিত fully connected; বাংলা ও English structure-ready frontend হিসেবে সাজানো।
            </p>
          </div>

          <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">মোট পয়েন্ট</p>
              <p className="mt-1 text-3xl font-black text-amber-600">⭐ {points}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {["Tutor", "Jachai", "Progress"].map((item) => (
                <div key={item} className="rounded-lg border border-slate-200 bg-white p-3">
                  <p className="text-sm font-black text-slate-900">{item}</p>
                  <p className="text-[11px] font-semibold text-slate-500">Ready flow</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-black text-slate-950">পাঠ্যবই</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">Math, Bangla, English book select করে subject workspace খুলবে।</p>
          </div>
          <Link href="/progress" className="w-fit rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-100">
            সামগ্রিক অগ্রগতি দেখো
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {books.map((book) => (
            <Link
              key={book.title}
              href={book.href}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className={`rounded-lg border px-3 py-1 text-xs font-black ${accentClass[book.accent]}`}>{book.status}</span>
                  <h3 className="mt-4 text-2xl font-black text-slate-950">{book.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-slate-500">{book.subtitle}</p>
                </div>
                <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100 shadow-sm transition group-hover:rotate-2 group-hover:scale-105">
                  <Image src={book.cover} alt={`${book.title} cover`} fill className="object-cover" />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                {book.points.map((point) => (
                  <span key={point} className="rounded-md bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">
                    {point}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-sm font-black text-slate-900">Workspace খুলুন</span>
                <span className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-black text-white">Enter</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

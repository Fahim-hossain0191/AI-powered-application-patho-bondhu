"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, storeSession } from "../../../services/api";

export default function SignIn() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ contact: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!form.contact || !form.password) {
      setErrorMessage("অনুগ্রহ করে মোবাইল নম্বর/ইমেইল এবং পাসওয়ার্ড দুটিই দিন।");
      return;
    }
    try {
      setLoading(true);
      const contact = form.contact.trim();
      const credentials = contact.includes("@")
        ? { email: contact, password: form.password }
        : { phone: contact, password: form.password };
      const data = await auth.login(credentials);

      storeSession(data);
      if (!localStorage.getItem("points")) localStorage.setItem("points", "100");
      if (!localStorage.getItem("streak")) localStorage.setItem("streak", "1");
      
      setSuccessMessage("লগইন সফল! ড্যাশবোর্ডে নিয়ে যাচ্ছি...");
      setTimeout(() => { 
        router.push("/home"); 
        router.refresh(); 
      }, 800);
    } catch (err) {
      setErrorMessage(err.message || "লগইন করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const particles = [
    { top: "8%", left: "7%", size: 10, color: "bg-teal-500", delay: "0s" },
    { top: "15%", right: "10%", size: 8, color: "bg-indigo-500", delay: "0.5s" },
    { top: "70%", left: "5%", size: 14, color: "bg-emerald-500", delay: "1s" },
    { top: "85%", right: "12%", size: 10, color: "bg-purple-500", delay: "1.5s" },
    { top: "45%", left: "92%", size: 8, color: "bg-amber-500", delay: "0.8s" },
    { top: "30%", left: "3%", size: 6, color: "bg-rose-500", delay: "1.2s" },
  ];

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans py-16 px-4 bg-slate-950">
      
      {/* Animated gradient space canvas */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.18)_0%,transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(20,184,166,0.18)_0%,transparent_65%)]" />

      {/* Cyber Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Floating high-fidelity particles */}
      {mounted && particles.map((p, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${p.color} opacity-30 blur-[1px] animate-bounce`}
          style={{
            top: p.top, left: p.left, right: p.right,
            width: p.size, height: p.size,
            animationDelay: p.delay,
            animationDuration: `${4 + i * 0.8}s`,
          }}
        />
      ))}

      {/* Futuristic Blur orbs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse" style={{ animationDuration: "10s" }} />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-teal-500/10 blur-[100px] animate-pulse" style={{ animationDuration: "8s" }} />

      {/* Signin Portal Card Container */}
      <div
        className="relative z-10 w-full max-w-[450px] px-2 sm:px-0 transition-all duration-700"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(30px)" }}
      >
        {/* Glow halo frame */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-600 to-teal-400 rounded-[32px] blur-xl opacity-20 animate-pulse" />
        
        <div className="relative bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.4)] p-8 sm:p-10">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-teal-400 text-white text-3xl shadow-[0_8px_25px_rgba(99,102,241,0.3)] mb-5 animate-bounce" style={{ animationDuration: "3.5s" }}>
              ⚡
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">পাঠবন্ধু পোর্টালে লগইন</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 font-medium">
              এআই কুইজ, কাস্টম সল্ভার ও ইন্টারেক্টিভ অনুশীলনী হাব
            </p>
          </div>

          {/* Feedback states */}
          {errorMessage && (
            <div className="mb-5 p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-rose-400 text-xs font-bold flex items-start gap-2.5 animate-fadeIn">
              <span className="text-sm mt-0.5 shrink-0">⚠️</span>
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="mb-5 p-4 bg-teal-500/10 border border-teal-500/25 rounded-2xl text-teal-400 text-xs font-bold flex items-center gap-2.5 animate-fadeIn">
              <span className="text-sm shrink-0">✅</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Username/Email Input Block */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
                মোবাইল নম্বর / ইমেল
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm transition-colors group-focus-within:text-indigo-400">
                  👤
                </span>
                <input
                  type="text"
                  id="signin-contact"
                  placeholder="যেমন: email@example.com অথবা মোবাইল"
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  className="w-full pl-11 pr-4 py-4 bg-slate-950/50 border border-white/10 focus:border-indigo-500/50 focus:bg-slate-950/80 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl text-white text-xs sm:text-sm outline-none transition-all placeholder:text-slate-600 font-medium"
                  required
                />
              </div>
            </div>

            {/* Password Input Block */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">পাসওয়ার্ড</label>
                <a href="#" className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider">ভুলে গেছেন?</a>
              </div>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm transition-colors group-focus-within:text-indigo-400">🔒</span>
                <input
                  type={showPw ? "text" : "password"}
                  id="signin-password"
                  placeholder="আপনার পাসওয়ার্ড লিখুন"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-11 pr-12 py-4 bg-slate-950/50 border border-white/10 focus:border-indigo-500/50 focus:bg-slate-950/80 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl text-white text-xs sm:text-sm outline-none transition-all placeholder:text-slate-600 font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-sm transition-colors"
                >
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Submit Trigger */}
            <button
              type="submit"
              id="signin-submit"
              disabled={loading}
              className="w-full mt-3 py-4 bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:scale-[1.01] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-[0_8px_25px_rgba(99,102,241,0.25)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.4)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 flex items-center justify-center gap-2.5 tracking-wider uppercase"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  লগইন হচ্ছে...
                </>
              ) : (
                <>প্রবেশ করি 🚀</>
              )}
            </button>
          </form>

          {/* Social Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">অথবা</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Registration Link */}
          <Link
            href="/signup"
            id="goto-signup"
            className="flex items-center justify-center gap-2 w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/30 text-slate-300 hover:text-white font-black text-xs rounded-2xl transition-all duration-300 uppercase tracking-wider shadow-inner"
          >
            ✨ নতুন শিক্ষার্থীর অ্যাকাউন্ট তৈরি
          </Link>

          {/* Bottom Security Capsule */}
          <p className="text-center text-[9px] text-slate-600 mt-6 flex items-center justify-center gap-1.5 font-bold uppercase tracking-wider">
            <span>🔒</span> আপনার তথ্য সম্পূর্ণরূপে নিরাপদ ও সংরক্ষিত
          </p>
        </div>
      </div>
    </div>
  );
}

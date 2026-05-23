"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "../../../services/api";

export default function SignUp() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 3 steps: 1 = Basic details, 2 = Academic details, 3 = Success
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    class: "9-10",
    school_name: "",
    board_name: "",
    profile_image_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { 
    setMounted(true); 
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMessage("");
  };

  const validateStep1 = () => {
    if (!formData.full_name.trim()) return "সম্পূর্ণ নাম দিন।";
    if (!formData.email.trim() && !formData.phone.trim()) return "ইমেল অথবা মোবাইল নম্বর দিন।";
    if (!formData.password || formData.password.length < 6) return "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।";
    return null;
  };

  const handleNextStep = () => {
    const err = validateStep1();
    if (err) { 
      setErrorMessage(err); 
      return; 
    }
    setErrorMessage("");
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      setLoading(true);
      await auth.register(formData);
      setStep(3); // Success state
      setTimeout(() => router.push("/signin"), 2500);
    } catch (err) {
      setErrorMessage(err.message || "নিবন্ধন সম্পন্ন করা যায়নি। অনুগ্রহ করে সব তথ্য পুনরায় পরীক্ষা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const classes = [
    { value: "6", label: "ষষ্ঠ শ্রেণি" },
    { value: "7", label: "সপ্তম শ্রেণি" },
    { value: "8", label: "অষ্টম শ্রেণি" },
    { value: "9-10", label: "নবম-দশম শ্রেণি" },
    { value: "11-12", label: "একাদশ-দ্বাদশ শ্রেণি" },
  ];

  const inputClass = "w-full px-4 py-3.5 bg-slate-950/50 border border-white/10 focus:border-indigo-500/50 focus:bg-slate-950/85 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl text-white text-xs sm:text-sm outline-none transition-all placeholder:text-slate-600 font-medium";
  const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1";

  const passwordStrength = () => {
    const len = formData.password.length;
    if (len === 0) return 0;
    if (len < 6) return 1; // weak
    if (len < 10) return 2; // medium
    return 3; // strong
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans py-16 px-4 bg-slate-950">
      
      {/* Background space elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.18)_0%,transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(20,184,166,0.18)_0%,transparent_65%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Blur Orbs */}
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse" style={{ animationDuration: "9s" }} />
      <div className="absolute bottom-1/3 left-1/4 w-[380px] h-[380px] rounded-full bg-teal-500/10 blur-[100px] animate-pulse" style={{ animationDuration: "11s" }} />

      {/* SignUp Portal Card Container */}
      <div
        className="relative z-10 w-full max-w-[550px] px-2 sm:px-0 transition-all duration-700"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(30px)" }}
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-600 to-teal-400 rounded-[32px] blur-xl opacity-20 animate-pulse" />
        
        <div className="relative bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.4)] p-8 sm:p-10">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-teal-400 text-white text-3xl shadow-[0_8px_25px_rgba(99,102,241,0.3)] mb-4">
              🎓
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">নতুন শিক্ষার্থীর অ্যাকাউন্ট</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 font-medium">
              পাঠবন্ধুতে যোগ দিন এবং এআই চালিত গণিত ও শিক্ষা হাবের সুবিধা নিন
            </p>
          </div>

          {/* Stepper Progress Bar */}
          {step < 3 && (
            <div className="flex items-center gap-3 mb-8 bg-slate-950/40 p-3 rounded-2xl border border-white/5">
              {[1, 2].map((s) => (
                <React.Fragment key={s}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-xl text-xs font-black transition-all duration-500 ${
                    step >= s
                      ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                      : "bg-white/5 text-slate-500 border border-white/5"
                  }`}>
                    {step > s ? "✓" : s}
                  </div>
                  {s < 2 && (
                    <div className="flex-1 h-0.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className={`h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500 ${step > 1 ? "w-full" : "w-0"}`} />
                    </div>
                  )}
                </React.Fragment>
              ))}
              <span className="ml-1 text-[9px] font-black text-slate-400 uppercase tracking-widest shrink-0">
                {step === 1 ? "ব্যক্তিগত বিবরণ" : "একাডেমিক তথ্য"}
              </span>
            </div>
          )}

          {/* Feedback message card */}
          {errorMessage && (
            <div className="mb-5 p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-rose-400 text-xs font-bold flex items-start gap-2.5 animate-fadeIn">
              <span className="text-sm shrink-0">⚠️</span>
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* ========= STEP 1 ========= */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>সম্পূর্ণ নাম *</label>
                <input 
                  type="text" 
                  name="full_name" 
                  id="signup-name" 
                  placeholder="যেমন: মোঃ সাকিব হাসান"
                  value={formData.full_name} 
                  onChange={handleChange} 
                  required 
                  className={inputClass} 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>ইমেল এড্রেস</label>
                  <input 
                    type="email" 
                    name="email" 
                    id="signup-email" 
                    placeholder="sajib@example.com"
                    value={formData.email} 
                    onChange={handleChange} 
                    className={inputClass} 
                  />
                </div>
                <div>
                  <label className={labelClass}>মোবাইল নম্বর</label>
                  <input 
                    type="text" 
                    name="phone" 
                    id="signup-phone" 
                    placeholder="017XXXXXXXX"
                    value={formData.phone} 
                    onChange={handleChange} 
                    className={inputClass} 
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>পাসওয়ার্ড তৈরি করুন *</label>
                <div className="relative group">
                  <input
                    type={showPw ? "text" : "password"}
                    name="password"
                    id="signup-password"
                    placeholder="কমপক্ষে ৬টি অক্ষরের পাসওয়ার্ড"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={inputClass + " pr-12"}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPw ? "🙈" : "👁️"}
                  </button>
                </div>

                {/* Password strength visualizer bar */}
                {formData.password.length > 0 && (
                  <div className="space-y-1 mt-2.5 px-0.5">
                    <div className="flex gap-1.5">
                      {[1, 2, 3].map((bar) => {
                        const level = passwordStrength();
                        let barColor = "bg-white/5";
                        if (level >= bar) {
                          if (level === 1) barColor = "bg-rose-500";
                          else if (level === 2) barColor = "bg-amber-500";
                          else barColor = "bg-teal-500";
                        }
                        return (
                          <div key={bar} className={`h-1 flex-1 rounded-full transition-all duration-500 ${barColor}`} />
                        );
                      })}
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-bold tracking-wider uppercase">
                      <span className="text-slate-500">পাসওয়ার্ড নিরাপত্তা</span>
                      <span className={
                        passwordStrength() === 1 ? "text-rose-500" :
                        passwordStrength() === 2 ? "text-amber-500" :
                        passwordStrength() === 3 ? "text-teal-500" : "text-slate-500"
                      }>
                        {passwordStrength() === 1 ? "দুর্বল" :
                         passwordStrength() === 2 ? "মাঝারি" :
                         passwordStrength() === 3 ? "খুব শক্তিশালী" : ""}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                id="signup-next"
                onClick={handleNextStep}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:scale-[1.01] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-[0_8px_25px_rgba(99,102,241,0.2)] active:scale-[0.98] transition-all duration-300 mt-3 uppercase tracking-wider"
              >
                পরবর্তী ধাপ →
              </button>
            </div>
          )}

          {/* ========= STEP 2 ========= */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>শ্রেণি নির্বাচন করুন</label>
                  <div className="relative">
                    <select 
                      name="class" 
                      value={formData.class} 
                      onChange={handleChange}
                      className={inputClass + " appearance-none cursor-pointer pr-10"}
                    >
                      {classes.map(c => (
                        <option key={c.value} value={c.value} className="bg-slate-900 text-slate-100">{c.label}</option>
                      ))}
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]">▼</span>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>শিক্ষা বোর্ড</label>
                  <input 
                    type="text" 
                    name="board_name" 
                    placeholder="যেমন: ঢাকা বোর্ড"
                    value={formData.board_name} 
                    onChange={handleChange} 
                    className={inputClass} 
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>বিদ্যালয় / স্কুল নাম</label>
                <input 
                  type="text" 
                  name="school_name" 
                  placeholder="যেমন: ঢাকা জিলা স্কুল"
                  value={formData.school_name} 
                  onChange={handleChange} 
                  className={inputClass} 
                />
              </div>

              <div>
                <label className={labelClass}>প্রোফাইল ইমেজ লিংক (ঐচ্ছিক)</label>
                <input 
                  type="url" 
                  name="profile_image_url" 
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.profile_image_url} 
                  onChange={handleChange} 
                  className={inputClass} 
                />
              </div>

              <div className="flex gap-4 mt-3">
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-extrabold text-xs rounded-2xl transition-all uppercase tracking-wider"
                >
                  ← পূর্বে
                </button>
                <button
                  type="submit"
                  id="signup-submit"
                  disabled={loading}
                  className="flex-[2] py-3.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:scale-[1.01] text-white font-extrabold text-xs rounded-2xl shadow-[0_8px_25px_rgba(99,102,241,0.2)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2.5 uppercase tracking-wider"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      তৈরি হচ্ছে...
                    </>
                  ) : (
                    "নিবন্ধন সম্পন্ন করি ✨"
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ========= STEP 3 – Success Confirmation ========= */}
          {step === 3 && (
            <div className="text-center py-8 space-y-6 animate-fadeIn">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-teal-400 flex items-center justify-center text-white text-4xl mx-auto shadow-[0_10px_30px_rgba(99,102,241,0.3)] animate-bounce" style={{ animationDuration: "1.8s" }}>
                🎉
              </div>
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">অ্যাকাউন্ট তৈরি সফল!</h2>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">পাঠবন্ধুতে আপনাকে স্বাগতম। লগইন স্ক্রিনে নিয়ে যাচ্ছি...</p>
              </div>
              <div className="flex justify-center gap-1.5 pt-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: `${i * 0.18}s` }} />
                ))}
              </div>
            </div>
          )}

          {/* Form Footer */}
          {step < 3 && (
            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-xs text-slate-500 font-medium">
                ইতিমধ্যে শিক্ষার্থীর অ্যাকাউন্ট আছে?{" "}
                <Link href="/signin" className="font-extrabold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider ml-1">
                  লগইন করুন 🚀
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client'

import Link from "next/link";
import { useState } from "react";

 
export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ contact: "", password: "" });
 
  const dots = [
    { top: "12%", left: "8%", color: "#4fc3f7", size: 10 },
    { top: "30%", left: "18%", color: "#66bb6a", size: 8 },
    { top: "55%", left: "6%", color: "#ffa726", size: 10 },
    { top: "70%", left: "22%", color: "#ef5350", size: 7 },
    { top: "80%", left: "38%", color: "#ab47bc", size: 8 },
  ];
 
  return (
    <div style={s.page}>
      {/* <link
        href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      /> */}
 
      {/* Decorative dots */}
      {dots.map((d, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: d.top,
            left: d.left,
            width: d.size,
            height: d.size,
            borderRadius: "50%",
            background: d.color,
            opacity: 0.85,
          }}
        />
      ))}
 
      {/* Staircase illustration (bottom-left) */}
      <div style={s.stairWrap}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              width: `${110 - i * 14}px`,
              height: "18px",
              background: "rgba(200,230,240,0.55)",
              borderRadius: "4px",
              marginBottom: "6px",
              marginLeft: `${i * 14}px`,
            }}
          />
        ))}
      </div>
 
      {/* Login Card */}
      <div style={s.card}>
        <h1 style={s.title}>ফিরে আসার জন্য স্বাগতম</h1>
        <p style={s.subtitle}>
          তোমার শেখার যাত্রা এখন আরো সহজ। চল শুরু করি।
        </p>
 
        {/* Contact field */}
        <div style={s.fieldGroup}>
          <label style={s.label}>মোবাইল নম্বর / ইমেইল</label>
          <input
            style={s.input}
            type="text"
            placeholder="017... অথবা email@example.com"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
          />
        </div>
 
        {/* Password field */}
        <div style={s.fieldGroup}>
          <label style={s.label}>পাসওয়ার্ড</label>
          <div style={s.pwWrap}>
            <input
              style={{ ...s.input, paddingRight: "42px" }}
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button style={s.eyeBtn} onClick={() => setShowPw((p) => !p)}>
              {showPw ? "🙈" : "👁"}
            </button>
          </div>
          <div style={{ textAlign: "right", marginTop: "6px" }}>
            <a href="#" style={s.forgotLink}>
              পাসওয়ার্ড ভুলে গেছো?
            </a>
          </div>
        </div>
 
        {/* Login button */}
        <Link href="/pages/home">
        
        <button style={s.loginBtn}>লগইন করি</button>
        </Link>
 
        {/* Create account button */}
        <button style={s.createBtn}>
          নতুন এসেছো নাকি? — একাউন্ট তৈরি করতে চাও
        </button>
 
        {/* Footer note */}
        <p style={s.footerNote}>
          নতুন এখানে?{" "}
          <a href="#" style={s.footerLink}>
            একাউন্ট তৈরি করো
          </a>
        </p>
      </div>
 
      {/* Bottom disclaimer */}
      <p style={s.disclaimer}>
        তোমার তথ্য সম্পূর্ণ নিরাপদে থাকবে 🔒
      </p>
    </div>
  );
}
 
const s = {
  page: {
    fontFamily: "'Hind Siliguri', 'Noto Sans Bengali', sans-serif",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e8f8f5 0%, #eaf6fb 40%, #f0f9ff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: "8%",
    position: "relative",
    overflow: "hidden",
  },
  stairWrap: {
    position: "absolute",
    bottom: "60px",
    left: "5%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    opacity: 0.6,
  },
  card: {
    background: "white",
    borderRadius: "18px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.09)",
    padding: "44px 40px 36px",
    width: "100%",
    maxWidth: "420px",
    position: "relative",
    zIndex: 2,
  },
  title: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#1a1a2e",
    marginBottom: "8px",
    lineHeight: 1.3,
  },
  subtitle: {
    fontSize: "13px",
    color: "#888",
    marginBottom: "28px",
    lineHeight: 1.6,
  },
  fieldGroup: {
    marginBottom: "18px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "#444",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    border: "1.5px solid #e0e0e0",
    borderRadius: "10px",
    fontFamily: "inherit",
    fontSize: "13px",
    color: "#333",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  pwWrap: {
    position: "relative",
  },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    color: "#aaa",
    padding: 0,
  },
  forgotLink: {
    fontSize: "12px",
    color: "#29b6c8",
    textDecoration: "none",
    fontWeight: 500,
  },
  loginBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(90deg, #26c6a6, #29b6c8)",
    border: "none",
    borderRadius: "12px",
    fontFamily: "inherit",
    fontSize: "15px",
    fontWeight: 600,
    color: "white",
    cursor: "pointer",
    marginTop: "6px",
    marginBottom: "14px",
    boxShadow: "0 4px 16px rgba(41,182,200,0.35)",
    transition: "opacity 0.2s",
  },
  createBtn: {
    width: "100%",
    padding: "13px",
    background: "transparent",
    border: "2px solid #26c6a6",
    borderRadius: "12px",
    fontFamily: "inherit",
    fontSize: "13px",
    fontWeight: 500,
    color: "#26c6a6",
    cursor: "pointer",
    marginBottom: "20px",
    transition: "all 0.2s",
  },
  footerNote: {
    textAlign: "center",
    fontSize: "13px",
    color: "#888",
  },
  footerLink: {
    color: "#29b6c8",
    textDecoration: "none",
    fontWeight: 600,
  },
  disclaimer: {
    position: "absolute",
    bottom: "16px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "12px",
    color: "#aaa",
    whiteSpace: "nowrap",
  },
};
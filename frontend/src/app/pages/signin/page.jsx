'use client'
import { useState } from "react";

const subjects = [
  { id: "math", icon: "📐", label: "গণিত" },
  { id: "science", icon: "🔬", label: "বিজ্ঞান" },
  { id: "english", icon: "🅰", label: "ইংরেজি" },
  { id: "bangla", icon: "অ", label: "বাংলা" },
  { id: "history", icon: "🌍", label: "ইতিহাস" },
  { id: "ict", icon: "💻", label: "আইসিটি" },
];
 
const hobbies = [
  { id: "games", icon: "🎮", label: "গেমস" },
  { id: "sports", icon: "🏆", label: "খেলা" },
  { id: "books", icon: "📚", label: "বই" },
  { id: "art", icon: "🎨", label: "আঁকা" },
  { id: "music", icon: "🎵", label: "গান" },
  { id: "scienceH", icon: "🔭", label: "বিজ্ঞান" },
];
 
const learningStyles = [
  { id: "visual", icon: "👁️", label: "দেখে শিখি" },
  { id: "audio", icon: "👂", label: "শুনে শিখি" },
  { id: "hands", icon: "✋", label: "করে শিখি" },
];
 
const styles = {
  body: {
    fontFamily: "'Hind Siliguri', 'Noto Sans Bengali', sans-serif",
    background: "linear-gradient(135deg, #e0f7fa 0%, #e8f5e9 50%, #f3e5f5 100%)",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    background: "white",
    borderRadius: "20px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: "1100px",
    overflow: "hidden",
  },
  header: {
    padding: "20px 28px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #f0f0f0",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: "12px" },
  logo: {
    width: "48px", height: "48px", borderRadius: "50%",
    background: "linear-gradient(135deg, #ff6b9d, #ff8e53)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "22px",
  },
  headerTitle: { fontSize: "18px", fontWeight: 700, color: "#222", margin: 0 },
  headerSub: { fontSize: "12px", color: "#888", marginTop: "2px" },
  loginBtn: {
    color: "#00bcd4", fontSize: "14px", fontWeight: 500,
    background: "none", border: "none", cursor: "pointer",
  },
  grid: {
    display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
  },
  section: { padding: "24px 28px", borderRight: "1px solid #f5f5f5" },
  sectionLast: { padding: "24px 28px" },
  sectionTitle: (color) => ({
    fontSize: "14px", fontWeight: 600, marginBottom: "16px",
    display: "flex", alignItems: "center", gap: "8px", color,
  }),
  input: {
    width: "100%", padding: "11px 14px", border: "1.5px solid #e0e0e0",
    borderRadius: "10px", fontFamily: "inherit",
    fontSize: "13px", color: "#444", outline: "none", marginBottom: "12px",
    display: "block",
  },
  pwWrap: { position: "relative" },
  eyeBtn: {
    position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
    background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "16px",
    marginBottom: "12px",
  },
  selectRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "4px" },
  select: {
    width: "100%", padding: "11px 14px", border: "1.5px solid #e0e0e0",
    borderRadius: "10px", fontFamily: "inherit",
    fontSize: "13px", color: "#444", outline: "none", background: "white",
    cursor: "pointer", appearance: "none",
  },
  subjectGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  hobbyGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" },
  card_: (selected, hoverColor, hoverBg) => ({
    border: `1.5px solid ${selected ? hoverColor : "#e8e8e8"}`,
    borderRadius: "12px", padding: "14px 10px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
    cursor: "pointer", background: selected ? hoverBg : "white",
    transition: "all 0.2s",
  }),
  hobbyCard_: (selected) => ({
    border: `1.5px solid ${selected ? "#e91e63" : "#e8e8e8"}`,
    borderRadius: "10px", padding: "12px 6px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: "5px",
    cursor: "pointer", background: selected ? "#fce4ec" : "white",
    transition: "all 0.2s",
  }),
  learnCard_: (selected) => ({
    border: `1.5px solid ${selected ? "#ff9800" : "#e8e8e8"}`,
    borderRadius: "10px", padding: "12px 6px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: "5px",
    cursor: "pointer", background: selected ? "#fff3e0" : "white",
    transition: "all 0.2s",
  }),
  iconLg: { fontSize: "22px" },
  iconSm: { fontSize: "18px" },
  labelSm: { fontSize: "12px", color: "#555", fontWeight: 500, textAlign: "center" },
  labelXs: { fontSize: "11px", color: "#555", textAlign: "center" },
  subTitle: {
    fontSize: "13px", fontWeight: 600, color: "#ff9800",
    margin: "16px 0 10px", display: "flex", alignItems: "center", gap: "6px",
  },
  footer: { padding: "0 28px 20px" },
  submitBtn: {
    width: "100%", padding: "16px",
    background: "linear-gradient(90deg, #4dd0e1, #80cbc4, #81d4fa)",
    border: "none", borderRadius: "14px", cursor: "pointer",
    fontFamily: "inherit", fontSize: "16px", fontWeight: 600, color: "white",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
    boxShadow: "0 4px 15px rgba(77,208,225,0.4)",
  },
  footerNote: { textAlign: "center", marginTop: "14px", fontSize: "13px", color: "#888" },
  footerLink: { color: "#00bcd4", textDecoration: "none", fontWeight: 500 },
};
 
function SelectableCard({ icon, label, selected, onToggle, cardStyle, iconStyle, labelStyle }) {
  return (
    <div style={cardStyle} onClick={onToggle}>
      <span style={iconStyle}>{icon}</span>
      <span style={labelStyle}>{label}</span>
    </div>
  );
}
 
export default function SignupPage() {
  const [showPw, setShowPw] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState(new Set());
  const [selectedHobbies, setSelectedHobbies] = useState(new Set());
  const [selectedLearn, setSelectedLearn] = useState(new Set());
  const [form, setForm] = useState({ name: "", contact: "", password: "", cls: "", medium: "" });
 
  const toggle = (set, setter, id) => {
    setter(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const handleSignup = async () => {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: form.name,
      email: form.contact,
      password: form.password,
    }),
  });

  const data = await res.json();

  if (res.ok) {
    alert("Account created!");
  } else {
    alert(data.error || "Something went wrong");
  }
};
  return (
    <div style={styles.body}>
      <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.logo}>🐼</div>
            <div>
              <p style={styles.headerTitle}>নতুন একাউন্ট তৈরি করি</p>
              <p style={styles.headerSub}>সব তথ্য পূরণ করে সেখা শুরু করো!</p>
            </div>
          </div>
          <button style={styles.loginBtn}>লগইন করুন</button>
        </div>
 
        {/* Body */}
        <div style={styles.grid}>
          {/* Column 1 */}
          <div style={styles.section}>
            <div style={styles.sectionTitle("#2196f3")}>
              <span>👤</span> তোমার পরিচয়
            </div>
            <input
              style={styles.input}
              placeholder="তোমার নাম"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <input
              style={styles.input}
              placeholder="মোবাইল / ইমেইল"
              value={form.contact}
              onChange={e => setForm({ ...form, contact: e.target.value })}
            />
            <div style={styles.pwWrap}>
              <input
                style={{ ...styles.input, paddingRight: "40px" }}
                type={showPw ? "text" : "password"}
                placeholder="পাসওয়ার্ড (৬+ অক্ষর)"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
              <button style={styles.eyeBtn} onClick={() => setShowPw(p => !p)}>👁</button>
            </div>
 
            <div style={{ ...styles.sectionTitle("#2196f3"), marginTop: "20px" }}>
              <span>🎓</span> পড়াশোনা
            </div>
            <div style={styles.selectRow}>
              {/* <select style={styles.select} value={form.cls} onChange={e => setForm({ ...form, cls: e.target.value })}> */}
              <select
  style={styles.select}
  value={form.cls || ""}
  onChange={(e) =>
    setForm((prev) => ({
      ...prev,
      cls: e.target.value,
    }))
  }
>
                <option value="">ক্লাস</option>
                {["৬","৭","৮","৯","১০"].map(c => <option key={c} value={c}>ক্লাস {c}</option>)}
              </select>
              <select style={styles.select} value={form.medium} onChange={e => setForm({ ...form, medium: e.target.value })}>
                <option value="">মাধ্যম</option>
                <option value="bangla">বাংলা</option>
                <option value="english">ইংরেজি</option>
              </select>
            </div>
          </div>
 
          {/* Column 2 */}
          <div style={styles.section}>
            <div style={styles.sectionTitle("#9c27b0")}>
              <span>📖</span> পছন্দের বিষয়
            </div>
            <div style={styles.subjectGrid}>
              {subjects.map(s => (
                <div
                  key={s.id}
                  style={styles.card_(selectedSubjects.has(s.id), "#00bcd4", "#e0f7fa")}
                  onClick={() => toggle(selectedSubjects, setSelectedSubjects, s.id)}
                >
                  <span style={styles.iconLg}>{s.icon}</span>
                  <span style={styles.labelSm}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
 
          {/* Column 3 */}
          <div style={styles.sectionLast}>
            <div style={styles.sectionTitle("#e91e63")}>
              <span>❤️</span> শখ ও আগ্রহ
            </div>
            <div style={styles.hobbyGrid}>
              {hobbies.map(h => (
                <div
                  key={h.id}
                  style={styles.hobbyCard_(selectedHobbies.has(h.id))}
                  onClick={() => toggle(selectedHobbies, setSelectedHobbies, h.id)}
                >
                  <span style={styles.iconSm}>{h.icon}</span>
                  <span style={styles.labelXs}>{h.label}</span>
                </div>
              ))}
            </div>
 
            <div style={styles.subTitle}>
              <span>🟠</span> শেখার ধরণ
            </div>
            <div style={styles.hobbyGrid}>
              {learningStyles.map(l => (
                <div
                  key={l.id}
                  style={styles.learnCard_(selectedLearn.has(l.id))}
                  onClick={() => toggle(selectedLearn, setSelectedLearn, l.id)}
                >
                  <span style={styles.iconSm}>{l.icon}</span>
                  <span style={styles.labelXs}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
 
        {/* Footer */}
        <div style={styles.footer}>
          <button style={styles.submitBtn} onClick={handleSignup}>
            একাউন্ট তৈরি করি ✓
          </button>
          <p style={styles.footerNote}>
            আগেই একাউন্ট আছে?{" "}
            <a href="#" style={styles.footerLink}>লগইন করো</a>
          </p>
        </div>
      </div>
    </div>
  );
}
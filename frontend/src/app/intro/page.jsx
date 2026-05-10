
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ─────────────────────────────────────────────
// Scroll Y hook
// ─────────────────────────────────────────────
function useScrollY() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrollY;
}

// ─────────────────────────────────────────────
// Intersection observer hook
// ─────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─────────────────────────────────────────────
// Parallax Layer
// ─────────────────────────────────────────────
function ParallaxLayer({ speed, children, className = "", style = {} }) {
  const scrollY = useScrollY();
  return (
    <div
      className={className}
      style={{ transform: `translateY(${scrollY * speed}px)`, willChange: "transform", ...style }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// SVG Assets
// ─────────────────────────────────────────────
const TreeSVG = ({ className = "", style = {} }) => (
  <svg viewBox="0 0 120 200" className={className} style={style} fill="none">
    <rect x="50" y="140" width="18" height="60" fill="#5C3A1E" rx="3" />
    <ellipse cx="59" cy="108" rx="48" ry="58" fill="#1A5C28" />
    <ellipse cx="59" cy="88" rx="36" ry="46" fill="#237A35" />
    <ellipse cx="59" cy="68" rx="24" ry="33" fill="#2EA043" />
    <ellipse cx="59" cy="52" rx="15" ry="22" fill="#3DBF56" />
  </svg>
);

const MountainSVG = ({ className = "" }) => (
  <svg viewBox="0 0 400 200" className={className} fill="none">
    <polygon points="0,200 120,40 240,200" fill="#1a2e4a" opacity="0.9" />
    <polygon points="80,200 200,20 320,200" fill="#243d5c" opacity="0.85" />
    <polygon points="160,200 280,55 400,200" fill="#1e3550" opacity="0.8" />
    <polygon points="100,200 200,60 260,120 300,200" fill="#2a4a6b" opacity="0.6" />
    <polygon points="120,40 140,75 100,75" fill="white" opacity="0.7" />
    <polygon points="200,20 225,65 175,65" fill="white" opacity="0.8" />
  </svg>
);

const CloudSVG = ({ className = "", style = {} }) => (
  <svg viewBox="0 0 200 90" className={className} style={style} fill="none">
    <ellipse cx="100" cy="62" rx="88" ry="28" fill="white" opacity="0.85" />
    <ellipse cx="70" cy="50" rx="42" ry="32" fill="white" opacity="0.9" />
    <ellipse cx="125" cy="46" rx="38" ry="30" fill="white" opacity="0.85" />
    <ellipse cx="95" cy="38" rx="34" ry="26" fill="white" />
  </svg>
);

const SunSVG = () => (
  <svg viewBox="0 0 120 120" width="120" height="120" fill="none">
    <defs>
      <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFF176" />
        <stop offset="60%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#FF8C00" stopOpacity="0.6" />
      </radialGradient>
      <filter id="sunGlow">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <circle cx="60" cy="60" r="50" fill="#FFD700" opacity="0.15" />
    <circle cx="60" cy="60" r="36" fill="#FFD700" opacity="0.25" />
    <circle cx="60" cy="60" r="26" fill="url(#sunGrad)" filter="url(#sunGlow)" />
    {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => (
      <line key={i}
        x1={60 + 30 * Math.cos((deg * Math.PI) / 180)}
        y1={60 + 30 * Math.sin((deg * Math.PI) / 180)}
        x2={60 + 48 * Math.cos((deg * Math.PI) / 180)}
        y2={60 + 48 * Math.sin((deg * Math.PI) / 180)}
        stroke="#FFD700" strokeWidth={i % 2 === 0 ? "2.5" : "1.5"} strokeLinecap="round" opacity="0.8"
      />
    ))}
  </svg>
);

const BirdSVG = ({ x = 0, y = 0, scale = 1 }) => (
  <svg viewBox="0 0 50 25" width={50 * scale} height={25 * scale}
    style={{ position: "absolute", left: x, top: y }} fill="none">
    <path d="M25 12 Q12 3 0 9" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M25 12 Q38 3 50 9" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" fill="none" />
    <circle cx="25" cy="13" r="2" fill="#2C3E50" />
  </svg>
);

const LanternSVG = ({ color = "#FF6B35" }) => (
  <svg viewBox="0 0 40 60" width="40" height="60" fill="none">
    <line x1="20" y1="0" x2="20" y2="8" stroke="#8B6914" strokeWidth="2" />
    <rect x="6" y="8" width="28" height="38" rx="14" fill={color} opacity="0.9" />
    <rect x="10" y="12" width="20" height="30" rx="10" fill={color} opacity="0.5" />
    <ellipse cx="20" cy="10" rx="12" ry="4" fill="#8B6914" />
    <ellipse cx="20" cy="46" rx="12" ry="4" fill="#8B6914" />
    <line x1="20" y1="50" x2="20" y2="60" stroke="#8B6914" strokeWidth="2" />
    <ellipse cx="20" cy="27" rx="10" ry="12" fill="white" opacity="0.3" />
  </svg>
);

// ─────────────────────────────────────────────
// Floating particles
// ─────────────────────────────────────────────
function Particles({ count = 20, color = "#FFD700" }) {
  const [particles] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.6 + 0.2,
    }))
  );
  return (
    <>
      {particles.map((p) => (
        <div key={p.id} className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            background: color, opacity: p.opacity,
            animation: `floatUp ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </>
  );
}

// ─────────────────────────────────────────────
// Section data
// ─────────────────────────────────────────────
const SECTIONS = [
  {
    id: 1,
    bangla: "শিশু শিক্ষা",
    sublabel: "Early Childhood",
    age: "Age 3 – 5",
    desc: "রঙিন ছবি, গল্প ও খেলার মাধ্যমে শিশুদের প্রথম পদক্ষেপ শুরু হয়।",
    descEn: "Learning through colors, storytelling and play — the first spark of curiosity.",
    accent: "#FF8C00",
    light: "#FFF3E0",
    dark: "#7A3D00",
    skyGrad: "linear-gradient(180deg, #FFF8E1 0%, #FFE0B2 60%, #FFCC80 100%)",
    icon: "🎨",
    timeLabel: "প্রথম আলো",
    timeSub: "First Light",
    IllustrationEl: IllustrationEarly,
  },
  {
    id: 2,
    bangla: "প্রাথমিক শিক্ষা",
    sublabel: "Primary School",
    age: "Class 1 – 5",
    desc: "বাংলা, গণিত ও বিজ্ঞানের মজাদার পাঠে জ্ঞানের দরজা খুলে যায়।",
    descEn: "Fun lessons in Bangla, Math and Science open the doors of knowledge.",
    accent: "#2E7D32",
    light: "#E8F5E9",
    dark: "#1B4D1E",
    skyGrad: "linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 60%, #A5D6A7 100%)",
    icon: "📚",
    timeLabel: "বিদ্যার ভোর",
    timeSub: "Dawn of Knowledge",
    IllustrationEl: IllustrationPrimary,
  },
  {
    id: 3,
    bangla: "মাধ্যমিক শিক্ষা",
    sublabel: "Secondary School",
    age: "Class 6 – 10",
    desc: "গভীর জ্ঞান, দলগত আলোচনা ও সৃজনশীল চিন্তার মাধ্যমে বিকশিত হওয়া।",
    descEn: "Deep learning, group discussions and creative thinking — growing in full bloom.",
    accent: "#1565C0",
    light: "#E3F2FD",
    dark: "#0D3878",
    skyGrad: "linear-gradient(180deg, #E3F2FD 0%, #BBDEFB 60%, #90CAF9 100%)",
    icon: "🔬",
    timeLabel: "জ্ঞানের মধ্যাহ্ন",
    timeSub: "Noon of Wisdom",
    IllustrationEl: IllustrationSecondary,
  },
  {
    id: 4,
    bangla: "উচ্চ মাধ্যমিক",
    sublabel: "Higher Secondary",
    age: "Class 11 – 12",
    desc: "ক্যারিয়ার প্রস্তুতি, বিশ্ববিদ্যালয় ভর্তি ও দক্ষতা উন্নয়নের পথে।",
    descEn: "Career preparation, university admission & skills for the world ahead.",
    accent: "#6A1B9A",
    light: "#F3E5F5",
    dark: "#3A0A5C",
    skyGrad: "linear-gradient(180deg, #EDE7F6 0%, #D1C4E9 60%, #B39DDB 100%)",
    icon: "🎓",
    timeLabel: "স্বপ্নের সন্ধ্যা",
    timeSub: "Evening of Dreams",
    IllustrationEl: IllustrationHigher,
  },
];

// ─────────────────────────────────────────────
// Main Page — NO visit gate, always renders
// ─────────────────────────────────────────────
export default function IntroPage() {
  const scrollY = useScrollY();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  const handleEnter = (path = "/home") => {
    setExiting(true);
    setTimeout(() => router.push(path), 800);
  };

  return (
    <div style={{ fontFamily: "'Noto Serif Bengali', Georgia, serif", overflowX: "hidden" }}
      className={`relative transition-all duration-700 ${exiting ? "opacity-0 scale-105" : "opacity-100 scale-100"}`}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;600;700;900&display=swap');

        @keyframes floatUp {
          0%   { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
          50%  { transform: translateY(-24px) rotate(5deg); opacity: 0.8; }
          100% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-14px); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(60px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes revealLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes revealRight {
          from { opacity: 0; transform: translateX(50px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes twinkle {
          0%,100% { opacity: 0.15; transform: scale(0.8); }
          50%      { opacity: 1; transform: scale(1.3); }
        }
        @keyframes glowPulse {
          0%,100% { filter: drop-shadow(0 0 12px rgba(255,215,0,0.4)); }
          50%      { filter: drop-shadow(0 0 36px rgba(255,215,0,0.85)); }
        }
        @keyframes lanternFloat {
          0%,100% { transform: translateY(0) rotate(-4deg); }
          50%      { transform: translateY(-18px) rotate(4deg); }
        }
        @keyframes progressFill {
          from { width: 0%; }
          to   { width: 100%; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #FFD700 0%, #FFF9C4 40%, #FF8C00 60%, #FFD700 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
      `}</style>

      {/* ══════════════════════════════════════════════
          HERO — Cinematic Sunrise Scene
      ══════════════════════════════════════════════ */}
      <section className="relative h-screen overflow-hidden"
        style={{ background: "linear-gradient(180deg, #0A1628 0%, #1A2D4F 15%, #2E5B8A 35%, #5B9BD5 55%, #87CEEB 70%, #B8E4FF 82%, #D4F0C8 92%, #90EE90 100%)" }}>

        {/* Stars */}
        <ParallaxLayer speed={-0.04} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 2.5 + 0.5, height: Math.random() * 2.5 + 0.5,
                top: `${Math.random() * 55}%`, left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.8 + 0.1,
                animation: `twinkle ${2 + Math.random() * 4}s ease-in-out ${Math.random() * 4}s infinite`,
              }}
            />
          ))}
        </ParallaxLayer>

        {/* Aurora glow */}
        <ParallaxLayer speed={-0.06} style={{ position: "absolute", top: "5%", left: 0, right: 0 }}>
          <div style={{ position: "absolute", left: "5%", top: 0, width: "40%", height: 180,
            background: "radial-gradient(ellipse, rgba(100,200,255,0.18) 0%, transparent 70%)", filter: "blur(30px)" }} />
          <div style={{ position: "absolute", right: "10%", top: 20, width: "35%", height: 140,
            background: "radial-gradient(ellipse, rgba(180,120,255,0.12) 0%, transparent 70%)", filter: "blur(25px)" }} />
        </ParallaxLayer>

        {/* Sun */}
        <ParallaxLayer speed={-0.12} style={{ position: "absolute", top: "18%", right: "12%", zIndex: 2 }}>
          <div style={{ animation: "glowPulse 4s ease-in-out infinite" }}>
            <SunSVG />
          </div>
        </ParallaxLayer>

        {/* Clouds slow */}
        <ParallaxLayer speed={-0.07} style={{ position: "absolute", top: "25%", left: 0, right: 0 }}>
          <CloudSVG className="absolute w-64 opacity-70" style={{ top: 0, left: "3%" }} />
          <CloudSVG className="absolute w-48 opacity-50" style={{ top: 30, right: "5%" }} />
        </ParallaxLayer>

        {/* Clouds mid */}
        <ParallaxLayer speed={-0.04} style={{ position: "absolute", top: "38%", left: 0, right: 0 }}>
          <CloudSVG className="absolute w-72 opacity-60" style={{ top: 0, left: "20%" }} />
          <CloudSVG className="absolute w-40 opacity-45" style={{ top: -10, right: "25%" }} />
        </ParallaxLayer>

        {/* Birds */}
        <ParallaxLayer speed={-0.09} style={{ position: "absolute", top: "22%", left: "15%", width: 200, height: 60 }}>
          <BirdSVG x={0} y={0} scale={0.9} />
          <BirdSVG x={60} y={-12} scale={0.7} />
          <BirdSVG x={108} y={6} scale={0.8} />
          <BirdSVG x={158} y={-6} scale={0.6} />
        </ParallaxLayer>

        {/* Distant mountains */}
        <ParallaxLayer speed={-0.05} style={{ position: "absolute", bottom: "18%", left: 0, right: 0 }}>
          <MountainSVG className="absolute w-full opacity-60" style={{ bottom: 0 }} />
        </ParallaxLayer>

        {/* Mid trees */}
        <ParallaxLayer speed={-0.03} style={{ position: "absolute", bottom: "12%", left: 0, right: 0 }}>
          <TreeSVG className="absolute w-28" style={{ bottom: 0, left: "2%", opacity: 0.85 }} />
          <TreeSVG className="absolute w-20" style={{ bottom: 0, left: "12%", opacity: 0.7 }} />
          <TreeSVG className="absolute w-24" style={{ bottom: 0, left: "22%", opacity: 0.6 }} />
          <TreeSVG className="absolute w-32" style={{ bottom: 0, right: "3%", opacity: 0.9 }} />
          <TreeSVG className="absolute w-20" style={{ bottom: 0, right: "14%", opacity: 0.75 }} />
          <TreeSVG className="absolute w-24" style={{ bottom: 0, right: "24%", opacity: 0.65 }} />
        </ParallaxLayer>

        {/* Foreground trees */}
        <ParallaxLayer speed={0.01} style={{ position: "absolute", bottom: "6%", left: 0, right: 0 }}>
          <TreeSVG className="absolute w-36" style={{ bottom: 0, left: "-2%", opacity: 1 }} />
          <TreeSVG className="absolute w-28" style={{ bottom: 0, right: "-1%", opacity: 1 }} />
        </ParallaxLayer>

        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-28"
          style={{ background: "linear-gradient(0deg, #3D8B3D 0%, #52A852 40%, #6DBF6D 70%, #90EE90 100%)",
            borderRadius: "80% 80% 0 0 / 40px 40px 0 0" }} />

        {/* Floating lanterns */}
        <ParallaxLayer speed={-0.18} style={{ position: "absolute", top: "28%", left: "30%", zIndex: 3 }}>
          <div style={{ animation: "lanternFloat 5s ease-in-out infinite" }}><LanternSVG color="#FF6B35" /></div>
        </ParallaxLayer>
        <ParallaxLayer speed={-0.22} style={{ position: "absolute", top: "32%", left: "45%", zIndex: 3 }}>
          <div style={{ animation: "lanternFloat 4s ease-in-out 1s infinite" }}><LanternSVG color="#FF9500" /></div>
        </ParallaxLayer>
        <ParallaxLayer speed={-0.16} style={{ position: "absolute", top: "24%", left: "60%", zIndex: 3 }}>
          <div style={{ animation: "lanternFloat 6s ease-in-out 0.5s infinite" }}><LanternSVG color="#FFD700" /></div>
        </ParallaxLayer>

        {/* Hero Text */}
        <ParallaxLayer speed={0.25} style={{ position: "absolute", top: 0, left: 0, right: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          height: "72%", zIndex: 10, padding: "0 24px" }}>
          <div className="text-center"
            style={{ animation: mounted ? "revealUp 1.2s cubic-bezier(0.16,1,0.3,1) forwards" : "none",
              opacity: mounted ? 1 : 0 }}>

            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.3)", borderRadius: 999,
              padding: "6px 20px", marginBottom: 20, color: "rgba(255,255,255,0.9)",
              fontSize: 13, fontWeight: 600, letterSpacing: "0.08em",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}>
              🇧🇩 &nbsp; বাংলাদেশের শিক্ষার নতুন দিগন্ত
            </div>

            <h1 className="shimmer-text"
              style={{ fontSize: "clamp(52px, 10vw, 96px)", fontWeight: 900, lineHeight: 1.1,
                letterSpacing: "-0.02em", margin: "0 0 12px", display: "block" }}>
              শিক্ষার আলো
            </h1>

            <p style={{ fontSize: "clamp(18px, 3vw, 28px)", fontWeight: 600, color: "rgba(255,255,255,0.9)",
              letterSpacing: "0.04em", marginBottom: 8, textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
              AI-চালিত শিক্ষা প্ল্যাটফর্ম
            </p>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", maxWidth: 420, margin: "0 auto 36px",
              lineHeight: 1.7, textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}>
              Scroll to explore your journey through every stage of education — from childhood to the stars.
            </p>

            {/* Progress line */}
            <div style={{ width: 200, height: 2, background: "rgba(255,255,255,0.15)", borderRadius: 4,
              margin: "0 auto 28px", overflow: "hidden" }}>
              <div style={{ height: "100%", background: "linear-gradient(90deg, #FFD700, #FF8C00)",
                animation: mounted ? "progressFill 2.5s 0.5s ease forwards" : "none", width: 0 }} />
            </div>

            {/* Scroll hint */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              color: "rgba(255,255,255,0.5)", animation: "floatUp 2.5s ease-in-out infinite" }}>
              <span style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                নিচে স্ক্রোল করুন
              </span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12l7 7 7-7" stroke="rgba(255,255,255,0.6)" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </ParallaxLayer>

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.45) 100%)" }} />
      </section>

      {/* Timeline Sections */}
      {SECTIONS.map((sec, idx) => (
        <CinematicSection key={sec.id} sec={sec} idx={idx} scrollY={scrollY} />
      ))}

      {/* Final CTA */}
      <CTASection onEnter={handleEnter} scrollY={scrollY} />
    </div>
  );
}

// ─────────────────────────────────────────────
// Cinematic Timeline Section
// ─────────────────────────────────────────────
function CinematicSection({ sec, idx, scrollY }) {
  const [ref, inView] = useInView(0.12);
  const isEven = idx % 2 === 0;
  const Illustration = sec.IllustrationEl;

  return (
    <section ref={ref} className="relative overflow-hidden"
      style={{ minHeight: "100vh", display: "flex", alignItems: "center",
        background: sec.skyGrad, padding: "100px 24px" }}>

      {/* Ambient orb */}
      <div className="absolute pointer-events-none"
        style={{
          width: 700, height: 700, borderRadius: "50%",
          background: `radial-gradient(circle, ${sec.accent}18 0%, transparent 70%)`,
          top: "50%", left: isEven ? "-20%" : "auto", right: isEven ? "auto" : "-20%",
          transform: `translateY(calc(-50% + ${scrollY * (isEven ? -0.06 : 0.06)}px))`,
          transition: "transform 0.08s linear", filter: "blur(10px)",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Particles count={12} color={sec.accent} />
      </div>

      {/* Giant step number */}
      <div className="absolute pointer-events-none select-none"
        style={{
          fontSize: "clamp(160px, 30vw, 300px)", fontWeight: 900,
          color: sec.accent, opacity: 0.04, lineHeight: 1,
          top: "50%", left: isEven ? "auto" : "2%", right: isEven ? "2%" : "auto",
          transform: `translateY(calc(-50% + ${scrollY * -0.07}px))`,
          transition: "transform 0.08s linear",
        }}>
        {String(sec.id).padStart(2, "0")}
      </div>

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${sec.accent}40, transparent)` }} />

      {/* Content grid */}
      <div className="relative z-10 max-w-6xl mx-auto w-full"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center",
          direction: isEven ? "ltr" : "rtl" }}>

        {/* Text */}
        <div style={{
          direction: "ltr",
          animation: inView ? `${isEven ? "revealLeft" : "revealRight"} 0.9s cubic-bezier(0.16,1,0.3,1) forwards` : "none",
          opacity: inView ? 1 : 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, ${sec.accent}, transparent)` }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em",
              textTransform: "uppercase", color: sec.accent, opacity: 0.8 }}>
              {sec.timeSub}
            </span>
          </div>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 8,
            background: `${sec.accent}18`, border: `1px solid ${sec.accent}40`,
            borderRadius: 999, padding: "6px 16px", marginBottom: 16 }}>
            <span style={{ fontSize: 18 }}>{sec.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: sec.accent, letterSpacing: "0.06em" }}>
              {sec.age}
            </span>
          </div>

          <h2 style={{ fontSize: "clamp(36px, 5vw, 58px)", fontWeight: 900, lineHeight: 1.15,
            color: sec.dark, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
            {sec.bangla}
          </h2>
          <p style={{ fontSize: 20, fontWeight: 600, color: sec.accent, marginBottom: 20, letterSpacing: "0.01em" }}>
            {sec.sublabel}
          </p>

          <div style={{ width: 60, height: 3, background: `linear-gradient(90deg, ${sec.accent}, ${sec.accent}40)`,
            borderRadius: 4, marginBottom: 20 }} />

          <p style={{ fontSize: 16, lineHeight: 1.9, color: sec.dark, opacity: 0.75, marginBottom: 10 }}>
            {sec.desc}
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: sec.dark, opacity: 0.5, fontStyle: "italic" }}>
            {sec.descEn}
          </p>

          <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: sec.accent,
              boxShadow: `0 0 12px ${sec.accent}80` }} />
            <span style={{ fontSize: 18, fontWeight: 700, color: sec.accent }}>{sec.timeLabel}</span>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: 16, height: 3, width: 220, background: `${sec.accent}20`,
            borderRadius: 4, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 4,
              background: `linear-gradient(90deg, ${sec.accent}60, ${sec.accent})`,
              width: inView ? `${sec.id * 25}%` : "0%",
              transition: "width 1.4s cubic-bezier(0.16,1,0.3,1) 0.4s",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", width: 220,
            marginTop: 6, fontSize: 11, color: sec.accent, opacity: 0.6 }}>
            <span>শুরু</span>
            <span>{sec.id * 25}%</span>
            <span>শেষ</span>
          </div>
        </div>

        {/* Illustration */}
        <div style={{
          direction: "ltr", display: "flex", justifyContent: "center", alignItems: "center",
          animation: inView ? `${isEven ? "revealRight" : "revealLeft"} 1s cubic-bezier(0.16,1,0.3,1) 0.15s forwards` : "none",
          opacity: inView ? 1 : 0,
        }}>
          <div style={{ animation: "float 5s ease-in-out infinite",
            filter: `drop-shadow(0 30px 50px ${sec.accent}30)` }}>
            <div style={{ border: `2px solid ${sec.accent}25`, borderRadius: 28, overflow: "hidden",
              boxShadow: `0 24px 80px ${sec.accent}20, 0 8px 32px rgba(0,0,0,0.1)` }}>
              <Illustration accent={sec.accent} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(0deg, rgba(255,255,255,0.4) 0%, transparent 100%)" }} />
    </section>
  );
}

// ─────────────────────────────────────────────
// Final CTA — Night sky
// ─────────────────────────────────────────────
function CTASection({ onEnter }) {
  const [ref, inView] = useInView(0.1);

  return (
    <section ref={ref} className="relative overflow-hidden"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: "80px 24px",
        background: "linear-gradient(180deg, #0D1B2A 0%, #071018 50%, #030810 100%)" }}>

      {/* Stars */}
      {/* {Array.from({ length: 80 }).map((_, i) => (
        <div key={i} className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 2.5 + 0.5, height: Math.random() * 2.5 + 0.5,
            top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.7 + 0.1,
            animation: `twinkle ${2 + Math.random() * 4}s ease-in-out ${Math.random() * 5}s infinite`,
          }}
        />
      ))} */}

      {/* Nebula glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{ position: "absolute", top: "10%", left: "15%", width: 500, height: 300,
          background: "radial-gradient(ellipse, rgba(100,50,200,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "15%", right: "10%", width: 400, height: 250,
          background: "radial-gradient(ellipse, rgba(50,120,200,0.1) 0%, transparent 70%)", filter: "blur(35px)" }} />
      </div>

      {/* Silhouette trees */}
      <div className="absolute pointer-events-none" style={{ bottom: "8%", left: 0, right: 0 }}>
        <TreeSVG style={{ position: "absolute", bottom: 0, left: "1%", width: 120, opacity: 0.12, filter: "brightness(0) invert(1)" }} />
        <TreeSVG style={{ position: "absolute", bottom: 0, left: "8%", width: 90, opacity: 0.08, filter: "brightness(0) invert(1)" }} />
        <TreeSVG style={{ position: "absolute", bottom: 0, right: "2%", width: 130, opacity: 0.12, filter: "brightness(0) invert(1)" }} />
        <TreeSVG style={{ position: "absolute", bottom: 0, right: "10%", width: 80, opacity: 0.08, filter: "brightness(0) invert(1)" }} />
      </div>

      {/* Floating lanterns */}
      {[
        { left: "20%", top: "20%", color: "#FF6B35", d: 0 },
        { left: "35%", top: "15%", color: "#FFD700", d: 1.5 },
        { left: "50%", top: "22%", color: "#FF9500", d: 0.8 },
        { left: "65%", top: "12%", color: "#FF6B35", d: 2.2 },
        { left: "78%", top: "18%", color: "#FFD700", d: 0.4 },
      ].map((l, i) => (
        <div key={i} style={{ position: "absolute", left: l.left, top: l.top,
          animation: `lanternFloat ${4 + i * 0.5}s ease-in-out ${l.d}s infinite`, zIndex: 2 }}>
          <LanternSVG color={l.color} />
        </div>
      ))}

      {/* CTA Content */}
      <div ref={ref} className="relative z-10 text-center"
        style={{ maxWidth: 640,
          animation: inView ? "revealUp 1s cubic-bezier(0.16,1,0.3,1) forwards" : "none",
          opacity: inView ? 1 : 0 }}>

        <div style={{ width: 1, height: 60, background: "linear-gradient(180deg, transparent, #FFD700, transparent)",
          margin: "0 auto 28px" }} />

        <p style={{ fontSize: 12, letterSpacing: "0.25em", textTransform: "uppercase",
          color: "rgba(255,215,0,0.6)", marginBottom: 16 }}>
          — Your Journey Awaits —
        </p>

        <h2 className="shimmer-text"
          style={{ fontSize: "clamp(38px, 7vw, 72px)", fontWeight: 900, lineHeight: 1.15,
            letterSpacing: "-0.02em", marginBottom: 12, display: "block" }}>
          আপনার যাত্রা শুরু করুন
        </h2>

        <p style={{ fontSize: 20, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 10 }}>
          Start Your Learning Journey
        </p>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 48, lineHeight: 1.8 }}>
          Join thousands of Bangladeshi students already learning smarter with AI-powered education.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
          <Link href="/pages/home">
          <button 
            style={{
              padding: "18px 52px", borderRadius: 999, fontWeight: 800, fontSize: 17,
              background: "linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)",
              color: "#1A1A00", border: "none", cursor: "pointer", width: "100%", maxWidth: 360,
              boxShadow: "0 8px 40px rgba(255,180,0,0.35)",
              transition: "transform 0.2s, box-shadow 0.2s", letterSpacing: "0.02em",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "scale(1.04) translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 16px 60px rgba(255,180,0,0.5)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "scale(1) translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 40px rgba(255,180,0,0.35)";
            }}>
            🚀 &nbsp; শুরু করুন — Get Started
          </button>
          
          </Link>

          <button 
            style={{
              padding: "16px 52px", borderRadius: 999, fontWeight: 700, fontSize: 16,
              background: "transparent", color: "rgba(255,255,255,0.75)",
              border: "1.5px solid rgba(255,255,255,0.2)", cursor: "pointer",
              width: "100%", maxWidth: 360, transition: "all 0.2s", letterSpacing: "0.02em",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              e.currentTarget.style.color = "rgba(255,255,255,0.75)";
            }}>
            🔑 &nbsp; লগইন করুন — Sign In
          </button>
        </div>

        <div style={{ width: 1, height: 50, background: "linear-gradient(180deg, #FFD700, transparent)",
          margin: "40px auto 0" }} />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Illustration Components
// ─────────────────────────────────────────────
function IllustrationEarly() {
  return (
    <svg viewBox="0 0 340 300" style={{ width: "100%", maxWidth: 320 }} fill="none">
      <rect width="340" height="300" rx="26" fill="#FFF8E1" />
      <rect x="240" y="20" width="70" height="80" rx="8" fill="#B3E5FC" stroke="#FF8C00" strokeWidth="2" />
      <line x1="275" y1="20" x2="275" y2="100" stroke="#FF8C00" strokeWidth="1.5" strokeDasharray="4,4" />
      <line x1="240" y1="60" x2="310" y2="60" stroke="#FF8C00" strokeWidth="1.5" strokeDasharray="4,4" />
      {[0,15,30,45].map((a, i) => (
        <line key={i} x1="310" y1="20"
          x2={310 + 50 * Math.cos((a * Math.PI) / 180)}
          y2={20 + 50 * Math.sin(((a + 20) * Math.PI) / 180)}
          stroke="#FFD700" strokeWidth="1.5" opacity="0.4" />
      ))}
      <rect x="30" y="25" width="160" height="90" rx="10" fill="#1B4D1E" />
      <rect x="36" y="31" width="148" height="78" rx="7" fill="#235C26" />
      <text x="110" y="72" textAnchor="middle" fontSize="20" fill="#FFF9C4" fontWeight="bold">অ আ ই</text>
      <text x="110" y="96" textAnchor="middle" fontSize="13" fill="rgba(255,255,255,0.5)">ক খ গ</text>
      <rect x="140" y="118" width="20" height="8" rx="3" fill="#EF9A9A" />
      <rect x="165" y="116" width="5" height="12" rx="2" fill="white" opacity="0.8" />
      <circle cx="110" cy="160" r="22" fill="#FFDAB9" />
      <rect x="90" y="182" width="40" height="52" rx="10" fill="#FF8C00" />
      <rect x="74" y="187" width="18" height="40" rx="8" fill="#FFDAB9" />
      <rect x="128" y="187" width="18" height="40" rx="8" fill="#FFDAB9" />
      <ellipse cx="110" cy="144" rx="22" ry="14" fill="#3E2723" />
      <line x1="92" y1="205" x2="65" y2="175" stroke="#5D4037" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="52" cy="218" r="17" fill="#FFD3A5" />
      <rect x="36" y="235" width="32" height="42" rx="8" fill="#4DB860" />
      <ellipse cx="52" cy="204" rx="17" ry="10" fill="#4A148C" opacity="0.8" />
      <circle cx="170" cy="218" r="17" fill="#FFDAB9" />
      <rect x="154" y="235" width="32" height="42" rx="8" fill="#FF6B6B" />
      <ellipse cx="170" cy="204" rx="17" ry="11" fill="#1A237E" opacity="0.8" />
      <rect x="28" y="270" width="60" height="8" rx="3" fill="#8D6E63" />
      <rect x="144" y="270" width="60" height="8" rx="3" fill="#8D6E63" />
      <text x="22" y="45" fontSize="16">⭐</text>
      <text x="296" y="130" fontSize="13">🌟</text>
      <rect x="0" y="275" width="340" height="25" fill="#FFECB3" opacity="0.6" />
    </svg>
  );
}

function IllustrationPrimary() {
  return (
    <svg viewBox="0 0 340 300" style={{ width: "100%", maxWidth: 320 }} fill="none">
      <rect width="340" height="300" rx="26" fill="#F1F8E9" />
      <rect x="240" y="20" width="85" height="140" rx="6" fill="#BCAAA4" opacity="0.4" />
      {[0,1,2,3].map(i => (
        <rect key={i} x="248" y={28 + i * 32} width={12 + i * 4} height="26" rx="3"
          fill={["#E53935","#1E88E5","#43A047","#FB8C00"][i]} opacity="0.85" />
      ))}
      <rect x="70" y="188" width="140" height="16" rx="4" fill="#43A047" />
      <rect x="76" y="174" width="128" height="16" rx="4" fill="#FF8C00" />
      <rect x="82" y="160" width="116" height="16" rx="4" fill="#1E88E5" />
      <rect x="88" y="146" width="104" height="16" rx="4" fill="#E53935" />
      <circle cx="170" cy="100" r="26" fill="#FFDAB9" />
      <rect x="148" y="126" width="44" height="56" rx="11" fill="#1E88E5" />
      <rect x="133" y="131" width="18" height="44" rx="7" fill="#FFDAB9" />
      <rect x="189" y="131" width="18" height="44" rx="7" fill="#FFDAB9" />
      <ellipse cx="170" cy="82" rx="26" ry="15" fill="#212121" opacity="0.85" />
      <rect x="134" y="160" width="38" height="26" rx="4" fill="white" stroke="#90CAF9" strokeWidth="1.5" />
      <line x1="153" y1="162" x2="153" y2="184" stroke="#90CAF9" strokeWidth="1" />
      <rect x="216" y="88" width="7" height="55" rx="2" fill="#FFD700" transform="rotate(25 216 88)" />
      <rect x="219" y="86" width="7" height="8" rx="1" fill="#FF8A65" transform="rotate(25 219 86)" />
      <text x="22" y="55" fontSize="17" fill="#1E88E5" opacity="0.35" fontWeight="700">২+২=৪</text>
      <text x="26" y="88" fontSize="14" fill="#43A047" opacity="0.3">ক খ গ</text>
      <text x="280" y="200" fontSize="22">🏅</text>
      <rect x="25" y="204" width="200" height="10" rx="3" fill="#A1887F" opacity="0.7" />
      <rect x="45" y="214" width="10" height="50" rx="3" fill="#A1887F" opacity="0.5" />
      <rect x="195" y="214" width="10" height="50" rx="3" fill="#A1887F" opacity="0.5" />
      <rect x="0" y="275" width="340" height="25" fill="#DCEDC8" opacity="0.5" />
    </svg>
  );
}

function IllustrationSecondary() {
  return (
    <svg viewBox="0 0 340 300" style={{ width: "100%", maxWidth: 320 }} fill="none">
      <rect width="340" height="300" rx="26" fill="#E8EAF6" />
      <rect x="85" y="130" width="170" height="110" rx="8" fill="#263238" />
      <rect x="92" y="137" width="156" height="90" rx="5" fill="#1565C0" opacity="0.9" />
      <rect x="98" y="143" width="70" height="12" rx="3" fill="rgba(255,255,255,0.2)" />
      <rect x="98" y="160" width="50" height="8" rx="2" fill="rgba(255,255,255,0.12)" />
      <rect x="98" y="173" width="60" height="8" rx="2" fill="rgba(255,255,255,0.12)" />
      <text x="196" y="192" textAnchor="middle" fontSize="22" fill="white" fontWeight="900">AI</text>
      <circle cx="196" cy="182" r="18" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <rect x="65" y="240" width="210" height="12" rx="4" fill="#37474F" />
      <rect x="30" y="252" width="280" height="12" rx="4" fill="#5D4037" opacity="0.8" />
      <rect x="55" y="264" width="12" height="36" rx="3" fill="#5D4037" opacity="0.6" />
      <rect x="273" y="264" width="12" height="36" rx="3" fill="#5D4037" opacity="0.6" />
      <circle cx="170" cy="88" r="28" fill="#FFDAB9" />
      <rect x="146" y="116" width="48" height="56" rx="11" fill="#6A1B9A" />
      <rect x="130" y="121" width="18" height="44" rx="7" fill="#FFDAB9" />
      <rect x="192" y="121" width="18" height="44" rx="7" fill="#FFDAB9" />
      <ellipse cx="170" cy="68" rx="28" ry="17" fill="#1A1A1A" opacity="0.9" />
      <rect x="280" y="140" width="16" height="32" rx="3" fill="#80DEEA" stroke="#00838F" strokeWidth="1.5" />
      <ellipse cx="288" cy="178" rx="16" ry="10" fill="#00838F" opacity="0.6" />
      <circle cx="50" cy="160" r="10" fill="none" stroke="#1565C0" strokeWidth="2" />
      <circle cx="50" cy="160" r="4" fill="#1565C0" />
      <ellipse cx="50" cy="160" rx="20" ry="7" fill="none" stroke="#1565C0" strokeWidth="1.5" transform="rotate(40 50 160)" />
      <ellipse cx="50" cy="160" rx="20" ry="7" fill="none" stroke="#1565C0" strokeWidth="1.5" transform="rotate(-40 50 160)" />
      <text x="30" y="50" fontSize="13" fill="#1565C0" opacity="0.3" fontWeight="700">E=mc²</text>
      <text x="260" y="50" fontSize="13" fill="#6A1B9A" opacity="0.3">∑∫dx</text>
      <rect x="0" y="278" width="340" height="22" fill="#C5CAE9" opacity="0.5" />
    </svg>
  );
}

function IllustrationHigher() {
  return (
    <svg viewBox="0 0 340 300" style={{ width: "100%", maxWidth: 320 }} fill="none">
      <rect width="340" height="300" rx="26" fill="#F3E5F5" />
      <rect x="210" y="80" width="110" height="160" rx="6" fill="#EDE7F6" stroke="#CE93D8" strokeWidth="1.5" />
      <rect x="238" y="130" width="28" height="50" rx="3" fill="#CE93D8" opacity="0.5" />
      <polygon points="265,72 320,100 210,100" fill="#9C27B0" opacity="0.6" />
      {[0,1].map(i => [0,1].map(j => (
        <rect key={`${i}-${j}`} x={220 + j * 38} y={108 + i * 30} width="18" height="18" rx="2"
          fill="#B39DDB" opacity="0.6" />
      )))}
      <circle cx="130" cy="110" r="32" fill="#FFDAB9" />
      <rect x="103" y="82" width="54" height="8" rx="2" fill="#1A1A1A" />
      <polygon points="130,56 166,78 130,88 94,78" fill="#212121" />
      <line x1="164" y1="78" x2="172" y2="108" stroke="#FFD700" strokeWidth="3" />
      <circle cx="172" cy="112" r="7" fill="#FFD700" />
      <rect x="102" y="142" width="56" height="70" rx="12" fill="#6A1B9A" />
      <rect x="86" y="148" width="18" height="56" rx="7" fill="#FFDAB9" />
      <rect x="156" y="148" width="18" height="56" rx="7" fill="#FFDAB9" />
      <rect x="26" y="158" width="84" height="62" rx="8" fill="white" stroke="#9C27B0" strokeWidth="2" />
      <rect x="33" y="170" width="70" height="3" rx="1" fill="#9C27B0" opacity="0.35" />
      <rect x="33" y="180" width="56" height="3" rx="1" fill="#9C27B0" opacity="0.25" />
      <rect x="33" y="190" width="62" height="3" rx="1" fill="#9C27B0" opacity="0.2" />
      <text x="68" y="214" textAnchor="middle" fontSize="11" fill="#9C27B0" fontWeight="700">সনদপত্র</text>
      <circle cx="82" cy="196" r="10" fill="#FFD700" opacity="0.6" />
      <text x="82" y="200" textAnchor="middle" fontSize="9" fill="#7A4000">✦</text>
      <text x="22" y="80" fontSize="22">🌟</text>
      <text x="292" y="85" fontSize="18">⭐</text>
      <text x="22" y="148" fontSize="16">✨</text>
      <text x="185" y="270" fontSize="20">🎓</text>
      <rect x="0" y="278" width="340" height="22" fill="#E1BEE7" opacity="0.5" />
    </svg>
  );
}
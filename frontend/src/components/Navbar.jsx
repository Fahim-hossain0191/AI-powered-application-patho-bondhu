"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "../services/api";

const navLinks = [
  { href: "/home", label: "পাঠ্যবই", caption: "Math, Bangla, English" },
  { href: "/practice", label: "Practice", caption: "Smart drills" },
  { href: "/progress", label: "Progress", caption: "Activity & points" },
  { href: "/olympiad", label: "Olympiad", caption: "Challenge prep" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sync = () => {
      const userData = localStorage.getItem("user");
      const storedPoints = localStorage.getItem("points");
      setUser(userData ? JSON.parse(userData) : null);
      setPoints(storedPoints ? Number(storedPoints) : 0);
    };

    sync();
    window.addEventListener("storage", sync);
    const interval = setInterval(sync, 1200);
    return () => {
      window.removeEventListener("storage", sync);
      clearInterval(interval);
    };
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  const handleLogout = async () => {
    try {
      await auth.logout();
    } catch {}
    localStorage.removeItem("points");
    localStorage.removeItem("streak");
    setUser(null);
    router.push("/signin");
  };

  return (
    <nav
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled
          ? "border-slate-200 bg-white/90 shadow-sm backdrop-blur-xl"
          : "border-slate-200/80 bg-white/75 backdrop-blur-xl"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/home" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-600 text-lg font-black text-white shadow-sm">
            প
          </div>
          <div className="leading-tight">
            <p className="text-base font-black text-slate-950">পাঠবন্ধু</p>
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Class 9-10 AI Study Desk</p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`group rounded-md px-4 py-2 transition ${
                isActive(link.href)
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:bg-white hover:text-slate-950"
              }`}
            >
              <span className="block text-sm font-black">{link.label}</span>
              <span className="block text-[10px] font-semibold text-slate-400">{link.caption}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-black text-amber-700 sm:flex">
              <span>⭐</span>
              <span>{points} পয়েন্ট</span>
            </div>
          )}

          {user ? (
            <div className="hidden items-center gap-3 sm:flex">
              <div className="max-w-36 truncate text-right">
                <p className="truncate text-sm font-black text-slate-900">{user.full_name}</p>
                <p className="truncate text-[11px] font-semibold text-slate-500">{user.email || user.phone}</p>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-black text-rose-600 transition hover:bg-rose-50"
              >
                লগআউট
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/signin" className="rounded-lg px-3 py-2 text-sm font-black text-slate-600 hover:text-slate-950">
                লগইন
              </Link>
              <Link href="/signup" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-black text-white hover:bg-emerald-700">
                রেজিস্ট্রেশন
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 lg:hidden"
          >
            মেনু
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
          <div className="grid gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg border px-4 py-3 ${
                  isActive(link.href)
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 text-slate-700"
                }`}
              >
                <span className="block text-sm font-black">{link.label}</span>
                <span className="text-xs font-semibold text-slate-500">{link.caption}</span>
              </Link>
            ))}
            {user ? (
              <button onClick={handleLogout} className="rounded-lg bg-rose-50 px-4 py-3 text-left text-sm font-black text-rose-600">
                লগআউট
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/signin" className="rounded-lg border border-slate-200 px-4 py-3 text-center text-sm font-black">
                  লগইন
                </Link>
                <Link href="/signup" className="rounded-lg bg-emerald-600 px-4 py-3 text-center text-sm font-black text-white">
                  রেজিস্ট্রেশন
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

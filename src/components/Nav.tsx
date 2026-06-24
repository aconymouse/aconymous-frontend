"use client";

// ============================================================
// Nav — Navigasi utama, sticky, dengan dark mode toggle.
// Client component karena butuh akses localStorage + window.
// ============================================================

import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/blog", label: "Artikel" },
  { href: "/blog?kategori=tutorial", label: "Tutorial" },
  { href: "/tentang", label: "Tentang" },
];

export function Nav() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch (e) {}
  };

  return (
    <header
      role="banner"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid var(--border)",
        backgroundColor: "var(--nav-bg)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link
          href="/"
          aria-label="Aconymous — Kembali ke halaman utama"
          className="text-sm font-semibold tracking-widest uppercase transition-opacity hover:opacity-60"
          style={{
            color: "var(--accent)",
            fontFamily: "var(--font-geist-mono)",
            letterSpacing: "0.15em",
          }}
        >
          Aconymous
        </Link>

        <div className="flex items-center gap-6">
          {/* Main navigation */}
          <nav aria-label="Navigasi utama">
            <ul className="flex items-center gap-6 list-none">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-opacity hover:opacity-60"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Dark mode toggle — hidden until mounted to avoid hydration mismatch */}
          {mounted && (
            <button
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Light mode" : "Dark mode"}
              style={{
                background: "none",
                border: "1px solid var(--border)",
                cursor: "pointer",
                padding: "5px 9px",
                color: "var(--text-secondary)",
                lineHeight: 1,
                fontSize: "13px",
                transition: "border-color 0.15s ease, color 0.15s ease",
              }}
            >
              {isDark ? "☀" : "☾"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

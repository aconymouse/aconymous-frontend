"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/blog", label: "Artikel" },
  { href: "/blog?kategori=tutorial", label: "Tutorial" },
  { href: "/tentang", label: "Tentang" },
];

export function Nav() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    // Baca state tema dari DOM — diset duluan oleh FOUC script di layout.tsx
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
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

          {isDark !== null && (
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
import { useEffect, useRef, useState } from "react";
import { useThemeContext } from "../context/ThemeContext";
import { RubikCube, ChessPiece } from "./ThemeDecor";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const { mode, toggleMode, themeStyle, setThemeStyle } = useThemeContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
        setThemeMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
        <a href="#top" className="flex items-center gap-2 font-mono text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white shadow-md shadow-black/10">
            {"</>"}
          </span>
          <span>
            Java<span className="text-accent">Dev</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-accent dark:text-slate-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Theme style selector */}
          <div className="relative" ref={themeMenuRef}>
            <button
              type="button"
              onClick={() => setThemeMenuOpen((o) => !o)}
              aria-label="Choose visual theme"
              aria-expanded={themeMenuOpen}
              className="flex h-10 items-center gap-2 rounded-full border border-black/10 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-accent hover:text-accent dark:border-white/10 dark:bg-slate-900 dark:text-slate-200"
            >
              {themeStyle === "chess" ? (
                <ChessPiece symbol="♞" size={18} />
              ) : (
                <RubikCube size={16} />
              )}
              <span className="hidden sm:inline">{themeStyle === "chess" ? "Chess" : "Rubik's Cube"}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={`transition-transform ${themeMenuOpen ? "rotate-180" : ""}`}>
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {themeMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-black/10 bg-white py-1.5 shadow-xl shadow-black/10 dark:border-white/10 dark:bg-slate-900">
                <p className="px-3 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Portfolio theme
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setThemeStyle("chess");
                    setThemeMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 px-3 py-2 text-sm transition hover:bg-black/5 dark:hover:bg-white/10 ${
                    themeStyle === "chess" ? "text-accent font-semibold" : "text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <ChessPiece symbol="♞" size={18} />
                  Chess
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setThemeStyle("rubik");
                    setThemeMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 px-3 py-2 text-sm transition hover:bg-black/5 dark:hover:bg-white/10 ${
                    themeStyle === "rubik" ? "text-accent font-semibold" : "text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <RubikCube size={16} />
                  Rubik's Cube
                </button>
              </div>
            )}
          </div>

          {/* Dark / light toggle */}
          <button
            type="button"
            onClick={toggleMode}
            aria-label="Toggle dark and light mode"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-slate-700 shadow-sm transition hover:border-accent hover:text-accent dark:border-white/10 dark:bg-slate-900 dark:text-slate-200"
          >
            {mode === "dark" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="4" />
                <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-slate-700 shadow-sm md:hidden dark:border-white/10 dark:bg-slate-900 dark:text-slate-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-black/5 bg-white px-5 py-3 md:hidden dark:border-white/10 dark:bg-slate-950">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-black/5 hover:text-accent dark:text-slate-300 dark:hover:bg-white/10"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

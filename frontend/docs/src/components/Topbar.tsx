import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchModal from "./SearchModal";
import { LANGS } from "../data/types";
import { useLanguage } from "../context/LanguageContext";
import { cn } from "../utils/cn";

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
          <path d="M3 4h2l2.4 12.4a2 2 0 002 1.6h7.2a2 2 0 002-1.6L20 8H6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="20" r="1.4" />
          <circle cx="17" cy="20" r="1.4" />
        </svg>
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-slate-900">Cartly</span>
      <span className="hidden rounded-full bg-slate-100 px-2 py-0.5 text-[10.5px] font-semibold text-slate-500 sm:inline">
        DOCS
      </span>
    </Link>
  );
}

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const { lang, setLang } = useLanguage();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const navLinks = [
    { label: "Guides", to: "/guide-checkout" },
    { label: "API Reference", to: "/api-products" },
    { label: "Examples", to: "/example-checkout-flow" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-14 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-full items-center gap-4 px-4">
        <button
          onClick={onMenuClick}
          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Toggle navigation"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M2 5.5A.5.5 0 012.5 5h15a.5.5 0 010 1h-15a.5.5 0 01-.5-.5zM2 10a.5.5 0 01.5-.5h15a.5.5 0 010 1h-15A.5.5 0 012 10zm.5 4a.5.5 0 000 1h15a.5.5 0 000-1h-15z" clipRule="evenodd" />
          </svg>
        </button>

        <Logo />

        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="rounded-md px-3 py-1.5 text-[13px] font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setSearchOpen(true)}
          className="ml-2 flex flex-1 max-w-sm items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-left text-sm text-slate-400 transition hover:border-slate-300"
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 shrink-0">
            <circle cx="9" cy="9" r="6" />
            <path d="M17 17l-3.5-3.5" strokeLinecap="round" />
          </svg>
          <span className="hidden sm:inline">Search docs...</span>
          <kbd className="ml-auto hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:inline">
            ⌘K
          </kbd>
        </button>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen((o) => !o)}
              onBlur={() => setTimeout(() => setLangMenuOpen(false), 120)}
              className="flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-[12.5px] font-medium text-slate-600 hover:bg-slate-50"
            >
              {LANGS.find((l) => l.id === lang)?.label}
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-slate-400">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
            {langMenuOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 w-32 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                {LANGS.map((l) => (
                  <button
                    key={l.id}
                    onMouseDown={() => setLang(l.id)}
                    className={cn(
                      "block w-full px-3 py-1.5 text-left text-[12.5px] font-medium hover:bg-slate-50",
                      l.id === lang ? "text-violet-600" : "text-slate-600"
                    )}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="hidden rounded-md bg-slate-900 px-3 py-1.5 text-[12.5px] font-semibold text-white shadow-sm transition hover:bg-slate-800 sm:inline-block"
          >
            Dashboard
          </a>
        </div>
      </div>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </header>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { allPages } from "../data/pages";
import { cn } from "../utils/cn";

export default function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allPages.slice(0, 8);
    return allPages
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.group.toLowerCase().includes(q)
      )
      .slice(0, 12);
  }, [query]);

  useEffect(() => setActiveIndex(0), [query]);

  function go(slug: string) {
    navigate(`/${slug}`);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 px-4 pt-24 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 text-slate-400">
            <circle cx="9" cy="9" r="6" />
            <path d="M17 17l-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search guides, API reference, examples..."
            className="w-full text-sm text-slate-800 outline-none placeholder:text-slate-400"
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, results.length - 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
              }
              if (e.key === "Enter" && results[activeIndex]) {
                go(results[activeIndex].slug);
              }
            }}
          />
          <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
            ESC
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-slate-400">No results for “{query}”.</p>
          )}
          {results.map((p, i) => (
            <button
              key={p.slug}
              onClick={() => go(p.slug)}
              onMouseEnter={() => setActiveIndex(i)}
              className={cn(
                "flex w-full flex-col items-start gap-0.5 px-4 py-2 text-left transition",
                i === activeIndex ? "bg-violet-50" : "bg-white"
              )}
            >
              <span className="text-[10.5px] font-semibold uppercase tracking-wide text-violet-500">
                {p.group}
              </span>
              <span className="text-sm font-medium text-slate-800">{p.title}</span>
              <span className="line-clamp-1 text-xs text-slate-400">{p.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

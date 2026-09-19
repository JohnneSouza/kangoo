import { useEffect, useRef, useState } from "react";
import { Search, CornerDownLeft } from "lucide-react";
import { useI18n } from "../i18n/I18nContext";
import { searchTools } from "../utils/search";
import { cn } from "../utils/cn";

export function SearchBar({ onNavigate, className }: { onNavigate: (toolId: string) => void; className?: string }) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = searchTools(query, t);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    function handleGlobalKey(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        const tag = (document.activeElement?.tagName || "").toLowerCase();
        if (tag === "input" || tag === "textarea" || tag === "select") return;
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const commit = (toolId: string) => {
    onNavigate(toolId);
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      commit(results[activeIndex].tool.id);
    }
  };

  return (
    <div ref={containerRef} className={cn("relative w-full max-w-md", className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={t.common.searchPlaceholder}
          className="w-full rounded-lg border border-slate-200 bg-slate-100/70 py-2 pl-9 pr-14 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-surface focus:ring-2 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-violet-500 dark:focus:ring-violet-900/40"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-2xs font-medium text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-500">
          {t.common.searchShortcut}
        </kbd>
      </div>

      {open && query.trim() && (
        <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-slate-400">{t.common.noResults}</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map((r, idx) => {
                const copy = t.tools[r.tool.id];
                const Icon = r.tool.icon;
                return (
                  <li key={r.tool.id}>
                    <button
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => commit(r.tool.id)}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2.5 text-left transition",
                        idx === activeIndex ? "bg-violet-50 dark:bg-violet-500/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      )}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                          {copy.name}
                        </span>
                        <span className="block truncate text-xs text-slate-400">{copy.description}</span>
                      </span>
                      {idx === activeIndex && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-violet-400" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

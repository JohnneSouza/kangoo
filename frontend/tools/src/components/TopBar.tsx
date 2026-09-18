import { Menu, Moon, Sun, Terminal } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import { useI18n } from "../i18n/I18nContext";
import { localeNames, type Locale } from "../i18n/translations";
import { SearchBar } from "./SearchBar";

export function TopBar({
  onNavigate,
  onToggleSidebar,
  onSelectHome,
}: {
  onNavigate: (toolId: string) => void;
  onToggleSidebar: () => void;
  onSelectHome: () => void;
}) {
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useI18n();
  const [langOpen, setLangOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80 sm:px-6">
      <button
        onClick={onToggleSidebar}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <button onClick={onSelectHome} className="flex shrink-0 items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-sm">
          <Terminal className="h-4 w-4" />
        </span>
        <span className="hidden flex-col leading-none sm:flex">
          <span className="text-sm font-semibold text-slate-900 dark:text-white">{t.common.appName}</span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">{t.common.appTagline}</span>
        </span>
      </button>

      <div className="flex flex-1 justify-center px-2">
        <SearchBar onNavigate={onNavigate} />
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <div className="relative">
          <button
            onClick={() => setLangOpen((v) => !v)}
            onBlur={() => window.setTimeout(() => setLangOpen(false), 120)}
            className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {locale}
          </button>
          {langOpen && (
            <div className="absolute right-0 z-40 mt-1.5 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
              {(Object.keys(localeNames) as Locale[]).map((code) => (
                <button
                  key={code}
                  onMouseDown={() => setLocale(code)}
                  className={`block w-full px-3 py-2 text-left text-sm ${
                    code === locale
                      ? "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
                      : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  {localeNames[code]}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={toggleTheme}
          className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}

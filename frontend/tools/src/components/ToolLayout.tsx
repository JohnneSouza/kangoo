import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { useI18n } from "../i18n/I18nContext";

export function ToolLayout({
  categoryLabel,
  title,
  description,
  children,
  aside,
}: {
  categoryLabel: string;
  title: string;
  description: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8 lg:px-10">
      <nav className="mb-4 flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-500">
        <span>{t.common.appName}</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span>{categoryLabel}</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-600 dark:text-slate-300">{title}</span>
      </nav>
      <header className="mb-8 border-b border-slate-200 pb-6 dark:border-slate-800">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </header>
      <div className={aside ? "grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]" : "grid grid-cols-1 gap-8"}>
        <div className="min-w-0 animate-fade-in space-y-5">{children}</div>
        {aside && <aside className="animate-fade-in space-y-4 lg:sticky lg:top-20 lg:self-start">{aside}</aside>}
      </div>
    </div>
  );
}

export function AsideCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/60">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {title}
      </h3>
      <div className="space-y-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{children}</div>
    </div>
  );
}

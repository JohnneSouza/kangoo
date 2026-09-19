import { ArrowRight } from "lucide-react";
import { useI18n } from "../i18n/I18nContext";
import { categoryOrder, tools } from "../data/tools";

export function Home({ onNavigate }: { onNavigate: (toolId: string) => void }) {
  const { t } = useI18n();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12 lg:px-10">
      <div className="mb-12 max-w-2xl">
        <span className="mb-3 inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
          {tools.length} {t.common.toolCount}
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {t.common.homeTitle}
        </h1>
        <p className="mt-4 text-md leading-relaxed text-slate-500 dark:text-slate-400">{t.common.homeSubtitle}</p>
        <p className="mt-3 text-sm text-slate-400 dark:text-slate-500">{t.common.homeSearchHint}</p>
      </div>

      <div className="space-y-10">
        {categoryOrder.map((categoryId) => {
          const categoryTools = tools.filter((tool) => tool.categoryId === categoryId);
          return (
            <section key={categoryId}>
              <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                {t.categories[categoryId]}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryTools.map((tool) => {
                  const Icon = tool.icon;
                  const copy = t.tools[tool.id];
                  return (
                    <button
                      key={tool.id}
                      onClick={() => onNavigate(tool.id)}
                      className="group flex flex-col items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-700"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="flex-1">
                        <span className="flex items-center gap-1.5 text-md font-medium text-slate-800 dark:text-slate-100">
                          {copy.name}
                          <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                          {copy.description}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

import { LayoutGrid } from "lucide-react";
import { useI18n } from "../i18n/I18nContext";
import { categoryOrder, tools } from "../data/tools";
import { cn } from "../utils/cn";

export function Sidebar({
  activeToolId,
  onSelect,
  onClose,
}: {
  activeToolId: string | null;
  onSelect: (toolId: string | null) => void;
  onClose?: () => void;
}) {
  const { t } = useI18n();

  return (
    <nav className="flex h-full flex-col gap-6 overflow-y-auto px-4 py-6">
      <button
        onClick={() => {
          onSelect(null);
          onClose?.();
        }}
        className={cn(
          "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition",
          activeToolId === null
            ? "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
            : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        )}
      >
        <LayoutGrid className="h-4 w-4" />
        {t.common.home}
      </button>

      {categoryOrder.map((categoryId) => {
        const categoryTools = tools.filter((tool) => tool.categoryId === categoryId);
        return (
          <div key={categoryId}>
            <h3 className="mb-1.5 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t.categories[categoryId]}
            </h3>
            <ul className="space-y-0.5">
              {categoryTools.map((tool) => {
                const Icon = tool.icon;
                const isActive = tool.id === activeToolId;
                return (
                  <li key={tool.id}>
                    <button
                      onClick={() => {
                        onSelect(tool.id);
                        onClose?.();
                      }}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-left text-sm transition",
                        isActive
                          ? "bg-violet-50 font-medium text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
                          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      )}
                    >
                      <Icon className={cn("h-3.5 w-3.5 shrink-0", isActive ? "text-violet-500" : "text-slate-400")} />
                      <span className="truncate">{t.tools[tool.id].name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

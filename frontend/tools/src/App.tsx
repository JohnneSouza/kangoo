import { useEffect, useState } from "react";
import { ThemeProvider } from "./theme/ThemeContext";
import { I18nProvider, useI18n } from "./i18n/I18nContext";
import { TopBar } from "./components/TopBar";
import { Sidebar } from "./components/Sidebar";
import { Home } from "./components/Home";
import { ToolLayout, AsideCard } from "./components/ToolLayout";
import { getToolById } from "./data/tools";
import { X } from "lucide-react";

function getToolIdFromHash() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  return hash || null;
}

function AppShell() {
  const { t } = useI18n();
  const [activeToolId, setActiveToolId] = useState<string | null>(() => getToolIdFromHash());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    function handleHashChange() {
      setActiveToolId(getToolIdFromHash());
    }
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigate = (toolId: string | null) => {
    window.location.hash = toolId ? `/${toolId}` : "";
    setActiveToolId(toolId);
    setSidebarOpen(false);
    window.scrollTo({ top: 0 });
  };

  const activeTool = activeToolId ? getToolById(activeToolId) : null;
  const ToolComponent = activeTool?.component;

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <TopBar onNavigate={navigate} onToggleSidebar={() => setSidebarOpen(true)} onSelectHome={() => navigate(null)} />

      <div className="mx-auto flex w-full flex-1">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 lg:block">
          <Sidebar activeToolId={activeToolId} onSelect={navigate} />
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-slate-900/40" onClick={() => setSidebarOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl dark:bg-slate-950">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t.common.allTools}</span>
                <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <Sidebar activeToolId={activeToolId} onSelect={navigate} onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1">
          {activeTool && ToolComponent ? (
            <ToolLayout
              categoryLabel={t.categories[activeTool.categoryId]}
              title={t.tools[activeTool.id].name}
              description={t.tools[activeTool.id].description}
              aside={
                <>
                  <AsideCard title={t.common.about}>
                    <p>{t.tools[activeTool.id].description}</p>
                  </AsideCard>
                  <AsideCard title={t.common.tips}>
                    <p>{t.common.footerText}</p>
                  </AsideCard>
                </>
              }
            >
              <ToolComponent />
            </ToolLayout>
          ) : (
            <Home onNavigate={navigate} />
          )}

          <footer className="border-t border-slate-200 px-6 py-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500 lg:px-10">
            {t.common.footerText}
          </footer>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AppShell />
      </I18nProvider>
    </ThemeProvider>
  );
}

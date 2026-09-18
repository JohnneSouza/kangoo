import { useState } from "react";
import { HashRouter, Routes, Route, useParams, Link, useLocation } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import DocPage from "./components/DocPage";
import { getPageBySlug } from "./data/pages";

function PageRoute() {
  const { slug } = useParams();
  const page = slug ? getPageBySlug(slug) : undefined;

  if (!page) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-[64px]">🧭</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-2 text-slate-500">We couldn't find the docs page you were looking for.</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Back to docs home
        </Link>
      </div>
    );
  }

  return <DocPage page={page} />;
}

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen bg-white">
      <Topbar onMenuClick={() => setSidebarOpen((o) => !o)} />
      <div className="flex pt-14">
        {!isHome && <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />}
        {sidebarOpen && !isHome && (
          <div
            className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <main className="min-w-0 flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:slug" element={<PageRoute />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <HashRouter>
        <Layout />
      </HashRouter>
    </LanguageProvider>
  );
}

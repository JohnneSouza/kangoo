import { NavLink } from "react-router-dom";
import { getGroupedNav } from "../data/pages";
import { cn } from "../utils/cn";

interface SidebarProps {
  open: boolean;
  onNavigate?: () => void;
}

export default function Sidebar({ open, onNavigate }: SidebarProps) {
  const groups = getGroupedNav();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 shrink-0 transform border-r border-slate-200 bg-white pt-14 transition-transform duration-200 lg:static lg:z-0 lg:translate-x-0 lg:pt-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="h-full overflow-y-auto px-4 py-6 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)]">
        <nav className="space-y-6">
          {groups.map((g) => (
            <div key={g.group}>
              <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {g.group}
              </p>
              <ul className="mt-2 space-y-0.5">
                {g.pages.map((p) => (
                  <li key={p.slug}>
                    <NavLink
                      to={`/${p.slug}`}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        cn(
                          "block rounded-md px-2.5 py-1.5 text-[13.5px] font-medium transition",
                          isActive
                            ? "bg-violet-50 text-violet-700"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )
                      }
                    >
                      {p.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}

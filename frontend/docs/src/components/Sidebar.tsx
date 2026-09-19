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
        "fixed top-header bottom-0 left-0 z-50 w-drawer shrink-0 transform border-r border-line bg-surface transition-transform duration-200 lg:static lg:z-0 lg:w-sidebar lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="h-full overflow-y-auto px-4 py-6 lg:sticky lg:top-header lg:h-(--rail-height)">
        <nav className="space-y-6">
          {groups.map((g) => (
            <div key={g.group}>
              <p className="px-2 text-2xs font-semibold uppercase tracking-wider text-fg-subtle">
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
                          "block rounded-md px-2.5 py-1.5 text-sm font-medium transition",
                          isActive
                            ? "bg-brand-soft text-brand-soft-fg"
                            : "text-fg-body hover:bg-surface-hover hover:text-fg"
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

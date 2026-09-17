import { useThemeContext } from "../context/ThemeContext";

export default function Footer() {
  const { themeStyle } = useThemeContext();

  return (
    <footer className="border-t border-black/5 px-5 py-8 sm:px-8 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-sm text-slate-500 sm:flex-row dark:text-slate-400">
        <p>© {new Date().getFullYear()} Daniel Reyes. Built with React, TypeScript &amp; Tailwind CSS.</p>
        <p className="flex items-center gap-1.5">
          Theme mode:
          <span className="font-semibold text-accent">
            {themeStyle === "chess" ? "Chess ♞" : "Rubik's Cube 🧩"}
          </span>
        </p>
      </div>
    </footer>
  );
}

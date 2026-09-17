import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Mode = "light" | "dark";
export type ThemeStyle = "chess" | "rubik";

interface ThemeContextValue {
  mode: Mode;
  themeStyle: ThemeStyle;
  toggleMode: () => void;
  setThemeStyle: (style: ThemeStyle) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const MODE_KEY = "portfolio-mode";
const THEME_KEY = "portfolio-theme";

function getInitialMode(): Mode {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(MODE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getInitialTheme(): ThemeStyle {
  if (typeof window === "undefined") return "chess";
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "chess" || stored === "rubik") return stored;
  return "chess";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(getInitialMode);
  const [themeStyle, setThemeStyleState] = useState<ThemeStyle>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    window.localStorage.setItem(MODE_KEY, mode);
  }, [mode]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeStyle);
    window.localStorage.setItem(THEME_KEY, themeStyle);
  }, [themeStyle]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      themeStyle,
      toggleMode: () => setMode((m) => (m === "dark" ? "light" : "dark")),
      setThemeStyle: (style: ThemeStyle) => setThemeStyleState(style),
    }),
    [mode, themeStyle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext must be used within ThemeProvider");
  return ctx;
}

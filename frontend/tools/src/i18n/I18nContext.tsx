import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { type Locale, translations, type Translation } from "./translations";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translation;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "devtoolbox:locale";

function detectDefaultLocale(): Locale {
  if (typeof window === "undefined") return "en-US";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "en-US" || stored === "pt-BR") return stored;
  const nav = window.navigator.language?.toLowerCase() ?? "";
  if (nav.startsWith("pt")) return "pt-BR";
  return "en-US";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => detectDefaultLocale());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (next: Locale) => setLocaleState(next);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t: translations[locale] }),
    [locale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

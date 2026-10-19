"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { dict, type DictKey, type Lang } from "@/lib/i18n";

type Ctx = {
  lang: Lang;
  dir: "rtl" | "ltr";
  t: (key: DictKey) => string;
  setLang: (l: Lang) => void;
  toggle: () => void;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    const saved = (localStorage.getItem("mn-lang") as Lang) || "ar";
    setLangState(saved);
    applyDir(saved);
  }, []);

  const applyDir = (l: Lang) => {
    const dir = l === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", l);
    document.body.setAttribute("dir", dir);
  };

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("mn-lang", l);
    applyDir(l);
  }, []);

  const toggle = useCallback(() => setLang(lang === "ar" ? "en" : "ar"), [lang, setLang]);

  const t = useCallback((key: DictKey) => dict[key]?.[lang] ?? (key as string), [lang]);

  const value = useMemo(
    () => ({ lang, dir: lang === "ar" ? ("rtl" as const) : ("ltr" as const), t, setLang, toggle }),
    [lang, t, setLang, toggle]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang(): Ctx {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // SSR-safe fallback (Arabic default)
    return {
      lang: "ar",
      dir: "rtl",
      t: (key: DictKey) => dict[key]?.ar ?? (key as string),
      setLang: () => {},
      toggle: () => {},
    };
  }
  return ctx;
}

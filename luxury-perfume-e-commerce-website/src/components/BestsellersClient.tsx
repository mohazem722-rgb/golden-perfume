"use client";

import { Flame } from "lucide-react";
import { useLang } from "./LanguageProvider";

export function BestsellersHeader() {
  const { t } = useLang();
  return (
    <div className="text-center">
      <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.4em] text-[#c9a86a] uppercase">
        <Flame size={14} />
        {t("nav_best")}
      </span>
      <h1 className="text-gold-grad mt-3 text-3xl font-bold sm:text-5xl">{t("sec_best")}</h1>
      <p className="mt-3 text-sm text-[#8b8262]">{t("sec_best_sub")}</p>
    </div>
  );
}

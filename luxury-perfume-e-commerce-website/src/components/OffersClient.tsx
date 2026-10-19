"use client";

import { useState } from "react";
import { BadgePercent, Check, Copy, Timer } from "lucide-react";
import { useLang } from "./LanguageProvider";

export function OffersHeader() {
  const { t } = useLang();
  return (
    <div className="text-center">
      <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.4em] text-[#c9a86a] uppercase">
        <BadgePercent size={14} />
        MAISON NOIR
      </span>
      <h1 className="text-gold-grad mt-3 text-3xl font-bold sm:text-5xl">{t("offers_title")}</h1>
      <p className="mt-3 text-sm text-[#8b8262]">{t("offers_sub")}</p>
      <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#d4af37aa] px-5 py-2 text-xs font-semibold text-[#ffd700]">
        <Timer size={13} />
        {t("ends_in")}
      </p>
    </div>
  );
}

export function CouponCopyCard({ code, percent }: { code: string; percent: number }) {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="glass relative overflow-hidden rounded-2xl p-5">
      <div className="pointer-events-none absolute -top-10 -end-10 h-28 w-28 rounded-full bg-[#d4af3722] blur-2xl" />
      <span className="text-[10px] font-bold tracking-[0.3em] text-[#c9a86a] uppercase">{t("exclusive_coupon")}</span>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-2xl font-bold tracking-[0.15em] text-[#ffd700]">{code}</span>
        <span className="text-3xl font-bold text-[#f4ecd9]">{percent}%</span>
      </div>
      <button
        onClick={copy}
        className="btn-gold mt-4 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-xs font-bold"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? t("copied") : t("copy")}
      </button>
    </div>
  );
}

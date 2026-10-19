"use client";

import { useEffect, useState } from "react";
import { useLang } from "./LanguageProvider";
import { cn } from "@/lib/utils";

function nextMidnightSunday(): number {
  const d = new Date();
  const day = d.getDay();
  const add = (7 - day) % 7 || 7;
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate() + add, 23, 59, 59);
  return target.getTime();
}

export default function CountdownTimer({ compact = false, className }: { compact?: boolean; className?: string }) {
  const { t, lang } = useLang();
  const [target] = useState<number>(nextMidnightSunday);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = now ? Math.max(0, target - now) : 0;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  const fmt = (n: number) => (lang === "ar" ? n.toLocaleString("ar-EG") : String(n).padStart(2, "0"));

  const cells: [string, string][] = [
    [fmt(days), t("days")],
    [fmt(hours), t("hours")],
    [fmt(mins), t("mins")],
    [fmt(secs), t("secs")],
  ];

  return (
    <div className={cn("flex items-center gap-2", className)} dir="ltr" aria-label={t("ends_in")}>
      {cells.map(([val, label], idx) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className={cn(
              "glass flex flex-col items-center justify-center rounded-xl border-[#d4af3744]",
              compact ? "h-12 w-12" : "h-16 w-16 md:h-20 md:w-20"
            )}
          >
            <span className={cn("font-bold tabular-nums text-[#ffd700]", compact ? "text-base" : "text-xl md:text-3xl")}>
              {now ? val : "--"}
            </span>
            <span className={cn("text-[#8b8262] uppercase", compact ? "text-[7px]" : "text-[9px]")}>{label}</span>
          </div>
          {idx < 3 && <span className="text-[#d4af3766]">:</span>}
        </div>
      ))}
    </div>
  );
}

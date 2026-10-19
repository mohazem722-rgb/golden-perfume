"use client";

import { Check, Package, PackageCheck, Truck } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { cn } from "@/lib/utils";

const STAGES = ["preparing", "shipped", "delivered"] as const;

export default function OrderStepper({ status }: { status: string }) {
  const { t } = useLang();
  const activeIdx = Math.max(0, STAGES.indexOf(status as never));
  const icons = [Package, Truck, PackageCheck];
  const labels = [t("st_preparing"), t("st_shipped"), t("st_delivered")];

  return (
    <div className="flex items-center" dir={undefined}>
      {STAGES.map((s, i) => {
        const Icon = icons[i];
        const done = i < activeIdx;
        const current = i === activeIdx;
        return (
          <div key={s} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border transition-all",
                  done
                    ? "border-[#d4af37] bg-[#d4af37] text-black"
                    : current
                      ? "pulse-gold border-[#ffd700] bg-[#d4af3722] text-[#ffd700]"
                      : "border-[#4a4436] text-[#4a4436]"
                )}
              >
                {done ? <Check size={16} /> : <Icon size={16} />}
              </span>
              <span className={cn("text-[10px] font-semibold whitespace-nowrap", done || current ? "text-[#d4af37]" : "text-[#4a4436]")}>
                {labels[i]}
              </span>
            </div>
            {i < 2 && (
              <div className={cn("mx-1 mb-5 h-px flex-1 transition-colors", i < activeIdx ? "bg-[#d4af37]" : "bg-[#4a4436]")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

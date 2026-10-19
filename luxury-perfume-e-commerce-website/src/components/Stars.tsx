"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Stars({ value, size = 14, className }: { value: number; size?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`Rating ${value} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(value) ? "fill-[#d4af37] text-[#d4af37]" : "fill-transparent text-[#4a4436]"}
        />
      ))}
    </span>
  );
}

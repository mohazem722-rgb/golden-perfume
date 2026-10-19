import type { Lang } from "./i18n";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatEGP(value: number, lang: Lang = "ar"): string {
  const formatted = Math.round(value).toLocaleString(lang === "ar" ? "ar-EG" : "en-US");
  return lang === "ar" ? `${formatted} ج.م` : `EGP ${formatted}`;
}

export function discountedPrice(price: number, discount: number): number {
  if (!discount || discount <= 0) return price;
  return Math.round(price * (1 - discount / 100));
}

export function categoryLabel(cat: string, lang: Lang): string {
  const map: Record<string, { ar: string; en: string }> = {
    men: { ar: "رجالي", en: "Men" },
    women: { ar: "نسائي", en: "Women" },
    unisex: { ar: "للجنسين", en: "Unisex" },
    oriental: { ar: "شرقي وعود", en: "Oriental & Oud" },
    home: { ar: "عطور منزلية", en: "Home Scents" },
    gift: { ar: "أطقم هدايا", en: "Gift Sets" },
  };
  return map[cat]?.[lang] ?? cat;
}

export function slugifyOrderCode(uuidStr: string): string {
  return uuidStr.replace(/-/g, "").slice(0, 8).toUpperCase();
}

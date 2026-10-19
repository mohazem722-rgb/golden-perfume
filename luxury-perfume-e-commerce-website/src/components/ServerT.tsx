"use client";

import Link from "next/link";
import CountdownTimer from "./CountdownTimer";
import { SectionHeading } from "./HomeSections";
import { useLang } from "./LanguageProvider";
import { categoryLabel } from "@/lib/utils";

/** Client sprinkle components that render translated text inside server pages. */
export function HomeTranslations({ variant }: { variant: "offers" | "latest" | "best" }) {
  const { t } = useLang();
  if (variant === "offers")
    return <SectionHeading title={t("sec_offers")} sub={t("sec_offers_sub")} href="/offers" viewAll={t("view_all")} />;
  if (variant === "latest")
    return <SectionHeading title={t("sec_latest")} sub={t("sec_latest_sub")} href="/products" viewAll={t("view_all")} />;
  return <SectionHeading title={t("sec_best")} sub={t("sec_best_sub")} href="/bestsellers" viewAll={t("view_all")} />;
}

export function CategoriesTranslations({ variant, slug }: { variant: "heading" | "label" | "count"; slug?: string }) {
  const { t, lang } = useLang();
  if (variant === "heading") return <SectionHeading title={t("sec_categories")} sub={t("sec_categories_sub")} />;
  if (variant === "label" && slug) return <span>{categoryLabel(slug, lang)}</span>;
  return <span>{t("products_count")}</span>;
}

export function BannerTranslations() {
  const { t } = useLang();
  return (
    <div className="relative z-10 flex flex-col items-center gap-6">
      <span className="text-[11px] font-bold tracking-[0.4em] text-[#c9a86a] uppercase">{t("sec_offers")}</span>
      <h3 className="text-gold-grad text-3xl font-bold sm:text-4xl">{t("ends_in")}</h3>
      <CountdownTimer />
      <Link href="/offers" className="btn-gold rounded-full px-8 py-3.5 text-sm font-bold">
        {t("nav_offers")}
      </Link>
    </div>
  );
}

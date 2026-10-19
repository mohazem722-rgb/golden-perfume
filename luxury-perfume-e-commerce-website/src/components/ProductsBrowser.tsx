"use client";

import { useMemo, useState } from "react";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { useLang } from "./LanguageProvider";
import ProductCard, { type ProductLite } from "./ProductCard";
import Reveal from "./Reveal";
import { cn, categoryLabel, discountedPrice, formatEGP } from "@/lib/utils";

const SIZES = ["50ml", "70ml", "75ml", "80ml", "90ml", "100ml", "Tola"];

export default function ProductsBrowser({
  catalog,
  initialQ = "",
  initialCategory = "all",
}: {
  catalog: ProductLite[];
  initialQ?: string;
  initialCategory?: string;
}) {
  const { t, lang } = useLang();
  const [q, setQ] = useState(initialQ);
  const [category, setCategory] = useState(initialCategory);
  const [brand, setBrand] = useState("all");
  const [size, setSize] = useState("all");
  const [maxPrice, setMaxPrice] = useState(() => Math.max(...catalog.map((p) => discountedPrice(p.price, p.discount)), 7000));
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const brands = useMemo(() => [...new Set(catalog.map((p) => p.brand))].sort(), [catalog]);
  const priceCap = useMemo(() => Math.max(...catalog.map((p) => discountedPrice(p.price, p.discount)), 7000), [catalog]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = catalog.filter((p) => {
      const final = discountedPrice(p.price, p.discount);
      if (category !== "all" && p.category !== category) return false;
      if (brand !== "all" && p.brand !== brand) return false;
      if (size !== "all" && p.size !== size) return false;
      if (final > maxPrice) return false;
      if (query) {
        const hay = `${p.nameAr} ${p.nameEn} ${p.brand} ${p.category}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });
    switch (sort) {
      case "price_low":
        list = [...list].sort((a, b) => discountedPrice(a.price, a.discount) - discountedPrice(b.price, b.discount));
        break;
      case "price_high":
        list = [...list].sort((a, b) => discountedPrice(b.price, b.discount) - discountedPrice(a.price, a.discount));
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case "bestseller":
        list = [...list].sort((a, b) => (b.sales ?? 0) - (a.sales ?? 0));
        break;
      default:
        list = [...list].sort((a, b) => b.discount - a.discount);
    }
    return list;
  }, [catalog, q, category, brand, size, maxPrice, sort]);

  const clearFilters = () => {
    setCategory("all");
    setBrand("all");
    setSize("all");
    setMaxPrice(priceCap);
    setQ("");
  };

  const categories = ["all", "men", "women", "unisex", "oriental", "home", "gift"];

  const filterBody = (
    <div className="space-y-7">
      {/* Search (mirrors top) */}
      <div>
        <h3 className="mb-3 text-xs font-bold tracking-[0.25em] text-[#c9a86a] uppercase">{t("filter_type")}</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-semibold transition",
                category === c ? "btn-gold" : "glass text-[#cfc6ab] hover:border-[#d4af37]"
              )}
            >
              {c === "all" ? t("filter_all") : categoryLabel(c, lang)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-bold tracking-[0.25em] text-[#c9a86a] uppercase">{t("filter_price")}</h3>
        <input
          type="range"
          min={100}
          max={priceCap}
          step={50}
          value={maxPrice}
          onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
          className="gold-range w-full"
          aria-label={t("filter_price")}
        />
        <div className="mt-1 flex justify-between text-[11px] text-[#8b8262]">
          <span>{t("up_to")}</span>
          <span className="font-bold text-[#ffd700]">{formatEGP(maxPrice, lang)}</span>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-bold tracking-[0.25em] text-[#c9a86a] uppercase">{t("filter_brand")}</h3>
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="glass w-full rounded-xl px-4 py-2.5 text-sm text-[#f4ecd9] focus:border-[#d4af37] focus:outline-none"
        >
          <option value="all">{t("filter_all")}</option>
          {brands.map((b) => (
            <option key={b} value={b} className="bg-[#0a1931]">
              {b}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-bold tracking-[0.25em] text-[#c9a86a] uppercase">{t("filter_size")}</h3>
        <div className="flex flex-wrap gap-2">
          {["all", ...SIZES].map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition",
                size === s ? "btn-gold" : "glass text-[#cfc6ab] hover:border-[#d4af37]"
              )}
            >
              {s === "all" ? t("filter_all") : s}
            </button>
          ))}
        </div>
      </div>

      <button onClick={clearFilters} className="w-full rounded-full border border-[#c9a86a44] py-2.5 text-xs font-bold text-[#c9a86a] transition hover:bg-[#d4af3722]">
        {t("filter_clear")}
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-20 md:px-6">
      {/* header */}
      <div className="mb-8">
        <span className="text-[11px] font-bold tracking-[0.4em] text-[#c9a86a] uppercase">MAISON NOIR</span>
        <h1 className="mt-2 text-3xl font-bold text-[#f4ecd9] sm:text-4xl">
          {initialCategory !== "all" ? categoryLabel(initialCategory, lang) : t("nav_products")}
        </h1>
      </div>

      {/* search + sort bar */}
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="glass flex flex-1 items-center gap-2 rounded-full px-4 py-1">
          <Search size={16} className="shrink-0 text-[#8b8262]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search_placeholder")}
            className="w-full bg-transparent py-2.5 text-sm text-[#f4ecd9] placeholder-[#8b8262] focus:outline-none"
            aria-label={t("search_placeholder")}
          />
          {q && (
            <button onClick={() => setQ("")} aria-label="clear">
              <X size={14} className="text-[#8b8262]" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFiltersOpen(true)}
            className="glass flex items-center gap-2 rounded-full px-4 py-2.5 text-sm text-[#cfc6ab] lg:hidden"
          >
            <Filter size={15} /> {t("filters")}
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="glass rounded-full px-4 py-2.5 text-sm text-[#f4ecd9] focus:border-[#d4af37] focus:outline-none"
            aria-label="sort"
          >
            <option value="featured" className="bg-[#0a1931]">{t("sort_featured")}</option>
            <option value="bestseller" className="bg-[#0a1931]">{t("sort_bestseller")}</option>
            <option value="price_low" className="bg-[#0a1931]">{t("sort_price_low")}</option>
            <option value="price_high" className="bg-[#0a1931]">{t("sort_price_high")}</option>
            <option value="rating" className="bg-[#0a1931]">{t("sort_rating")}</option>
          </select>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
        {/* sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <h2 className="mb-5 flex items-center gap-2 text-sm font-bold text-[#f4ecd9]">
              <SlidersHorizontal size={15} className="text-[#d4af37]" /> {t("filters")}
            </h2>
            {filterBody}
          </div>
        </aside>

        {/* grid */}
        <div>
          <p className="mb-4 text-xs text-[#8b8262]">
            {filtered.length} {t("products_count")}
          </p>
          {filtered.length === 0 ? (
            <div className="glass flex h-72 flex-col items-center justify-center rounded-3xl text-center">
              <Search size={36} className="mb-3 text-[#4a4436]" />
              <p className="text-sm text-[#8b8262]">{t("no_results")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-3">
              {filtered.map((p, i) => (
                <Reveal key={p.id} delay={Math.min(i, 8) * 50}>
                  <ProductCard p={p} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* mobile filter sheet */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setFiltersOpen(false)} />
          <div className="glass-strong absolute inset-y-0 end-0 w-[85%] max-w-sm overflow-y-auto p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-base font-bold text-[#f4ecd9]">{t("filters")}</h2>
              <button onClick={() => setFiltersOpen(false)} className="gold-border rounded-full p-2 text-[#c9a86a]" aria-label="close">
                <X size={16} />
              </button>
            </div>
            {filterBody}
          </div>
        </div>
      )}
    </div>
  );
}

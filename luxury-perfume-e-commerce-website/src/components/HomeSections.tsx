"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingBag, Sparkles } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { useCart } from "./CartProvider";
import ProductCard, { type ProductLite } from "./ProductCard";
import Stars from "./Stars";
import { cn, discountedPrice, formatEGP } from "@/lib/utils";

/* ---------------- Offers Slider ---------------- */
export function OffersSlider({ offers }: { offers: ProductLite[] }) {
  const { t, lang } = useLang();
  const { add } = useCart();
  const [idx, setIdx] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval>>(null);
  const count = offers.length;

  const go = useCallback(
    (i: number) => setIdx(((i % count) + count) % count),
    [count]
  );

  const restart = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    if (count > 1) timer.current = setInterval(() => setIdx((i) => (i + 1) % count), 5000);
  }, [count]);

  useEffect(() => {
    restart();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [restart]);

  if (!count) return null;

  return (
    <div
      className="group/slider relative overflow-hidden rounded-3xl border border-[#c9a86a33]"
      onMouseEnter={() => timer.current && clearInterval(timer.current)}
      onMouseLeave={restart}
    >
      <div
        className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
        style={{ transform: `translateX(${lang === "ar" ? idx * 100 : -idx * 100}%)` }}
      >
        {offers.map((p) => {
          const final = discountedPrice(p.price, p.discount);
          return (
            <div key={p.id} className="relative h-[380px] w-full shrink-0 sm:h-[440px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.imageUrl} alt="" className="ken-burns absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050507f2] via-[#050507aa] to-transparent rtl:bg-gradient-to-l" />
              <div className="relative z-10 flex h-full max-w-2xl flex-col justify-center gap-4 px-6 sm:px-12">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d4af37aa] bg-black/50 px-4 py-1.5 text-[11px] font-bold tracking-widest text-[#ffd700] backdrop-blur">
                  <Sparkles size={13} />
                  {t("off_label")} {p.discount}%
                </span>
                <span className="text-xs font-semibold tracking-[0.3em] text-[#c9a86a] uppercase">{p.brand}</span>
                <h3 className="text-3xl font-bold text-[#f4ecd9] sm:text-5xl">{lang === "ar" ? p.nameAr : p.nameEn}</h3>
                <div className="flex items-center gap-3">
                  <Stars value={p.rating} size={15} />
                  <span className="text-xs text-[#8b8262]">· {p.size}</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-[#ffd700]">{formatEGP(final, lang)}</span>
                  <span className="text-sm text-[#8b8262] line-through">{formatEGP(p.price, lang)}</span>
                </div>
                <div className="mt-2 flex gap-3">
                  <Link href={`/product/${p.id}`} className="btn-gold rounded-full px-6 py-3 text-sm font-bold">
                    {t("view_all")}
                  </Link>
                  <button
                    onClick={() =>
                      add({
                        productId: p.id,
                        nameAr: p.nameAr,
                        nameEn: p.nameEn,
                        brand: p.brand,
                        size: p.size,
                        price: p.price,
                        discount: p.discount,
                        imageUrl: p.imageUrl,
                      })
                    }
                    className="glass flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[#f4ecd9] hover:border-[#d4af37]"
                  >
                    <ShoppingBag size={15} />
                    {t("add_to_cart")}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* arrows */}
      <button
        onClick={() => { go(idx - 1); restart(); }}
        aria-label="Previous"
        className="glass absolute top-1/2 start-4 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-[#d4af37] opacity-0 transition group-hover/slider:opacity-100 hover:bg-[#d4af3722] sm:flex"
      >
        <ChevronLeft size={20} className="rtl:rotate-180" />
      </button>
      <button
        onClick={() => { go(idx + 1); restart(); }}
        aria-label="Next"
        className="glass absolute top-1/2 end-4 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-[#d4af37] opacity-0 transition group-hover/slider:opacity-100 hover:bg-[#d4af3722] sm:flex"
      >
        <ChevronRight size={20} className="rtl:rotate-180" />
      </button>

      {/* dots */}
      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2" dir="ltr">
        {offers.map((_, i) => (
          <button
            key={i}
            onClick={() => { go(i); restart(); }}
            aria-label={`Slide ${i + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              i === idx ? "w-8 bg-[#ffd700]" : "w-3 bg-[#c9a86a55] hover:bg-[#c9a86a]"
            )}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------- Latest Carousel ---------------- */
export function LatestCarousel({ items }: { items: ProductLite[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => {
    ref.current?.scrollBy({ left: dir * 520 * -1, behavior: "smooth" });
  };
  return (
    <div className="relative">
      <div ref={ref} className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2">
        {items.map((p) => (
          <div key={p.id} className="w-[240px] shrink-0 snap-start sm:w-[264px]">
            <ProductCard p={p} />
          </div>
        ))}
      </div>
      <button onClick={() => scroll(1)} aria-label="prev" className="glass absolute top-1/2 -start-4 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-[#d4af37] hover:bg-[#d4af3722] md:flex">
        <ChevronRight size={20} className="rtl:rotate-180" />
      </button>
      <button onClick={() => scroll(-1)} aria-label="next" className="glass absolute top-1/2 -end-4 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-[#d4af37] hover:bg-[#d4af3722] md:flex">
        <ChevronLeft size={20} className="rtl:rotate-180" />
      </button>
    </div>
  );
}

/* ---------------- Section Heading ---------------- */
export function SectionHeading({ title, sub, href, viewAll }: { title: string; sub?: string; href?: string; viewAll?: string }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-[#f4ecd9] sm:text-3xl">{title}</h2>
        {sub && <p className="mt-1.5 text-sm text-[#8b8262]">{sub}</p>}
      </div>
      {href && (
        <Link href={href} className="gold-border shrink-0 rounded-full px-5 py-2 text-xs font-bold text-[#d4af37] transition hover:bg-[#d4af3722]">
          {viewAll}
        </Link>
      )}
    </div>
  );
}

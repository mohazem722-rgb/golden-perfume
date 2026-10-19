"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Heart, ShoppingBag } from "lucide-react";
import Stars from "./Stars";
import { useCart } from "./CartProvider";
import { useLang } from "./LanguageProvider";
import { cn, discountedPrice, formatEGP } from "@/lib/utils";

export type ProductLite = {
  id: number;
  nameAr: string;
  nameEn: string;
  brand: string;
  size: string;
  price: number;
  discount: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  category: string;
  stock: number;
  sales?: number;
  isNew?: boolean;
};

export default function ProductCard({ p, bestBadge }: { p: ProductLite; bestBadge?: boolean }) {
  const { add, wishlist, toggleWish } = useCart();
  const { t, lang } = useLang();
  const [added, setAdded] = useState(false);
  const final = discountedPrice(p.price, p.discount);
  const wished = wishlist.includes(p.id);

  const onAdd = () => {
    add({
      productId: p.id,
      nameAr: p.nameAr,
      nameEn: p.nameEn,
      brand: p.brand,
      size: p.size,
      price: p.price,
      discount: p.discount,
      imageUrl: p.imageUrl,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="product-text group glass relative flex flex-col overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1.5 hover:border-[#d4af3780] hover:shadow-[0_25px_60px_-20px_rgba(212,175,55,0.35)]">
      {/* image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <Link href={`/product/${p.id}`} aria-label={lang === "ar" ? p.nameAr : p.nameEn}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.imageUrl}
            alt={lang === "ar" ? p.nameAr : p.nameEn}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507cc] via-transparent to-transparent" />
        {/* badges */}
        <div className={cn("absolute top-3 flex flex-col gap-2", "start-3")}>
          {p.discount > 0 && (
            <span className="rounded-full bg-[#d4af37] px-2.5 py-1 text-[10px] font-bold text-black shadow-lg">
              -{p.discount}%
            </span>
          )}
          {p.isNew && (
            <span className="rounded-full bg-[#0a1931] px-2.5 py-1 text-[10px] font-bold text-[#7fb3ff] ltr:border rtl:border-0">
              NEW
            </span>
          )}
        </div>
        {bestBadge && (
          <div className="absolute top-0 end-0 overflow-hidden">
            <span className="mt-2.5 inline-block -translate-x-1/4 rotate-45 bg-gradient-to-r from-[#8a6d3b] via-[#d4af37] to-[#ffd700] px-8 py-0.5 text-[9px] font-bold text-black shadow-lg rtl:translate-x-1/4 rtl:-rotate-45">
              {t("nav_best")}
            </span>
          </div>
        )}
        <button
          onClick={() => toggleWish(p.id)}
          aria-label="Wishlist"
          className="glass absolute bottom-3 end-3 flex h-9 w-9 items-center justify-center rounded-full text-[#f4ecd9] transition hover:scale-110"
        >
          <Heart size={15} className={wished ? "fill-[#ff5f6d] text-[#ff5f6d]" : ""} />
        </button>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-[10px] font-semibold tracking-[0.25em] text-[#8b8262] uppercase">{p.brand}</span>
        <Link href={`/product/${p.id}`} className="line-clamp-1 text-[15px] font-bold text-[#f4ecd9] transition hover:text-[#ffd700]">
          {lang === "ar" ? p.nameAr : p.nameEn}
        </Link>
        <div className="flex items-center gap-2">
          <Stars value={p.rating} size={12} />
          <span className="text-[10px] text-[#8b8262]">({p.reviewsCount})</span>
        </div>
        <span className="text-[11px] text-[#8b8262]">{p.size}</span>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-lg font-bold text-[#ffd700]">{formatEGP(final, lang)}</span>
          {p.discount > 0 && (
            <span className="text-[11px] text-[#8b8262] line-through">{formatEGP(p.price, lang)}</span>
          )}
        </div>
        <button
          onClick={onAdd}
          disabled={p.stock <= 0}
          className={cn(
            "mt-2 flex items-center justify-center gap-2 rounded-full py-2.5 text-[13px] font-bold transition active:scale-95",
            p.stock <= 0 ? "cursor-not-allowed bg-[#2a2a30] text-[#6a6455]" : added ? "bg-[#1fa855] text-white" : "btn-gold"
          )}
        >
          {added ? <CheckCircle2 size={15} /> : <ShoppingBag size={15} />}
          {p.stock <= 0 ? t("out_of_stock") : added ? t("added") : t("add_to_cart")}
        </button>
      </div>
    </article>
  );
}

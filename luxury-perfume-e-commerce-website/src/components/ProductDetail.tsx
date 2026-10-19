"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Heart, Minus, Plus, Send, ShoppingBag, X } from "lucide-react";
import Stars from "./Stars";
import Reveal from "./Reveal";
import ProductCard, { type ProductLite } from "./ProductCard";
import { useCart } from "./CartProvider";
import { useLang } from "./LanguageProvider";
import { cn, categoryLabel, discountedPrice, formatEGP } from "@/lib/utils";

type ReviewRow = { id: number; customerName: string; rating: number; comment: string; createdAt: string };

export default function ProductDetail({
  product,
  related,
}: {
  product: ProductLite & { descriptionAr: string; descriptionEn: string };
  related: ProductLite[];
}) {
  const { t, lang } = useLang();
  const { add, wishlist, toggleWish } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [zoomPos, setZoomPos] = useState<string>("50% 50%");
  const [zooming, setZooming] = useState(false);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);

  const final = discountedPrice(product.price, product.discount);
  const wished = wishlist.includes(product.id);

  useEffect(() => {
    fetch(`/api/reviews?productId=${product.id}`)
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews || []))
      .catch(() => {});
  }, [product.id]);

  const onAdd = () => {
    add(
      {
        productId: product.id,
        nameAr: product.nameAr,
        nameEn: product.nameEn,
        brand: product.brand,
        size: product.size,
        price: product.price,
        discount: product.discount,
        imageUrl: product.imageUrl,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, rating, name, comment }),
    });
    if (res.ok) {
      setSent(true);
      setReviews((prev) => [
        { id: Date.now(), customerName: name, rating, comment, createdAt: new Date().toISOString() },
        ...prev,
      ]);
      setComment("");
    }
  };

  return (
    <div className="product-text mx-auto max-w-7xl px-4 pt-24 pb-24 md:px-6 md:pt-28">
      {/* breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-xs text-[#8b8262]">
        <Link href="/" className="hover:text-[#ffd700]">{t("nav_home")}</Link>
        <ChevronRight size={12} className="rtl:rotate-180" />
        <Link href="/products" className="hover:text-[#ffd700]">{t("nav_products")}</Link>
        <ChevronRight size={12} className="rtl:rotate-180" />
        <span className="text-[#c9a86a]">{lang === "ar" ? product.nameAr : product.nameEn}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* gallery */}
        <Reveal>
          <div
            className="group relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-3xl border border-[#c9a86a33]"
            onClick={() => setLightbox(true)}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setZoomPos(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
            }}
            onMouseEnter={() => setZooming(true)}
            onMouseLeave={() => setZooming(false)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.imageUrl}
              alt={lang === "ar" ? product.nameAr : product.nameEn}
              className="h-full w-full object-cover transition-transform duration-300"
              style={{ transform: zooming ? "scale(1.8)" : "scale(1)", transformOrigin: zoomPos }}
            />
            {product.discount > 0 && (
              <span className="absolute top-4 start-4 rounded-full bg-[#d4af37] px-3 py-1.5 text-xs font-bold text-black">
                -{product.discount}%
              </span>
            )}
            <span className="glass absolute bottom-4 start-4 rounded-full px-4 py-1.5 text-[11px] text-[#cfc6ab]">
              {t("click_zoom")}
            </span>
          </div>
        </Reveal>

        {/* info */}
        <Reveal delay={120}>
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold tracking-[0.35em] text-[#c9a86a] uppercase">{product.brand}</span>
            <h1 className="text-3xl font-bold text-[#f4ecd9] sm:text-4xl">
              {lang === "ar" ? product.nameAr : product.nameEn}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#8b8262]">
              <Stars value={product.rating} size={16} />
              <span>
                {product.rating.toFixed(1)} · {product.reviewsCount} {t("reviews_label")}
              </span>
              <span className="gold-border rounded-full px-3 py-1 text-[11px] text-[#d4af37]">
                {t("size_label")}: {product.size}
              </span>
              <span className="gold-border rounded-full px-3 py-1 text-[11px] text-[#d4af37]">
                {categoryLabel(product.category, lang)}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-[#ffd700]">{formatEGP(final, lang)}</span>
              {product.discount > 0 && (
                <span className="text-lg text-[#8b8262] line-through">{formatEGP(product.price, lang)}</span>
              )}
            </div>

            <p className={cn(
              "text-sm font-semibold",
              product.stock > 0 ? "text-emerald-400" : "text-red-400"
            )}>
              {t("availability")}: {product.stock > 0 ? `${t("in_stock")} (${product.stock.toLocaleString(lang === "ar" ? "ar-EG" : "en-US")})` : t("out_of_stock")}
            </p>

            <div className="divider-gold" />

            <div>
              <h2 className="mb-2 text-sm font-bold tracking-widest text-[#c9a86a] uppercase">{t("description")}</h2>
              <p className="text-sm leading-relaxed text-[#cfc6ab]">
                {lang === "ar" ? product.descriptionAr : product.descriptionEn}
              </p>
            </div>

            <div className="divider-gold" />

            {/* qty + add */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="gold-border flex items-center gap-1 rounded-full p-1">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="rounded-full p-2.5 text-[#c9a86a] hover:bg-[#d4af3722]" aria-label="minus">
                  <Minus size={15} />
                </button>
                <span className="w-10 text-center text-base font-bold">{qty.toLocaleString(lang === "ar" ? "ar-EG" : "en-US")}</span>
                <button onClick={() => setQty(Math.min(20, qty + 1))} className="rounded-full p-2.5 text-[#c9a86a] hover:bg-[#d4af3722]" aria-label="plus">
                  <Plus size={15} />
                </button>
              </div>
              <button
                onClick={onAdd}
                disabled={product.stock <= 0}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-full py-4 text-sm font-bold transition active:scale-[0.98] sm:flex-none sm:px-12",
                  product.stock <= 0 ? "cursor-not-allowed bg-[#2a2a30] text-[#6a6455]" : added ? "bg-[#1fa855] text-white" : "btn-gold"
                )}
              >
                {added ? <CheckCircle2 size={17} /> : <ShoppingBag size={17} />}
                {product.stock <= 0 ? t("out_of_stock") : added ? t("added") : t("add_to_cart")}
              </button>
              <button
                onClick={() => toggleWish(product.id)}
                className="gold-border flex h-13 w-13 items-center justify-center rounded-full p-4 text-[#c9a86a] hover:bg-[#d4af3722]"
                aria-label="wishlist"
              >
                <Heart size={18} className={wished ? "fill-[#ff5f6d] text-[#ff5f6d]" : ""} />
              </button>
            </div>
          </div>
        </Reveal>
      </div>

      {/* reviews */}
      <section className="mt-20 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="mb-6 text-xl font-bold text-[#f4ecd9]">
            {t("reviews_label")} ({reviews.length.toLocaleString(lang === "ar" ? "ar-EG" : "en-US")})
          </h2>
          <div className="space-y-4">
            {reviews.length === 0 && <p className="text-sm text-[#8b8262]">{t("write_review")}…</p>}
            {reviews.map((r) => (
              <Reveal key={r.id}>
                <article className="glass rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#f4ecd9]">{r.customerName}</span>
                    <span className="text-[10px] text-[#8b8262]">
                      {new Date(r.createdAt).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB")}
                    </span>
                  </div>
                  <Stars value={r.rating} size={13} className="my-2" />
                  <p className="text-sm leading-relaxed text-[#cfc6ab]">{r.comment}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        {/* add review */}
        <Reveal delay={100}>
          <form onSubmit={submitReview} className="glass sticky top-24 space-y-4 rounded-3xl p-6">
            <h3 className="text-base font-bold text-[#f4ecd9]">{t("write_review")}</h3>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <button key={i} type="button" onClick={() => setRating(i)} aria-label={`${i} stars`}>
                  <Stars value={i <= rating ? i : 0} size={0} className="hidden" />
                  <span className={cn("text-2xl transition", i <= rating ? "text-[#ffd700]" : "text-[#4a4436]")}>★</span>
                </button>
              ))}
            </div>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("your_name")}
              className="glass w-full rounded-xl px-4 py-3 text-sm text-[#f4ecd9] placeholder-[#8b8262] focus:border-[#d4af37] focus:outline-none"
            />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder={t("your_comment")}
              className="glass w-full resize-none rounded-xl px-4 py-3 text-sm text-[#f4ecd9] placeholder-[#8b8262] focus:border-[#d4af37] focus:outline-none"
            />
            {sent && <p className="text-xs font-semibold text-emerald-400">{t("review_thanks")}</p>}
            <button className="btn-gold flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-bold">
              <Send size={14} />
              {t("submit_review")}
            </button>
          </form>
        </Reveal>
      </section>

      {/* related */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 text-xl font-bold text-[#f4ecd9]">{t("related")}</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <ProductCard p={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* sticky add-to-cart (mobile) */}
      <div className="glass-strong fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-[#c9a86a33] px-4 py-3 sm:hidden">
        <div className="flex-1">
          <span className="block text-[10px] text-[#8b8262]">{product.brand}</span>
          <span className="text-base font-bold text-[#ffd700]">{formatEGP(final, lang)}</span>
        </div>
        <button
          onClick={onAdd}
          disabled={product.stock <= 0}
          className={cn("rounded-full px-6 py-3 text-sm font-bold", product.stock <= 0 ? "bg-[#2a2a30] text-[#6a6455]" : "btn-gold")}
        >
          {t("add_to_cart")}
        </button>
      </div>

      {/* lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/95 p-4" onClick={() => setLightbox(false)}>
          <button className="gold-border absolute top-5 end-5 rounded-full p-2.5 text-[#d4af37]" aria-label="close">
            <X size={20} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={lang === "ar" ? product.nameAr : product.nameEn}
            className="max-h-[90vh] max-w-full rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

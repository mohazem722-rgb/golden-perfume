"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "./CartProvider";
import { useLang } from "./LanguageProvider";
import { cn, formatEGP } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, closeCart, setQty, remove, subtotal } = useCart();
  const { t, lang, dir } = useLang();

  return (
    <>
      {/* overlay */}
      <div
        onClick={closeCart}
        className={cn(
          "fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      {/* panel */}
      <aside
        className={cn(
          "glass-strong fixed top-0 z-[70] flex h-full w-full max-w-md flex-col shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
          dir === "rtl" ? "left-0" : "right-0",
          isOpen ? "translate-x-0" : dir === "rtl" ? "-translate-x-full" : "translate-x-full"
        )}
        role="dialog"
        aria-label={t("cart_title")}
      >
        <header className="flex items-center justify-between border-b border-[#c9a86a33] px-5 py-4">
          <h2 className="flex items-center gap-2 text-base font-bold text-[#f4ecd9]">
            <ShoppingBag size={18} className="text-[#d4af37]" />
            {t("cart_title")}
          </h2>
          <button onClick={closeCart} className="gold-border rounded-full p-2 text-[#c9a86a] hover:bg-[#d4af3722]" aria-label="Close">
            <X size={16} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <ShoppingBag size={44} className="text-[#4a4436]" />
              <p className="text-sm text-[#8b8262]">{t("cart_empty")}</p>
              <Link href="/products" onClick={closeCart} className="btn-gold rounded-full px-6 py-2.5 text-sm">
                {t("cart_empty_cta")}
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((i) => {
                const unit = Math.round(i.price * (1 - i.discount / 100));
                return (
                  <li key={i.productId} className="glass flex gap-3 rounded-2xl p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={i.imageUrl} alt="" className="h-20 w-16 shrink-0 rounded-xl object-cover" loading="lazy" />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/product/${i.productId}`} onClick={closeCart} className="truncate text-sm font-semibold text-[#f4ecd9] hover:text-[#ffd700]">
                          {lang === "ar" ? i.nameAr : i.nameEn}
                        </Link>
                        <button onClick={() => remove(i.productId)} className="text-[#8b8262] hover:text-red-400" aria-label={t("a_delete")}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <span className="text-[11px] text-[#8b8262]">
                        {i.brand} · {i.size}
                      </span>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="gold-border flex items-center rounded-full">
                          <button onClick={() => setQty(i.productId, i.qty - 1)} className="p-1.5 text-[#c9a86a]" aria-label="decrease">
                            <Minus size={12} />
                          </button>
                          <span className="w-7 text-center text-xs font-bold">{i.qty}</span>
                          <button onClick={() => setQty(i.productId, i.qty + 1)} className="p-1.5 text-[#c9a86a]" aria-label="increase">
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-[#d4af37]">{formatEGP(unit * i.qty, lang)}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-[#c9a86a33] px-5 py-4">
            <div className="flex items-center justify-between pb-3">
              <span className="text-sm text-[#cfc6ab]">{t("subtotal")}</span>
              <span className="text-lg font-bold text-[#ffd700]">{formatEGP(subtotal, lang)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/cart" onClick={closeCart} className="glass rounded-full py-3 text-center text-sm font-semibold text-[#f4ecd9] hover:border-[#d4af37]">
                {t("nav_cart")}
              </Link>
              <Link href="/checkout" onClick={closeCart} className="btn-gold rounded-full py-3 text-center text-sm font-bold">
                {t("checkout")}
              </Link>
            </div>
          </footer>
        )}
      </aside>
    </>
  );
}

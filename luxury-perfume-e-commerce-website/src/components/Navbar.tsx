"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useLang } from "./LanguageProvider";
import { useCart } from "./CartProvider";
import { cn } from "@/lib/utils";
import type { DictKey } from "@/lib/i18n";

const NAV: { href: string; key: DictKey }[] = [
  { href: "/", key: "nav_home" },
  { href: "/products", key: "nav_products" },
  { href: "/offers", key: "nav_offers" },
  { href: "/bestsellers", key: "nav_best" },
  { href: "/about", key: "nav_about" },
  { href: "/faq", key: "nav_faq" },
  { href: "/contact", key: "nav_contact" },
];

type Suggestion = { id: number; nameAr: string; nameEn: string; price: number; discount: number; imageUrl: string };

export default function Navbar() {
  const { t, lang, toggle, dir } = useLang();
  const { count, openCart, wishlist } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sugs, setSugs] = useState<Suggestion[]>([]);
  const [showSug, setShowSug] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const onQuery = (val: string) => {
    setQ(val);
    if (debounce.current) clearTimeout(debounce.current);
    if (val.trim().length < 2) {
      setSugs([]);
      setShowSug(false);
      return;
    }
    debounce.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(val)}&limit=5`);
        const data = await res.json();
        setSugs(data.products || []);
        setShowSug(true);
      } catch {
        setSugs([]);
      }
    }, 220);
  };

  const submitSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    setShowSug(false);
    if (q.trim()) router.push(`/products?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "glass-strong shadow-[0_10px_40px_-15px_rgba(0,0,0,0.8)]" : "bg-gradient-to-b from-black/70 to-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:h-[72px] md:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5" aria-label={t("brand")}>
            <svg width="34" height="34" viewBox="0 0 40 40" className="shrink-0" aria-hidden="true">
              <defs>
                <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#8a6d3b" />
                  <stop offset="50%" stopColor="#ffd700" />
                  <stop offset="100%" stopColor="#c9a86a" />
                </linearGradient>
              </defs>
              <polygon points="20,3 35,11.5 35,28.5 20,37 5,28.5 5,11.5" fill="none" stroke="url(#lg)" strokeWidth="2" />
              <polygon points="20,9 29.5,14.5 29.5,25.5 20,31 10.5,25.5 10.5,14.5" fill="rgba(212,175,55,0.15)" stroke="url(#lg)" strokeWidth="1" />
              <text x="20" y="25" textAnchor="middle" fontSize="12" fontWeight="700" fill="url(#lg)">N</text>
            </svg>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="text-gold-grad text-sm font-bold tracking-[0.18em]">MAISON NOIR</span>
              <span className="text-[9px] tracking-[0.3em] text-[#8b8262]">{lang === "ar" ? "دار العطور الفاخرة" : "HAUTE PARFUMERIE"}</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="mx-2 hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-2 text-[13px] font-medium transition-colors",
                  pathname === item.href ? "text-[#ffd700]" : "text-[#cfc6ab] hover:text-[#ffd700]"
                )}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          {/* Search */}
          <div className="relative mx-auto hidden w-full max-w-[240px] md:block xl:max-w-xs">
            <form onSubmit={submitSearch} role="search">
              <Search size={15} className={cn("pointer-events-none absolute top-1/2 -translate-y-1/2 text-[#8b8262]", dir === "rtl" ? "right-3" : "left-3")} />
              <input
                value={q}
                onChange={(e) => onQuery(e.target.value)}
                onFocus={() => sugs.length > 0 && setShowSug(true)}
                onBlur={() => setTimeout(() => setShowSug(false), 200)}
                placeholder={t("search_placeholder")}
                className="glass w-full rounded-full py-2 pr-9 pl-4 text-[12px] text-[#f4ecd9] placeholder-[#8b8262] focus:border-[#d4af37] focus:outline-none"
                aria-label={t("search_placeholder")}
              />
            </form>
            {showSug && sugs.length > 0 && (
              <ul className="glass-strong absolute inset-x-0 top-11 overflow-hidden rounded-2xl p-1.5 shadow-2xl">
                {sugs.map((s) => (
                  <li key={s.id}>
                    <Link href={`/product/${s.id}`} className="flex items-center gap-3 rounded-xl px-2.5 py-2 hover:bg-white/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.imageUrl} alt="" className="h-9 w-9 rounded-lg object-cover" loading="lazy" />
                      <span className="flex-1 truncate text-[12px] text-[#f4ecd9]">
                        {lang === "ar" ? s.nameAr : s.nameEn}
                      </span>
                      <span className="text-[11px] font-semibold text-[#d4af37]">
                        {Math.round(s.price * (1 - s.discount / 100)).toLocaleString(lang === "ar" ? "ar-EG" : "en-US")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggle}
              className="gold-border h-9 rounded-full px-3 text-[11px] font-bold text-[#d4af37] transition hover:bg-[#d4af3722]"
              aria-label="Switch language"
            >
              {lang === "ar" ? "EN" : "ع"}
            </button>
            <Link href="/account" className="gold-border hidden h-9 w-9 items-center justify-center rounded-full text-[#c9a86a] transition hover:bg-[#d4af3722] sm:flex" aria-label={t("nav_account")}>
              <User size={16} />
            </Link>
            <span className="relative hidden sm:inline-flex">
              <Link href="/account" className="gold-border flex h-9 w-9 items-center justify-center rounded-full text-[#c9a86a] transition hover:bg-[#d4af3722]" aria-label="Wishlist">
                <Heart size={16} className={wishlist.length > 0 ? "fill-[#d4af37] text-[#d4af37]" : ""} />
              </Link>
            </span>
            <button onClick={openCart} className="glass relative flex h-9 items-center gap-1.5 rounded-full px-3 text-[#f4ecd9] transition hover:border-[#d4af37]" aria-label={t("nav_cart")}>
              <ShoppingBag size={16} />
              <span className="hidden text-[12px] font-semibold md:inline">{t("nav_cart")}</span>
              {count > 0 && (
                <span className="btn-gold absolute -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold ltr:-right-1.5 rtl:-left-1.5">
                  {count}
                </span>
              )}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="gold-border flex h-9 w-9 items-center justify-center rounded-full text-[#c9a86a] lg:hidden" aria-label="Menu" aria-expanded={mobileOpen}>
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {/* mobile nav */}
        <div className={cn("accordion-content glass-strong lg:hidden", mobileOpen && "open")}>
          <div>
            <nav className="flex flex-col gap-1 px-5 py-4">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm font-medium",
                    pathname === item.href ? "bg-[#d4af3722] text-[#ffd700]" : "text-[#cfc6ab]"
                  )}
                >
                  {t(item.key)}
                </Link>
              ))}
              <form onSubmit={submitSearch} className="mt-2 flex gap-2">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t("search_placeholder")}
                  className="glass flex-1 rounded-full px-4 py-2.5 text-sm text-[#f4ecd9] placeholder-[#8b8262] focus:outline-none"
                />
                <button className="btn-gold rounded-full px-4" aria-label="Search">
                  <Search size={15} />
                </button>
              </form>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}

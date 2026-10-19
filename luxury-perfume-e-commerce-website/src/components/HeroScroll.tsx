"use client";

import { useEffect, useRef } from "react";
import { useLang } from "./LanguageProvider";

export default function HeroScroll() {
  const { t } = useLang();

  const wrapRef   = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const smoothRef = useRef(0);
  const bottleRef = useRef<HTMLDivElement>(null);
  const textRef   = useRef<HTMLDivElement>(null);
  const finaleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const getProgress = () => {
      const rect  = wrap.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      scrollRef.current = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
    };
    window.addEventListener("scroll", getProgress, { passive: true });
    getProgress();

    const e = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x));
    const seg = (p: number, a: number, b: number) => e((p - a) / (b - a));

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      smoothRef.current += (scrollRef.current - smoothRef.current) * 0.12;
      const p = smoothRef.current;

      if (bottleRef.current) {
        const recede = seg(p, 0.55, 0.9);
        bottleRef.current.style.transform = `translateY(${p * 20 - recede * 60}px) scale(${1 - recede * 0.15})`;
        bottleRef.current.style.opacity   = String(1 - recede * 0.8);
      }
      if (textRef.current) {
        const f = 1 - seg(p, 0.28, 0.5);
        textRef.current.style.opacity      = String(f);
        textRef.current.style.transform    = `translateY(${seg(p, 0.28, 0.5) * -40}px)`;
        textRef.current.style.pointerEvents = f > 0.35 ? "auto" : "none";
      }
      if (finaleRef.current) {
        const f = seg(p, 0.72, 0.94);
        finaleRef.current.style.opacity      = String(f);
        finaleRef.current.style.transform    = `translateY(${(1 - f) * 30}px)`;
        finaleRef.current.style.pointerEvents = f > 0.55 ? "auto" : "none";
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", getProgress);
    };
  }, []);

  return (
    <section ref={wrapRef} className="relative h-[240vh] bg-transparent" aria-label="Hero">
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden bg-transparent">

        {/* ── BOTTLE ZONE ── */}
        <div className="relative flex flex-1 items-center justify-center pt-24 sm:pt-28">

          {/* هالة ذهبية خفيفة جداً في الوسط */}
          <div
            className="pointer-events-none absolute"
            style={{
              width: "360px",
              height: "360px",
              background: "radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />

          {/* البرفان — صورة حقيقية بدون أي برواز */}
          <div ref={bottleRef} className="relative z-[2] will-change-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/perfume-hero.png"
              alt="MAISON NOIR"
              className="h-[46vh] w-auto max-w-[300px] object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,1)] sm:h-[55vh] sm:max-w-[380px]"
              loading="eager"
            />
          </div>
        </div>

        {/* ── فاصل خفيف ── */}
        <div className="relative z-[3] flex-shrink-0 py-1">
          <div className="mx-auto h-px max-w-[160px] bg-gradient-to-r from-transparent via-[#c9a86a44] to-transparent" />
        </div>

        {/* ── TEXT ZONE ── */}
        <div
          ref={textRef}
          className="relative z-[3] flex flex-shrink-0 flex-col items-center px-5 pb-10 pt-6 text-center sm:pb-14 sm:pt-8"
        >
          {/* badge */}
          <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-[#c9a86a33] bg-black/50 px-5 py-2 backdrop-blur-md">
            <span className="h-[4px] w-[4px] rounded-full bg-[#d4af37]" />
            <span className="text-[11px] font-medium tracking-[0.4em] text-[#d4af37] uppercase">
              MAISON NOIR &mdash; {t("hero_badge")}
            </span>
          </div>

          {/* headline */}
          <h1 className="text-gold-grad text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl md:text-6xl">
            {t("hero_title_a")} {t("hero_title_b")}{" "}
            <span className="shimmer">{t("hero_title_c")}</span>
          </h1>

          {/* subtext */}
          <p className="mt-3 max-w-md text-[13px] font-normal leading-relaxed text-[#9b9280] sm:text-sm">
            {t("hero_sub")}
          </p>

          {/* CTAs */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <a href="/products" className="btn-gold rounded-full px-8 py-3.5 text-sm font-bold tracking-wide">
              {t("hero_cta_shop")}
            </a>
            <a href="/contact" className="glass rounded-full px-8 py-3.5 text-sm font-semibold text-[#f4ecd9] transition hover:border-[#d4af37]">
              {t("hero_cta_taste")}
            </a>
          </div>
        </div>

        {/* ── FINALE ── */}
        <div
          ref={finaleRef}
          className="pointer-events-none absolute inset-0 z-[10] flex flex-col items-center justify-center bg-black/90 px-6 text-center opacity-0 backdrop-blur-md"
        >
          <div className="mb-4 h-px w-20 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
          <h2 className="text-gold-grad text-6xl font-bold tracking-tighter md:text-8xl">{t("brand")}</h2>
          <a href="/products" className="btn-gold pointer-events-auto mt-10 rounded-full px-10 py-4 text-sm font-bold">
            {t("hero_cta_shop")}
          </a>
        </div>

      </div>
    </section>
  );
}

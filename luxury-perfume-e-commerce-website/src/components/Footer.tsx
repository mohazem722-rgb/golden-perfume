"use client";

import { useState } from "react";
import Link from "next/link";
import { BellRing, CheckCircle2 } from "lucide-react";
import { useLang } from "./LanguageProvider";
import Reveal from "./Reveal";

export default function Footer() {
  const { t, lang } = useLang();
  const [email, setEmail] = useState("");
  const [sms, setSms] = useState(false);
  const [done, setDone] = useState(false);
  const year = new Date().getFullYear();

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "subscribe", email, sms }),
      });
      setDone(true);
    } catch {}
  };

  return (
    <footer className="relative z-10 border-t border-[#c9a86a26] bg-[#050507]">
      {/* newsletter */}
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <Reveal className="glass mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-3xl px-6 py-10 text-center md:px-12">
          <span className="gold-border flex h-12 w-12 items-center justify-center rounded-full text-[#d4af37]">
            <BellRing size={20} />
          </span>
          <h3 className="text-2xl font-bold text-[#f4ecd9]">{t("notify_title")}</h3>
          <p className="max-w-md text-sm text-[#8b8262]">{t("notify_sub")}</p>
          {done ? (
            <p className="flex items-center gap-2 text-sm font-semibold text-[#d4af37]">
              <CheckCircle2 size={16} /> {t("subscribed")}
            </p>
          ) : (
            <form onSubmit={subscribe} className="flex w-full max-w-md flex-col items-center gap-3">
              <div className="flex w-full gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("notify_email")}
                  className="glass flex-1 rounded-full px-5 py-3 text-sm text-[#f4ecd9] placeholder-[#8b8262] focus:border-[#d4af37] focus:outline-none"
                />
                <button className="btn-gold rounded-full px-6 py-3 text-sm font-bold">{t("subscribe")}</button>
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-xs text-[#cfc6ab]">
                <input type="checkbox" checked={sms} onChange={(e) => setSms(e.target.checked)} className="gold-range" />
                {t("notify_sms")}
              </label>
            </form>
          )}
        </Reveal>

        {/* links */}
        <div className="mt-14 grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <svg width="30" height="30" viewBox="0 0 40 40" aria-hidden="true">
                <polygon points="20,3 35,11.5 35,28.5 20,37 5,28.5 5,11.5" fill="none" stroke="#d4af37" strokeWidth="2" />
                <polygon points="20,9 29.5,14.5 29.5,25.5 20,31 10.5,25.5 10.5,14.5" fill="rgba(212,175,55,0.15)" stroke="#d4af37" />
              </svg>
              <span className="text-gold-grad text-sm font-bold tracking-[0.18em]">MAISON NOIR</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#8b8262]">{t("footer_about")}</p>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-bold tracking-[0.3em] text-[#d4af37] uppercase">{t("footer_links")}</h4>
            <ul className="space-y-2.5 text-sm text-[#cfc6ab]">
              <li><Link className="hover:text-[#ffd700]" href="/products">{t("nav_products")}</Link></li>
              <li><Link className="hover:text-[#ffd700]" href="/offers">{t("nav_offers")}</Link></li>
              <li><Link className="hover:text-[#ffd700]" href="/bestsellers">{t("nav_best")}</Link></li>
              <li><Link className="hover:text-[#ffd700]" href="/track">{t("nav_track")}</Link></li>
              <li><Link className="hover:text-[#ffd700]" href="/about">{t("nav_about")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-bold tracking-[0.3em] text-[#d4af37] uppercase">{t("footer_support")}</h4>
            <ul className="space-y-2.5 text-sm text-[#cfc6ab]">
              <li><Link className="hover:text-[#ffd700]" href="/faq">{t("nav_faq")}</Link></li>
              <li><Link className="hover:text-[#ffd700]" href="/returns">{t("returns_title")}</Link></li>
              <li><Link className="hover:text-[#ffd700]" href="/contact">{t("nav_contact")}</Link></li>
              <li><Link className="hover:text-[#ffd700]" href="/account">{t("nav_account")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="divider-gold mt-12" />
        <p className="mt-6 text-center text-xs text-[#5c5540]">
          © {year} {lang === "ar" ? "ميزون نوار" : "MAISON NOIR"} — {t("footer_rights")}
        </p>
      </div>
    </footer>
  );
}

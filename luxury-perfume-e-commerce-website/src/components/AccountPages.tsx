"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Hash, Loader2, LogOut, Package, Phone, Search, User } from "lucide-react";
import Reveal from "./Reveal";
import OrderStepper from "./OrderStepper";
import { useLang } from "./LanguageProvider";
import { cn, formatEGP } from "@/lib/utils";

type TrackedOrder = {
  trackingCode: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  governorate: string;
  createdAt: string;
  items: { nameAr?: string; nameEn?: string; qty: number; price: number }[];
};

function OrderCard({ o, lang, t }: { o: any; lang: "ar" | "en"; t: (k: any) => string }) {
  return (
    <div className="glass space-y-5 rounded-3xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] tracking-[0.3em] text-[#8b8262] uppercase">{t("tracking_code")}</span>
          <p dir="ltr" className="text-lg font-bold tracking-[0.2em] text-[#ffd700]">{o.trackingCode}</p>
        </div>
        <div className="text-end">
          <span className="text-[10px] text-[#8b8262]">
            {new Date(o.createdAt).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB")}
          </span>
          <p className="text-lg font-bold text-[#f4ecd9]">{formatEGP(o.total, lang)}</p>
        </div>
      </div>
      <OrderStepper status={o.orderStatus} />
      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        <span className="rounded-full border border-[#c9a86a44] px-3 py-1 text-[#c9a86a]">
          {o.paymentMethod === "cod" ? t("pay_cod") : o.paymentMethod}
        </span>
        <span className={cn(
          "rounded-full px-3 py-1 font-semibold",
          o.paymentStatus === "paid" ? "bg-emerald-500/15 text-emerald-300" : o.paymentStatus === "cod" ? "bg-[#d4af3718] text-[#d4af37]" : "bg-amber-500/15 text-amber-300"
        )}>
          {o.paymentStatus === "paid" ? t("payst_paid") : o.paymentStatus === "cod" ? t("payst_cod") : t("payst_pending")}
        </span>
      </div>
      <ul className="space-y-1.5 border-t border-[#c9a86a22] pt-4 text-xs text-[#a89f86]">
        {(o.items || []).map((li: any, i: number) => (
          <li key={i} className="flex justify-between">
            <span>{lang === "ar" ? li.nameAr || li.name || li.nameEn : li.nameEn || li.name || li.nameAr} × {(li.qty || 1).toLocaleString(lang === "ar" ? "ar-EG" : "en-US")}</span>
            <span className="text-[#cfc6ab]">{formatEGP(li.price * (li.qty || 1), lang)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ================= TRACK PAGE ================= */
export function TrackPage() {
  const { t, lang } = useLang();
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [notFound, setNotFound] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotFound(false);
    setOrder(null);
    try {
      const res = await fetch(`/api/orders/track?code=${encodeURIComponent(code.trim())}&phone=${encodeURIComponent(phone.trim())}`);
      const data = await res.json();
      if (data.found) setOrder(data.order);
      else setNotFound(true);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 pt-28 pb-20 md:px-6">
      <Reveal className="text-center">
        <span className="gold-border mx-auto flex h-12 w-12 items-center justify-center rounded-full text-[#d4af37]">
          <Package size={20} />
        </span>
        <h1 className="text-gold-grad mt-4 text-3xl font-bold">{t("track_title")}</h1>
        <p className="mt-2 text-sm text-[#8b8262]">{t("track_hint")}</p>
      </Reveal>
      <Reveal delay={100}>
        <form onSubmit={submit} className="glass mt-8 space-y-4 rounded-3xl p-7">
          <div className="glass flex items-center gap-3 rounded-full px-4">
            <Hash size={15} className="text-[#8b8262]" />
            <input required value={code} onChange={(e) => setCode(e.target.value)} dir="ltr"
              placeholder={t("tracking_code")}
              className="w-full bg-transparent py-3.5 text-sm tracking-[0.2em] text-[#f4ecd9] uppercase placeholder-[#8b8262] focus:outline-none" />
          </div>
          <div className="glass flex items-center gap-3 rounded-full px-4">
            <Phone size={15} className="text-[#8b8262]" />
            <input required value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel"
              placeholder={t("phone")}
              className="w-full bg-transparent py-3.5 text-sm text-[#f4ecd9] placeholder-[#8b8262] focus:outline-none" />
          </div>
          <button disabled={loading} className="btn-gold flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold">
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
            {t("track_btn")}
          </button>
          {notFound && <p className="text-center text-sm text-red-400">{t("track_not_found")}</p>}
        </form>
      </Reveal>
      {order && (
        <Reveal className="mt-8">
          <OrderCard o={order} lang={lang} t={t} />
        </Reveal>
      )}
    </div>
  );
}

/* ================= ACCOUNT PAGE ================= */
type Authed = { customer: { id: number; name: string; email: string; phone: string } | null; orders: any[] };

export function AccountPage() {
  const { t, lang } = useLang();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [data, setData] = useState<Authed | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = () =>
    fetch("/api/auth").then((r) => r.json()).then((d) => setData(d)).catch(() => setData({ customer: null, orders: [] }));

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: mode, ...form }),
      });
      if (res.ok) {
        await load();
      } else {
        setError(mode === "login" ? t("auth_error") : t("auth_error"));
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    await load();
  };

  if (!data) return <div className="min-h-[70vh]" />;

  if (!data.customer) {
    return (
      <div className="mx-auto max-w-md px-4 pt-28 pb-20 md:px-6">
        <Reveal className="text-center">
          <span className="gold-border mx-auto flex h-12 w-12 items-center justify-center rounded-full text-[#d4af37]">
            <User size={20} />
          </span>
          <h1 className="text-gold-grad mt-4 text-3xl font-bold">{mode === "login" ? t("login") : t("register")}</h1>
        </Reveal>
        <Reveal delay={100}>
          <form onSubmit={submit} className="glass mt-8 space-y-4 rounded-3xl p-7">
            {mode === "register" && (
              <>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("full_name")}
                  className="glass w-full rounded-xl px-4 py-3.5 text-sm text-[#f4ecd9] placeholder-[#8b8262] focus:border-[#d4af37] focus:outline-none" />
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={t("phone")} inputMode="tel"
                  className="glass w-full rounded-xl px-4 py-3.5 text-sm text-[#f4ecd9] placeholder-[#8b8262] focus:border-[#d4af37] focus:outline-none" />
              </>
            )}
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t("email")}
              className="glass w-full rounded-xl px-4 py-3.5 text-sm text-[#f4ecd9] placeholder-[#8b8262] focus:border-[#d4af37] focus:outline-none" />
            <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={t("password")}
              className="glass w-full rounded-xl px-4 py-3.5 text-sm text-[#f4ecd9] placeholder-[#8b8262] focus:border-[#d4af37] focus:outline-none" />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button disabled={loading} className="btn-gold flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold">
              {loading && <Loader2 size={15} className="animate-spin" />}
              {mode === "login" ? t("login") : t("register")}
            </button>
            <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")} className="w-full text-center text-xs text-[#c9a86a] hover:text-[#ffd700]">
              {mode === "login" ? t("need_account") : t("have_account")}
            </button>
          </form>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pt-28 pb-20 md:px-6">
      <Reveal className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] tracking-[0.3em] text-[#c9a86a] uppercase">{t("welcome_back")}</span>
          <h1 className="mt-1 text-3xl font-bold text-[#f4ecd9]">{data.customer.name}</h1>
          <p className="mt-1 text-sm text-[#8b8262]">{data.customer.email}</p>
        </div>
        <button onClick={logout} className="flex items-center gap-2 rounded-full border border-[#c9a86a44] px-5 py-2.5 text-xs font-bold text-[#c9a86a] hover:bg-[#d4af3722]">
          <LogOut size={14} />
          {t("logout")}
        </button>
      </Reveal>

      <Reveal delay={100} className="mt-10">
        <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-[#f4ecd9]">
          <Package size={18} className="text-[#d4af37]" /> {t("my_orders")} ({data.orders.length.toLocaleString(lang === "ar" ? "ar-EG" : "en-US")})
        </h2>
      </Reveal>
      <div className="space-y-5">
        {data.orders.length === 0 && (
          <Reveal delay={150}>
            <div className="glass rounded-3xl p-10 text-center text-sm text-[#8b8262]">
              {t("cart_empty")} — <Link href="/products" className="text-[#d4af37] hover:underline">{t("cart_empty_cta")}</Link>
            </div>
          </Reveal>
        )}
        {data.orders.map((o, i) => (
          <Reveal key={o.id} delay={i * 60}>
            <OrderCard o={o} lang={lang} t={t} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

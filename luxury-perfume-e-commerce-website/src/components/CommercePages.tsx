"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgePercent, Banknote, CheckCircle2, CreditCard, Gift, Landmark,
  Loader2, Minus, Plus, ShoppingBag, Smartphone, TicketPercent, Trash2,
} from "lucide-react";
import Reveal from "./Reveal";
import OrderStepper from "./OrderStepper";
import { useCart } from "./CartProvider";
import { useLang } from "./LanguageProvider";
import { cn, formatEGP } from "@/lib/utils";

type Rate = { id: number; governorate: string; governorateAr: string; price: number; estimatedDays: string };

function useCoupon() {
  const [coupon, setCoupon] = useState<{ code: string; percent: number } | null>(null);
  useEffect(() => {
    const raw = localStorage.getItem("mn-coupon");
    if (raw) {
      try { setCoupon(JSON.parse(raw)); } catch {}
    }
  }, []);
  const save = (c: { code: string; percent: number } | null) => {
    setCoupon(c);
    if (c) localStorage.setItem("mn-coupon", JSON.stringify(c));
    else localStorage.removeItem("mn-coupon");
  };
  return { coupon, save };
}

function CouponBox({ coupon, save }: { coupon: { code: string; percent: number } | null; save: (c: any) => void }) {
  const { t } = useLang();
  const [val, setVal] = useState("");
  const [state, setState] = useState<"idle" | "ok" | "bad">("idle");
  const apply = async () => {
    if (!val.trim()) return;
    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: val }),
    });
    const data = await res.json();
    if (data.valid) {
      save({ code: data.code, percent: data.discountPercent });
      setState("ok");
    } else {
      setState("bad");
      save(null);
    }
  };
  if (coupon) {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-bold text-emerald-300">
          <TicketPercent size={16} />
          {coupon.code} · {coupon.percent}%
        </span>
        <button onClick={() => { save(null); setState("idle"); setVal(""); }} aria-label="remove">
          <Trash2 size={15} className="text-emerald-300 hover:text-red-400" />
        </button>
      </div>
    );
  }
  return (
    <div>
      <div className="flex gap-2">
        <input
          value={val}
          onChange={(e) => { setVal(e.target.value); setState("idle"); }}
          placeholder={t("coupon_code")}
          className="glass flex-1 rounded-full px-5 py-3 text-sm text-[#f4ecd9] uppercase placeholder-[#8b8262] focus:border-[#d4af37] focus:outline-none"
        />
        <button onClick={apply} className="btn-gold rounded-full px-6 text-sm font-bold">{t("apply")}</button>
      </div>
      {state === "bad" && <p className="mt-2 text-xs text-red-400">{t("coupon_invalid")}</p>}
    </div>
  );
}

/* ================= CART PAGE ================= */
export function CartPage() {
  const { items, setQty, remove, subtotal } = useCart();
  const { t, lang } = useLang();
  const { coupon, save } = useCoupon();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="min-h-[60vh]" />;

  const discountAmount = coupon ? Math.round(subtotal * (coupon.percent / 100)) : 0;

  return (
    <div className="product-text mx-auto max-w-6xl px-4 pt-28 pb-20 md:px-6">
      <Reveal>
        <h1 className="flex items-center gap-3 text-3xl font-bold text-[#f4ecd9]">
          <ShoppingBag className="text-[#d4af37]" size={28} />
          {t("cart_title")}
        </h1>
      </Reveal>

      {items.length === 0 ? (
        <Reveal delay={100}>
          <div className="glass mt-10 flex flex-col items-center gap-5 rounded-3xl py-20 text-center">
            <ShoppingBag size={48} className="text-[#4a4436]" />
            <p className="text-sm text-[#8b8262]">{t("cart_empty")}</p>
            <Link href="/products" className="btn-gold rounded-full px-8 py-3 text-sm font-bold">{t("cart_empty_cta")}</Link>
          </div>
        </Reveal>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map((i, idx) => {
              const unit = Math.round(i.price * (1 - i.discount / 100));
              return (
                <Reveal key={i.productId} delay={idx * 60}>
                  <div className="glass flex gap-4 rounded-2xl p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={i.imageUrl} alt="" className="h-24 w-20 shrink-0 rounded-xl object-cover" loading="lazy" />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link href={`/product/${i.productId}`} className="text-sm font-bold text-[#f4ecd9] hover:text-[#ffd700]">
                            {lang === "ar" ? i.nameAr : i.nameEn}
                          </Link>
                          <p className="mt-0.5 text-xs text-[#8b8262]">{i.brand} · {i.size}</p>
                        </div>
                        <button onClick={() => remove(i.productId)} className="text-[#8b8262] hover:text-red-400" aria-label={t("a_delete")}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="gold-border flex items-center rounded-full">
                          <button onClick={() => setQty(i.productId, i.qty - 1)} className="p-2 text-[#c9a86a]" aria-label="minus"><Minus size={13} /></button>
                          <span className="w-8 text-center text-sm font-bold">{i.qty.toLocaleString(lang === "ar" ? "ar-EG" : "en-US")}</span>
                          <button onClick={() => setQty(i.productId, i.qty + 1)} className="p-2 text-[#c9a86a]" aria-label="plus"><Plus size={13} /></button>
                        </div>
                        <span className="text-base font-bold text-[#ffd700]">{formatEGP(unit * i.qty, lang)}</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* summary */}
          <Reveal delay={120}>
            <div className="glass sticky top-24 space-y-5 rounded-3xl p-6">
              <h2 className="text-base font-bold text-[#f4ecd9]">{t("order_summary")}</h2>
              <CouponBox coupon={coupon} save={save} />
              <div className="space-y-2.5 text-sm">
                <Row label={t("subtotal")} value={formatEGP(subtotal, lang)} />
                {discountAmount > 0 && <Row label={`${t("discount_label")} (${coupon?.code})`} value={`- ${formatEGP(discountAmount, lang)}`} accent />}
                <Row label={t("shipping")} value={t("governorate") + "…"} />
              </div>
              <div className="divider-gold" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#cfc6ab]">{t("subtotal")}</span>
                <span className="text-xl font-bold text-[#ffd700]">{formatEGP(subtotal - discountAmount, lang)}</span>
              </div>
              <Link href="/checkout" className="btn-gold block rounded-full py-3.5 text-center text-sm font-bold">
                {t("checkout")}
              </Link>
              <Link href="/products" className="block rounded-full border border-[#c9a86a44] py-3 text-center text-xs font-semibold text-[#c9a86a] hover:bg-[#d4af3722]">
                {t("continue_shopping")}
              </Link>
            </div>
          </Reveal>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#a89f86]">{label}</span>
      <span className={cn("font-semibold", accent ? "text-emerald-400" : "text-[#f4ecd9]")}>{value}</span>
    </div>
  );
}

/* ================= CHECKOUT PAGE ================= */
const GIFT_LIMIT_BY_DEFAULT = 75;

export function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { t, lang } = useLang();
  const { coupon, save } = useCoupon();
  const [mounted, setMounted] = useState(false);
  const [rates, setRates] = useState<Rate[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", email: "", governorate: "", address: "" });
  const [payment, setPayment] = useState("cod");
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftText, setGiftText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<null | { trackingCode: string; total: number; estimatedDays: string }>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
    fetch("/api/shipping").then((r) => r.json()).then((d) => setRates(d.rates || [])).catch(() => {});
  }, []);

  const rate = useMemo(() => rates.find((r) => r.governorate === form.governorate), [rates, form.governorate]);
  const shippingCost = form.governorate ? rate?.price ?? GIFT_LIMIT_BY_DEFAULT : 0;
  const discountAmount = coupon ? Math.round(subtotal * (coupon.percent / 100)) : 0;
  const giftFee = giftWrap ? 50 : 0;
  const total = subtotal - discountAmount + shippingCost + giftFee;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.phone || !form.governorate || !form.address) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
          customer: { name: form.name, phone: form.phone, email: form.email },
          governorate: form.governorate,
          address: form.address,
          couponCode: coupon?.code || "",
          giftWrap,
          giftCardText: giftText,
          paymentMethod: payment,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setResult({ trackingCode: data.trackingCode, total: data.total, estimatedDays: data.estimatedDays });
        clear();
        localStorage.removeItem("mn-coupon");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError("error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return <div className="min-h-[60vh]" />;

  /* ---- success screen ---- */
  if (result) {
    return (
      <div className="mx-auto max-w-xl px-4 pt-28 pb-20 text-center md:px-6">
        <Reveal>
          <span className="btn-gold mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <CheckCircle2 size={30} />
          </span>
          <h1 className="text-gold-grad mt-6 text-3xl font-bold">{t("order_placed")}</h1>
          <p className="mt-2 text-sm text-[#8b8262]">{t("order_placed_sub")}</p>
        </Reveal>
        <Reveal delay={120}>
          <div className="glass mt-8 space-y-5 rounded-3xl p-8">
            <div>
              <span className="text-[11px] tracking-[0.3em] text-[#8b8262] uppercase">{t("tracking_code")}</span>
              <p dir="ltr" className="mt-1 text-3xl font-bold tracking-[0.25em] text-[#ffd700]">{result.trackingCode}</p>
            </div>
            <div className="flex items-center justify-center gap-8 text-sm">
              <span className="text-[#a89f86]">{t("total")}:</span>
              <span className="text-xl font-bold text-[#f4ecd9]">{formatEGP(result.total, lang)}</span>
              <span className="text-[#a89f86]">{t("est_delivery")}: {result.estimatedDays} {t("days")}</span>
            </div>
            {payment !== "cod" && (
              <p className="rounded-2xl border border-[#d4af3744] bg-[#d4af3711] px-4 py-3 text-xs leading-relaxed text-[#d4af37]">
                {t("pay_integration")}
              </p>
            )}
            <OrderStepper status="preparing" />
            <div className="flex gap-3">
              <Link href="/track" className="btn-gold flex-1 rounded-full py-3 text-sm font-bold">{t("nav_track")}</Link>
              <Link href="/products" className="flex-1 rounded-full border border-[#c9a86a44] py-3 text-sm font-semibold text-[#c9a86a] hover:bg-[#d4af3722]">
                {t("continue_shopping")}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 pt-28 pb-20 text-center md:px-6">
        <Reveal>
          <div className="glass flex flex-col items-center gap-5 rounded-3xl py-16">
            <ShoppingBag size={44} className="text-[#4a4436]" />
            <p className="text-sm text-[#8b8262]">{t("cart_empty")}</p>
            <Link href="/products" className="btn-gold rounded-full px-8 py-3 text-sm font-bold">{t("cart_empty_cta")}</Link>
          </div>
        </Reveal>
      </div>
    );
  }

  const payOptions = [
    { id: "cod", label: t("pay_cod"), icon: Banknote, ready: true },
    { id: "vodafone_cash", label: t("pay_vodafone"), icon: Smartphone, ready: false },
    { id: "visa", label: t("pay_visa"), icon: CreditCard, ready: false },
    { id: "instapay", label: t("pay_instapay"), icon: Landmark, ready: false },
  ];

  return (
    <div className="product-text mx-auto max-w-6xl px-4 pt-28 pb-20 md:px-6">
      <Reveal>
        <h1 className="text-3xl font-bold text-[#f4ecd9]">{t("checkout_title")}</h1>
      </Reveal>
      <form onSubmit={submit} className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* contact info */}
          <Reveal>
            <section className="glass space-y-4 rounded-3xl p-6">
              <h2 className="text-sm font-bold tracking-widest text-[#c9a86a] uppercase">{t("contact_info")}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("full_name")}
                  className="glass rounded-xl px-4 py-3.5 text-sm text-[#f4ecd9] placeholder-[#8b8262] focus:border-[#d4af37] focus:outline-none" />
                <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={t("phone")} inputMode="tel"
                  className="glass rounded-xl px-4 py-3.5 text-sm text-[#f4ecd9] placeholder-[#8b8262] focus:border-[#d4af37] focus:outline-none" />
              </div>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t("email")} type="email"
                className="glass w-full rounded-xl px-4 py-3.5 text-sm text-[#f4ecd9] placeholder-[#8b8262] focus:border-[#d4af37] focus:outline-none" />
              <div className="grid gap-4 sm:grid-cols-2">
                <select required value={form.governorate} onChange={(e) => setForm({ ...form, governorate: e.target.value })}
                  className="glass rounded-xl px-4 py-3.5 text-sm text-[#f4ecd9] focus:border-[#d4af37] focus:outline-none">
                  <option value="" className="bg-[#0a1931]">{t("governorate")}…</option>
                  {rates.map((r) => (
                    <option key={r.id} value={r.governorate} className="bg-[#0a1931]">
                      {lang === "ar" ? r.governorateAr : r.governorate} — {formatEGP(r.price, lang)} ({r.estimatedDays})
                    </option>
                  ))}
                </select>
                <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder={t("address")}
                  className="glass rounded-xl px-4 py-3.5 text-sm text-[#f4ecd9] placeholder-[#8b8262] focus:border-[#d4af37] focus:outline-none" />
              </div>
            </section>
          </Reveal>

          {/* payment */}
          <Reveal delay={80}>
            <section className="glass space-y-4 rounded-3xl p-6">
              <h2 className="text-sm font-bold tracking-widest text-[#c9a86a] uppercase">{t("payment_method")}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {payOptions.map((o) => {
                  const Icon = o.icon;
                  const active = payment === o.id;
                  return (
                    <button
                      type="button"
                      key={o.id}
                      onClick={() => setPayment(o.id)}
                      className={cn(
                        "relative flex items-center gap-3 rounded-2xl border p-4 text-start transition",
                        active ? "border-[#d4af37] bg-[#d4af3714]" : "border-[#c9a86a2e] hover:border-[#c9a86a66]"
                      )}
                    >
                      <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", active ? "bg-[#d4af37] text-black" : "bg-[#c9a86a1a] text-[#d4af37]")}>
                        <Icon size={19} />
                      </span>
                      <span className="text-sm font-semibold text-[#f4ecd9]">{o.label}</span>
                      {!o.ready && (
                        <span className="absolute -top-2 end-3 rounded-full bg-[#0a1931] px-2 py-0.5 text-[9px] font-bold text-[#7fb3ff]">
                          {t("integration_badge")}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {payment !== "cod" && (
                <p className="rounded-2xl border border-[#d4af3744] bg-[#d4af3711] px-4 py-3 text-xs leading-relaxed text-[#d4af37]">
                  {t("pay_integration")}
                </p>
              )}
            </section>
          </Reveal>

          {/* gift wrap */}
          <Reveal delay={140}>
            <section className="glass space-y-4 rounded-3xl p-6">
              <label className="flex cursor-pointer items-center gap-3">
                <input type="checkbox" checked={giftWrap} onChange={(e) => setGiftWrap(e.target.checked)} className="gold-range h-4 w-4" />
                <Gift size={17} className="text-[#d4af37]" />
                <span className="text-sm font-semibold text-[#f4ecd9]">{t("gift_wrap")}</span>
              </label>
              {giftWrap && (
                <textarea value={giftText} onChange={(e) => setGiftText(e.target.value)} rows={3} placeholder={t("gift_card_text")}
                  className="glass w-full resize-none rounded-xl px-4 py-3 text-sm text-[#f4ecd9] placeholder-[#8b8262] focus:border-[#d4af37] focus:outline-none" />
              )}
            </section>
          </Reveal>
        </div>

        {/* summary */}
        <Reveal delay={200}>
          <aside className="glass sticky top-24 space-y-5 self-start rounded-3xl p-6">
            <h2 className="text-base font-bold text-[#f4ecd9]">{t("order_summary")}</h2>
            <ul className="max-h-48 space-y-2.5 overflow-y-auto text-sm">
              {items.map((i) => (
                <li key={i.productId} className="flex items-center justify-between gap-2">
                  <span className="line-clamp-1 flex-1 text-[#a89f86]">
                    {lang === "ar" ? i.nameAr : i.nameEn} × {i.qty.toLocaleString(lang === "ar" ? "ar-EG" : "en-US")}
                  </span>
                  <span className="font-semibold text-[#f4ecd9]">{formatEGP(Math.round(i.price * (1 - i.discount / 100)) * i.qty, lang)}</span>
                </li>
              ))}
            </ul>
            <CouponBox coupon={coupon} save={save} />
            <div className="space-y-2.5 text-sm">
              <Row label={t("subtotal")} value={formatEGP(subtotal, lang)} />
              {discountAmount > 0 && <Row label={`${t("discount_label")} (${coupon?.code})`} value={`- ${formatEGP(discountAmount, lang)}`} accent />}
              <Row label={t("shipping")} value={form.governorate ? formatEGP(shippingCost, lang) : "—"} />
              {giftWrap && <Row label={t("gift_wrap").split("(")[0]} value={formatEGP(giftFee, lang)} />}
            </div>
            <div className="divider-gold" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#cfc6ab]">{t("total")}</span>
              <span className="text-2xl font-bold text-[#ffd700]">{formatEGP(total, lang)}</span>
            </div>
            {error && <p className="text-xs text-red-400">{t("auth_error")}</p>}
            <button
              type="submit"
              disabled={submitting || !form.governorate}
              className="btn-gold flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-bold disabled:opacity-60"
            >
              {submitting && <Loader2 size={15} className="animate-spin" />}
              {t("place_order")} · {formatEGP(total, lang)}
            </button>
            <p className="flex items-center justify-center gap-1.5 text-[10px] text-[#8b8262]">
              <BadgePercent size={11} />
              {t("exclusive_coupon")}: NOIR10
            </p>
          </aside>
        </Reveal>
      </form>
    </div>
  );
}


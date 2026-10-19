"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3, Check, Coins, KeyRound, Loader2, LogOut, Package, PackagePlus,
  Pencil, Plus, ShieldCheck, ShoppingBag, TicketPercent, Trash2, Truck, X,
} from "lucide-react";
import { useLang } from "./LanguageProvider";
import { cn, discountedPrice, formatEGP } from "@/lib/utils";

type Tab = "dashboard" | "products" | "orders" | "coupons" | "shipping";

type Product = {
  id: number; nameAr: string; nameEn: string; brand: string; size: string; price: number;
  category: string; imageUrl: string; stock: number; discount: number; isNew: boolean;
  descriptionAr: string; descriptionEn: string;
};
type Order = {
  id: string; trackingCode: string; customerName: string; customerPhone: string; governorate: string;
  total: number; orderStatus: string; paymentStatus: string; paymentMethod: string; createdAt: string;
  items: any[];
};
type Coupon = { id: number; code: string; discountPercent: number; maxUses: number; usedCount: number; active: boolean };
type Rate = { id: number; governorate: string; governorateAr: string; price: number; estimatedDays: string };

export default function AdminPanel() {
  const { t, lang } = useLang();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [pass, setPass] = useState("");
  const [passErr, setPassErr] = useState(false);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [rates, setRates] = useState<Rate[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [toast, setToast] = useState("");

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  };

  const loadAll = async () => {
    const [p, o, c, s, r] = await Promise.all([
      fetch("/api/products?limit=200").then((x) => x.json()).catch(() => ({ products: [] })),
      fetch("/api/admin/orders").then((x) => (x.ok ? x.json() : { orders: [] })).catch(() => ({ orders: [] })),
      fetch("/api/admin/coupons").then((x) => (x.ok ? x.json() : { coupons: [] })).catch(() => ({ coupons: [] })),
      fetch("/api/admin/stats").then((x) => (x.ok ? x.json() : null)).catch(() => null),
      fetch("/api/shipping").then((x) => x.json()).catch(() => ({ rates: [] })),
    ]);
    if (!s) {
      setAuthed(false);
      return;
    }
    setProducts(p.products || []);
    setOrders(o.orders || []);
    setCoupons(c.coupons || []);
    setRates(r.rates || []);
    setStats(s);
    setAuthed(true);
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pass }),
    });
    if (res.ok) {
      await loadAll();
    } else {
      setPassErr(true);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthed(false);
  };

  if (authed === null) return <div className="min-h-[70vh]" />;

  /* ---------- login gate ---------- */
  if (!authed) {
    return (
      <div className="mx-auto max-w-sm px-4 pt-28 pb-20 md:px-6">
        <form onSubmit={login} className="glass space-y-5 rounded-3xl p-8 text-center">
          <span className="gold-border mx-auto flex h-14 w-14 items-center justify-center rounded-full text-[#d4af37]">
            <ShieldCheck size={24} />
          </span>
          <h1 className="text-xl font-bold text-[#f4ecd9]">{t("admin_title")}</h1>
          <div className="glass flex items-center gap-3 rounded-full px-4">
            <KeyRound size={15} className="text-[#8b8262]" />
            <input
              type="password"
              value={pass}
              onChange={(e) => { setPass(e.target.value); setPassErr(false); }}
              placeholder={t("admin_pass")}
              className="w-full bg-transparent py-3.5 text-sm text-[#f4ecd9] placeholder-[#8b8262] focus:outline-none"
            />
          </div>
          {passErr && <p className="text-xs text-red-400">{t("admin_wrong")}</p>}
          <button className="btn-gold w-full rounded-full py-3.5 text-sm font-bold">{t("admin_enter")}</button>
        </form>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "dashboard", label: t("a_dashboard"), icon: BarChart3 },
    { id: "products", label: t("a_products"), icon: Package },
    { id: "orders", label: t("a_orders"), icon: ShoppingBag },
    { id: "coupons", label: t("a_coupons"), icon: TicketPercent },
    { id: "shipping", label: t("shipping"), icon: Truck },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-20 md:px-6">
      {/* header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-3 text-2xl font-bold text-[#f4ecd9]">
          <ShieldCheck className="text-[#d4af37]" size={24} />
          {t("admin_title")}
        </h1>
        <button onClick={logout} className="flex items-center gap-2 rounded-full border border-[#c9a86a44] px-4 py-2 text-xs font-bold text-[#c9a86a] hover:bg-[#d4af3722]">
          <LogOut size={13} /> {t("logout")}
        </button>
      </div>

      {/* tabs */}
      <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition",
              tab === id ? "btn-gold" : "glass text-[#cfc6ab] hover:border-[#d4af37]"
            )}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#d4af37] px-6 py-2.5 text-xs font-bold text-black shadow-2xl">
          {toast}
        </div>
      )}

      {tab === "dashboard" && stats && <Dashboard stats={stats} t={t} lang={lang} />}
      {tab === "products" && <ProductsTab products={products} reload={loadAll} t={t} lang={lang} flash={flash} />}
      {tab === "orders" && <OrdersTab orders={orders} reload={loadAll} t={t} lang={lang} flash={flash} />}
      {tab === "coupons" && <CouponsTab coupons={coupons} reload={loadAll} t={t} flash={flash} />}
      {tab === "shipping" && <ShippingTab rates={rates} reload={loadAll} t={t} lang={lang} flash={flash} />}
    </div>
  );
}

/* ---------------- dashboard ---------------- */
function Dashboard({ stats, t, lang }: { stats: any; t: any; lang: "ar" | "en" }) {
  const cards = [
    { label: t("a_revenue_today"), value: formatEGP(stats.totals.revenueToday, lang), icon: Coins },
    { label: t("a_revenue_month"), value: formatEGP(stats.totals.revenueMonth, lang), icon: BarChart3 },
    { label: t("a_orders_total"), value: stats.totals.orders.toLocaleString(lang === "ar" ? "ar-EG" : "en-US"), icon: ShoppingBag },
    { label: t("a_avg_order"), value: formatEGP(stats.totals.avgOrder, lang), icon: Package },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="glass rounded-2xl p-5">
            <span className="gold-border mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-[#d4af37]">
              <Icon size={16} />
            </span>
            <p className="text-[11px] text-[#8b8262]">{label}</p>
            <p className="mt-1 truncate text-lg font-bold text-[#ffd700] sm:text-xl">{value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-3xl p-6">
          <h3 className="mb-5 text-sm font-bold text-[#f4ecd9]">{t("shipping") + " — " + t("a_daily")}</h3>
          <BarChart data={stats.daily} labelKey="day" valueKey="revenue" lang={lang} />
        </div>
        <div className="glass rounded-3xl p-6">
          <h3 className="mb-5 text-sm font-bold text-[#f4ecd9]">{t("total") + " — " + t("a_monthly")}</h3>
          <BarChart data={stats.monthly} labelKey="month" valueKey="revenue" lang={lang} />
        </div>
      </div>
    </div>
  );
}

function BarChart({ data, labelKey, valueKey, lang }: { data: any[]; labelKey: string; valueKey: string; lang: "ar" | "en" }) {
  const max = Math.max(...data.map((d) => d[valueKey]), 1);
  const H = 160;
  return (
    <div dir="ltr" className="flex items-end gap-1.5 overflow-x-auto" role="img" aria-label="sales chart">
      {data.map((d, i) => (
        <div key={i} className="group flex min-w-[34px] flex-1 flex-col items-center justify-end gap-1.5">
          <span className="text-[9px] font-bold text-[#ffd700] opacity-0 transition group-hover:opacity-100">
            {(d[valueKey] / 1000).toFixed(1)}k
          </span>
          <div
            className="w-full rounded-t-md bg-gradient-to-t from-[#6e5324] via-[#b8912f] to-[#ffd700] transition-all group-hover:brightness-125"
            style={{ height: Math.max(3, (d[valueKey] / max) * H) }}
          />
          <span className="origin-center text-[8px] whitespace-nowrap text-[#8b8262]">
            {String(d[labelKey]).slice(5)}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------------- products tab ---------------- */
const EMPTY_FORM = {
  nameAr: "", nameEn: "", brand: "", size: "100ml", price: "", category: "men",
  imageUrl: "", stock: "25", discount: "0", isNew: false, descriptionAr: "", descriptionEn: "",
};

function ProductsTab({ products, reload, t, lang, flash }: any) {
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<any>(EMPTY_FORM);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  const startAdd = () => { setEditing(null); setForm(EMPTY_FORM); setOpen(true); };
  const startEdit = (p: Product) => {
    setEditing(p);
    setForm({
      nameAr: p.nameAr, nameEn: p.nameEn, brand: p.brand, size: p.size, price: String(p.price),
      category: p.category, imageUrl: p.imageUrl, stock: String(p.stock), discount: String(p.discount),
      isNew: p.isNew, descriptionAr: p.descriptionAr, descriptionEn: p.descriptionEn,
    });
    setOpen(true);
  };

  const save = async () => {
    setSaving(true);
    const payload = {
      ...form,
      id: editing?.id,
      price: Number(form.price),
      stock: Number(form.stock),
      discount: Number(form.discount),
    };
    const res = await fetch("/api/admin/products", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      setOpen(false);
      flash(t("a_saved"));
      reload();
    }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    if (res.ok) { flash(t("a_deleted")); reload(); }
  };

  const filtered = useMemo(
    () => products.filter((p: Product) =>
      !query || p.nameEn.toLowerCase().includes(query.toLowerCase()) || p.nameAr.includes(query) || p.brand.toLowerCase().includes(query.toLowerCase())
    ),
    [products, query]
  );

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search_placeholder")}
          className="glass w-full max-w-xs rounded-full px-5 py-2.5 text-sm text-[#f4ecd9] placeholder-[#8b8262] focus:outline-none"
        />
        <button onClick={startAdd} className="btn-gold flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold">
          <Plus size={14} /> {t("a_add_product")}
        </button>
      </div>

      <div className="glass overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[760px] text-start text-xs">
          <thead>
            <tr className="border-b border-[#c9a86a22] text-[10px] tracking-widest text-[#8b8262] uppercase">
              <th className="px-4 py-3 text-start">{t("a_products")}</th>
              <th className="px-4 py-3 text-start">{t("filter_brand")}</th>
              <th className="px-4 py-3 text-start">{t("a_price")}</th>
              <th className="px-4 py-3 text-start">{t("a_discount_str")}</th>
              <th className="px-4 py-3 text-start">{t("a_stock")}</th>
              <th className="px-4 py-3 text-start">{t("category_label")}</th>
              <th className="px-4 py-3 text-start">{t("a_actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p: Product) => (
              <tr key={p.id} className="border-b border-[#c9a86a11] hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.imageUrl} alt="" className="h-10 w-10 rounded-lg object-cover" loading="lazy" />
                    <div>
                      <p className="font-bold text-[#f4ecd9]">{p.nameEn}</p>
                      <p className="text-[10px] text-[#8b8262]">{p.nameAr} · {p.size}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[#cfc6ab]">{p.brand}</td>
                <td className="px-4 py-3 font-bold text-[#ffd700]">{p.price.toLocaleString()}</td>
                <td className="px-4 py-3">{p.discount}%</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3 text-[#c9a86a]">{p.category}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <button onClick={() => startEdit(p)} className="gold-border rounded-lg p-2 text-[#c9a86a] hover:bg-[#d4af3722]" aria-label={t("a_edit")}>
                      <Pencil size={12} />
                    </button>
                    <button onClick={() => del(p.id)} className="rounded-lg border border-red-900/50 p-2 text-red-400 hover:bg-red-950/40" aria-label={t("a_delete")}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* modal */}
      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-black/80 p-4">
          <div className="glass-strong my-8 w-full max-w-2xl rounded-3xl p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-base font-bold text-[#f4ecd9]">
                <PackagePlus size={18} className="text-[#d4af37]" />
                {editing ? t("a_edit") : t("a_add_product")}
              </h3>
              <button onClick={() => setOpen(false)} className="gold-border rounded-full p-2 text-[#c9a86a]" aria-label="close">
                <X size={15} />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label={t("a_name_ar")} value={form.nameAr} onChange={(v: string) => setForm({ ...form, nameAr: v })} dir="rtl" />
              <Field label={t("a_name_en")} value={form.nameEn} onChange={(v: string) => setForm({ ...form, nameEn: v })} />
              <Field label={t("filter_brand")} value={form.brand} onChange={(v: string) => setForm({ ...form, brand: v })} />
              <Field label={t("filter_size")} value={form.size} onChange={(v: string) => setForm({ ...form, size: v })} />
              <Field label={t("a_price") + " (EGP)"} value={form.price} onChange={(v: string) => setForm({ ...form, price: v })} type="number" />
              <Field label={t("a_discount_str")} value={form.discount} onChange={(v: string) => setForm({ ...form, discount: v })} type="number" />
              <Field label={t("a_stock")} value={form.stock} onChange={(v: string) => setForm({ ...form, stock: v })} type="number" />
              <div>
                <label className="mb-1 block text-[10px] font-bold tracking-widest text-[#8b8262] uppercase">{t("category_label")}</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="glass w-full rounded-xl px-3 py-2.5 text-sm text-[#f4ecd9] focus:outline-none">
                  {["men", "women", "unisex", "oriental", "home", "gift"].map((c) => (
                    <option key={c} value={c} className="bg-[#0a1931]">{c}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <Field label={t("a_image_url")} value={form.imageUrl} onChange={(v: string) => setForm({ ...form, imageUrl: v })} />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-[10px] font-bold tracking-widest text-[#8b8262] uppercase">{t("description")} (EN)</label>
                <textarea rows={2} value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
                  className="glass w-full resize-none rounded-xl px-3 py-2.5 text-sm text-[#f4ecd9] focus:outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-[10px] font-bold tracking-widest text-[#8b8262] uppercase">{t("description")} (AR)</label>
                <textarea rows={2} dir="rtl" value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
                  className="glass w-full resize-none rounded-xl px-3 py-2.5 text-sm text-[#f4ecd9] focus:outline-none" />
              </div>
              <label className="flex items-center gap-2 text-xs text-[#cfc6ab]">
                <input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} className="gold-range" />
                NEW
              </label>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={save} disabled={saving} className="btn-gold flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-bold">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                {t("a_save")}
              </button>
              <button onClick={() => setOpen(false)} className="flex-1 rounded-full border border-[#c9a86a44] py-3 text-sm font-semibold text-[#c9a86a]">
                {t("a_cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", dir }: any) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold tracking-widest text-[#8b8262] uppercase">{label}</label>
      <input type={type} dir={dir} value={value} onChange={(e) => onChange(e.target.value)}
        className="glass w-full rounded-xl px-3 py-2.5 text-sm text-[#f4ecd9] focus:border-[#d4af37] focus:outline-none" />
    </div>
  );
}

/* ---------------- orders tab ---------------- */
function OrdersTab({ orders, reload, t, lang, flash }: any) {
  const update = async (id: string, patch: any) => {
    const res = await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    if (res.ok) { flash(t("a_saved")); reload(); }
  };

  return (
    <div className="space-y-4">
      {orders.length === 0 && <div className="glass rounded-2xl p-10 text-center text-sm text-[#8b8262]">—</div>}
      {orders.map((o: Order) => (
        <div key={o.id} className="glass rounded-2xl p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span dir="ltr" className="text-sm font-bold tracking-[0.15em] text-[#ffd700]">{o.trackingCode}</span>
                <span className="text-[10px] text-[#8b8262]">{new Date(o.createdAt).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB")}</span>
              </div>
              <p className="mt-1.5 text-sm text-[#f4ecd9]">
                {o.customerName} <span className="text-[#8b8262]">· {o.customerPhone}</span>
              </p>
              <p className="mt-0.5 text-xs text-[#8b8262]">{o.governorate}</p>
            </div>
            <div className="text-end">
              <p className="text-lg font-bold text-[#ffd700]">{formatEGP(o.total, lang)}</p>
              <p className="text-[10px] text-[#8b8262]">{o.paymentMethod} · {o.paymentStatus}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <select
              value={o.orderStatus}
              onChange={(e) => update(o.id, { orderStatus: e.target.value })}
              className="glass rounded-full px-4 py-2 text-xs text-[#f4ecd9] focus:outline-none"
            >
              <option value="preparing" className="bg-[#0a1931]">{t("st_preparing")}</option>
              <option value="shipped" className="bg-[#0a1931]">{t("st_shipped")}</option>
              <option value="delivered" className="bg-[#0a1931]">{t("st_delivered")}</option>
            </select>
            <select
              value={o.paymentStatus}
              onChange={(e) => update(o.id, { paymentStatus: e.target.value })}
              className="glass rounded-full px-4 py-2 text-xs text-[#f4ecd9] focus:outline-none"
            >
              <option value="pending" className="bg-[#0a1931]">{t("payst_pending")}</option>
              <option value="paid" className="bg-[#0a1931]">{t("payst_paid")}</option>
              <option value="cod" className="bg-[#0a1931]">{t("payst_cod")}</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- coupons tab ---------------- */
function CouponsTab({ coupons, reload, t, flash }: any) {
  const [form, setForm] = useState({ code: "", discountPercent: "10", maxUses: "100" });

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) return;
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) { flash(t("a_saved")); setForm({ code: "", discountPercent: "10", maxUses: "100" }); reload(); }
  };

  const toggle = async (c: Coupon) => {
    await fetch("/api/admin/coupons", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: c.id, active: !c.active, discountPercent: c.discountPercent, maxUses: c.maxUses }),
    });
    reload();
  };

  const del = async (id: number) => {
    await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
    flash(t("a_deleted"));
    reload();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      <form onSubmit={create} className="glass space-y-4 self-start rounded-3xl p-6">
        <h3 className="flex items-center gap-2 text-sm font-bold text-[#f4ecd9]">
          <TicketPercent size={16} className="text-[#d4af37]" /> {t("a_new_coupon")}
        </h3>
        <Field label={t("a_code")} value={form.code} onChange={(v: string) => setForm({ ...form, code: v.toUpperCase() })} />
        <Field label={t("a_percent_str")} type="number" value={form.discountPercent} onChange={(v: string) => setForm({ ...form, discountPercent: v })} />
        <Field label="Max uses" type="number" value={form.maxUses} onChange={(v: string) => setForm({ ...form, maxUses: v })} />
        <button className="btn-gold w-full rounded-full py-3 text-sm font-bold">{t("a_save")}</button>
      </form>
      <div className="space-y-3">
        {coupons.map((c: Coupon) => (
          <div key={c.id} className="glass flex items-center justify-between gap-4 rounded-2xl px-5 py-4">
            <div>
              <span dir="ltr" className="text-base font-bold tracking-[0.2em] text-[#ffd700]">{c.code}</span>
              <p className="mt-0.5 text-xs text-[#8b8262]">
                {c.discountPercent}% · {t("a_used")}: {c.usedCount}/{c.maxUses}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggle(c)}
                className={cn("rounded-full px-4 py-1.5 text-[10px] font-bold", c.active ? "bg-emerald-500/20 text-emerald-300" : "bg-red-900/30 text-red-300")}>
                {c.active ? t("a_active") : "OFF"}
              </button>
              <button onClick={() => del(c.id)} className="rounded-lg border border-red-900/50 p-2 text-red-400 hover:bg-red-950/40" aria-label={t("a_delete")}>
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- shipping tab ---------------- */
function ShippingTab({ rates, reload, t, lang, flash }: any) {
  const [prices, setPrices] = useState<Record<number, number>>({});

  useEffect(() => {
    setPrices(Object.fromEntries(rates.map((r: Rate) => [r.id, r.price])));
  }, [rates]);

  const save = async (r: Rate) => {
    const res = await fetch("/api/admin/shipping", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: r.id, price: prices[r.id], estimatedDays: r.estimatedDays }),
    });
    if (res.ok) { flash(t("a_saved")); reload(); }
  };

  return (
    <div className="glass overflow-hidden rounded-2xl">
      <table className="w-full min-w-[560px] text-xs">
        <thead>
          <tr className="border-b border-[#c9a86a22] text-[10px] tracking-widest text-[#8b8262] uppercase">
            <th className="px-4 py-3 text-start">{t("governorate")}</th>
            <th className="px-4 py-3 text-start">{t("a_price")} (EGP)</th>
            <th className="px-4 py-3 text-start">{t("est_delivery")}</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {rates.map((r: Rate) => (
            <tr key={r.id} className="border-b border-[#c9a86a11]">
              <td className="px-4 py-2.5 font-semibold text-[#f4ecd9]">{lang === "ar" ? r.governorateAr : r.governorate}</td>
              <td className="px-4 py-2.5">
                <input
                  type="number"
                  value={prices[r.id] ?? r.price}
                  onChange={(e) => setPrices({ ...prices, [r.id]: Math.max(0, Number(e.target.value)) })}
                  className="glass w-24 rounded-lg px-3 py-1.5 text-[#ffd700] focus:outline-none"
                />
              </td>
              <td className="px-4 py-2.5 text-[#8b8262]">{r.estimatedDays}</td>
              <td className="px-4 py-2.5">
                <button onClick={() => save(r)} className="btn-gold rounded-full px-4 py-1.5 text-[10px] font-bold">{t("a_save")}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

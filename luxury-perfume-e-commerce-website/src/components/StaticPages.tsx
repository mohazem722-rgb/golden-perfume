"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, Eye, Landmark, MapPin, Phone, Quote, Send, ShieldCheck, Store } from "lucide-react";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";
import { cn } from "@/lib/utils";
import { STORE_IMAGES as STORE_IMGS } from "@/lib/images";

/* ---------------- About ---------------- */
export function AboutPage() {
  const { t } = useLang();
  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-20 md:px-6">
      <Reveal className="text-center">
        <span className="text-[11px] font-bold tracking-[0.4em] text-[#c9a86a] uppercase">{t("hero_badge")}</span>
        <h1 className="text-gold-grad mt-3 text-4xl font-bold sm:text-6xl">{t("about_title")}</h1>
        <div className="divider-gold mx-auto mt-6 max-w-md" />
      </Reveal>

      <div className="mt-14 grid gap-10 md:grid-cols-2">
        <Reveal>
          <div className="glass h-full rounded-3xl p-8">
            <span className="gold-border mb-5 flex h-12 w-12 items-center justify-center rounded-full text-[#d4af37]">
              <Quote size={20} />
            </span>
            <p className="mb-4 text-base leading-loose text-[#cfc6ab]">{t("about_story_p1")}</p>
            <p className="text-base leading-loose text-[#cfc6ab]">{t("about_story_p2")}</p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="glass flex h-full flex-col rounded-3xl p-8">
            <span className="gold-border mb-5 flex h-12 w-12 items-center justify-center rounded-full text-[#d4af37]">
              <Eye size={20} />
            </span>
            <h2 className="mb-4 text-2xl font-bold text-[#f4ecd9]">{t("about_vision")}</h2>
            <p className="text-base leading-loose text-[#cfc6ab]">{t("about_vision_p")}</p>
            <div className="mt-auto pt-8">
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  ["2010", t("hero_badge")],
                  ["90+", t("products_count")],
                  ["27", t("governorate")],
                ].map(([v, l]) => (
                  <div key={l} className="rounded-2xl border border-[#c9a86a2e] py-4">
                    <div className="text-gold-grad text-2xl font-bold">{v}</div>
                    <div className="mt-1 text-[10px] tracking-widest text-[#8b8262] uppercase">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-16">
        <h2 className="mb-8 flex items-center justify-center gap-3 text-center text-2xl font-bold text-[#f4ecd9]">
          <Store size={22} className="text-[#d4af37]" />
          {t("our_stores")}
        </h2>
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-3">
        {STORE_IMGS.map((src, i) => (
          <Reveal key={src} delay={i * 100}>
            <div className="group aspect-[4/3] overflow-hidden rounded-2xl border border-[#c9a86a2e]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Boutique ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ---------------- FAQ ---------------- */
const FAQ_ITEMS: { q: { ar: string; en: string }; a: { ar: string; en: string } }[] = [
  {
    q: { ar: "كم تستغرق مدة الشحن؟", en: "How long does shipping take?" },
    a: { ar: "القاهرة والجيزة 1-2 يوم، الإسكندرية والدلتا 2-3 أيام، وباقي المحافظات من 3 إلى 7 أيام عمل حسب شركات الشحن — تجد المدة التقديرية بجوار كل محافظة عند إتمام الطلب.", en: "Cairo & Giza 1–2 days, Alexandria & Delta 2–3 days, other governorates 3–7 business days depending on courier. The estimate shows next to each governorate at checkout." },
  },
  {
    q: { ar: "ما هي تكلفة الشحن؟", en: "How much is shipping?" },
    a: { ar: "تُحسب تلقائياً حسب المحافظة (من 60 إلى 110 ج.م) وتظهر في إجمالي الطلب قبل الدفع. الشحن مجاني للطلبات فوق 10,000 ج.م.", en: "Calculated automatically by governorate (60–110 EGP) and shown in your total before payment. Orders above EGP 10,000 ship free." },
  },
  {
    q: { ar: "ما هي سياسة الاسترجاع؟", en: "What is the return policy?" },
    a: { ar: "يمكنك الاسترجاع خلال 14 يوماً بشرط أن تكون العبوة مغلقة بالغلاف الخلوفان الأصلي وغير مستخدمة، مع إرفاق فاتورة الشراء. راجع صفحة سياسة الاسترجاع للتفاصيل الكاملة.", en: "You may return within 14 days provided the box is sealed in its original cellophane and unused, with proof of purchase. See the Return Policy page for full details." },
  },
  {
    q: { ar: "ما هي طرق الدفع المتاحة؟", en: "Which payment methods do you accept?" },
    a: { ar: "الدفع عند الاستلام متاح لجميع المحافظات. كما تتوفر فودافون كاش وفيزا/ماستركارد وإنستاباي — بوابات الدفع الإلكتروني قيد التفعيل وسيتم تفعيلها قريباً.", en: "Cash on delivery is available nationwide. Vodafone Cash, Visa/Mastercard and InstaPay are also listed — online gateways are being activated and will go live soon." },
  },
  {
    q: { ar: "هل منتجاتكم أصلية؟", en: "Are your products original?" },
    a: { ar: "نعم 100% — جميع العطور من موزعين معتمدين وتصلك مغلفة بالغلاف الأصلي مع ضمان ميزون نوار للأصالة.", en: "Yes, 100% — all fragrances come from certified distributors, arrive in original sealed packaging, and carry the MAISON NOIR authenticity guarantee." },
  },
  {
    q: { ar: "كيف أتتبع طلبي؟", en: "How do I track my order?" },
    a: { ar: "بعد تأكيد الطلب تحصل على رقم تتبع — استخدمه في صفحة «تتبع الطلب» مع رقم هاتفك لمعرفة الحالة: قيد التجهيز ثم تم الشحن ثم تم التوصيل.", en: "After placing your order you receive a tracking code — use it on the Track Order page with your phone number to follow: Preparing → Shipped → Delivered." },
  },
  {
    q: { ar: "هل يمكنني إهداء الطلب بتغليف هدايا؟", en: "Can I send my order as a wrapped gift?" },
    a: { ar: "بالتأكيد — فعّل خيار التغليف الفاخر عند إتمام الطلب (+50 ج.م) وأضف نص بطاقة الإهداء، وسيصل الطلب مغلفاً بحرير أسود وشريط ذهبي.", en: "Absolutely — enable luxury gift wrap at checkout (+50 EGP) and add your gift-card message; the order arrives wrapped in black silk with a gold ribbon." },
  },
];

export function FaqPage() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto max-w-3xl px-4 pt-28 pb-20 md:px-6">
      <Reveal className="text-center">
        <span className="text-[11px] font-bold tracking-[0.4em] text-[#c9a86a] uppercase">MAISON NOIR</span>
        <h1 className="text-gold-grad mt-3 text-3xl font-bold sm:text-5xl">{t("faq_title")}</h1>
      </Reveal>
      <div className="mt-12 space-y-3">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={i} delay={i * 60}>
              <div className={cn("glass overflow-hidden rounded-2xl transition", isOpen && "border-[#d4af3766]")}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-bold text-[#f4ecd9]">{item.q[lang]}</span>
                  <ChevronDown size={18} className={cn("shrink-0 text-[#d4af37] transition-transform duration-300", isOpen && "rotate-180")} />
                </button>
                <div className={cn("accordion-content", isOpen && "open")}>
                  <div>
                    <p className="px-6 pb-5 text-sm leading-relaxed text-[#a89f86]">{item.a[lang]}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Contact ---------------- */
export function ContactPage() {
  const { t } = useLang();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "contact", name, phone, message }),
    });
    if (res.ok) setSent(true);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-20 md:px-6">
      <Reveal className="text-center">
        <span className="text-[11px] font-bold tracking-[0.4em] text-[#c9a86a] uppercase">MAISON NOIR</span>
        <h1 className="text-gold-grad mt-3 text-3xl font-bold sm:text-5xl">{t("contact_title")}</h1>
        <p className="mt-3 text-sm text-[#8b8262]">{t("contact_sub")}</p>
      </Reveal>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {/* form */}
        <Reveal>
          <form onSubmit={submit} className="glass space-y-4 rounded-3xl p-7">
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder={t("name_label")}
              className="glass w-full rounded-xl px-4 py-3.5 text-sm text-[#f4ecd9] placeholder-[#8b8262] focus:border-[#d4af37] focus:outline-none" />
            <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t("phone")} inputMode="tel"
              className="glass w-full rounded-xl px-4 py-3.5 text-sm text-[#f4ecd9] placeholder-[#8b8262] focus:border-[#d4af37] focus:outline-none" />
            <textarea required value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder={t("message")}
              className="glass w-full resize-none rounded-xl px-4 py-3.5 text-sm text-[#f4ecd9] placeholder-[#8b8262] focus:border-[#d4af37] focus:outline-none" />
            {sent ? (
              <p className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
                <CheckCircle2 size={16} /> {t("message_sent")}
              </p>
            ) : (
              <button className="btn-gold flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold">
                <Send size={15} />
                {t("send")}
              </button>
            )}
          </form>
        </Reveal>

        {/* branches + map */}
        <Reveal delay={120}>
          <div className="space-y-5">
            <div className="glass relative aspect-video overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(201,168,106,0.15),transparent_60%),linear-gradient(140deg,#0a1931,#050507)]" />
              {/* abstract map grid */}
              <svg className="absolute inset-0 h-full w-full opacity-25" aria-hidden="true">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#c9a86a" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                <span className="pulse-gold flex h-14 w-14 items-center justify-center rounded-full bg-[#d4af37] text-black">
                  <MapPin size={24} />
                </span>
                <p className="text-sm font-semibold text-[#f4ecd9]">{t("branches_title")}</p>
                <p className="text-xs text-[#c9a86a]">{t("coming_soon_addr")}</p>
              </div>
            </div>

            <div className="glass rounded-3xl p-6">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-[#f4ecd9]">
                <Landmark size={16} className="text-[#d4af37]" /> {t("branches_title")}
              </h3>
              <ul className="space-y-3 text-sm text-[#a89f86]">
                <li className="flex items-center gap-3">
                  <MapPin size={14} className="text-[#c9a86a]" /> {t("coming_soon_addr")}
                </li>
                <li className="flex items-center gap-3">
                  <MapPin size={14} className="text-[#c9a86a]" /> {t("coming_soon_addr")}
                </li>
              </ul>
              <div className="divider-gold my-5" />
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-[#f4ecd9]">
                <Phone size={16} className="text-[#d4af37]" /> {t("phone_lines")}
              </h3>
              <ul className="space-y-3 text-sm text-[#a89f86]" dir="ltr">
                <li className="flex items-center gap-3 text-end">
                  <Phone size={14} className="text-[#c9a86a]" /> +20 — · {t("coming_soon_addr")}
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={14} className="text-[#c9a86a]" /> +20 — · {t("coming_soon_addr")}
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ---------------- Returns ---------------- */
export function ReturnsPage() {
  const { t, lang } = useLang();
  const points =
    lang === "ar"
      ? [
          "يحق لك استرجاع المنتج خلال 14 يوماً من تاريخ الاستلام.",
          "يجب أن تكون العبوة مغلقة بالغلاف الخلوفان الأصلي وغير مستخدمة إطلاقاً.",
          "يُستثنى من الاسترجاع: الزيوت الشرقية المعبأة (التولة)، البخور المفتوح، ومنتجات العناية المستخدمة.",
          "في حال تلف المنتج أثناء الشحن، تواصل معنا خلال 48 ساعة بصورة واضحة وسيتم الاستبدال فوراً.",
          "يُسترد المبلغ بنفس وسيلة الدفع خلال 5-10 أيام عمل بعد فحص المنتج.",
          "الشحن غير مسترد إلا في حالات الخطأ من طرفنا أو التلف أثناء النقل.",
          "لطلبات الهدايا المغلفة: يُسترد المبلغ بعد خصم رسوم التغليف (50 ج.م).",
        ]
      : [
          "You may return any product within 14 days of delivery.",
          "The box must remain sealed in its original cellophane and completely unused.",
          "Excluded from returns: decanted oriental oils (tola), opened incense, and used grooming products.",
          "If a product arrives damaged in transit, contact us within 48 hours with a clear photo for an immediate replacement.",
          "Refunds are issued to the original payment method within 5–10 business days after inspection.",
          "Shipping fees are non-refundable except for our error or transit damage.",
          "Gift-wrapped orders are refunded minus the wrapping fee (50 EGP).",
        ];
  return (
    <div className="mx-auto max-w-3xl px-4 pt-28 pb-20 md:px-6">
      <Reveal className="text-center">
        <span className="text-[11px] font-bold tracking-[0.4em] text-[#c9a86a] uppercase">MAISON NOIR</span>
        <h1 className="text-gold-grad mt-3 text-3xl font-bold sm:text-5xl">{t("returns_title")}</h1>
        <p className="mt-3 inline-flex items-center gap-2 text-sm text-[#c9a86a]">
          <ShieldCheck size={15} /> 14 {t("days")}
        </p>
      </Reveal>
      <div className="mt-10 space-y-4">
        {points.map((p, i) => (
          <Reveal key={i} delay={i * 60}>
            <div className="glass flex gap-4 rounded-2xl p-5">
              <span className="btn-gold flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                {(i + 1).toLocaleString(lang === "ar" ? "ar-EG" : "en-US")}
              </span>
              <p className="text-sm leading-relaxed text-[#cfc6ab]">{p}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={200} className="mt-10 text-center">
        <a href="/contact" className="btn-gold inline-block rounded-full px-8 py-3.5 text-sm font-bold">
          {t("nav_contact")}
        </a>
      </Reveal>
    </div>
  );
}

# MAISON NOIR — Luxury Perfume E-Commerce

Premium bilingual (AR/EN, RTL/LTR) perfume boutique. Dark luxury palette (black / navy / gold),
scroll-scrubbed cinematic hero, full commerce flow, and an admin panel.

## Stack
- Next.js (App Router) + TypeScript + Tailwind CSS v4 + lucide-react
- PostgreSQL via Drizzle ORM (local instance, implements the Supabase-style schema:
  products, orders, coupons, reviews, customers, shipping_rates, subscribers, contact_messages)

## Getting started
```bash
npm install
npx drizzle-kit push        # create tables
npx tsx scripts/seed.ts     # 90 products, 27 governorates, coupons, demo orders
npm run dev
```

## Key routes
- `/` Home (hero scroll scene, offers slider, categories, latest, countdown)
- `/products` search + filters + sort · `/product/[id]` detail, zoom, reviews
- `/offers` · `/bestsellers` · `/about` · `/contact` · `/faq` · `/returns`
- `/cart` · `/checkout` · `/track` (tracking code + phone) · `/account`
- `/admin` admin panel

## Admin panel
- URL: `/admin`
- Password: env `ADMIN_PASSWORD` (default `maison-noir-admin`)
- Capabilities: product CRUD (name/brand/size/price/category/image/stock/discount),
  edit prices, order status (قيد التجهيز → تم الشحن → تم التوصيل) and payment status,
  coupon CRUD, shipping-rate editing per governorate, daily/monthly revenue charts.

## Configuration
| Env var | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection (required) |
| `ADMIN_PASSWORD` | Admin panel password |
| `SESSION_SECRET` | HMAC secret for session cookies |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp float button number (placeholder `201000000000`) |

Payment gateway (Vodafone Cash / Visa / InstaPay) and SMS/email providers are placeholder-ready:
orders placed via online methods are stored with `payment_status = pending` and the UI shows
“Integration required”. Wire a real gateway (e.g. Paymob/Fawry) in `POST /api/orders/create`
and update `payment_status` from a webhook — set gateway keys as env vars, never in code.

## Managing catalog & shipping
- Add/edit products from `/admin` → Products (appears on the site instantly).
- Shipping per governorate: `/admin` → Shipping.
- Coupons: `/admin` → Coupons (seeded: `NOIR10`, `GOLD20`, `OUD15`).
- Placeholder contact numbers/addresses intentionally read “Coming soon — to be confirmed”
  until real details are provided.

## Gift wrap
Checkout checkbox adds +50 EGP and stores the gift-card message on the order.

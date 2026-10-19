# MAISON NOIR — Luxury Perfume E-Commerce

Premium bilingual (AR/EN, RTL/LTR) perfume boutique. Dark luxury palette (black / navy / gold),
scroll-scrubbed cinematic hero, full commerce flow, and an admin panel.

## Stack
- Next.js (App Router) + TypeScript + Tailwind CSS v4 + lucide-react
- **Backend: Supabase Postgres** (project `golden-perfume`, eu-central-1) via Drizzle ORM:
  products, orders, coupons, reviews, customers, shipping_rates, subscribers, contact_messages.
  RLS is enabled; the browser never talks to the DB directly — all access goes through
  Next.js API routes using the server-side connection.
- Self-hosted fonts (Fontsource) — no Google Fonts request at build time.

## Getting started
```bash
cp .env.example .env.local   # fill in the Supabase keys/passwords
npm install
npm run db:push              # create tables (uses DIRECT_URL, port 5432)
npm run db:seed              # 90 products, 27 governorates, coupons, demo orders
npm run dev
```

## Deploying on Vercel (verified setup)
- **Root Directory:** `luxury-perfume-e-commerce-website` (the app is not at repo root)
- **Framework:** Next.js · **Node:** >= 20 · Region pinned near the DB (`fra1`, see `vercel.json`)
- Required env vars (Production + Preview):
  `DATABASE_URL` = Supabase **transaction pooler** URL (port **6543**, user `postgres.<ref>`),
  `DIRECT_URL` = direct URL (port 5432, migrations/seed only),
  `SESSION_SECRET`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- ⚠️ Never use the direct 5432 URL as `DATABASE_URL` on Vercel: serverless functions
  would exhaust Postgres connections. The pool in `src/db/index.ts` is capped at
  1 client per invocation for this reason.

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

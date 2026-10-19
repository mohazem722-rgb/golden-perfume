import { NextRequest, NextResponse } from "next/server";
import { eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { products, shippingRates, coupons, orders } from "@/db/schema";
import { getCustomerId } from "@/lib/session";

export const dynamic = "force-dynamic";

const PAYMENT_METHODS = new Set(["cod", "vodafone_cash", "visa", "instapay"]);

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const { items, customer, governorate, address, couponCode, giftWrap, giftCardText, paymentMethod } = body;
  if (!customer?.name || !customer?.phone || !governorate || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  if (!PAYMENT_METHODS.has(paymentMethod)) {
    return NextResponse.json({ error: "bad_payment" }, { status: 400 });
  }

  // --- validate items against DB prices ---
  const ids = items.map((i: any) => parseInt(i.productId, 10)).filter((n: number) => Number.isFinite(n));
  if (!ids.length) return NextResponse.json({ error: "empty_cart" }, { status: 400 });
  const rows = await db.select().from(products).where(inArray(products.id, ids));
  const byId = new Map(rows.map((r) => [r.id, r]));

  let subtotal = 0;
  const lineItems: any[] = [];
  for (const it of items) {
    const p = byId.get(parseInt(it.productId, 10));
    if (!p) continue;
    const qty = Math.min(Math.max(parseInt(it.qty, 10) || 1, 1), 20);
    const unit = Math.round(p.price * (1 - p.discount / 100));
    subtotal += unit * qty;
    lineItems.push({
      productId: p.id,
      nameAr: p.nameAr,
      nameEn: p.nameEn,
      size: p.size,
      qty,
      price: unit,
    });
  }
  if (!lineItems.length) return NextResponse.json({ error: "empty_cart" }, { status: 400 });

  // --- shipping by governorate (default 75 EGP) ---
  const [rate] = await db.select().from(shippingRates).where(eq(shippingRates.governorate, governorate));
  const shippingCost = rate?.price ?? 75;

  // --- coupon ---
  let discountAmount = 0;
  let finalCode = "";
  if (couponCode) {
    const [c] = await db.select().from(coupons).where(eq(coupons.code, String(couponCode).toUpperCase().trim()));
    const now = new Date();
    if (c && c.active && c.usedCount < c.maxUses && (!c.expiresAt || new Date(c.expiresAt) > now)) {
      discountAmount = Math.round(subtotal * (c.discountPercent / 100));
      finalCode = c.code;
      await db.update(coupons).set({ usedCount: sql`${coupons.usedCount} + 1` }).where(eq(coupons.id, c.id));
    }
  }

  const gift = !!giftWrap;
  const total = subtotal - discountAmount + shippingCost + (gift ? 50 : 0);
  const customerId = await getCustomerId();

  const orderId = crypto.randomUUID();
  const trackingCode = orderId.replace(/-/g, "").slice(0, 8).toUpperCase();

  await db.insert(orders).values({
    id: orderId,
    trackingCode,
    customerId,
    customerName: String(customer.name).slice(0, 160),
    customerPhone: String(customer.phone).slice(0, 40),
    customerEmail: String(customer.email || "").slice(0, 160),
    governorate,
    address: String(address || "").slice(0, 500),
    items: lineItems,
    subtotal,
    shippingCost,
    discountCode: finalCode,
    discountAmount,
    giftWrap: gift,
    giftCardText: String(giftCardText || "").slice(0, 500),
    total,
    paymentMethod,
    paymentStatus: paymentMethod === "cod" ? "cod" : "pending",
    orderStatus: "preparing",
  });

  // bump sales counters
  for (const li of lineItems) {
    await db.update(products).set({ sales: sql`${products.sales} + ${li.qty}` }).where(eq(products.id, li.productId));
  }

  return NextResponse.json({ ok: true, orderId, trackingCode, total, estimatedDays: rate?.estimatedDays ?? "3-5" });
}

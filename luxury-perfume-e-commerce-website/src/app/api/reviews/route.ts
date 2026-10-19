import { NextRequest, NextResponse } from "next/server";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { reviews, products } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const productId = parseInt(req.nextUrl.searchParams.get("productId") || "", 10);
  if (!Number.isFinite(productId)) return NextResponse.json({ reviews: [] });
  const rows = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, productId))
    .orderBy(desc(reviews.createdAt))
    .limit(50);
  return NextResponse.json({ reviews: rows });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false }, { status: 400 });
  const productId = parseInt(body.productId, 10);
  const rating = Math.min(5, Math.max(1, parseInt(body.rating, 10) || 5));
  const name = String(body.name || "").slice(0, 120);
  const comment = String(body.comment || "").slice(0, 1000);
  if (!Number.isFinite(productId) || !name) return NextResponse.json({ ok: false }, { status: 400 });

  await db.insert(reviews).values({ productId, customerName: name, rating, comment });

  // recalc aggregate
  const [agg] = await db
    .select({ avg: sql<number>`avg(${reviews.rating})::float`, count: sql<number>`count(*)::int` })
    .from(reviews)
    .where(eq(reviews.productId, productId));

  // blend with seed base so a single review doesn't dominate heavily
  await db
    .update(products)
    .set({
      rating: Math.round((agg.avg ?? rating) * 10) / 10,
      reviewsCount: sql`${products.reviewsCount} + 1`,
    })
    .where(eq(products.id, productId));

  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { asc, desc, ilike, or, and, eq, sql, inArray } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const q = sp.get("q")?.trim();
  const category = sp.get("category");
  const limit = Math.min(parseInt(sp.get("limit") || "100", 10) || 100, 200);
  const sort = sp.get("sort") || "featured";
  const discounted = sp.get("discounted") === "1";
  const ids = sp.get("ids");

  const conds = [] as any[];
  if (q) {
    conds.push(
      or(
        ilike(products.nameAr, `%${q}%`),
        ilike(products.nameEn, `%${q}%`),
        ilike(products.brand, `%${q}%`)
      )
    );
  }
  if (category && category !== "all") conds.push(eq(products.category, category));
  if (discounted) conds.push(sql`${products.discount} > 0`);
  if (ids) {
    const idList = ids.split(",").map((x) => parseInt(x, 10)).filter((n) => Number.isFinite(n));
    if (idList.length) conds.push(inArray(products.id, idList));
  }

  const orderBy =
    sort === "price_low"
      ? asc(sql`${products.price} * (1 - ${products.discount} / 100.0)`)
      : sort === "price_high"
        ? desc(sql`${products.price} * (1 - ${products.discount} / 100.0)`)
        : sort === "rating"
          ? desc(products.rating)
          : sort === "newest"
            ? desc(products.createdAt)
            : sort === "bestseller"
              ? desc(products.sales)
              : asc(products.id);

  const rows = await db
    .select()
    .from(products)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(orderBy)
    .limit(limit);

  return NextResponse.json({ products: rows });
}

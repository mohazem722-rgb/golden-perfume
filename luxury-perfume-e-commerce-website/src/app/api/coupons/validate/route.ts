import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { coupons } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { code } = await req.json().catch(() => ({ code: "" }));
  if (!code) return NextResponse.json({ valid: false }, { status: 400 });

  const [coupon] = await db.select().from(coupons).where(eq(coupons.code, String(code).toUpperCase().trim()));

  const now = new Date();
  const valid =
    !!coupon &&
    coupon.active &&
    coupon.usedCount < coupon.maxUses &&
    (!coupon.expiresAt || new Date(coupon.expiresAt) > now);

  if (!valid) return NextResponse.json({ valid: false });
  return NextResponse.json({ valid: true, code: coupon.code, discountPercent: coupon.discountPercent });
}

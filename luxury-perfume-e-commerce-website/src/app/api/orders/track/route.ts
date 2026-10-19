import { NextRequest, NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")?.trim().toUpperCase();
  const phone = req.nextUrl.searchParams.get("phone")?.replace(/\D/g, "");
  if (!code || !phone) return NextResponse.json({ error: "missing" }, { status: 400 });

  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.trackingCode, code), sql`regexp_replace(${orders.customerPhone}, '[^0-9]', '', 'g') LIKE ${"%" + phone.slice(-9)}`));

  if (!order) return NextResponse.json({ found: false });
  return NextResponse.json({
    found: true,
    order: {
      trackingCode: order.trackingCode,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      total: order.total,
      governorate: order.governorate,
      createdAt: order.createdAt,
      items: order.items,
    },
  });
}

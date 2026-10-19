import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { isAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(200);
  return NextResponse.json({ orders: rows });
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body?.id) return NextResponse.json({ ok: false }, { status: 400 });
  const patch: Record<string, string> = {};
  if (["preparing", "shipped", "delivered"].includes(body.orderStatus)) patch.orderStatus = body.orderStatus;
  if (["pending", "paid", "cod", "failed"].includes(body.paymentStatus)) patch.paymentStatus = body.paymentStatus;
  if (!Object.keys(patch).length) return NextResponse.json({ ok: false }, { status: 400 });
  await db.update(orders).set(patch).where(eq(orders.id, String(body.id)));
  return NextResponse.json({ ok: true });
}

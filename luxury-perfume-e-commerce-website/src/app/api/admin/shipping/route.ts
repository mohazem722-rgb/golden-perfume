import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { shippingRates } from "@/db/schema";
import { isAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const b = await req.json().catch(() => null);
  const id = parseInt(b?.id, 10);
  if (!Number.isFinite(id)) return NextResponse.json({ ok: false }, { status: 400 });
  await db
    .update(shippingRates)
    .set({
      price: Math.max(0, Math.round(Number(b.price) || 0)),
      estimatedDays: String(b.estimatedDays || "2-4").slice(0, 20),
    })
    .where(eq(shippingRates.id, id));
  return NextResponse.json({ ok: true });
}

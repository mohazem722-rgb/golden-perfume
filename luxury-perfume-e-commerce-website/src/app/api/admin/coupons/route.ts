import { NextRequest, NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { isAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const rows = await db.select().from(coupons).orderBy(asc(coupons.id));
  return NextResponse.json({ coupons: rows });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const b = await req.json().catch(() => null);
  const code = String(b?.code || "").toUpperCase().trim().slice(0, 40);
  const discountPercent = Math.min(90, Math.max(1, Math.round(Number(b?.discountPercent) || 0)));
  if (!code || !discountPercent) return NextResponse.json({ ok: false }, { status: 400 });
  await db
    .insert(coupons)
    .values({
      code,
      discountPercent,
      maxUses: Math.max(1, Math.round(Number(b?.maxUses) || 100)),
      expiresAt: b?.expiresAt ? new Date(b.expiresAt) : null,
      active: true,
    })
    .onConflictDoUpdate({ target: coupons.code, set: { discountPercent, active: true, usedCount: 0 } });
  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const b = await req.json().catch(() => null);
  const id = parseInt(b?.id, 10);
  if (!Number.isFinite(id)) return NextResponse.json({ ok: false }, { status: 400 });
  await db
    .update(coupons)
    .set({
      active: !!b.active,
      discountPercent: Math.min(90, Math.max(1, Math.round(Number(b.discountPercent) || 1))),
      maxUses: Math.max(1, Math.round(Number(b.maxUses) || 100)),
    })
    .where(eq(coupons.id, id));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const id = parseInt(req.nextUrl.searchParams.get("id") || "", 10);
  if (!Number.isFinite(id)) return NextResponse.json({ ok: false }, { status: 400 });
  await db.delete(coupons).where(eq(coupons.id, id));
  return NextResponse.json({ ok: true });
}

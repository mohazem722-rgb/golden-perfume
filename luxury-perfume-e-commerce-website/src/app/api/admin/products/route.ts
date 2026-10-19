import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { isAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

function sanitize(b: any) {
  return {
    nameAr: String(b.nameAr || "").slice(0, 255),
    nameEn: String(b.nameEn || "").slice(0, 255),
    brand: String(b.brand || "").slice(0, 120),
    size: String(b.size || "100ml").slice(0, 40),
    price: Math.max(0, Math.round(Number(b.price) || 0)),
    category: ["men", "women", "unisex", "oriental", "home", "gift"].includes(b.category) ? b.category : "men",
    imageUrl: String(b.imageUrl || "").slice(0, 700),
    stock: Math.max(0, Math.round(Number(b.stock) || 0)),
    discount: Math.min(90, Math.max(0, Math.round(Number(b.discount) || 0))),
    isNew: !!b.isNew,
    descriptionAr: String(b.descriptionAr || "").slice(0, 2000),
    descriptionEn: String(b.descriptionEn || "").slice(0, 2000),
  };
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body?.nameAr || !body?.nameEn) return NextResponse.json({ ok: false }, { status: 400 });
  const [row] = await db.insert(products).values(sanitize(body)).returning({ id: products.id });
  return NextResponse.json({ ok: true, id: row.id });
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const body = await req.json().catch(() => null);
  const id = parseInt(body?.id, 10);
  if (!Number.isFinite(id)) return NextResponse.json({ ok: false }, { status: 400 });
  await db.update(products).set(sanitize(body)).where(eq(products.id, id));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const id = parseInt(req.nextUrl.searchParams.get("id") || "", 10);
  if (!Number.isFinite(id)) return NextResponse.json({ ok: false }, { status: 400 });
  await db.delete(products).where(eq(products.id, id));
  return NextResponse.json({ ok: true });
}

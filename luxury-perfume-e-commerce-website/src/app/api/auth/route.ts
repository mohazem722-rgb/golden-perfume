import { NextRequest, NextResponse } from "next/server";
import { desc, eq, or } from "drizzle-orm";
import { db } from "@/db";
import { customers, orders } from "@/db/schema";
import { sign, storedPasswordHash, verify, verifyPassword } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const { cookies } = await import("next/headers");
  const store = await cookies();
  const idStr = verify(store.get("mn_cust")?.value);
  if (!idStr) return NextResponse.json({ customer: null });
  const id = parseInt(idStr, 10);
  if (!Number.isFinite(id)) return NextResponse.json({ customer: null });
  const [c] = await db.select().from(customers).where(eq(customers.id, id));
  if (!c) return NextResponse.json({ customer: null });

  const customerOrders = await db
    .select()
    .from(orders)
    .where(or(eq(orders.customerId, id), eq(orders.customerPhone, c.phone)))
    .orderBy(desc(orders.createdAt))
    .limit(30);

  return NextResponse.json({
    customer: { id: c.id, name: c.name, email: c.email, phone: c.phone },
    orders: customerOrders,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.action) return NextResponse.json({ ok: false }, { status: 400 });

  if (body.action === "logout") {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("mn_cust", "", { httpOnly: true, maxAge: 0, path: "/" });
    return res;
  }

  const email = String(body.email || "").toLowerCase().trim();
  const password = String(body.password || "");
  if (!email.includes("@") || password.length < 4) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });

  if (body.action === "register") {
    const name = String(body.name || "").slice(0, 160);
    const phone = String(body.phone || "").slice(0, 40);
    if (!name) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
    const [exists] = await db.select({ id: customers.id }).from(customers).where(eq(customers.email, email));
    if (exists) return NextResponse.json({ ok: false, error: "exists" }, { status: 409 });
    const [c] = await db
      .insert(customers)
      .values({ name, email, phone, passwordHash: storedPasswordHash(password) })
      .returning({ id: customers.id });
    const res = NextResponse.json({ ok: true });
    res.cookies.set("mn_cust", sign(String(c.id)), { httpOnly: true, maxAge: 60 * 60 * 24 * 30, path: "/", sameSite: "lax" });
    return res;
  }

  if (body.action === "login") {
    const [c] = await db.select().from(customers).where(eq(customers.email, email));
    if (!c || !verifyPassword(password, c.passwordHash)) {
      return NextResponse.json({ ok: false, error: "invalid" }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set("mn_cust", sign(String(c.id)), { httpOnly: true, maxAge: 60 * 60 * 24 * 30, path: "/", sameSite: "lax" });
    return res;
  }

  return NextResponse.json({ ok: false }, { status: 400 });
}

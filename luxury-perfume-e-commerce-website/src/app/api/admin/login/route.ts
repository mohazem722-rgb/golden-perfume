import { NextRequest, NextResponse } from "next/server";
import { sign } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const adminPassword = process.env.ADMIN_PASSWORD || "maison-noir-admin";
  if (body?.password !== adminPassword) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("mn_admin", sign("admin"), { httpOnly: true, maxAge: 60 * 60 * 12, path: "/", sameSite: "lax" });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("mn_admin", "", { httpOnly: true, maxAge: 0, path: "/" });
  return res;
}

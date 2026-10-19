import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { subscribers, contactMessages } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false }, { status: 400 });

  if (body.type === "subscribe") {
    if (!body.email || !String(body.email).includes("@")) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    await db.insert(subscribers).values({ email: String(body.email).slice(0, 160), smsOptIn: !!body.sms });
    return NextResponse.json({ ok: true });
  }

  if (body.type === "contact") {
    if (!body.name || !body.message) return NextResponse.json({ ok: false }, { status: 400 });
    await db.insert(contactMessages).values({
      name: String(body.name).slice(0, 120),
      phone: String(body.phone || "").slice(0, 40),
      message: String(body.message).slice(0, 2000),
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false }, { status: 400 });
}

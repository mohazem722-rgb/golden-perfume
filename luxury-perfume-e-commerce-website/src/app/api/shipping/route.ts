import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { shippingRates } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select().from(shippingRates).orderBy(asc(shippingRates.id));
  return NextResponse.json({ rates: rows });
}

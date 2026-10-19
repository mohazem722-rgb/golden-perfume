import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { orders, products, contactMessages } from "@/db/schema";
import { isAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });

  const [totals] = await db
    .select({
      revenue: sql<number>`coalesce(sum(${orders.total}), 0)::int`,
      count: sql<number>`count(*)::int`,
      revenueToday: sql<number>`coalesce(sum(case when ${orders.createdAt} >= date_trunc('day', now()) then ${orders.total} end), 0)::int`,
      revenueMonth: sql<number>`coalesce(sum(case when ${orders.createdAt} >= date_trunc('month', now()) then ${orders.total} end), 0)::int`,
    })
    .from(orders);

  const daily = await db.execute(sql`
    select to_char(d.day, 'YYYY-MM-DD') as day, coalesce(sum(o.total), 0)::int as revenue, count(o.id)::int as orders
    from generate_series(current_date - interval '13 days', current_date, interval '1 day') d(day)
    left join orders o on date_trunc('day', o.created_at) = d.day
    group by d.day order by d.day
  `);

  const monthly = await db.execute(sql`
    select to_char(m.month, 'Mon') as month, coalesce(sum(o.total), 0)::int as revenue, count(o.id)::int as orders
    from generate_series(date_trunc('month', now()) - interval '5 months', date_trunc('month', now()), interval '1 month') m(month)
    left join orders o on date_trunc('month', o.created_at) = m.month
    group by m.month order by m.month
  `);

  const [prodCount] = await db.select({ count: sql<number>`count(*)::int` }).from(products);
  const [msgCount] = await db.select({ count: sql<number>`count(*)::int` }).from(contactMessages);

  return NextResponse.json({
    ok: true,
    totals: {
      revenue: totals.revenue,
      orders: totals.count,
      revenueToday: totals.revenueToday,
      revenueMonth: totals.revenueMonth,
      avgOrder: totals.count ? Math.round(totals.revenue / totals.count) : 0,
      products: prodCount.count,
      messages: msgCount.count,
    },
    daily: (daily as any).rows ?? daily,
    monthly: (monthly as any).rows ?? monthly,
  });
}

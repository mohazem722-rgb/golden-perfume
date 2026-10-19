import { asc, desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { products, coupons } from "@/db/schema";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import CountdownTimer from "@/components/CountdownTimer";
import { OffersHeader, CouponCopyCard } from "@/components/OffersClient";

export const dynamic = "force-dynamic";

export default async function OffersPage() {
  const discounted = await db
    .select()
    .from(products)
    .where(sql`${products.discount} > 0`)
    .orderBy(desc(products.discount));
  const activeCoupons = await db.select().from(coupons).where(sql`${coupons.active} = true`).orderBy(asc(coupons.id));

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-20 md:px-6">
      <Reveal>
        <OffersHeader />
      </Reveal>

      {/* countdown */}
      <Reveal delay={80}>
        <div className="mt-8 flex flex-col items-center gap-4 rounded-3xl border border-[#c9a86a33] bg-gradient-to-br from-[#0a1931] to-[#050507] px-6 py-10 text-center">
          <CountdownTimer />
        </div>
      </Reveal>

      {/* coupons */}
      {activeCoupons.length > 0 && (
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {activeCoupons.slice(0, 3).map((c, i) => (
            <Reveal key={c.id} delay={i * 80}>
              <CouponCopyCard code={c.code} percent={c.discountPercent} />
            </Reveal>
          ))}
        </div>
      )}

      {/* products */}
      <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {discounted.map((p, i) => (
          <Reveal key={p.id} delay={Math.min(i, 8) * 60}>
            <ProductCard p={JSON.parse(JSON.stringify(p))} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

import { desc } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import { BestsellersHeader } from "@/components/BestsellersClient";
import { Flame } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BestsellersPage() {
  const top = await db.select().from(products).orderBy(desc(products.sales)).limit(12);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-20 md:px-6">
      <Reveal>
        <BestsellersHeader />
      </Reveal>

      {/* podium strip */}
      <Reveal delay={80}>
        <div className="mt-8 grid grid-cols-3 gap-3 rounded-3xl border border-[#c9a86a33] bg-gradient-to-br from-[#0a1931] to-[#050507] p-5 text-center sm:gap-6 sm:p-8">
          {top.slice(0, 3).map((p, i) => (
            <a key={p.id} href={`/product/${p.id}`} className="group flex flex-col items-center gap-2">
              <span
                className={
                  i === 0
                    ? "flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#ffd700] to-[#8a6d3b] text-black shadow-[0_0_30px_rgba(212,175,55,0.5)]"
                    : "flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a86a55] text-[#d4af37]"
                }
              >
                <Flame size={20} />
              </span>
              <span className="line-clamp-1 max-w-full text-xs font-bold text-[#f4ecd9] group-hover:text-[#ffd700] sm:text-sm">
                {p.nameEn}
              </span>
              <span className="text-[10px] text-[#c9a86a]">#{(i + 1).toLocaleString("en-US")}</span>
            </a>
          ))}
        </div>
      </Reveal>

      <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {top.map((p, i) => (
          <Reveal key={p.id} delay={Math.min(i, 8) * 60}>
            <ProductCard p={JSON.parse(JSON.stringify(p))} bestBadge />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

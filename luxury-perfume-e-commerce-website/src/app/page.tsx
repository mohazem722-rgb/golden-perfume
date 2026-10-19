import Link from "next/link";
import { desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import HeroScroll from "@/components/HeroScroll";
import Reveal from "@/components/Reveal";
import CountdownTimer from "@/components/CountdownTimer";
import { OffersSlider, LatestCarousel, SectionHeading } from "@/components/HomeSections";
import ProductCard from "@/components/ProductCard";
import { HomeTranslations, CategoriesTranslations, BannerTranslations } from "@/components/ServerT";
import { categoryImage } from "@/lib/images";

export const dynamic = "force-dynamic";

const CATEGORY_META: { slug: string; img: string }[] = ["men", "women", "unisex", "oriental", "home", "gift"].map(
  (slug) => ({ slug, img: categoryImage(slug) })
);

export default async function HomePage() {
  const offers = await db.select().from(products).where(sql`${products.discount} > 0`).orderBy(desc(products.discount)).limit(5);
  const latest = await db.select().from(products).orderBy(desc(products.isNew), desc(products.id)).limit(8);
  const best = await db.select().from(products).orderBy(desc(products.sales)).limit(4);
  const counts: { category: string; count: number }[] = await db
    .select({ category: products.category, count: sql<number>`count(*)::int` })
    .from(products)
    .groupBy(products.category);
  const countMap = Object.fromEntries(counts.map((c) => [c.category, c.count]));

  return (
    <div>
      {/* 1. Scroll-scrubbed cinematic hero */}
      <HeroScroll />

      <div className="relative z-10 mx-auto max-w-7xl space-y-24 px-4 py-20 md:px-6">
        {/* spacer handled by hero track height */}

        {/* 2. Offers slider */}
        {offers.length > 0 && (
          <section aria-label="offers">
            <Reveal>
              <HomeTranslations variant="offers" />
            </Reveal>
            <Reveal delay={100}>
              <OffersSlider offers={offers} />
            </Reveal>
          </section>
        )}

        {/* 3. Categories */}
        <section aria-label="categories">
          <Reveal>
            <CategoriesTranslations variant="heading" />
          </Reveal>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORY_META.map((c, i) => (
              <Reveal key={c.slug} delay={i * 70}>
                <Link
                  href={`/products?category=${c.slug}`}
                  className="group relative block aspect-square overflow-hidden rounded-2xl border border-[#c9a86a2e] transition hover:border-[#d4af37aa]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.img}
                    alt={c.slug}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050507ee] via-[#05050755] to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="text-sm font-bold text-[#f4ecd9] sm:text-base">
                      <CategoriesTranslations variant="label" slug={c.slug} />
                    </h3>
                    <p className="mt-0.5 text-[11px] text-[#c9a86a]">
                      {countMap[c.slug] ?? 0} <CategoriesTranslations variant="count" />
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 4. Latest arrivals */}
        <section aria-label="latest">
          <Reveal>
            <HomeTranslations variant="latest" />
          </Reveal>
          <Reveal delay={100}>
            <LatestCarousel items={latest} />
          </Reveal>
        </section>

        {/* 5. Countdown banner */}
        <Reveal>
          <section className="relative overflow-hidden rounded-3xl border border-[#c9a86a40] bg-gradient-to-br from-[#0a1931] via-[#050507] to-[#1c1509] px-6 py-12 text-center sm:px-12">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[520px] -translate-x-1/2 rounded-full bg-[#d4af3722] blur-[100px]" />
            <BannerTranslations />
          </section>
        </Reveal>

        {/* 6. Bestseller teaser */}
        <section aria-label="bestsellers">
          <Reveal>
            <HomeTranslations variant="best" />
          </Reveal>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {best.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <ProductCard p={p} bestBadge />
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

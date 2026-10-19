import { asc } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import ProductsBrowser from "@/components/ProductsBrowser";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const sp = await searchParams;
  const catalog = await db.select().from(products).orderBy(asc(products.id));
  return (
    <ProductsBrowser
      catalog={JSON.parse(JSON.stringify(catalog))}
      initialQ={sp.q || ""}
      initialCategory={sp.category || "all"}
    />
  );
}

import { notFound } from "next/navigation";
import { and, desc, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import ProductDetail from "@/components/ProductDetail";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pid = parseInt(id, 10);
  if (!Number.isFinite(pid)) notFound();

  const [product] = await db.select().from(products).where(eq(products.id, pid));
  if (!product) notFound();

  const related = await db
    .select()
    .from(products)
    .where(and(eq(products.category, product.category), ne(products.id, pid)))
    .orderBy(desc(products.sales))
    .limit(4);

  return (
    <ProductDetail
      product={JSON.parse(JSON.stringify(product))}
      related={JSON.parse(JSON.stringify(related))}
    />
  );
}

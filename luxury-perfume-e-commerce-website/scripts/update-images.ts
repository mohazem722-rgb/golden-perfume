/**
 * Refresh products.image_url on an EXISTING database using the curated
 * pools in src/lib/images.ts (seed.ts intentionally skips products that
 * already exist, so image refreshes must go through here).
 *
 * Run with the session-pooler DIRECT_URL (.env.local is loaded below):
 *   npx tsx scripts/update-images.ts
 */
import { Pool } from "pg";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

// Minimal .env.local loader (same behaviour as scripts/seed.ts).
for (const p of [resolve(process.cwd(), ".env.local"), resolve(__dirname, "../.env.local")]) {
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
import { productImageFor } from "../src/lib/images";

async function main() {
  const raw = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!raw) throw new Error("DIRECT_URL / DATABASE_URL is not set");
  const u = new URL(raw);
  u.searchParams.delete("sslmode");
  const isSupabase = u.hostname.includes("supabase");
  const pool = new Pool({
    connectionString: u.toString(),
    ssl: isSupabase || u.hostname.includes("pooler") ? { rejectUnauthorized: false } : undefined,
    max: 1,
  });

  const { rows } = await pool.query<{ id: number; name_en: string; category: string }>(
    "SELECT id, name_en, category FROM products ORDER BY id"
  );
  const counters: Record<string, number> = {};
  let updated = 0;
  for (const r of rows) {
    const i = counters[r.category] ?? 0;
    counters[r.category] = i + 1;
    const url = productImageFor(r.name_en, r.category, i);
    await pool.query("UPDATE products SET image_url = $1 WHERE id = $2", [url, r.id]);
    updated++;
  }
  console.log(`Updated image_url for ${updated} products.`);
  await pool.end();
}

main().then(
  () => process.exit(0),
  (e) => {
    console.error("UPDATE_IMAGES_ERROR:", e instanceof Error ? e.message.split("\n")[0] : String(e));
    process.exit(1);
  }
);

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * Supabase (Postgres) connection — Vercel/serverless safe.
 *
 * - On Vercel use the Supabase *transaction pooler* (port 6543) as
 *   DATABASE_URL. Each serverless invocation gets max 1 client so we
 *   never exhaust Supabase's pool.
 * - DIRECT_URL (port 5432) is only for migrations / seeding locally.
 * - We never throw at import time: `next build` imports route modules
 *   while collecting page data, and a missing env var must not crash
 *   the build. Real queries will fail loudly at request time instead
 *   (surfaced by /api/health).
 */
const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.DIRECT_URL ||
  "postgresql://postgres:postgres@127.0.0.1:5432/postgres";

if (!process.env.DATABASE_URL && process.env.NODE_ENV === "production") {
  console.warn(
    "[db] DATABASE_URL is not set — database queries will fail. " +
      "Set it to the Supabase transaction-pooler URL (port 6543) in Vercel env vars."
  );
}

const isSupabase = /supabase\.(co|com)/.test(databaseUrl);
const isPooler = /pooler\.supabase\.com:6543/.test(databaseUrl);

const globalForDb = globalThis as typeof globalThis & {
  __goldenPerfumePool?: Pool;
};

function createPool(): Pool {
  return new Pool({
    connectionString: databaseUrl,
    // Supabase requires TLS; its pooler cert chain is not verifiable
    // with the default Node trust store in every runtime.
    ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
    // Serverless: 1 client per invocation (transaction pooler multiplexes).
    // Local dev: small pool.
    max: process.env.VERCEL || isPooler ? 1 : 10,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
    allowExitOnIdle: true,
  });
}

export const pool = globalForDb.__goldenPerfumePool ?? createPool();

// Reuse one pool across hot reloads / warm invocations.
globalForDb.__goldenPerfumePool = pool;

export const db = drizzle(pool);

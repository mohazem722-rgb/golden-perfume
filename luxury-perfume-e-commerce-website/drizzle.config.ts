import { defineConfig } from "drizzle-kit";

// Migrations / `drizzle-kit push` must use the DIRECT connection
// (port 5432), never the transaction pooler.
const url =
  process.env.DIRECT_URL ||
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@127.0.0.1:5432/app_db";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url },
});

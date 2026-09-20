import "dotenv/config";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Pool } from "pg";

/**
 * Seeds site_content/home from db/seed-content.json (snapshot of the
 * src/data/content.ts fallback). Re-run to reset the DB to defaults.
 */
const dir = dirname(fileURLToPath(import.meta.url));
const payload = readFileSync(join(dir, "seed-content.json"), "utf8");

const rawUrl = process.env.DATABASE_URL;
if (!rawUrl) {
  console.error("DATABASE_URL is not set. Copy .env.example to .env and fill it in.");
  process.exit(1);
}

const pool = new Pool(
  process.env.PGSSL_NO_VERIFY === "1"
    ? { connectionString: rawUrl.split("?")[0], ssl: { rejectUnauthorized: false } }
    : { connectionString: rawUrl }
);

await pool.query(
  `INSERT INTO site_content (page_id, draft, published, version, updated_at, published_at)
   VALUES ('home', $1::jsonb, $1::jsonb, 1, NOW(), NOW())
   ON CONFLICT (page_id) DO UPDATE
   SET draft = EXCLUDED.draft, published = EXCLUDED.published, updated_at = NOW()`,
  [payload]
);

console.log("Seeded site_content/home from db/seed-content.json.");
await pool.end();

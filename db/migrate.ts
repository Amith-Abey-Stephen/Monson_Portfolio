import "dotenv/config";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Pool } from "pg";

const dir = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(dir, "schema.sql"), "utf8");

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

await pool.query(sql);
console.log("Schema applied.");
await pool.end();

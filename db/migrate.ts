import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Pool } from "pg";

const dir = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(dir, "schema.sql"), "utf8");

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ?? "postgresql://amith@localhost:5432/portfolio",
});

await pool.query(sql);
console.log("Schema applied.");
await pool.end();

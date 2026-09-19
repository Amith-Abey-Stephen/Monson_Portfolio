import { Pool } from "pg";

let pool: Pool | null = null;

export function getPool(): Pool | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: url,
      max: 5,
      idleTimeoutMillis: 30_000,
    });
  }
  return pool;
}

export async function query<T = unknown>(text: string, params?: unknown[]): Promise<T[]> {
  const p = getPool();
  if (!p) throw new Error("DATABASE_URL is not configured");
  const res = await p.query(text, params as never[]);
  return res.rows as T[];
}

import { Pool } from "pg";

let pool: Pool | null = null;

export function connectionConfig(): { connectionString: string; ssl?: { rejectUnauthorized: boolean } } {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env and fill it in."
    );
  }
  if (process.env.PGSSL_NO_VERIFY === "1") {
    // Drop any ?sslmode=… (pg maps `require` to full verification and it
    // wins over the Pool `ssl` object). TLS stays on, chain check off.
    return { connectionString: raw.split("?")[0], ssl: { rejectUnauthorized: false } };
  }
  return { connectionString: raw };
}

export function getPool(): Pool | null {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    pool = new Pool({
      ...connectionConfig(),
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

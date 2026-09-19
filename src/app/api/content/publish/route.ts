import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPool } from "@/lib/db";
import { HISTORY_LIMIT } from "@/lib/content";

export const runtime = "nodejs";

/**
 * POST /api/content/publish (S15) — transactional:
 * 1. archive current published to history, 2. copy draft → published,
 * 3. bump version, 4. stamp time, 5. keep latest 20 history entries.
 */
export async function POST() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const pool = getPool();
  if (!pool) return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const cur = await client.query(
      "SELECT draft, published, version FROM site_content WHERE page_id = 'home' FOR UPDATE"
    );
    if (cur.rowCount === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "No content found." }, { status: 404 });
    }
    const { draft, published, version } = cur.rows[0] as {
      draft: unknown;
      published: unknown;
      version: number;
    };
    await client.query(
      "INSERT INTO content_versions (page_id, version, content) VALUES ('home', $1, $2::jsonb)",
      [version, JSON.stringify(published)]
    );
    const next = version + 1;
    await client.query(
      "UPDATE site_content SET published = $1::jsonb, version = $2, published_at = NOW(), updated_at = NOW() WHERE page_id = 'home'",
      [JSON.stringify(draft), next]
    );
    await client.query(
      `DELETE FROM content_versions WHERE page_id = 'home' AND id NOT IN (
         SELECT id FROM content_versions WHERE page_id = 'home' ORDER BY version DESC LIMIT $1
       )`,
      [HISTORY_LIMIT]
    );
    await client.query("COMMIT");
    return NextResponse.json({ ok: true, message: "Published.", version: next });
  } catch {
    await client.query("ROLLBACK");
    return NextResponse.json({ error: "Publish failed." }, { status: 500 });
  } finally {
    client.release();
  }
}

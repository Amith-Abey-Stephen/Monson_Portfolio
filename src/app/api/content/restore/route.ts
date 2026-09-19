import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPool } from "@/lib/db";
import { HISTORY_LIMIT } from "@/lib/content";

export const runtime = "nodejs";

/**
 * POST /api/content/restore { id } (S16) — transactional:
 * preserve current published in history, copy selected version into
 * published AND draft, bump version, keep max 20 entries.
 */
export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: { id?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (typeof body.id !== "number") {
    return NextResponse.json({ error: "Missing version id." }, { status: 400 });
  }
  const pool = getPool();
  if (!pool) return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const target = await client.query(
      "SELECT content FROM content_versions WHERE id = $1 AND page_id = 'home'",
      [body.id]
    );
    if (target.rowCount === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Version not found." }, { status: 404 });
    }
    const cur = await client.query(
      "SELECT published, version FROM site_content WHERE page_id = 'home' FOR UPDATE"
    );
    if (cur.rowCount === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "No content found." }, { status: 404 });
    }
    const { published, version } = cur.rows[0] as { published: unknown; version: number };
    await client.query(
      "INSERT INTO content_versions (page_id, version, content) VALUES ('home', $1, $2::jsonb)",
      [version, JSON.stringify(published)]
    );
    const next = version + 1;
    const restored = JSON.stringify(target.rows[0].content);
    await client.query(
      "UPDATE site_content SET published = $1::jsonb, draft = $1::jsonb, version = $2, published_at = NOW(), updated_at = NOW() WHERE page_id = 'home'",
      [restored, next]
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
    return NextResponse.json({ error: "Restore failed." }, { status: 500 });
  } finally {
    client.release();
  }
}

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPool } from "@/lib/db";
import { ensureRow } from "@/lib/content";
import { defaultContent } from "@/data/content";
import { siteContentSchema } from "@/lib/schema";

export const runtime = "nodejs";

/** PUT /api/content/draft — autosave target. Validates, saves draft only. */
export async function PUT(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const parsed = siteContentSchema.safeParse((body as { content?: unknown })?.content ?? body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", issues: parsed.error.issues.slice(0, 12) },
      { status: 422 }
    );
  }
  const pool = getPool();
  if (!pool) return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
  await ensureRow(defaultContent);
  const payload = JSON.stringify(parsed.data);
  await pool.query(
    "UPDATE site_content SET draft = $1::jsonb, updated_at = NOW() WHERE page_id = 'home'",
    [payload]
  );
  return NextResponse.json({ ok: true, savedAt: new Date().toISOString() });
}

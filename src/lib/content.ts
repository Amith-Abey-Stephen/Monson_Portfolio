import { defaultContent } from "@/data/content";
import { query } from "./db";
import { siteContentSchema, type SiteContent } from "./schema";

export const PAGE_ID = "home";
export const HISTORY_LIMIT = 20;

type Row = {
  draft: unknown;
  published: unknown;
  version: number;
  updated_at: string;
  published_at: string;
};

function coerce(value: unknown): SiteContent {
  const parsed = siteContentSchema.safeParse(value);
  if (parsed.success) return parsed.data;
  // Never let invalid DB data break the public site — fall back safely.
  return defaultContent;
}

async function readRow(): Promise<Row | null> {
  try {
    const rows = await query<Row>(
      "SELECT draft, published, version, updated_at, published_at FROM site_content WHERE page_id = $1",
      [PAGE_ID]
    );
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function getPublishedContent(): Promise<SiteContent> {
  const row = await readRow();
  if (!row) return defaultContent;
  return coerce(row.published);
}

export async function getDraftContent(): Promise<SiteContent> {
  const row = await readRow();
  if (!row) return defaultContent;
  return coerce(row.draft);
}

export async function getContentMeta(): Promise<{ version: number; updatedAt: string | null; publishedAt: string | null }> {
  const row = await readRow();
  if (!row) return { version: 1, updatedAt: null, publishedAt: null };
  return { version: row.version, updatedAt: row.updated_at, publishedAt: row.published_at };
}

export type HistoryEntry = {
  id: number;
  version: number;
  content: SiteContent;
  createdAt: string;
};

export async function getHistory(): Promise<HistoryEntry[]> {
  try {
    const rows = await query<{ id: number; version: number; content: unknown; created_at: string }>(
      "SELECT id, version, content, created_at FROM content_versions WHERE page_id = $1 ORDER BY version DESC LIMIT $2",
      [PAGE_ID, HISTORY_LIMIT]
    );
    return rows.map((r) => ({ id: r.id, version: r.version, content: coerce(r.content), createdAt: r.created_at }));
  } catch {
    return [];
  }
}

/** Ensure the row exists (used by seed + first Studio save). */
export async function ensureRow(content: SiteContent): Promise<void> {
  const payload = JSON.stringify(content);
  await query(
    `INSERT INTO site_content (page_id, draft, published, version)
     VALUES ($1, $2::jsonb, $2::jsonb, 1)
     ON CONFLICT (page_id) DO NOTHING`,
    [PAGE_ID, payload]
  );
}

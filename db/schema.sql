-- Portfolio content store (per docs/v1.md S13-S16).
-- Single-row-per-page model: structured JSON keeps the schema simple,
-- drafts are isolated from published data, history is preserved,
-- publish/restore run in transactions, max 20 history entries.

CREATE TABLE IF NOT EXISTS site_content (
  page_id      TEXT PRIMARY KEY DEFAULT 'home',
  draft        JSONB NOT NULL,
  published    JSONB NOT NULL,
  version      INTEGER NOT NULL DEFAULT 1,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_versions (
  id         SERIAL PRIMARY KEY,
  page_id    TEXT NOT NULL REFERENCES site_content(page_id) ON DELETE CASCADE,
  version    INTEGER NOT NULL,
  content    JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS content_versions_page_idx
  ON content_versions (page_id, version DESC);

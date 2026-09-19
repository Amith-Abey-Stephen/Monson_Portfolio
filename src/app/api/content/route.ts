import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDraftContent, getHistory, getContentMeta, getPublishedContent } from "@/lib/content";

export const runtime = "nodejs";

/**
 * GET /api/content?scope=published (public) | draft | history | meta (auth).
 * Draft data is never exposed without a valid owner session (S17).
 */
export async function GET(req: Request) {
  const scope = new URL(req.url).searchParams.get("scope") ?? "published";
  if (scope === "published") {
    return NextResponse.json({ content: await getPublishedContent() });
  }
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (scope === "draft") {
    return NextResponse.json({
      content: await getDraftContent(),
      meta: await getContentMeta(),
    });
  }
  if (scope === "history") {
    return NextResponse.json({ history: await getHistory() });
  }
  if (scope === "meta") {
    return NextResponse.json({ meta: await getContentMeta() });
  }
  return NextResponse.json({ error: "Unknown scope" }, { status: 400 });
}

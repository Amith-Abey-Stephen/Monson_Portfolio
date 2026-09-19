import { readFile } from "node:fs/promises";
import { join, normalize, sep } from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MIME: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
};

/** Serve owner-uploaded images. Public (portfolio images must be viewable). */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path } = await ctx.params;
  const safe = normalize(path.join("/")).replace(/^(\.\.(\/|\\|$))+/, "");
  if (!safe || safe.includes("..") || safe.includes(sep + ".") || safe.startsWith(".")) {
    return new NextResponse("Not found", { status: 404 });
  }
  const file = join(process.cwd(), "uploads", safe);
  if (!file.startsWith(join(process.cwd(), "uploads") + sep)) {
    return new NextResponse("Not found", { status: 404 });
  }
  let buf: Buffer;
  try {
    buf = await readFile(file);
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
  const ext = safe.slice(safe.lastIndexOf(".")).toLowerCase();
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": MIME[ext] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

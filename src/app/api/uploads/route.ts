import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024;
const OUT_W = 1600;

/**
 * POST /api/uploads — multipart { file, aspect? }.
 * aspect is "W/H" (e.g. "16/10", "4/5"); the image is cover-cropped to
 * that ratio before saving, enforcing the existing component's ratio (S10).
 */
export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }
  const file = form.get("file");
  const aspectRaw = String(form.get("aspect") ?? "");
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "Missing file." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File is too large (max 8MB)." }, { status: 400 });
  }
  const mime = file.type || "application/octet-stream";
  if (!mime.startsWith("image/")) {
    return NextResponse.json({ error: "Only image uploads are allowed." }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  // Stored outside public/ (Next's prod server snapshots public/ at build
  // time) and served via GET /uploads/[...path].
  const dir = join(process.cwd(), "uploads");
  await mkdir(dir, { recursive: true });

  // SVG: store as-is (sharp rasterization would lose vectors).
  if (mime === "image/svg+xml") {
    const name = `${stamp}-${rand}.svg`;
    await writeFile(join(dir, name), buf);
    return NextResponse.json({ url: `/uploads/${name}` });
  }

  let pipeline = sharp(buf).rotate();
  const m = aspectRaw.match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);
  if (m) {
    const w = Number(m[1]);
    const h = Number(m[2]);
    if (w > 0 && h > 0) {
      const height = Math.round((OUT_W * h) / w);
      pipeline = pipeline.resize(OUT_W, height, { fit: "cover", position: "attention" });
    }
  } else {
    pipeline = pipeline.resize({ width: OUT_W, withoutEnlargement: true });
  }
  const name = `${stamp}-${rand}.webp`;
  const out = await pipeline.webp({ quality: 82 }).toBuffer();
  await writeFile(join(dir, name), out);
  return NextResponse.json({ url: `/uploads/${name}` });
}

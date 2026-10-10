import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { AwsClient } from "aws4fetch";

/**
 * Upload storage. Cloudflare R2 when configured (required on Vercel — its
 * filesystem is read-only and not persistent); local ./uploads otherwise,
 * served by GET /uploads/[...path].
 */
function r2Config() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;
  const publicUrl = process.env.R2_PUBLIC_URL;
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) return null;
  return { accountId, accessKeyId, secretAccessKey, bucket, publicUrl: publicUrl.replace(/\/+$/, "") };
}

/** Store `body` under `name`; returns the public URL to save in content. */
export async function storeUpload(name: string, body: Buffer, contentType: string): Promise<string> {
  const r2 = r2Config();
  if (r2) {
    const client = new AwsClient({
      accessKeyId: r2.accessKeyId,
      secretAccessKey: r2.secretAccessKey,
      service: "s3",
      region: "auto",
    });
    const key = `uploads/${name}`;
    const res = await client.fetch(
      `https://${r2.accountId}.r2.cloudflarestorage.com/${r2.bucket}/${key}`,
      {
        method: "PUT",
        body: new Uint8Array(body),
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      }
    );
    if (!res.ok) {
      throw new Error(`R2 upload failed (${res.status}): ${(await res.text()).slice(0, 300)}`);
    }
    return `${r2.publicUrl}/${key}`;
  }

  if (process.env.VERCEL) {
    throw new Error("R2 storage is not configured (set R2_* env vars).");
  }
  const dir = join(process.cwd(), "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, name), body);
  return `/uploads/${name}`;
}

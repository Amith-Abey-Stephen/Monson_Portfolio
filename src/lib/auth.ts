import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "studio_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

function sign(payload: Record<string, unknown>, secret: string): string {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64url(JSON.stringify(payload));
  const sig = createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${sig}`;
}

export function verifySessionToken(token: string, secret: string): { email: string; exp: number } | null {
  try {
    const [header, body, sig] = token.split(".");
    if (!header || !body || !sig) return null;
    const expected = createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as { email: string; exp: number };
    if (!payload.email || !payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

/** scrypt hash format: `scrypt$<salt-hex>$<key-hex>` (N=16384, r=8, p=1, 32B). */
export function hashPassword(password: string): string {
  const salt = createHmac("sha256", Math.random().toString()).digest("hex").slice(0, 32);
  const key = scryptSync(password, salt, 32).toString("hex");
  return `scrypt$${salt}$${key}`;
}

function verifyScrypt(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, salt, keyHex] = parts;
  try {
    const derived = scryptSync(password, salt, 32);
    const expected = Buffer.from(keyHex, "hex");
    return derived.length === expected.length && timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

export function verifyPassword(password: string): boolean {
  const hash = process.env.STUDIO_PASSWORD_HASH;
  if (hash) return verifyScrypt(password, hash);
  const plain = process.env.STUDIO_PASSWORD;
  if (!plain) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(plain);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Owner allowlist. `OWNER_EMAILS` holds a comma-separated list sharing the
 * single Studio password; legacy `OWNER_EMAIL` still works and merges in.
 */
export function allowedEmails(): string[] {
  const list = (process.env.OWNER_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const single = (process.env.OWNER_EMAIL ?? "").trim().toLowerCase();
  if (single && !list.includes(single)) list.push(single);
  return list;
}

export function isEmailAllowed(email: string): boolean {
  return allowedEmails().includes(email.trim().toLowerCase());
}

export function createSession(email: string): { token: string; expiresAt: number } {
  const secret = process.env.AUTH_SECRET ?? "";
  const expiresAt = Date.now() + SESSION_TTL_MS;
  return { token: sign({ email, exp: expiresAt }, secret), expiresAt };
}

export async function getSession(): Promise<{ email: string; expiresAt?: number } | null> {
  const secret = process.env.AUTH_SECRET ?? "";
  if (!secret) return null;
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = verifySessionToken(token, secret);
  if (!payload) return null;
  if (!isEmailAllowed(payload.email)) return null;
  return { email: payload.email, expiresAt: payload.exp };
}

export async function requireSession(): Promise<{ email: string }> {
  const s = await getSession();
  if (!s) throw new Error("Unauthorized");
  return s;
}

export function authConfigured(): boolean {
  return Boolean(
    allowedEmails().length > 0 &&
      process.env.AUTH_SECRET &&
      (process.env.STUDIO_PASSWORD_HASH || process.env.STUDIO_PASSWORD)
  );
}

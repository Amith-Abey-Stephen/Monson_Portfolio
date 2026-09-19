import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  authConfigured,
  createSession,
  isEmailAllowed,
  verifyPassword,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!authConfigured()) {
    return NextResponse.json(
      { error: "Studio auth is not configured on the server." },
      { status: 500 }
    );
  }
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const email = (body.email ?? "").trim();
  const password = body.password ?? "";
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }
  if (!isEmailAllowed(email) || !verifyPassword(password)) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }
  const { token, expiresAt } = createSession(email);
  const res = NextResponse.json({ ok: true, email });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt),
  });
  return res;
}

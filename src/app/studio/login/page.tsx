"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock, ShieldAlert, CheckCircle2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/studio/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Sign in failed.");
      router.push("/studio");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-[400px] rounded-2xl border border-stone-200/80 bg-white p-7 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] sm:p-8"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-black font-heading text-[16px] font-bold text-white shadow-xs">
          M
        </span>
        <div>
          <h1 className="font-heading text-[20px] font-bold tracking-tight text-stone-900">Content Studio</h1>
          <p className="text-[12px] font-medium text-stone-500">Monson Sunny Portfolio CMS</p>
        </div>
      </div>

      {reason === "timeout" && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/90 p-3 text-left">
          <Clock className="mt-0.5 size-4 shrink-0 text-amber-600" />
          <div className="text-[12px] leading-relaxed text-amber-900">
            <span className="font-semibold">Session Timed Out:</span> You were logged out after inactivity. Your latest draft edits have been preserved.
          </div>
        </div>
      )}

      {reason === "expired" && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/90 p-3 text-left">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-rose-600" />
          <div className="text-[12px] leading-relaxed text-rose-900">
            <span className="font-semibold">Session Expired:</span> Your login session has expired. Please sign in again to continue editing.
          </div>
        </div>
      )}

      {reason === "logout" && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-stone-200 bg-stone-50 p-3 text-left">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-stone-600" />
          <div className="text-[12px] leading-relaxed text-stone-700">
            You have successfully signed out of Content Studio.
          </div>
        </div>
      )}

      <p className="mt-4 text-[13px] text-stone-500 leading-relaxed">
        Owner sign-in. Drafts stay private until you publish to the live site.
      </p>

      <label className="mt-5 block text-[13px] font-semibold text-stone-800">
        Email
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 min-h-[46px] w-full rounded-xl border border-stone-200 bg-white px-3.5 text-[14px] text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 transition-all"
          placeholder="you@example.com"
        />
      </label>

      <label className="mt-3 block text-[13px] font-semibold text-stone-800">
        Password
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 min-h-[46px] w-full rounded-xl border border-stone-200 bg-white px-3.5 text-[14px] text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 transition-all"
          placeholder="••••••••"
        />
      </label>

      {error && (
        <p role="alert" className="mt-3 rounded-lg bg-red-50 p-2.5 text-[13px] font-medium text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-5 min-h-[46px] w-full rounded-xl bg-black font-heading text-[14px] font-semibold text-white shadow-sm transition hover:bg-stone-800 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
      >
        {busy ? "Signing in…" : "Sign in to Studio"}
      </button>

      <Link href="/" className="mt-4 block text-center text-[13px] font-medium text-stone-500 transition hover:text-stone-900">
        ← Back to live site
      </Link>
    </form>
  );
}

export default function StudioLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#faf9f6] px-4 text-stone-900">
      <Suspense fallback={<div className="text-[13px] text-stone-400">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}

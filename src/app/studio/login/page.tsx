"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StudioLoginPage() {
  const router = useRouter();
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
    <main className="grid min-h-screen place-items-center bg-[#f4f2ec] px-4 text-stone-900">
      <form
        onSubmit={submit}
        className="w-full max-w-[380px] rounded-2xl border border-stone-200/90 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)] sm:p-8"
      >
        <h1 className="font-heading text-[22px] font-bold tracking-tight">Content Studio</h1>
        <p className="mt-1 text-[13px] text-stone-500">Owner sign-in. Drafts stay private until you publish.</p>
        <label className="mt-5 block text-[13px] font-semibold text-stone-800">
          Email
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 min-h-[48px] w-full rounded-xl border border-stone-200 bg-white px-3.5 text-[15px] text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none"
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
            className="mt-1.5 min-h-[48px] w-full rounded-xl border border-stone-200 bg-white px-3.5 text-[15px] text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none"
            placeholder="••••••••"
          />
        </label>
        {error && (
          <p role="alert" className="mt-3 text-[13px] font-medium text-red-600">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="mt-5 min-h-[48px] w-full rounded-full bg-black font-heading text-[15px] font-semibold text-white hover:bg-stone-800 disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <Link href="/" className="mt-4 block text-center text-[13px] text-stone-500 hover:text-stone-900">
          ← Back to site
        </Link>
      </form>
    </main>
  );
}

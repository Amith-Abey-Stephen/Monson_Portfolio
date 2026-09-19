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
    <main className="grid min-h-screen place-items-center bg-[#0b0b0d] px-4 text-white">
      <form
        onSubmit={submit}
        className="w-full max-w-[380px] rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8"
      >
        <h1 className="font-heading text-[22px] font-bold">Content Studio</h1>
        <p className="mt-1 text-[13px] text-white/50">Owner sign-in. Drafts stay private until you publish.</p>
        <label className="mt-5 block text-[13px] font-medium text-white/80">
          Email
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 min-h-[48px] w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 text-[15px] text-white placeholder:text-white/30 focus:border-white/35 focus:outline-none"
            placeholder="you@example.com"
          />
        </label>
        <label className="mt-3 block text-[13px] font-medium text-white/80">
          Password
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 min-h-[48px] w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 text-[15px] text-white placeholder:text-white/30 focus:border-white/35 focus:outline-none"
            placeholder="••••••••"
          />
        </label>
        {error && (
          <p role="alert" className="mt-3 text-[13px] text-red-300">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="mt-5 min-h-[48px] w-full rounded-lg bg-[#ece8df] font-heading text-[15px] font-semibold text-black hover:bg-white disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <Link href="/" className="mt-4 block text-center text-[13px] text-white/50 hover:text-white">
          ← Back to site
        </Link>
      </form>
    </main>
  );
}

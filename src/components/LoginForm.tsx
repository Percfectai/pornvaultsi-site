"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { loginWithPerfectAI } from "@/lib/spicy-api";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await loginWithPerfectAI(username, password);
      router.push("/library/");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Sign in failed. Please check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      id="login"
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-[#0f1016] p-6 sm:p-8 shadow-2xl shadow-black/60"
    >
      <div className="mb-6">
        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600/15 text-rose-400 ring-1 ring-rose-500/25">
          <KeyRound className="h-5 w-5" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Sign in to your Library
        </h1>
        <p className="mt-1.5 text-sm text-zinc-400">
          Use your <span className="text-zinc-200 font-medium">PerfectAI</span>{" "}
          username and password to open your private library.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-3 text-sm text-rose-200"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400"
          >
            Username or Email
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your_username"
            className="w-full rounded-xl border border-white/10 bg-[#08090d] px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-rose-500/60 focus:ring-2 focus:ring-rose-500/20"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-xl border border-white/10 bg-[#08090d] px-3.5 py-2.5 pr-10 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-rose-500/60 focus:ring-2 focus:ring-rose-500/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500 transition hover:text-zinc-300"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-950/50 transition hover:from-rose-500 hover:to-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Signing in…</span>
          </>
        ) : (
          <span>Open Private Library</span>
        )}
      </button>
    </form>
  );
}

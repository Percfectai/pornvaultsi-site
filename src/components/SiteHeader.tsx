"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Lock, LogOut, ShieldCheck } from "lucide-react";
import { clearStoredSession, getStoredSession } from "@/lib/spicy-api";

interface SiteHeaderProps {
  username?: string | null;
}

export function SiteHeader({ username: propUsername }: SiteHeaderProps) {
  const router = useRouter();
  const [storedUsername, setStoredUsername] = useState<string | null>(null);

  useEffect(() => {
    const session = getStoredSession();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStoredUsername(session?.user.username ?? null);
  }, []);

  const username = propUsername ?? storedUsername;
  const perfectAiUrl =
    process.env.NEXT_PUBLIC_PERFECTAI_URL || "https://perfectai.com";

  function handleLogout() {
    clearStoredSession();
    setStoredUsername(null);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07070a]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href={username ? "/library/" : "/"}
          className="flex items-center gap-2.5 group"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-600 to-rose-800 shadow-lg shadow-rose-950/50 ring-1 ring-white/15 transition group-hover:scale-105">
            <Lock className="h-4 w-4 text-white" />
          </span>
          <span className="flex items-baseline gap-1 text-lg font-semibold tracking-tight text-white">
            pornvault<span className="text-rose-500 font-bold">.SI</span>
          </span>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-4">
          <a
            href={perfectAiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs sm:text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <span>PerfectAI</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400" />
          </a>

          {username ? (
            <div className="flex items-center gap-2.5">
              <Link
                href="/library/"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>@{username}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-900 px-3 py-1.5 text-xs sm:text-sm font-medium text-zinc-300 transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-200"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign out</span>
              </button>
            </div>
          ) : (
            <Link
              href="/#login"
              className="inline-flex items-center rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white shadow-sm shadow-rose-950/50 transition hover:bg-rose-500"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

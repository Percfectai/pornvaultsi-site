"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  fetchLibraryItems,
  getStoredSession,
  type StoredSession,
} from "@/lib/spicy-api";
import type { LibraryItemDTO } from "@/types/library";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { LibraryClient } from "@/components/LibraryClient";

export default function LibraryPage() {
  const router = useRouter();
  const [session, setSession] = useState<StoredSession | null>(null);
  const [items, setItems] = useState<LibraryItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const active = getStoredSession();
    if (!active) {
      router.replace("/");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(active);

    fetchLibraryItems(active.token)
      .then((loaded) => {
        setItems(loaded);
      })
      .catch((err) => {
        const msg =
          err instanceof Error ? err.message : "Failed to load library.";
        if (msg.toLowerCase().includes("unauthorized")) {
          router.replace("/");
          return;
        }
        setError(msg);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col bg-[#07070a]">
      <SiteHeader username={session?.user.username} />

      {loading ? (
        <main className="flex flex-1 items-center justify-center p-8">
          <div className="flex items-center gap-2.5 text-sm text-zinc-400">
            <Loader2 className="h-4 w-4 animate-spin text-rose-400" />
            <span>Loading your private library…</span>
          </div>
        </main>
      ) : error ? (
        <main className="flex flex-1 items-center justify-center p-8">
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-6 py-4 text-sm text-rose-200">
            {error}
          </div>
        </main>
      ) : session ? (
        <LibraryClient
          initialItems={items}
          username={session.user.username}
          token={session.token}
        />
      ) : null}

      <SiteFooter />
    </div>
  );
}

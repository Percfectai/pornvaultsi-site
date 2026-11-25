"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CloudDownload, Lock, Shield } from "lucide-react";
import { getStoredSession } from "@/lib/spicy-api";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { LoginForm } from "@/components/LoginForm";
import { PromoRedirectSlot } from "@/components/PromoRedirectSlot";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (getStoredSession()) {
      router.replace("/library/");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col bg-[#07070a]">
      <SiteHeader />

      <main className="relative flex-1 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-96 bg-[radial-gradient(ellipse_at_top,rgba(225,29,72,0.16),transparent_65%)]"
        />

        <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-start gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:py-20">
          <div className="space-y-8 lg:col-span-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300">
                <Lock className="h-3.5 w-3.5 text-rose-400" />
                <span>Spicy API &middot; Private Media Libraries</span>
              </span>
              <h1 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-white">
                Your private library, synced with{" "}
                <span className="bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent">
                  PerfectAI
                </span>
                .
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-400">
                Sign in with the same username and password you created on
                PerfectAI to view, organize, and download items saved to your
                private library.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-[#0f1016]/80 p-4">
                <Shield className="h-4 w-4 text-rose-400" />
                <h3 className="mt-2 text-sm font-medium text-white">
                  Shared Account Login
                </h3>
                <p className="mt-1 text-xs text-zinc-400">
                  Authenticates directly against your shared Supabase user
                  database.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#0f1016]/80 p-4">
                <CloudDownload className="h-4 w-4 text-rose-400" />
                <h3 className="mt-2 text-sm font-medium text-white">
                  Private Downloads
                </h3>
                <p className="mt-1 text-xs text-zinc-400">
                  Every library is strictly isolated to its owner with signed
                  download links.
                </p>
              </div>
            </div>

            <PromoRedirectSlot />
          </div>

          <div className="lg:col-span-6 lg:pl-6">
            <LoginForm />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

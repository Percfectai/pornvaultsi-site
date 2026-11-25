import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#07070a]">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <Link
          href="/"
          className="text-xs font-medium text-rose-400 hover:text-rose-300"
        >
          &larr; Back to Home
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
          Privacy Policy
        </h1>
        <div className="mt-6 space-y-5 text-sm leading-relaxed text-zinc-400">
          <section>
            <h2 className="text-base font-medium text-white">
              1. Shared Authentication
            </h2>
            <p className="mt-1.5">
              pornvault.SI verifies your username and password directly against
              your shared Supabase account record via a secured Supabase Edge
              Function. Passwords are never stored in plaintext or exposed to
              the browser.
            </p>
          </section>
          <section>
            <h2 className="text-base font-medium text-white">
              2. Session Tokens
            </h2>
            <p className="mt-1.5">
              We store a signed bearer token locally in your browser so you stay
              signed in while viewing your private library. Signing out removes
              it immediately.
            </p>
          </section>
          <section>
            <h2 className="text-base font-medium text-white">
              3. Private Media Storage
            </h2>
            <p className="mt-1.5">
              Media assets stored in private storage buckets are accessed only
              via short-lived signed URLs issued exclusively to the authenticated
              account owner.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

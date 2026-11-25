import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <div className="mt-6 space-y-5 text-sm leading-relaxed text-zinc-400">
          <section>
            <h2 className="text-base font-medium text-white">
              1. Eligibility &amp; Account Access
            </h2>
            <p className="mt-1.5">
              Access to pornvault.SI requires an active, age-verified account
              registered through PerfectAI. You are responsible for maintaining
              the confidentiality of your login credentials.
            </p>
          </section>
          <section>
            <h2 className="text-base font-medium text-white">
              2. Acceptable &amp; Lawful Content
            </h2>
            <p className="mt-1.5">
              Zero tolerance applies to any illegal, non-consensual, or abusive
              material. Only lawful content permitted under applicable law may
              be stored in your private library.
            </p>
          </section>
          <section>
            <h2 className="text-base font-medium text-white">
              3. Private Libraries
            </h2>
            <p className="mt-1.5">
              Items saved in your private library are accessible only to your
              authenticated user account and may be deleted by you at any time.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

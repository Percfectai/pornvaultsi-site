import { ArrowUpRight, ExternalLink, Sparkles } from "lucide-react";

/**
 * Configurable Redirect / Advertisement Slot.
 * Update NEXT_PUBLIC_REDIRECT_URL / NEXT_PUBLIC_PERFECTAI_URL or swap this
 * component's body later to embed an ad banner, affiliate card, or auto-redirect.
 */
export function PromoRedirectSlot() {
  const redirectUrl =
    process.env.NEXT_PUBLIC_REDIRECT_URL ||
    process.env.NEXT_PUBLIC_PERFECTAI_URL ||
    "https://perfectai.com";

  const headline =
    process.env.NEXT_PUBLIC_AD_TITLE || "Need an account? Start on PerfectAI";
  const description =
    process.env.NEXT_PUBLIC_AD_DESCRIPTION ||
    "Account creation and verification happen on PerfectAI. Once registered, use your exact same username and password here to access your private library.";
  const ctaLabel = process.env.NEXT_PUBLIC_AD_CTA || "Go to PerfectAI.com";

  return (
    <div
      data-slot="promo-redirect"
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#12131c] via-[#0f1017] to-[#1a0d14] p-6 shadow-xl"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/25 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-rose-300">
          <Sparkles className="h-3 w-3" />
          Partner Redirect / Ad Slot
        </span>
        <ExternalLink className="h-4 w-4 text-zinc-500" />
      </div>

      <h2 className="text-base font-semibold text-white">{headline}</h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{description}</p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <a
          href={redirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-600/15 px-4 py-2.5 text-sm font-medium text-rose-200 transition hover:border-rose-400/50 hover:bg-rose-600/25 hover:text-white"
        >
          <span>{ctaLabel}</span>
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

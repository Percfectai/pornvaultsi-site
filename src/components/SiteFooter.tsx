import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#07070a]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-zinc-500 sm:flex-row sm:px-6">
        <p>
          &copy; {new Date().getFullYear()} pornvault.SI &mdash; Private Media
          Library
        </p>
        <div className="flex items-center gap-5">
          <Link href="/terms" className="transition hover:text-zinc-300">
            Terms
          </Link>
          <Link href="/privacy" className="transition hover:text-zinc-300">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}

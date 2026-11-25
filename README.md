# Spicy API (`pornvault.SI`)

Static frontend (hosted free on **GitHub Pages**) powered by a **Supabase Edge Function** (`spicy-api`) on your shared PerfectAI Supabase project (`fyxofxprzffcdgbkdyax`).

## Architecture

- **Frontend (`GitHub Pages`)**: Static HTML/CSS/JS exported to `out/` with `CNAME` (`pornvault.si`) and `.nojekyll`.
- **Backend (`Supabase Edge Function: spicy-api`)**: Deployed at `https://fyxofxprzffcdgbkdyax.supabase.co/functions/v1/spicy-api`. Uses Supabase's built-in `SUPABASE_SERVICE_ROLE_KEY` automatically—no Render, Vercel, or Netlify server needed.
- **Database & Storage**:
  - Reads `public.users` (`username` + `password` hashes in `scrypt` or `pbkdf2` Werkzeug format).
  - Stores private library items in `public.private_library_items` and private files in bucket `private-library-media`.

## Enable `LIBRARY_INGEST_SECRET` (for PerfectAI -> Spicy API auto-sync)

In **Supabase Dashboard &rarr; Edge Functions &rarr; Secrets**, add `LIBRARY_INGEST_SECRET` (any long random string) so your PerfectAI backend can call:

```ts
await fetch("https://fyxofxprzffcdgbkdyax.supabase.co/functions/v1/spicy-api/library/ingest", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-library-secret": process.env.LIBRARY_INGEST_SECRET!,
  },
  body: JSON.stringify({
    username: "alice",
    title: "Saved Generation",
    prompt: "...",
    mediaType: "image",
    base64Data: "...",
    mimeType: "image/png",
    collection: "PerfectAI Imports",
    tags: ["perfectai"],
  }),
});
```

## GitHub Pages & Namecheap Setup

1. In GitHub repo **Settings &rarr; Pages**, set **Source** to **GitHub Actions** (the workflow `.github/workflows/pages.yml` builds and publishes automatically on push to `main`).
2. In **Namecheap &rarr; Domain List &rarr; Manage (`pornvault.si`) &rarr; Advanced DNS**:
   - Keep Nameservers on **Namecheap BasicDNS**.
   - Add four `A Record` entries for `Host: @` pointing to GitHub Pages IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Add one `CNAME Record` for `Host: www` pointing to `percfectai.github.io.`
   - Delete any conflicting parking/URL-redirect records for `@` or `www`.
3. Wait 5&ndash;30 minutes, then check **Enforce HTTPS** in GitHub repo **Settings &rarr; Pages**.

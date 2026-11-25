"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Code2,
  Copy,
  Download,
  Film,
  FolderOpen,
  Image as ImageIcon,
  LayoutGrid,
  List,
  Lock,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  deleteLibraryItem,
  getLibraryDownloadUrl,
  saveLibraryUrl,
  SPICY_API_URL,
} from "@/lib/spicy-api";
import type { LibraryItemDTO, MediaType } from "@/types/library";

interface LibraryClientProps {
  initialItems: LibraryItemDTO[];
  username: string;
  token: string;
}

export function LibraryClient({
  initialItems,
  username,
  token,
}: LibraryClientProps) {
  const [items, setItems] = useState<LibraryItemDTO[]>(initialItems);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | MediaType>("all");
  const [collectionFilter, setCollectionFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItem, setSelectedItem] = useState<LibraryItemDTO | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showApiInfo, setShowApiInfo] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newType, setNewType] = useState<MediaType>("image");
  const [newCollection, setNewCollection] = useState("General");
  const [newPrompt, setNewPrompt] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const collections = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) {
      if (item.collection) set.add(item.collection);
    }
    return ["all", ...Array.from(set).sort()];
  }, [items]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (typeFilter !== "all" && item.media_type !== typeFilter) return false;
      if (collectionFilter !== "all" && item.collection !== collectionFilter) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        item.title,
        item.prompt ?? "",
        item.collection,
        ...item.tags,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [items, search, typeFilter, collectionFilter]);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteLibraryItem(token, id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleDownload(item: LibraryItemDTO) {
    setDownloadingId(item.id);
    try {
      const downloadUrl = await getLibraryDownloadUrl(token, item.id);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleCopyPrompt(id: string, prompt: string) {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Clipboard unavailable
    }
  }

  async function handleManualAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAddError(null);
    setAdding(true);
    try {
      const created = await saveLibraryUrl(token, {
        title: newTitle || "Saved Media",
        mediaUrl: newUrl,
        mediaType: newType,
        collection: newCollection || "General",
        prompt: newPrompt || undefined,
      });
      setItems((prev) => [created, ...prev]);
      setShowAddModal(false);
      setNewTitle("");
      setNewUrl("");
      setNewPrompt("");
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Could not save item.");
    } finally {
      setAdding(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300">
            <Lock className="h-3 w-3 text-rose-400" />
            <span>Private Library &middot; @{username}</span>
          </div>
          <h1 className="mt-2.5 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Your Private Library
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {items.length} {items.length === 1 ? "item" : "items"} stored
            privately under your account.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowApiInfo((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#0f1016] px-3.5 py-2 text-xs sm:text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:text-white"
          >
            <Code2 className="h-4 w-4 text-rose-400" />
            <span>Sync Endpoint</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs sm:text-sm font-medium text-white shadow-sm shadow-rose-950/50 transition hover:bg-rose-500"
          >
            <Plus className="h-4 w-4" />
            <span>Save URL</span>
          </button>
        </div>
      </div>

      {showApiInfo && (
        <section className="mb-6 rounded-2xl border border-rose-500/20 bg-[#0f1016] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-white">
                PerfectAI &rarr; Spicy API Ingestion Endpoint
              </h2>
              <p className="mt-1 text-xs text-zinc-400">
                Authorized servers can push routed items into a user&apos;s
                private Supabase library via{" "}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-rose-300">
                  POST {SPICY_API_URL}/library/ingest
                </code>{" "}
                with header{" "}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-zinc-200">
                  x-library-secret
                </code>
                .
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowApiInfo(false)}
              className="text-zinc-500 hover:text-zinc-300"
              aria-label="Close API panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <pre className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-[#07070a] p-3.5 text-xs text-zinc-300 font-mono">
{`{
  "username": "${username}",
  "title": "Generation Title",
  "prompt": "Original prompt metadata",
  "mediaType": "image",
  "mediaUrl": "https://... (or base64Data + mimeType)",
  "collection": "PerfectAI Imports",
  "tags": ["perfectai"]
}`}
          </pre>
        </section>
      )}

      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0f1016] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search titles, prompts, or tags…"
            className="w-full rounded-xl border border-white/10 bg-[#07070a] py-2 pl-9 pr-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-rose-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl border border-white/10 bg-[#07070a] p-1">
            {(["all", "image", "video"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`rounded-lg px-3 py-1 text-xs font-medium capitalize transition ${
                  typeFilter === t
                    ? "bg-rose-600 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <select
            value={collectionFilter}
            onChange={(e) => setCollectionFilter(e.target.value)}
            aria-label="Filter by collection"
            className="rounded-xl border border-white/10 bg-[#07070a] px-3 py-1.5 text-xs font-medium text-zinc-200 outline-none focus:border-rose-500/50"
          >
            {collections.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All Collections" : c}
              </option>
            ))}
          </select>

          <div className="inline-flex rounded-xl border border-white/10 bg-[#07070a] p-1">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              className={`rounded-lg p-1.5 transition ${
                viewMode === "grid"
                  ? "bg-white/15 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-label="List view"
              className={`rounded-lg p-1.5 transition ${
                viewMode === "list"
                  ? "bg-white/15 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-[#0f1016]/60 px-6 py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-zinc-400">
            <FolderOpen className="h-6 w-6" />
          </div>
          <h2 className="text-base font-semibold text-white">
            {items.length === 0
              ? "Your private library is empty"
              : "No items match your filters"}
          </h2>
          <p className="mt-1.5 max-w-md text-sm text-zinc-400">
            {items.length === 0
              ? "Items routed here from PerfectAI will appear automatically under your account."
              : "Try clearing your search query or switching collections."}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0f1016] transition hover:border-white/20"
            >
              <button
                type="button"
                onClick={() => setSelectedItem(item)}
                className="relative aspect-[4/3] w-full overflow-hidden bg-[#07070a] text-left"
              >
                {item.media_type === "video" && item.resolved_url ? (
                  <video
                    src={item.resolved_url}
                    poster={item.resolved_thumbnail_url ?? undefined}
                    muted
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                ) : item.resolved_thumbnail_url || item.resolved_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.resolved_thumbnail_url || item.resolved_url || ""}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-zinc-600">
                    {item.media_type === "video" ? (
                      <Film className="h-8 w-8" />
                    ) : (
                      <ImageIcon className="h-8 w-8" />
                    )}
                  </div>
                )}

                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-0.5 text-[11px] font-medium text-zinc-200 backdrop-blur">
                  {item.media_type === "video" ? (
                    <Film className="h-3 w-3 text-rose-400" />
                  ) : (
                    <ImageIcon className="h-3 w-3 text-rose-400" />
                  )}
                  <span className="capitalize">{item.media_type}</span>
                </span>
              </button>

              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="line-clamp-1 text-sm font-semibold text-white">
                    {item.title}
                  </h3>
                  <span className="shrink-0 rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-zinc-400">
                    {item.collection}
                  </span>
                </div>

                {item.prompt && (
                  <p className="mt-1.5 line-clamp-2 text-xs text-zinc-400">
                    {item.prompt}
                  </p>
                )}

                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="text-[11px] text-zinc-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleDownload(item)}
                      disabled={downloadingId === item.id}
                      className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/10 disabled:opacity-50"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>
                        {downloadingId === item.id ? "Loading…" : "Download"}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      aria-label={`Delete ${item.title}`}
                      className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 p-1.5 text-zinc-400 transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300 disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-[#0f1016]">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <button
                type="button"
                onClick={() => setSelectedItem(item)}
                className="flex items-center gap-3 text-left"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-rose-400">
                  {item.media_type === "video" ? (
                    <Film className="h-4 w-4" />
                  ) : (
                    <ImageIcon className="h-4 w-4" />
                  )}
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="text-xs text-zinc-400">
                    {item.collection} &middot;{" "}
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownload(item)}
                  disabled={downloadingId === item.id}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-white/10 disabled:opacity-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>
                    {downloadingId === item.id ? "Loading…" : "Download"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-zinc-400 hover:border-rose-500/40 hover:text-rose-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-2xl border border-white/15 bg-[#0f1016] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  {selectedItem.title}
                </h3>
                <p className="text-xs text-zinc-400">
                  {selectedItem.collection} &middot;{" "}
                  {new Date(selectedItem.created_at).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex max-h-[60vh] items-center justify-center bg-[#07070a] p-4">
              {selectedItem.media_type === "video" &&
              selectedItem.resolved_url ? (
                <video
                  src={selectedItem.resolved_url}
                  controls
                  className="max-h-[54vh] w-auto rounded-lg"
                />
              ) : selectedItem.resolved_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedItem.resolved_url}
                  alt={selectedItem.title}
                  className="max-h-[54vh] w-auto rounded-lg object-contain"
                />
              ) : (
                <p className="text-sm text-zinc-500">Preview unavailable</p>
              )}
            </div>

            <div className="space-y-3 p-5">
              {selectedItem.prompt && (
                <div className="rounded-xl border border-white/10 bg-[#07070a] p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                      Prompt
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyPrompt(selectedItem.id, selectedItem.prompt!)
                      }
                      className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white"
                    >
                      {copiedId === selectedItem.id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs leading-relaxed text-zinc-300">
                    {selectedItem.prompt}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => handleDelete(selectedItem.id)}
                  disabled={deletingId === selectedItem.id}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-medium text-rose-200 hover:bg-rose-500/20"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(selectedItem)}
                  disabled={downloadingId === selectedItem.id}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 disabled:opacity-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>
                    {downloadingId === selectedItem.id
                      ? "Preparing…"
                      : "Download Original"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setShowAddModal(false)}
        >
          <form
            onSubmit={handleManualAdd}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0f1016] p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">
                Save Media URL to Library
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {addError && (
              <p className="mb-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                {addError}
              </p>
            )}

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-zinc-400">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="My Saved Item"
                  className="w-full rounded-xl border border-white/10 bg-[#07070a] px-3 py-2 text-sm text-white outline-none focus:border-rose-500/50"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-400">
                  Media URL *
                </label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://example.com/media.png"
                  className="w-full rounded-xl border border-white/10 bg-[#07070a] px-3 py-2 text-sm text-white outline-none focus:border-rose-500/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">
                    Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as MediaType)}
                    className="w-full rounded-xl border border-white/10 bg-[#07070a] px-3 py-2 text-sm text-white outline-none focus:border-rose-500/50"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">
                    Collection
                  </label>
                  <input
                    type="text"
                    value={newCollection}
                    onChange={(e) => setNewCollection(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#07070a] px-3 py-2 text-sm text-white outline-none focus:border-rose-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-400">
                  Prompt / Notes
                </label>
                <textarea
                  rows={2}
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#07070a] px-3 py-2 text-sm text-white outline-none focus:border-rose-500/50"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={adding}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 disabled:opacity-60"
              >
                {adding ? "Saving…" : "Save to Library"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

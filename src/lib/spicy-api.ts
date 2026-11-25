import type { LibraryItemDTO, MediaType } from "@/types/library";

export const SPICY_API_URL =
  process.env.NEXT_PUBLIC_SPICY_API_URL ||
  "https://fyxofxprzffcdgbkdyax.supabase.co/functions/v1/spicy-api";

const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_5o30X5hHJkjinb3hEl7xsQ_QbJqcFaD";

const STORAGE_KEY = "spicy_api_session_v1";

export interface SpicyUser {
  userId: number;
  username: string;
  displayName: string | null;
  isAdmin: boolean;
}

export interface StoredSession {
  token: string;
  user: SpicyUser;
}

export function getStoredSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    if (!parsed?.token || !parsed?.user?.username) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setStoredSession(session: StoredSession): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("apikey", SUPABASE_PUBLISHABLE_KEY);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${SPICY_API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) {
    if (res.status === 401 && token) {
      clearStoredSession();
    }
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export async function loginWithPerfectAI(
  username: string,
  password: string
): Promise<StoredSession> {
  const data = await apiRequest<{ ok: boolean; token: string; user: SpicyUser }>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }
  );
  const session = { token: data.token, user: data.user };
  setStoredSession(session);
  return session;
}

export async function fetchLibraryItems(
  token: string
): Promise<LibraryItemDTO[]> {
  const data = await apiRequest<{ items: LibraryItemDTO[] }>(
    "/library/items",
    { method: "GET" },
    token
  );
  return data.items ?? [];
}

export async function saveLibraryUrl(
  token: string,
  payload: {
    title: string;
    mediaUrl: string;
    mediaType: MediaType;
    collection: string;
    prompt?: string;
  }
): Promise<LibraryItemDTO> {
  const data = await apiRequest<{ item: LibraryItemDTO }>(
    "/library/items",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token
  );
  return data.item;
}

export async function deleteLibraryItem(
  token: string,
  id: string
): Promise<void> {
  await apiRequest<{ ok: boolean }>(
    `/library/items/${encodeURIComponent(id)}`,
    { method: "DELETE" },
    token
  );
}

export async function getLibraryDownloadUrl(
  token: string,
  id: string
): Promise<string> {
  const data = await apiRequest<{ downloadUrl: string }>(
    `/library/items/${encodeURIComponent(id)}/download`,
    { method: "GET" },
    token
  );
  return data.downloadUrl;
}

export type MediaType = "image" | "video";

export interface LibraryItemRecord {
  id: string;
  user_id: number;
  title: string;
  prompt: string | null;
  media_type: MediaType;
  media_url: string | null;
  storage_path: string | null;
  thumbnail_url: string | null;
  collection: string;
  tags: string[];
  source_app: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface LibraryItemDTO extends LibraryItemRecord {
  resolved_url: string | null;
  resolved_thumbnail_url: string | null;
}

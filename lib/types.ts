export type LayoutType = "full" | "grid" | "video" | "letter" | "timeline" | "special";

export type MemoryType = "image" | "video" | "text" | "letter" | "timeline" | "audio";

export type Album = {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  cover_image: string | null;
};

export type Page = {
  id: string;
  album_id: string;
  page_number: number;
  layout_type: LayoutType;
  created_at: string;
};

export type Memory = {
  id: string;
  page_id: string;
  type: MemoryType;
  title: string | null;
  description: string | null;
  memory_date: string | null;
  media_url: string | null;
  thumbnail_url: string | null;
  position: number | null;
  created_at: string;
};

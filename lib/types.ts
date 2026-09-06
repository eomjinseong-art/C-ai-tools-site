export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  search_keywords: string[];
  is_trend: boolean;
  sort_order: number;
  click_count: number;
  target_video_count: number;
  icon_url: string | null;
  created_at: string;
}

export type VideoStatus = "published" | "pending" | "excluded";

export interface Video {
  id: string;
  youtube_id: string;
  category_id: string;
  title: string;
  description: string | null;
  channel_title: string | null;
  channel_id: string | null;
  thumbnail_url: string | null;
  published_at: string | null;
  view_count: number;
  like_count: number;
  duration_seconds: number | null;
  summary: string | null;
  summary_points: string[] | null;
  hook: string | null;
  tool_features: string[] | null;
  difficulty: string | null;
  takeaway: string | null;
  transcript_lang: string | null;
  rank: number | null;
  status: VideoStatus;
  collected_at: string;
  updated_at: string;
}

export interface GuidebookSection {
  id: string;
  category_id: string | null;
  slug: string;
  title: string;
  content_markdown: string;
  source_video_ids: string[];
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type AdPlacement =
  | "home_top"
  | "home_bottom"
  | "category_sidebar"
  | "category_sidebar_1"
  | "category_sidebar_2"
  | "category_sidebar_3"
  | "category_sidebar_4"
  | "video_inline"
  | "video_list_bottom"
  | "guidebook_footer";

export const AD_PLACEMENTS: AdPlacement[] = [
  "home_top",
  "home_bottom",
  "category_sidebar_1",
  "category_sidebar_2",
  "category_sidebar_3",
  "category_sidebar_4",
  "video_inline",
  "video_list_bottom",
  "guidebook_footer",
];

export type CategoryPreview = {
  id: string;
  slug: string;
  name: string;
  is_trend: boolean;
  cover_url: string | null;
};

export type CarouselVideo = {
  id: string;
  title: string;
  thumbnail_url: string | null;
  view_count: number;
  category_slug: string;
  category_name: string;
};

export type SearchVideo = {
  id: string;
  title: string;
  thumbnail_url: string | null;
  view_count: number;
  published_at: string | null;
  channel_title: string | null;
  rank: number | null;
  category_slug: string;
  category_name: string;
};

export type VideoCardData = {
  id: string;
  title: string;
  thumbnail_url: string | null;
  channel_title: string | null;
  view_count: number;
  published_at: string | null;
  rank: number | null;
};

export interface Ad {
  id: string;
  name: string;
  placement: AdPlacement;
  image_url: string;
  link_url: string;
  alt_text: string | null;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  sort_order: number;
  created_at: string;
}

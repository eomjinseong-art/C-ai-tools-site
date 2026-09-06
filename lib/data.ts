import { cache } from "react";
import { supabase } from "@/lib/supabase";
import { compactThumbnail } from "@/lib/thumbnails";
import type { CarouselVideo, Category, CategoryPreview, SearchVideo, Video } from "@/lib/types";

const VIDEO_CARD_COLUMNS =
  "id, title, thumbnail_url, view_count, published_at, channel_title, rank, youtube_id, category_id, status";

function pinTrendLast(categories: Category[]): Category[] {
  return [...categories.filter((c) => !c.is_trend), ...categories.filter((c) => c.is_trend)];
}

export const getCategories = cache(async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load categories", error);
    return [];
  }
  return pinTrendLast((data ?? []) as Category[]);
});

export const getCategoryPreviews = cache(async (): Promise<CategoryPreview[]> => {
  const categories = await getCategories();
  if (categories.length === 0) return [];

  const { data, error } = await supabase
    .from("videos")
    .select("category_id, thumbnail_url, rank")
    .eq("status", "published")
    .order("rank", { ascending: true })
    .limit(300);

  if (error) {
    console.error("Failed to load category covers", error);
  }

  const covers = new Map<string, string>();
  for (const row of data ?? []) {
    const categoryId = row.category_id as string;
    if (covers.has(categoryId)) continue;
    const src = compactThumbnail(row.thumbnail_url as string | null);
    if (src) covers.set(categoryId, src);
  }

  return categories.map((category) => ({
    id: category.id,
    slug: category.slug,
    name: category.name,
    is_trend: category.is_trend,
    cover_url: compactThumbnail(category.icon_url) ?? covers.get(category.id) ?? null,
  }));
});

export const getVideosForCategory = cache(async (categoryId: string): Promise<Video[]> => {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("category_id", categoryId)
    .eq("status", "published")
    .order("rank", { ascending: true })
    .limit(10);

  if (error) {
    console.error("Failed to load videos", error);
    return [];
  }
  return (data ?? []) as Video[];
});

function categoryFromJoin(raw: unknown): { slug: string; name: string } | null {
  const category = Array.isArray(raw) ? raw[0] : raw;
  if (!category || typeof category !== "object") return null;
  const { slug, name } = category as { slug?: unknown; name?: unknown };
  if (typeof slug !== "string" || typeof name !== "string") return null;
  return { slug, name };
}

export const getPublishedVideo = cache(async (id: string): Promise<(Video & { category_slug: string; category_name: string }) | null> => {
  const trimmed = id.trim();
  if (!trimmed) return null;

  const selectWithCategory = "*, categories(slug, name)";
  let { data, error } = await supabase
    .from("videos")
    .select(selectWithCategory)
    .eq("id", trimmed)
    .eq("status", "published")
    .maybeSingle();

  if ((error || !data) && trimmed.length <= 16) {
    const byYoutube = await supabase
      .from("videos")
      .select(selectWithCategory)
      .eq("youtube_id", trimmed)
      .eq("status", "published")
      .maybeSingle();
    data = byYoutube.data;
    error = byYoutube.error;
  }

  if (error || !data) {
    const plain = await supabase
      .from("videos")
      .select("*")
      .eq(trimmed.length <= 16 ? "youtube_id" : "id", trimmed)
      .eq("status", "published")
      .maybeSingle();
    if (plain.error || !plain.data) {
      if (error) console.error("Failed to load video", error);
      return null;
    }
    data = { ...plain.data, categories: null };
  }

  const category = categoryFromJoin((data as { categories?: unknown }).categories);
  const { categories, ...video } = data as Video & { categories: unknown };
  void categories;
  return {
    ...(video as Video),
    category_slug: category?.slug ?? "",
    category_name: category?.name ?? "",
  };
});

export const getCarouselVideos = cache(async (): Promise<CarouselVideo[]> => {
  const { data, error } = await supabase
    .from("videos")
    .select("id, title, thumbnail_url, view_count, published_at, categories(slug, name)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(24);

  if (error || !data) {
    console.error("Failed to load carousel videos", error);
    return [];
  }

  return data
    .map((v) => {
      const category = Array.isArray(v.categories) ? v.categories[0] : v.categories;
      if (!category) return null;
      return {
        id: v.id as string,
        title: v.title as string,
        thumbnail_url: v.thumbnail_url as string | null,
        view_count: (v.view_count as number) ?? 0,
        category_slug: category.slug as string,
        category_name: category.name as string,
      };
    })
    .filter((v): v is CarouselVideo => v !== null)
    .sort((a, b) => b.view_count - a.view_count)
    .slice(0, 8);
});

function sanitizeSearchQuery(raw: string): string {
  return raw
    .trim()
    .slice(0, 80)
    .replace(/[%_,"()\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function searchVideos(query: string): Promise<SearchVideo[]> {
  const q = sanitizeSearchQuery(query);
  if (!q) return [];

  const pattern = `"%${q}%"`;
  const { data, error } = await supabase
    .from("videos")
    .select(`${VIDEO_CARD_COLUMNS}, categories(slug, name)`)
    .eq("status", "published")
    .or(`title.ilike.${pattern},summary.ilike.${pattern},hook.ilike.${pattern},takeaway.ilike.${pattern}`)
    .limit(40);

  if (error || !data) {
    console.error("Failed to search videos", error);
    return [];
  }

  const qLower = q.toLowerCase();
  return data
    .map((v) => {
      const category = Array.isArray(v.categories) ? v.categories[0] : v.categories;
      return {
        id: v.id as string,
        title: v.title as string,
        thumbnail_url: v.thumbnail_url as string | null,
        view_count: (v.view_count as number) ?? 0,
        published_at: (v.published_at as string | null) ?? null,
        channel_title: (v.channel_title as string | null) ?? null,
        rank: (v.rank as number | null) ?? null,
        category_slug: (category?.slug as string) ?? "",
        category_name: (category?.name as string) ?? "",
      };
    })
    .sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(qLower) ? 0 : 1;
      const bTitle = b.title.toLowerCase().includes(qLower) ? 0 : 1;
      if (aTitle !== bTitle) return aTitle - bTitle;
      return b.view_count - a.view_count;
    });
}

export const getSitemapEntries = cache(async () => {
  const [categories, videos] = await Promise.all([
    supabase.from("categories").select("slug"),
    supabase.from("videos").select("id, updated_at").eq("status", "published"),
  ]);
  return {
    categories: (categories.data ?? []) as { slug: string }[],
    videos: (videos.data ?? []) as { id: string; updated_at: string }[],
  };
});

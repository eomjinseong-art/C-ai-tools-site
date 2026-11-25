import { cache } from "react";
import { ARCHIVE_RANK, pageWindow } from "@/lib/listing";
import { rankSearchHits } from "@/lib/searchRank";
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
    .gte("rank", 1)
    .lt("rank", ARCHIVE_RANK)
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
    .gte("rank", 1)
    .lt("rank", ARCHIVE_RANK)
    .order("rank", { ascending: true })
    .limit(ARCHIVE_RANK - 1);

  if (error) {
    console.error("Failed to load videos", error);
    return [];
  }
  return (data ?? []) as Video[];
});

export const countArchivedVideos = cache(async (categoryId: string): Promise<number> => {
  const { count, error } = await supabase
    .from("videos")
    .select("id", { count: "exact", head: true })
    .eq("category_id", categoryId)
    .eq("status", "published")
    .gte("rank", ARCHIVE_RANK);
  if (error) {
    console.error("Failed to count archived videos", error);
    return 0;
  }
  return count ?? 0;
});

export const getArchivedVideos = cache(async (categoryId: string, page: number): Promise<Video[]> => {
  const window = pageWindow(page);
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("category_id", categoryId)
    .eq("status", "published")
    .gte("rank", ARCHIVE_RANK)
    .order("published_at", { ascending: false })
    .range(window.from, window.to);
  if (error) {
    console.error("Failed to load archived videos", error);
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
    .gte("rank", 1)
    .lt("rank", ARCHIVE_RANK)
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

function sanitizeCategorySlug(raw: string): string {
  const slug = raw.trim();
  return /^[a-z0-9-]{1,80}$/.test(slug) ? slug : "";
}

export async function searchVideos(query: string, categorySlug = ""): Promise<SearchVideo[]> {
  const q = sanitizeSearchQuery(query);
  const safeSlug = sanitizeCategorySlug(categorySlug);
  if (!q && !safeSlug) return [];

  const pattern = q ? `"%${q}%"` : "";
  let request = supabase
    .from("videos")
    .select(`${VIDEO_CARD_COLUMNS}, summary, hook, categories!inner(slug, name, target_video_count)`)
    .eq("status", "published");
  if (q) {
    const idClause = /^[\w-]{6,16}$/.test(q) ? `,youtube_id.eq.${q}` : "";
    request = request.or(`title.ilike.${pattern},summary.ilike.${pattern},hook.ilike.${pattern},takeaway.ilike.${pattern}${idClause}`);
  }
  if (safeSlug) request = request.eq("categories.slug", safeSlug);
  const { data, error } = await request.limit(80);

  if (error || !data) {
    console.error("Failed to search videos", error);
    return [];
  }

  const hits = data.map((v) => {
    const category = Array.isArray(v.categories) ? v.categories[0] : v.categories;
    return {
      id: v.id as string,
      title: v.title as string,
      thumbnail_url: v.thumbnail_url as string | null,
      view_count: (v.view_count as number) ?? 0,
      published_at: (v.published_at as string | null) ?? null,
      channel_title: (v.channel_title as string | null) ?? null,
      rank: (v.rank as number | null) ?? null,
      youtube_id: (v.youtube_id as string | null) ?? null,
      summary: (v.summary as string | null) ?? null,
      hook: (v.hook as string | null) ?? null,
      category_slug: (category?.slug as string) ?? "",
      category_name: (category?.name as string) ?? "",
      target_video_count: (category?.target_video_count as number | null) ?? 10,
    };
  });
  return rankSearchHits(hits, q).slice(0, 40);
}

const ARCHIVE_SITEMAP_CAP = 5000;

export const getSitemapEntries = cache(async () => {
  const [categories, videos, archived] = await Promise.all([
    supabase.from("categories").select("slug"),
    supabase.from("videos").select("id, updated_at").eq("status", "published"),
    supabase
      .from("videos")
      .select("categories!inner(slug)")
      .eq("status", "published")
      .gte("rank", ARCHIVE_RANK)
      .limit(ARCHIVE_SITEMAP_CAP),
  ]);
  let archiveSlugs: string[] | null = null;
  if (!archived.error && (archived.data?.length ?? 0) < ARCHIVE_SITEMAP_CAP) {
    const slugs = new Set<string>();
    for (const row of archived.data ?? []) {
      const category = Array.isArray(row.categories) ? row.categories[0] : row.categories;
      const slug = (category as { slug?: string } | null)?.slug;
      if (slug) slugs.add(slug);
    }
    archiveSlugs = [...slugs];
  }
  return {
    categories: (categories.data ?? []) as { slug: string }[],
    videos: (videos.data ?? []) as { id: string; updated_at: string }[],
    archiveSlugs,
  };
});

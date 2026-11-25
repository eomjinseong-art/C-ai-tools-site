import { ARCHIVE_RANK, isArchivedRank, isRecommendedRank } from "./listing";

export type SearchHit = {
  id: string;
  title: string;
  thumbnail_url: string | null;
  view_count: number;
  published_at: string | null;
  channel_title: string | null;
  rank: number | null;
  youtube_id?: string | null;
  category_slug: string;
  category_name: string;
  summary?: string | null;
  hook?: string | null;
  target_video_count?: number | null;
};

export type RankedSearchHit = SearchHit & {
  listing: "recommended" | "archive";
  badges: string[];
};

function yearInTitle(title: string): number | null {
  const years = [...title.matchAll(/20\d{2}/g)].map((match) => Number(match[0]));
  return years.length > 0 ? Math.min(...years) : null;
}

export function versionNote(title: string, publishedAt: string | null, now = new Date()): string | null {
  const titleYear = yearInTitle(title);
  const publishedYear = publishedAt ? new Date(publishedAt).getUTCFullYear() : null;
  const current = now.getUTCFullYear();
  if ((titleYear != null && titleYear < current) || (publishedYear != null && publishedYear <= current - 2)) {
    return "이전 시기 강의";
  }
  return null;
}

export function searchResultHref(hit: { id: string; category_slug: string; rank?: number | null; listing?: "recommended" | "archive" }): string {
  if (hit.listing === "archive" || isArchivedRank(hit.rank) || !hit.category_slug) return `/video/${hit.id}`;
  return `/category/${hit.category_slug}?video=${hit.id}#player`;
}

export function rankSearchHits(hits: readonly SearchHit[], query: string, now = new Date()): RankedSearchHit[] {
  const q = query.trim().toLowerCase();
  return hits
    .map((hit) => {
      const title = hit.title.toLowerCase();
      const categoryName = hit.category_name.toLowerCase();
      const categorySlug = hit.category_slug.toLowerCase();
      const category = `${categoryName} ${categorySlug}`;
      const body = `${hit.summary ?? ""} ${hit.hook ?? ""}`.toLowerCase();
      let score = Math.min(20, Math.log10((hit.view_count || 0) + 1) * 5);
      const badges: string[] = [];
      const archived = isArchivedRank(hit.rank);
      const recommended = isRecommendedRank(hit.rank);
      const categoryMatch = Boolean(q) && (category.includes(q) || categorySlug === q);
      if (hit.youtube_id && hit.youtube_id.toLowerCase() === q) score += 1000;
      if (categoryMatch) score += categorySlug === q || categoryName === q ? 600 : 500;
      if (q && title === q) score += 400;
      else if (q && title.startsWith(q)) score += 300;
      else if (q && title.includes(q)) score += 200;
      else if (q && body.includes(q)) {
        score += 40;
        if (!categoryMatch) badges.push("다른 도구 영상에서 언급");
      }
      if (recommended && hit.rank != null) {
        const target = Math.min(Math.max(hit.target_video_count ?? 10, 1), ARCHIVE_RANK - 1);
        score += hit.rank <= target ? 25 : 10;
      } else if (archived) badges.push("보관");
      const old = versionNote(hit.title, hit.published_at, now);
      if (old) {
        score -= 5;
        badges.push(old);
      }
      return { hit, score, badges, listing: archived ? "archive" as const : "recommended" as const };
    })
    .sort((a, b) => b.score - a.score || b.hit.view_count - a.hit.view_count)
    .map(({ hit, badges, listing }) => ({ ...hit, badges, listing }));
}

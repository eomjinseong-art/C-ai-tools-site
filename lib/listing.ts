export const ARCHIVE_RANK = 1000;
export const ARCHIVE_PAGE_SIZE = 12;

/** Rank 1–999 stays recommendable. Rank 1000 is the archive boundary and is never included. */
export function isRecommendedRank(rank: number | null | undefined): boolean {
  return rank != null && rank >= 1 && rank < ARCHIVE_RANK;
}

export function isArchivedRank(rank: number | null | undefined): boolean {
  return rank != null && rank >= ARCHIVE_RANK;
}

export function pageWindow(page: number, pageSize = ARCHIVE_PAGE_SIZE): { page: number; from: number; to: number } {
  const safe = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const from = (safe - 1) * pageSize;
  return { page: safe, from, to: from + pageSize - 1 };
}

export function pageCount(total: number, pageSize = ARCHIVE_PAGE_SIZE): number {
  if (total <= 0) return 1;
  return Math.ceil(total / pageSize);
}

export function archivePath(slug: string, page = 1): string {
  const path = `/category/${slug}/archive`;
  return page > 1 ? `${path}?page=${page}` : path;
}

/** Invalid or out-of-range pages redirect to the canonical page. `?page=1` redirects to the bare path. */
export function resolveArchivePage(
  raw: string | undefined,
  total: number,
  pageSize = ARCHIVE_PAGE_SIZE,
): { page: number; pages: number; redirectTo: number | null } {
  const pages = pageCount(total, pageSize);
  if (raw == null || raw === "") return { page: 1, pages, redirectTo: null };
  if (!/^[1-9]\d{0,5}$/.test(raw)) return { page: 1, pages, redirectTo: 1 };
  const requested = Number(raw);
  if (requested === 1) return { page: 1, pages, redirectTo: 1 };
  if (requested > pages) return { page: pages, pages, redirectTo: pages };
  return { page: requested, pages, redirectTo: null };
}

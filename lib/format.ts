export function formatViewCount(count: number | null | undefined): string {
  if (count == null || count <= 0) return "";
  if (count >= 100000000) return `${(count / 100000000).toFixed(1)}억회`;
  if (count >= 10000) return `${(count / 10000).toFixed(1)}만회`;
  return `${count.toLocaleString("ko-KR")}회`;
}

export function joinMeta(...parts: Array<string | null | undefined>): string {
  return parts.filter((part) => Boolean(part && part.trim())).join(" · ");
}

export function formatPublishedDate(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

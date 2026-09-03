/** Prefer the smaller YouTube mqdefault (320x180) over hq/maxres. */
export function compactThumbnail(url: string | null | undefined): string | null {
  if (!url) return null;
  return url.replace(
    /\/(maxresdefault|sddefault|hq720|hqdefault)(\.[a-zA-Z0-9]+)(\?.*)?/i,
    "/mqdefault$2$3",
  );
}

export function youtubePoster(youtubeId: string, thumbnailUrl?: string | null): string {
  return compactThumbnail(thumbnailUrl) ?? `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`;
}

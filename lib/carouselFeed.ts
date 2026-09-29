export type CarouselItem = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  url: string;
  cover: string;
  slideCount: number;
};

const FEED_URL = "https://nadoo-carousel.vercel.app/feed.json";

export async function getLatestCarousels(limit = 6): Promise<CarouselItem[]> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 600 } });
    if (!res.ok) return [];
    const data = (await res.json()) as { items?: CarouselItem[] };
    return (data.items ?? []).slice(0, limit);
  } catch {
    return [];
  }
}

export function carouselLink(url: string) {
  return `${url}${url.includes("?") ? "&" : "?"}utm_source=nadoo-ai&utm_medium=hub&utm_campaign=carousel`;
}

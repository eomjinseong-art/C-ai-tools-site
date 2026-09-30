import { carouselLink } from "@/lib/carouselFeed";
import AiTechNewsList, { type NewsItem } from "@/components/AiTechNewsList";

const NEWS_URL = "https://raw.githubusercontent.com/eomjinseong-art/nadoo-carousel/main/data/ai-news.json";
const NEWS_PAGE = "https://nadoo-carousel.vercel.app/news";

async function getNews(limit: number): Promise<NewsItem[]> {
  try {
    const res = await fetch(NEWS_URL, { next: { revalidate: 600 } });
    if (!res.ok) return [];
    const data = (await res.json()) as NewsItem[];
    return Array.isArray(data) ? data.slice(0, limit) : [];
  } catch {
    return [];
  }
}

export default async function AiTechNews() {
  const items = await getNews(6);
  if (items.length === 0) return null;
  return (
    <section className="flex flex-col gap-2" aria-labelledby="ai-tech-news">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 id="ai-tech-news" className="text-lg font-bold text-gray-900 dark:text-gray-100">AI 테크 소식</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">누르면 한국어 요약과 핵심 포인트를 바로 볼 수 있어요.</p>
        </div>
        <a href={carouselLink(NEWS_PAGE)} target="_blank" rel="noopener" className="shrink-0 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-500">
          전체 보기 →
        </a>
      </div>
      <AiTechNewsList items={items} newsPage={carouselLink(NEWS_PAGE)} />
    </section>
  );
}

import { carouselLink } from "@/lib/carouselFeed";

type NewsItem = { date: string; topic: string; text: string | null; sources: string[]; tags: string[] };

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
    <section className="flex flex-col gap-3" aria-labelledby="ai-tech-news">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 id="ai-tech-news" className="text-lg font-bold text-gray-900 dark:text-gray-100">AI 테크 소식</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">매일 눈여겨본 AI 소식과 쓸 만한 팁을 한 줄로 정리해요.</p>
        </div>
        <a href={carouselLink(NEWS_PAGE)} target="_blank" rel="noopener" className="shrink-0 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-500">
          전체 보기 →
        </a>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((item, i) => (
          <li key={item.date + i} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p className="text-xs text-gray-400">{item.date.slice(0, 10).replace(/-/g, ".")}</p>
            <p className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900 dark:text-gray-100">{item.topic}</p>
            {item.text && <p className="mt-1 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">{item.text}</p>}
            {item.sources[0] && (
              <a href={item.sources[0]} target="_blank" rel="noopener noreferrer nofollow" className="mt-2 inline-block text-xs font-semibold text-brand-600 hover:underline dark:text-brand-500">
                원문 보기
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

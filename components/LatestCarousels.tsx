import { carouselLink, getLatestCarousels } from "@/lib/carouselFeed";

export default async function LatestCarousels() {
  const items = await getLatestCarousels(6);
  if (items.length === 0) return null;
  return (
    <section className="flex flex-col gap-3" aria-labelledby="latest-carousels">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 id="latest-carousels" className="text-lg font-bold text-gray-900 dark:text-gray-100">
            최신 AI 캐러셀
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">하루 4번, 새로 나온 AI 소식을 슬라이드로 정리해요.</p>
        </div>
        <a href={carouselLink("https://nadoo-carousel.vercel.app/")} target="_blank" rel="noopener" className="shrink-0 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-500">
          전체 보기 →
        </a>
      </div>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {items.map((item) => (
          <li key={item.slug}>
            <a href={carouselLink(item.url)} target="_blank" rel="noopener" className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-brand-400 dark:border-gray-800 dark:bg-gray-900">
              <div className="aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.cover} alt={item.title} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
              </div>
              <div className="p-3">
                <p className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-gray-100">{item.title}</p>
                <p className="mt-1 text-xs text-gray-400">{item.date.slice(0, 10).replace(/-/g, ".")} · 슬라이드 {item.slideCount}장</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

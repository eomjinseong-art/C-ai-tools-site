import type { Metadata } from "next";
import VideoCard from "@/components/VideoCard";
import { getCategories, searchVideos } from "@/lib/data";
import { searchResultHref } from "@/lib/searchRank";

export const metadata: Metadata = {
  title: "검색",
  robots: { index: false, follow: true },
  alternates: { canonical: "/search" },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string } | Promise<{ q?: string; category?: string }>;
}) {
  const queryParams = await searchParams;
  const query = queryParams.q?.trim() ?? "";
  const category = queryParams.category?.trim() ?? "";
  const [results, categories] = await Promise.all([
    query || category ? searchVideos(query, category) : Promise.resolve([]),
    getCategories(),
  ]);
  const categoryName = categories.find((item) => item.slug === category)?.name ?? "";
  const searched = Boolean(query || category);

  return (
    <div className="flex flex-col gap-6">
      <form action="/search" className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="search-q">
          검색어
        </label>
        <input
          id="search-q"
          name="q"
          defaultValue={query}
          placeholder="도구 이름, 제목, 유튜브 id"
          className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        />
        <label className="sr-only" htmlFor="search-category">
          도구
        </label>
        <select
          id="search-category"
          name="category"
          defaultValue={category}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="">모든 도구</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
          검색
        </button>
      </form>
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        {query && categoryName ? (
          <>
            &ldquo;{query}&rdquo; · {categoryName} ({results.length}건)
          </>
        ) : query ? (
          <>
            &ldquo;{query}&rdquo; 검색 결과 ({results.length}건)
          </>
        ) : categoryName ? (
          <>
            {categoryName} 영상 ({results.length}건)
          </>
        ) : category ? (
          <>선택한 도구의 영상 ({results.length}건)</>
        ) : (
          "검색어를 입력해 주세요"
        )}
      </h1>
      {searched && results.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
          일치하는 영상을 찾지 못했습니다. 도구를 고르거나 다른 단어를 써 보세요.
        </div>
      ) : searched ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((video) => (
            <VideoCard key={video.id} video={video} showRank={false} href={searchResultHref(video)} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

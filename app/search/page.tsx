import type { Metadata } from "next";
import VideoCard from "@/components/VideoCard";
import { searchVideos } from "@/lib/data";

export const metadata: Metadata = {
  title: "검색",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q?.trim() ?? "";
  const results = query ? await searchVideos(query) : [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        {query ? (
          <>
            &ldquo;{query}&rdquo; 검색 결과 ({results.length}건)
          </>
        ) : (
          "검색어를 입력해 주세요"
        )}
      </h1>
      {query && results.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
          일치하는 실전 방법을 찾지 못했습니다. 다른 키워드로 검색해보세요.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((video) => (
            <VideoCard key={video.id} video={video} showRank={false} />
          ))}
        </div>
      )}
    </div>
  );
}

import type { Category, Video } from "@/lib/types";
import { TOOL_SITE_URLS } from "@/lib/toolSites";
import AdBanner from "@/components/AdBanner";
import CategoryMenu from "@/components/CategoryMenu";
import VideoCard from "@/components/VideoCard";
import SummaryPanel from "@/components/SummaryPanel";

export default function BrowseView({
  categories,
  selectedCategory,
  videos,
  selectedVideo,
}: {
  categories: Category[];
  selectedCategory: Category | null;
  videos: Video[];
  selectedVideo: Video | null;
}) {
  if (categories.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
        <p className="font-medium">아직 등록된 카테고리가 없습니다.</p>
        <p className="mt-1 text-sm">수집기가 첫 실행되면 카테고리와 영상이 자동으로 채워집니다.</p>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-[180px_1fr_400px]">
      <div className="lg:border-r lg:border-gray-100 lg:pr-4 dark:lg:border-gray-800">
        <CategoryMenu categories={categories} selectedSlug={selectedCategory?.slug ?? ""} />
      </div>

      <div className="flex flex-col gap-3">
        {selectedCategory && (
          <div className="flex items-center gap-2 pb-1">
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {selectedCategory.name}
            </h1>
            {selectedCategory.is_trend && (
              <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white">
                트렌드
              </span>
            )}
            {TOOL_SITE_URLS[selectedCategory.slug] && (
              <a
                href={TOOL_SITE_URLS[selectedCategory.slug]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
              >
                바로가기 ↗
              </a>
            )}
          </div>
        )}
        {videos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
            아직 수집된 영상이 없습니다. 곧 업데이트될 예정입니다.
          </div>
        ) : (
          <>
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                selected={video.id === selectedVideo?.id}
              />
            ))}
            <AdBanner placement="video_list_bottom" />
          </>
        )}
      </div>

      <div className="lg:border-l lg:border-gray-100 lg:pl-4 dark:lg:border-gray-800">
        <SummaryPanel video={selectedVideo} />
      </div>
    </section>
  );
}

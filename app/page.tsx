import type { Metadata } from "next";
import AdBanner from "@/components/AdBanner";
import TopCarousel from "@/components/TopCarousel";
import CategoryChips from "@/components/CategoryChips";
import { getCarouselVideos, getCategoryPreviews } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [categories, carouselVideos] = await Promise.all([
    getCategoryPreviews(),
    getCarouselVideos(),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <section className="text-center py-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
          오늘의 AI, 나두 써본다
        </h1>
        <p className="mt-4 text-gray-500 max-w-2xl mx-auto dark:text-gray-400">
          챗GPT부터 미드저니, 커서까지 — 매일 업데이트되는 유튜브 영상을 AI가 요약해
          핵심만 빠르게 알려드립니다.
        </p>
      </section>

      <AdBanner placement="guidebook_footer" />

      <TopCarousel videos={carouselVideos} />

      <AdBanner placement="home_top" />

      {categories.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            카테고리에서 사용법 보기
          </h2>
          <CategoryChips categories={categories} />
        </section>
      )}

      <AdBanner placement="home_bottom" />
    </div>
  );
}

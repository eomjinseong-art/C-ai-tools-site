import type { Metadata } from "next";
import AdBanner from "@/components/AdBanner";
import TopCarousel from "@/components/TopCarousel";
import CategoryChips from "@/components/CategoryChips";
import LatestCarousels from "@/components/LatestCarousels";
import SituationPicks from "@/components/SituationPicks";
import AiTechNews from "@/components/AiTechNews";
import FamilySection from "@/components/FamilySection";
import { getCarouselVideos, getCategoryPreviews } from "@/lib/data";

export const revalidate = 600;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [categories, carouselVideos] = await Promise.all([
    getCategoryPreviews(),
    getCarouselVideos(),
  ]);
  const toolCategories = categories.filter((c) => !c.is_trend);

  return (
    <div className="flex flex-col gap-12">
      <h1 className="sr-only">나두Ai: 인기 AI 도구 가격·한국어 지원·쓰는 법 한국어 정리</h1>

      <section className="flex flex-col gap-3 pt-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">요즘 많이 보는 AI 영상</h2>
        <TopCarousel videos={carouselVideos} />
      </section>

      <LatestCarousels />

      {toolCategories.length > 0 && (
        <section id="tools" className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">도구별 사용법 가이드</h2>
          <CategoryChips categories={toolCategories} />
        </section>
      )}

      <SituationPicks />

      <AiTechNews />

      <FamilySection />

      <AdBanner placement="home_bottom" />
    </div>
  );
}

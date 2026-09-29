import type { Metadata } from "next";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import TopCarousel from "@/components/TopCarousel";
import CategoryChips from "@/components/CategoryChips";
import LatestCarousels from "@/components/LatestCarousels";
import SituationPicks from "@/components/SituationPicks";
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
      <section className="py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-gray-100">
          뭘 써야 할지, 3분이면 정해져요
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-gray-500 dark:text-gray-400">
          챗GPT, 클로드, 캔바, 런웨이까지. 인기 AI 도구 30개의 가격, 한국어 지원, 쓰는 법을
          한국어로 정리하고 매일 새 소식을 더합니다.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link href="#situations" className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700">상황별로 찾기</Link>
          <Link href="/tools" className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:border-brand-500 dark:border-gray-700 dark:text-gray-200">도구 30개 한눈에 보기</Link>
        </div>
      </section>

      <LatestCarousels />

      <SituationPicks />

      {toolCategories.length > 0 && (
        <section id="tools" className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">도구별 사용법 가이드</h2>
          <CategoryChips categories={toolCategories} />
        </section>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">요즘 많이 보는 AI 영상</h2>
        <TopCarousel videos={carouselVideos} />
      </section>

      <FamilySection />

      <AdBanner placement="home_bottom" />
    </div>
  );
}

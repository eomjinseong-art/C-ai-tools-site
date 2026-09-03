import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BrowseView from "@/components/BrowseView";
import { getCategories, getVideosForCategory } from "@/lib/data";
import { SITE_NAME } from "@/lib/site";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) return { title: "카테고리" };
  return {
    title: `${category.name} 사용법`,
    description: `${category.name} 관련 유튜브 영상을 AI가 요약한 실전 가이드를 ${SITE_NAME}에서 확인하세요.`,
    alternates: { canonical: `/category/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const categories = await getCategories();
  const selectedCategory = categories.find((c) => c.slug === params.slug) ?? null;
  if (!selectedCategory) notFound();

  const videos = await getVideosForCategory(selectedCategory.id);
  const selectedVideo = videos[0] ?? null;

  return (
    <BrowseView
      categories={categories}
      selectedCategory={selectedCategory}
      videos={videos}
      selectedVideo={selectedVideo}
    />
  );
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BrowseView from "@/components/BrowseView";
import { getCategories, getPublishedVideo, getVideosForCategory } from "@/lib/data";
import { SITE_NAME } from "@/lib/site";

export const revalidate = 60;
export const dynamicParams = true;

type CategoryPageProps = {
  params: { slug: string } | Promise<{ slug: string }>;
  searchParams?: { video?: string } | Promise<{ video?: string }>;
};

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return { title: "카테고리" };
  return {
    title: `${category.name} 사용법`,
    description: `${category.name} 관련 유튜브 영상을 AI가 요약한 실전 가이드를 ${SITE_NAME}에서 확인하세요.`,
    alternates: { canonical: `/category/${category.slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const query = (await searchParams) ?? {};
  const videoId = query.video?.trim() ?? "";

  const categories = await getCategories();
  const selectedCategory = categories.find((c) => c.slug === slug) ?? null;
  if (!selectedCategory) notFound();

  const videos = await getVideosForCategory(selectedCategory.id);
  let selectedVideo =
    videos.find((video) => video.id === videoId || video.youtube_id === videoId) ?? videos[0] ?? null;

  if (videoId && selectedVideo?.id !== videoId && selectedVideo?.youtube_id !== videoId) {
    const extra = await getPublishedVideo(videoId);
    if (extra && extra.category_id === selectedCategory.id) {
      selectedVideo = extra;
    }
  }

  return (
    <BrowseView
      categories={categories}
      selectedCategory={selectedCategory}
      videos={videos}
      selectedVideo={selectedVideo}
    />
  );
}

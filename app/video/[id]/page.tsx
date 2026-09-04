import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BrowseView from "@/components/BrowseView";
import { getCategories, getPublishedVideo, getVideosForCategory } from "@/lib/data";
import { compactThumbnail } from "@/lib/thumbnails";

export const revalidate = 60;
export const dynamicParams = true;

type VideoPageProps = {
  params: { id: string } | Promise<{ id: string }>;
};

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  const { id } = await params;
  const video = await getPublishedVideo(id);
  if (!video) return { title: "영상" };
  const description = video.summary ?? video.hook ?? video.title;
  const image = compactThumbnail(video.thumbnail_url);
  return {
    title: video.title,
    description,
    alternates: { canonical: `/video/${video.id}` },
    openGraph: {
      title: video.title,
      description,
      type: "video.other",
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { id } = await params;
  const [video, categories] = await Promise.all([
    getPublishedVideo(id),
    getCategories(),
  ]);
  if (!video) notFound();

  const selectedCategory = categories.find((c) => c.id === video.category_id) ?? null;
  const videos = selectedCategory ? await getVideosForCategory(selectedCategory.id) : [];
  const selectedVideo = videos.find((v) => v.id === video.id) ?? video;

  return (
    <BrowseView
      categories={categories}
      selectedCategory={selectedCategory}
      videos={videos}
      selectedVideo={selectedVideo}
    />
  );
}

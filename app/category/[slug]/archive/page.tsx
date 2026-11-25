import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import VideoCard from "@/components/VideoCard";
import ArchiveNotFound from "@/app/category/[slug]/archive/not-found";
import { countArchivedVideos, getArchivedVideos, getCategories } from "@/lib/data";
import { archivePath, resolveArchivePage } from "@/lib/listing";

export const revalidate = 60;

type ArchivePageProps = {
  params: { slug: string } | Promise<{ slug: string }>;
  searchParams?: { page?: string } | Promise<{ page?: string }>;
};

export async function generateMetadata({ params, searchParams }: ArchivePageProps): Promise<Metadata> {
  const { slug } = await params;
  const query = (await searchParams) ?? {};
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);
  if (!category) {
    return {
      title: "보관 페이지를 찾을 수 없습니다",
      robots: { index: false, follow: false },
    };
  }
  const total = await countArchivedVideos(category.id);
  const resolved = resolveArchivePage(query.page, total);
  return {
    title: resolved.page > 1 ? `${category.name} 보관 영상 ${resolved.page}페이지` : `${category.name} 보관 영상`,
    description: `${category.name} 추천 목록에서 빠졌지만 삭제하지 않은 영상입니다.`,
    alternates: { canonical: archivePath(category.slug, resolved.redirectTo ?? resolved.page) },
    robots: total > 0 ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export default async function ArchivePage({ params, searchParams }: ArchivePageProps) {
  const { slug } = await params;
  const query = (await searchParams) ?? {};
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);
  if (!category) return <ArchiveNotFound />;

  const total = await countArchivedVideos(category.id);
  const resolved = resolveArchivePage(query.page, total);
  if (resolved.redirectTo != null) redirect(archivePath(category.slug, resolved.redirectTo));
  const videos = total > 0 ? await getArchivedVideos(category.id, resolved.page) : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Link href={`/category/${category.slug}`} className="text-sm text-brand-600 hover:underline dark:text-brand-400">
          {category.name} 추천 목록
        </Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{category.name} 보관 영상</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          랭크 1000으로 옮겨 둔 영상입니다. 추천 목록의 주소와 기록은 그대로 둡니다. {total}개.
        </p>
      </div>
      {videos.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 p-8 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          아직 보관으로 옮겨진 영상이 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {videos.map((video) => (
            <VideoCard key={video.id} video={{ ...video, badges: ["보관"] }} showRank={false} href={`/video/${video.id}`} />
          ))}
        </div>
      )}
      {resolved.pages > 1 && (
        <nav className="flex items-center gap-4 text-sm" aria-label="보관 페이지">
          {resolved.page > 1 && (
            <Link href={archivePath(category.slug, resolved.page - 1)} className="text-brand-600 hover:underline">
              이전
            </Link>
          )}
          <span>
            {resolved.page} / {resolved.pages}
          </span>
          {resolved.page < resolved.pages && (
            <Link href={archivePath(category.slug, resolved.page + 1)} className="text-brand-600 hover:underline">
              다음
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}

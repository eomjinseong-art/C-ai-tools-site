import Link from "next/link";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { BlogDraftVideo } from "@/lib/blogDraft";
import BlogExportStudio from "@/components/admin/BlogExportStudio";

const SETUP_SQL = `create table if not exists public.blog_exports (
  video_id uuid primary key references public.videos (id) on delete cascade,
  posted_at timestamptz not null default now(),
  blog_url text
);

alter table public.blog_exports enable row level security;`;

export default async function AdminBlogPage() {
  requireAdmin();

  const { data: videoRows, error: videoError } = await supabaseAdmin
    .from("videos")
    .select(
      "id, title, youtube_id, channel_title, hook, summary, summary_points, tool_features, takeaway, rank, categories(name, slug)",
    )
    .eq("status", "published")
    .order("rank", { ascending: true });

  const posted = await supabaseAdmin.from("blog_exports").select("video_id, posted_at");
  const setupNeeded = Boolean(posted.error);

  const postedAt = new Map<string, string>();
  if (!setupNeeded) {
    for (const row of posted.data ?? []) {
      postedAt.set(row.video_id as string, row.posted_at as string);
    }
  }

  const videos: BlogDraftVideo[] = (videoRows ?? [])
    .map((row) => {
      const category = Array.isArray(row.categories) ? row.categories[0] : row.categories;
      return {
        id: row.id as string,
        title: row.title as string,
        youtube_id: row.youtube_id as string,
        channel_title: (row.channel_title as string | null) ?? null,
        hook: (row.hook as string | null) ?? null,
        summary: (row.summary as string | null) ?? null,
        summary_points: (row.summary_points as string[] | null) ?? null,
        tool_features: (row.tool_features as string[] | null) ?? null,
        takeaway: (row.takeaway as string | null) ?? null,
        category_name: (category?.name as string) ?? "기타",
        category_slug: (category?.slug as string) ?? "",
        posted_at: postedAt.get(row.id as string) ?? null,
      };
    })
    .sort((a, b) => {
      const aPosted = a.posted_at ? 1 : 0;
      const bPosted = b.posted_at ? 1 : 0;
      if (aPosted !== bPosted) return aPosted - bPosted;
      const cat = a.category_name.localeCompare(b.category_name, "ko");
      if (cat !== 0) return cat;
      return a.title.localeCompare(b.title, "ko");
    });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href="/admin" className="text-sm text-gray-500 hover:text-brand-600 dark:text-gray-400">
          ← 관리자
        </Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">블로그 초안</h1>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        공개된 모든 영상의 AI 요약을 Blogger에 붙여넣을 수 있게 만듭니다. 제목·본문을 복사한 뒤
        블로그에 발행하고, ‘올렸음 · 다음’을 누르면 남은 목록만 남습니다. 수집기가 새 영상을 넣으면
        다시 여기 미발행에 나타납니다.
      </p>
      {videoError && (
        <p className="text-sm text-red-500">영상을 불러오지 못했습니다. {videoError.message}</p>
      )}
      <BlogExportStudio videos={videos} setupNeeded={setupNeeded} setupSql={SETUP_SQL} />
    </div>
  );
}

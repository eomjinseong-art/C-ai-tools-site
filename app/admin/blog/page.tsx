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

const VIDEO_COLUMNS =
  "id, title, youtube_id, channel_title, hook, summary, summary_points, tool_features, takeaway, rank, categories(name, slug)";
const PROVENANCE_COLUMNS =
  "summary_source, summary_generated_at, summary_verified_at, source_cues, useful_facts, costs, limitations";

export default async function AdminBlogPage() {
  requireAdmin();

  const withProvenance = await supabaseAdmin
    .from("videos")
    .select(`${VIDEO_COLUMNS}, ${PROVENANCE_COLUMNS}`)
    .eq("status", "published")
    .order("rank", { ascending: true });
  const missingProvenance = Boolean(
    withProvenance.error && /column|schema cache|does not exist/i.test(withProvenance.error.message),
  );
  const videoResult = missingProvenance
    ? await supabaseAdmin.from("videos").select(VIDEO_COLUMNS).eq("status", "published").order("rank", { ascending: true })
    : withProvenance;
  const { data: videoRows, error: videoError } = videoResult;

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
      const record = row as Record<string, unknown>;
      const joined = record.categories;
      const category = (Array.isArray(joined) ? joined[0] : joined) as { name?: string; slug?: string } | null;
      const text = (key: string) => (typeof record[key] === "string" ? (record[key] as string) : null);
      const list = (key: string) => (Array.isArray(record[key]) ? (record[key] as string[]) : null);
      const id = text("id") ?? "";
      return {
        id,
        title: text("title") ?? "",
        youtube_id: text("youtube_id") ?? "",
        channel_title: text("channel_title"),
        hook: text("hook"),
        summary: text("summary"),
        summary_points: list("summary_points"),
        tool_features: list("tool_features"),
        takeaway: text("takeaway"),
        summary_source: text("summary_source"),
        summary_generated_at: text("summary_generated_at"),
        summary_verified_at: text("summary_verified_at"),
        source_cues: record.source_cues,
        useful_facts: record.useful_facts,
        costs: text("costs"),
        limitations: text("limitations"),
        category_name: category?.name ?? "기타",
        category_slug: category?.slug ?? "",
        posted_at: postedAt.get(id) ?? null,
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
        공개된 영상의 발췌·검토 요약을 Blogger에 붙여넣을 수 있게 만듭니다. 제목·본문을 복사한 뒤
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

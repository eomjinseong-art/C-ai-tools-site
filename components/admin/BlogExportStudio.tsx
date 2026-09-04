"use client";

import { useMemo, useState } from "react";
import type { BlogDraftVideo } from "@/lib/blogDraft";
import { buildBlogHtml, buildBlogTitle } from "@/lib/blogDraft";
import { markBlogPosted, unmarkBlogPosted } from "@/app/admin/blog/actions";

type Filter = "pending" | "posted" | "all";

export default function BlogExportStudio({
  videos,
  setupNeeded,
  setupSql,
}: {
  videos: BlogDraftVideo[];
  setupNeeded: boolean;
  setupSql: string;
}) {
  const [filter, setFilter] = useState<Filter>("pending");
  const [selectedId, setSelectedId] = useState<string | null>(
    videos.find((video) => !video.posted_at)?.id ?? videos[0]?.id ?? null,
  );
  const [copied, setCopied] = useState<"title" | "body" | null>(null);

  const visible = useMemo(() => {
    if (filter === "pending") return videos.filter((video) => !video.posted_at);
    if (filter === "posted") return videos.filter((video) => video.posted_at);
    return videos;
  }, [filter, videos]);

  const selected = videos.find((video) => video.id === selectedId) ?? visible[0] ?? null;
  const pendingCount = videos.filter((video) => !video.posted_at).length;
  const postedCount = videos.length - pendingCount;

  async function copy(kind: "title" | "body") {
    if (!selected) return;
    const text = kind === "title" ? buildBlogTitle(selected) : buildBlogHtml(selected);
    await navigator.clipboard.writeText(text);
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1500);
  }

  function selectNextPending(afterId: string) {
    const pending = videos.filter((video) => !video.posted_at && video.id !== afterId);
    setSelectedId(pending[0]?.id ?? afterId);
    setFilter("pending");
  }

  return (
    <div className="flex flex-col gap-4">
      {setupNeeded && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
          <p className="font-medium">아직 ‘올렸음’ 기록이 저장되지 않습니다.</p>
          <p className="mt-1">
            Supabase → SQL Editor에 아래를 한 번 실행한 뒤 이 페이지를 새로고침하세요. 초안 복사는
            지금 바로 됩니다.
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-white/80 p-3 text-xs dark:bg-black/30">
            {setupSql}
          </pre>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-gray-500 dark:text-gray-400">
          전체 {videos.length} · 남음 {pendingCount} · 올림 {postedCount}
        </span>
        {(["pending", "posted", "all"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              filter === key
                ? "bg-brand-600 text-white"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            {key === "pending" ? "아직 안 올림" : key === "posted" ? "이미 올림" : "전체"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
        <div className="max-h-[70vh] overflow-y-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          {visible.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">이 목록이 비어 있습니다.</p>
          ) : (
            visible.map((video) => (
              <button
                key={video.id}
                type="button"
                onClick={() => setSelectedId(video.id)}
                className={`block w-full border-b border-gray-100 px-3 py-2 text-left text-sm last:border-b-0 dark:border-gray-800 ${
                  selected?.id === video.id
                    ? "bg-brand-50 dark:bg-brand-500/10"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <span className="block truncate font-medium text-gray-900 dark:text-gray-100">
                  {video.title}
                </span>
                <span className="text-xs text-gray-500">
                  {video.category_name}
                  {video.posted_at ? " · 올림" : ""}
                </span>
              </button>
            ))
          )}
        </div>

        {selected ? (
          <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-xs text-gray-500">{selected.category_name}</p>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{selected.title}</h2>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void copy("title")}
                className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
              >
                {copied === "title" ? "제목 복사됨" : "제목 복사"}
              </button>
              <button
                type="button"
                onClick={() => void copy("body")}
                className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
              >
                {copied === "body" ? "본문 복사됨" : "본문 복사"}
              </button>
              {!selected.posted_at ? (
                <form
                  action={async (formData) => {
                    const id = String(formData.get("video_id") || selected.id);
                    await markBlogPosted(formData);
                    selectNextPending(id);
                  }}
                >
                  <input type="hidden" name="video_id" value={selected.id} />
                  <button
                    type="submit"
                    disabled={setupNeeded}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 disabled:opacity-50"
                  >
                    올렸음 · 다음
                  </button>
                </form>
              ) : (
                <form action={unmarkBlogPosted}>
                  <input type="hidden" name="video_id" value={selected.id} />
                  <button
                    type="submit"
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700"
                  >
                    안 올린 것으로
                  </button>
                </form>
              )}
            </div>

            <p className="text-xs text-gray-500">
              Blogger 새 글 → 제목 붙여넣기 → HTML 보기 모드에서 본문 붙여넣기 → 발행 → 여기
              서 ‘올렸음 · 다음’
            </p>

            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm leading-relaxed text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
              <p className="mb-2 font-medium">{buildBlogTitle(selected)}</p>
              <div
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: buildBlogHtml(selected) }}
              />
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">왼쪽에서 영상을 고르세요.</p>
        )}
      </div>
    </div>
  );
}

import { SITE_NAME, SITE_URL } from "@/lib/site";
import { presentSummary } from "@/lib/summaryPresentation";

export type BlogDraftVideo = {
  id: string;
  title: string;
  youtube_id: string;
  channel_title: string | null;
  hook: string | null;
  summary: string | null;
  summary_points: string[] | null;
  tool_features: string[] | null;
  takeaway: string | null;
  summary_source?: string | null;
  summary_generated_at?: string | null;
  summary_verified_at?: string | null;
  source_cues?: unknown;
  useful_facts?: unknown;
  costs?: string | null;
  limitations?: string | null;
  category_name: string;
  category_slug: string;
  posted_at: string | null;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function paragraphs(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, "<br />")}</p>`)
    .join("\n");
}

function bullets(items: string[], marker: string): string {
  const lis = items
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("\n");
  if (!lis) return "";
  return `<p><strong>${escapeHtml(marker)}</strong></p>\n<ul>\n${lis}\n</ul>`;
}

export function buildBlogTitle(video: BlogDraftVideo): string {
  return `[${video.category_name}] ${video.title}`;
}

export function buildBlogHtml(video: BlogDraftVideo): string {
  const watchUrl = `https://www.youtube.com/watch?v=${video.youtube_id}`;
  const siteUrl = `${SITE_URL}/video/${video.id}`;
  const parts: string[] = [];

  parts.push(`<p><strong>${escapeHtml(video.category_name)}</strong> 사용법 요약</p>`);

  if (video.channel_title) {
    parts.push(`<p>원본 채널: ${escapeHtml(video.channel_title)}</p>`);
  }

  const view = presentSummary(video);
  if (view.state === "pending") {
    parts.push(`<p>이 영상은 아직 검토된 요약이 없습니다. 원본을 확인해 주세요.</p>`);
  } else {
    if (view.hook) parts.push(`<p><em>${escapeHtml(view.hook)}</em></p>`);
    parts.push(`<p><strong>${escapeHtml(view.label)}</strong></p>`);
    parts.push(paragraphs(view.summary));
    if (view.points.length) parts.push(bullets(view.points, "확인한 단계"));
    if (view.features.length) parts.push(bullets(view.features, "주요 기능"));
    if (view.costs) parts.push(`<p>비용: ${escapeHtml(view.costs)}</p>`);
    if (view.limitations) parts.push(`<p>한계: ${escapeHtml(view.limitations)}</p>`);
    if (view.takeaway) parts.push(`<p><em>“${escapeHtml(view.takeaway)}”</em></p>`);
  }

  parts.push(`<p>유튜브 원본: <a href="${watchUrl}">${watchUrl}</a></p>`);
  parts.push(`<p>${escapeHtml(SITE_NAME)}에서 보기: <a href="${siteUrl}">${siteUrl}</a></p>`);
  parts.push(
    `<p>이 글은 공개 유튜브 영상의 설명·자막 발췌 또는 검토된 요약입니다. AI가 새로 쓴 요약이라고 보지 마세요. 정확한 내용은 원본을 확인해 주세요. 영상 저작권은 원 채널에 있습니다.</p>`,
  );

  return parts.filter(Boolean).join("\n");
}

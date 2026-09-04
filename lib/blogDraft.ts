import { SITE_NAME, SITE_URL } from "@/lib/site";

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

  if (video.hook) {
    parts.push(`<p><em>${escapeHtml(video.hook)}</em></p>`);
  }

  if (video.summary) {
    parts.push(`<p><strong>AI 요약</strong></p>`);
    parts.push(paragraphs(video.summary));
  }

  if (video.summary_points?.length) {
    parts.push(bullets(video.summary_points, "핵심 포인트"));
  }

  if (video.tool_features?.length) {
    parts.push(bullets(video.tool_features, "주요 기능"));
  }

  if (video.takeaway) {
    parts.push(`<p><em>“${escapeHtml(video.takeaway)}”</em></p>`);
  }

  parts.push(`<p>유튜브 원본: <a href="${watchUrl}">${watchUrl}</a></p>`);
  parts.push(`<p>${escapeHtml(SITE_NAME)}에서 보기: <a href="${siteUrl}">${siteUrl}</a></p>`);
  parts.push(
    `<p>이 글은 공개 유튜브 영상을 AI로 재구성한 요약입니다. 정확한 내용은 원본을 확인해 주세요. 영상 저작권은 원 채널에 있습니다.</p>`,
  );

  return parts.filter(Boolean).join("\n");
}

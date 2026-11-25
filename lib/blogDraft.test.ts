import assert from "node:assert/strict";
import test from "node:test";
import { buildBlogHtml, type BlogDraftVideo } from "./blogDraft";

function video(partial: Partial<BlogDraftVideo>): BlogDraftVideo {
  return {
    id: "video-1",
    title: "챗GPT 강의",
    youtube_id: "abcdefghijk",
    channel_title: "채널",
    hook: null,
    summary: null,
    summary_points: null,
    tool_features: null,
    takeaway: null,
    category_name: "챗GPT",
    category_slug: "chatgpt",
    posted_at: null,
    ...partial,
  };
}

test("blog drafts do not call promo text or a stored excerpt an AI summary", () => {
  const promo = buildBlogHtml(
    video({
      summary: "🎓 무료 3시간 AI 특강 | 12월 라이브 예정 오늘 본 편집기·프로그램·자동화, 상상하는 모든 걸 처음부터 같이 만들어 봅시다! ▶️신청링크",
      hook: "신청링크",
      takeaway: "신청링크",
    }),
  );
  assert.equal(promo.includes("AI 요약"), false);
  assert.equal(promo.includes("신청링크"), false);
  assert.equal(promo.includes("아직 검토된 요약이 없습니다"), true);

  const stored = buildBlogHtml(
    video({
      title: "보고서 초안",
      summary: "자료를 붙인 뒤 문단 순서를 먼저 고칩니다. 마지막에는 날짜와 숫자를 원본 문서와 한 번씩 비교합니다.",
      summary_source: "description",
    }),
  );
  assert.equal(stored.includes("<strong>설명 발췌</strong>"), true);
  assert.equal(stored.includes("AI 요약"), false);
  assert.equal(stored.includes("AI가 새로 쓴 요약이라고 보지 마세요"), true);
});

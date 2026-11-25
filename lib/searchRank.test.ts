import assert from "node:assert/strict";
import test from "node:test";
import { rankSearchHits, searchResultHref, type SearchHit } from "./searchRank";

function hit(partial: Partial<SearchHit>): SearchHit {
  return {
    id: partial.id ?? "1",
    title: partial.title ?? "챗GPT로 보고서 쓰기",
    thumbnail_url: null,
    view_count: partial.view_count ?? 10,
    published_at: partial.published_at ?? "2026-10-01T00:00:00.000Z",
    channel_title: "채널",
    rank: partial.rank ?? 1,
    youtube_id: partial.youtube_id ?? "abcdefghijk",
    category_slug: partial.category_slug ?? "chatgpt",
    category_name: partial.category_name ?? "챗GPT",
    summary: partial.summary ?? "",
    hook: partial.hook ?? "",
    target_video_count: partial.target_video_count ?? 10,
  };
}

test("exact tool and title matches outrank a cross-tool mention", () => {
  const ranked = rankSearchHits(
    [
      hit({
        id: "mention",
        title: "딥시크 사용법",
        category_slug: "deepseek",
        category_name: "딥시크",
        summary: "챗GPT보다 가볍다고 비교합니다. 설치 순서와 제한을 따로 설명합니다.",
        view_count: 500000,
        rank: 1,
      }),
      hit({
        id: "old",
        title: "2024 챗GPT 왕초보 강의",
        published_at: "2024-12-07T00:00:00.000Z",
        view_count: 200000,
        rank: 1000,
      }),
      hit({ id: "current", title: "챗GPT로 메일 초안 만들기", view_count: 1000, rank: 2 }),
    ],
    "챗GPT",
    new Date("2026-11-06T00:00:00.000Z"),
  );
  assert.equal(ranked[0]?.id, "current");
  assert.equal(ranked.find((item) => item.id === "mention")?.badges.includes("다른 도구 영상에서 언급"), true);
  assert.equal(ranked.find((item) => item.id === "old")?.badges.includes("이전 시기 강의"), true);
  assert.equal(ranked.find((item) => item.id === "old")?.listing, "archive");
  assert.ok(ranked.findIndex((item) => item.id === "current") < ranked.findIndex((item) => item.id === "mention"));
  assert.equal(searchResultHref(ranked.find((item) => item.id === "old")!), "/video/old");
  assert.equal(searchResultHref(ranked.find((item) => item.id === "current")!), "/category/chatgpt?video=current#player");
});

test("same-tool body matches are not labeled as another tool", () => {
  const ranked = rankSearchHits(
    [
      hit({
        id: "body",
        title: "메일 초안 순서",
        summary: "챗GPT에서 자료를 붙이고 문단을 고친 뒤 숫자만 원문과 비교합니다.",
        rank: 4,
      }),
    ],
    "챗GPT",
    new Date("2026-11-06T00:00:00.000Z"),
  );
  assert.equal(ranked[0]?.badges.includes("다른 도구 영상에서 언급"), false);
  assert.equal(ranked[0]?.listing, "recommended");
});

test("exact title and youtube id outrank looser matches", () => {
  const byTitle = rankSearchHits(
    [
      hit({ id: "prefix", title: "챗GPT로 메일 초안 만들기", view_count: 999999, rank: 1 }),
      hit({ id: "exact", title: "챗GPT", view_count: 10, rank: 3 }),
    ],
    "챗GPT",
    new Date("2026-11-06T00:00:00.000Z"),
  );
  assert.equal(byTitle[0]?.id, "exact");

  const byId = rankSearchHits(
    [
      hit({ id: "title", title: "abcdefghijk 강의", youtube_id: "zzzzzzzzzzz", view_count: 999999 }),
      hit({ id: "id", title: "다른 제목", youtube_id: "abcdefghijk", view_count: 1 }),
    ],
    "abcdefghijk",
    new Date("2026-11-06T00:00:00.000Z"),
  );
  assert.equal(byId[0]?.id, "id");
});

test("rank 999 stays recommended and rank 1000 is archived", () => {
  const ranked = rankSearchHits(
    [
      hit({ id: "edge", title: "챗GPT 경계", rank: 999, target_video_count: 10 }),
      hit({ id: "box", title: "챗GPT 보관", rank: 1000 }),
    ],
    "챗GPT",
    new Date("2026-11-06T00:00:00.000Z"),
  );
  assert.equal(ranked.find((item) => item.id === "edge")?.listing, "recommended");
  assert.equal(ranked.find((item) => item.id === "edge")?.badges.includes("보관"), false);
  assert.equal(ranked.find((item) => item.id === "box")?.listing, "archive");
  assert.equal(ranked.find((item) => item.id === "box")?.badges.includes("보관"), true);
});
